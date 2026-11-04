// Inspect the local static artifact. This script performs no network requests.
import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"

const root = path.resolve(import.meta.dirname, "..")
const dist = path.join(root, "dist")
const origin = "https://avancelawpartners.info"
const projectRef = "xweeslmfqpgnxfkgrbat"
const files = []
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else files.push(file)
  }
}
walk(dist)
let scriptBytes = 0
let mainUsesExpectedBackend = false
for (const file of files) {
  const relative = path.relative(dist, file)
  assert.ok(
    !/\.map$|^\.env|\.toml$|\.sql$/i.test(relative),
    "Unexpected source/config artifact: " + relative,
  )
  if (!/\.(html|js|css|json|txt|xml)$/.test(file)) continue
  const text = fs.readFileSync(file, "utf8")
  assert.ok(
    !text.includes("avance-law-staging.isratarni1422.workers.dev"),
    "Staging origin in " + relative,
  )
  assert.ok(
    !/sb_secret_[A-Za-z0-9_-]{12,}|sbp_[a-f0-9]{40}|re_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/.test(
      text,
    ),
    "Possible privileged credential in " + relative,
  )
  const urls = [...text.matchAll(/https:\/\/([a-z]{18,23})\.supabase\.co/g)]
  assert.ok(
    urls.every((match) => match[1] === projectRef),
    "Unexpected backend in " + relative,
  )
  if (file.endsWith(".js")) {
    scriptBytes += fs.statSync(file).size
    mainUsesExpectedBackend ||=
      urls.length > 0 && text.includes("x-contact-visitor")
  }
}
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8")
assert.ok(
  /name="robots" content="index, follow"/.test(html),
  "Production shell must permit indexing",
)
assert.ok(
  !/<meta[^>]*name="robots"[^>]*noindex/i.test(html),
  "Production shell has noindex",
)
assert.ok(
  html.includes(`rel="canonical" href="${origin}/"`),
  "Incorrect canonical",
)
assert.ok(
  html.includes(`property="og:url" content="${origin}/"`),
  "Incorrect Open Graph URL",
)
const data = JSON.parse(
  html.match(
    /<script type="application\/ld\+json" id="firm-structured-data">([\s\S]*?)<\/script>/,
  )[1],
)
assert.equal(data.name, "Avance Law Partners")
assert.equal(data.foundingDate, "1998")
assert.equal(data.url, origin + "/")
for (const filename of [
  "favicon.svg",
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "images/social-card.png",
]) {
  assert.ok(
    fs.existsSync(path.join(dist, filename)),
    "Missing asset: " + filename,
  )
}
const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8")
assert.ok(
  !/^Disallow:\s*\/\s*$/im.test(robots),
  "Production robots blocks all crawling",
)
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8")
assert.deepEqual(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
  [origin + "/"],
)
assert.ok(
  mainUsesExpectedBackend,
  "Working Contact contract is missing from bundle",
)
const report = {
  result: "PASS",
  files: files.length,
  scriptBytes,
  canonical: origin + "/",
  projectRef,
  staticPublicIndexing: "PASS",
  secretPatternScan: "PASS",
  stageOriginScan: "PASS",
  note: "Local artifact checks only. Remote content, hostname authorization and CORS remain release gates.",
}
fs.mkdirSync(path.join(root, "audit"), { recursive: true })
fs.writeFileSync(
  path.join(root, "audit/master-release-build.json"),
  JSON.stringify(report, null, 2) + "\n",
)
console.log(JSON.stringify(report))
