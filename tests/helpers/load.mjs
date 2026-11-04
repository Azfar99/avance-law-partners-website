import fs from "node:fs/promises"
import ts from "typescript"
export async function moduleUrl(file, env = {}) {
  const source = (await fs.readFile(file, "utf8")).replaceAll(
    "import.meta.env",
    JSON.stringify(env),
  )
  let js = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText
  const matches = [...js.matchAll(/from\s+["'](\.[^"']+)["']/g)]
  for (const match of matches) {
    const target = new URL(
      match[1] + (/\.[a-z]+$/.test(match[1]) ? "" : ".ts"),
      file,
    )
    const url = await moduleUrl(target, env)
    js = js.replace(match[0], `from "${url}"`)
  }
  return (
    "data:text/javascript;base64," +
    Buffer.from(js + "\n//" + Math.random()).toString("base64")
  )
}
export async function loadTS(file, env = {}) {
  return import(await moduleUrl(file, env))
}
export function memoryStorage() {
  const data = new Map()
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  }
}
