import fs from "node:fs"
import path from "node:path"
import { createDecipheriv } from "node:crypto"
import { pipeline } from "node:stream/promises"
import { spawnSync } from "node:child_process"
import { createInterface } from "node:readline/promises"
import { pathToFileURL } from "node:url"

// Format: ASCII header, 12-byte nonce, ciphertext, 16-byte GCM tag.
export const BACKUP_HEADER = Buffer.from("AVANCE-BACKUP-V1\n")

export async function decryptBackup(inputFile, outputFile, recoveryKey) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(recoveryKey)) {
    throw new Error("The recovery key must contain exactly 43 characters.")
  }
  const key = Buffer.from(recoveryKey, "base64url")
  const size = fs.statSync(inputFile).size
  const prefixLength = BACKUP_HEADER.length + 12
  if (size <= prefixLength + 16) throw new Error("Incomplete backup file.")
  const handle = fs.openSync(inputFile, "r")
  let prefix, tag
  try {
    prefix = Buffer.alloc(prefixLength)
    tag = Buffer.alloc(16)
    fs.readSync(handle, prefix, 0, prefix.length, 0)
    fs.readSync(handle, tag, 0, tag.length, size - tag.length)
  } finally {
    fs.closeSync(handle)
  }
  if (!prefix.subarray(0, BACKUP_HEADER.length).equals(BACKUP_HEADER)) {
    throw new Error("Unsupported backup format.")
  }
  const decipher = createDecipheriv(
    "aes-256-gcm", key, prefix.subarray(BACKUP_HEADER.length),
  )
  decipher.setAAD(BACKUP_HEADER)
  decipher.setAuthTag(tag)
  await pipeline(
    fs.createReadStream(inputFile, { start: prefixLength, end: size - 17 }),
    decipher,
    fs.createWriteStream(outputFile, { flags: "wx", mode: 0o600 }),
  )
}

export function repairDependencyLinks(project, copiesDirectory) {
  const metadata = path.join(project, "scripts", "dependency-links.snapshot.json")
  if (!fs.existsSync(metadata)) return 0
  const { links } = JSON.parse(fs.readFileSync(metadata, "utf8"))
  const root = path.resolve(project)
  const inside = (relative) => {
    const result = path.resolve(root, relative)
    if (!result.toLowerCase().startsWith(root.toLowerCase() + path.sep)) {
      throw new Error("Dependency link points outside the restored project.")
    }
    return result
  }
  fs.mkdirSync(copiesDirectory, { recursive: true })
  const sorted = [...links].sort((a, b) => b.path.length - a.path.length)
  for (const [index, link] of sorted.entries()) {
    const from = inside(link.path)
    const target = inside(link.target)
    if (!fs.existsSync(target)) throw new Error("Missing dependency target: " + link.target)
    if (fs.lstatSync(from).isSymbolicLink()) continue
    // Keep materialized copies outside the project; no files are deleted.
    fs.renameSync(from, path.join(copiesDirectory, String(index).padStart(4, "0")))
    const reference = process.platform === "win32"
      ? target : path.relative(path.dirname(from), target)
    fs.symlinkSync(reference, from,
      process.platform === "win32" && link.kind === "dir" ? "junction" : link.kind)
  }
  return links.length
}

async function main() {
  const [input, destination] = process.argv.slice(2)
  if (!input || !destination) {
    throw new Error(
      'Usage: node scripts/restore-full-backup.mjs "backup.tar.gz.enc" "new-folder"',
    )
  }
  const inputFile = path.resolve(input)
  const target = path.resolve(destination)
  if (fs.existsSync(target)) {
    throw new Error("Choose a new destination folder; existing folders are preserved.")
  }
  let key = process.env.AVANCE_BACKUP_KEY
  if (!key) {
    const prompt = createInterface({ input: process.stdin, output: process.stdout })
    try {
      key = (await prompt.question("Recovery key (from your backup chat): ")).trim()
    } finally {
      prompt.close()
    }
  }
  fs.mkdirSync(target, { recursive: true })
  const archive = path.join(target, "project-files.tar.gz")
  // Authentication must succeed before tar receives the decrypted archive.
  await decryptBackup(inputFile, archive, key)
  const listing = spawnSync("tar", ["-tzf", archive], {
    encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
  })
  if (listing.status !== 0) throw new Error("The decrypted archive cannot be read.")
  const entries = listing.stdout.split(/\r?\n/).filter(Boolean)
  if (entries.some((entry) =>
    path.posix.isAbsolute(entry) || /^[A-Za-z]:/.test(entry) ||
    entry.replaceAll("\\", "/").split("/").includes("..")
  )) throw new Error("Unsafe archive path; nothing has been extracted.")
  const project = path.join(target, "project")
  fs.mkdirSync(project)
  const extracted = spawnSync("tar", ["-xzf", archive, "-C", project], {
    stdio: "inherit",
  })
  if (extracted.status !== 0) throw new Error("Archive extraction failed.")
  const repaired = repairDependencyLinks(project, path.join(target, "dependency-copies"))
  console.log(`Restored project: ${project}`)
  console.log(`Restored dependency links: ${repaired}`)
  console.log("Original files and the downloaded backup were preserved.")
  console.log("Run pnpm typecheck and pnpm test inside the restored project.")
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1 })
}
