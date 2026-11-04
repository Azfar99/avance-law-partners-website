import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import ts from "typescript"

async function load(file) {
  const source = await fs.readFile(new URL(file, import.meta.url), "utf8")
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`)
}
const {countPracticeEntries,yearsOfPractice} = await load("../src/lib/statistics.ts")
const {lawyers} = await load("../src/lib/content.ts")

test("practice entries count shared areas per lawyer and handle missing arrays", () => {
  assert.equal(countPracticeEntries([{practice_areas:["Contracts","Litigation"]},{practice_areas:["Contracts"]},{}]),3)
  assert.equal(countPracticeEntries([]),0)
  const published = lawyers.filter(lawyer=>lawyer.published)
  assert.deepEqual(published.map(lawyer=>lawyer.practice_areas.length),[14,14,15])
  assert.equal(countPracticeEntries(published),43)
})
test("years derive from establishment and handle invalid or future years", () => {
  assert.equal(yearsOfPractice("1998",2026),28)
  assert.equal(yearsOfPractice("1998",2027),29)
  for (const value of ["", "unknown", "2030", "1998.5"]) assert.equal(yearsOfPractice(value,2026),0)
})
