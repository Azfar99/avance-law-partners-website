import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import ts from "typescript"

const source = await fs.readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8")
const js = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText
const {CANONICAL_URL,publicPageMetadata,updatePageSEO} = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`)

test("hash views use the actual crawlable canonical; public titles are unique", () => {
  assert.equal(CANONICAL_URL,"https://avancelawpartners.info/")
  assert.equal(new URL(CANONICAL_URL).hash,"")
  const titles = Object.values(publicPageMetadata).map(page=>page.title)
  assert.equal(new Set(titles).size,titles.length)
  for(const page of Object.values(publicPageMetadata)) assert.ok(page.description.length > 40)
})

test("SEO navigation updates existing tags and clears private noindex on returning public", () => {
  const previous=globalThis.document
  const nodes=[]
  globalThis.document={title:"",head:{appendChild:n=>nodes.push(n)},createElement:()=>({attributes:{},setAttribute(key,value){this.attributes[key]=value}}),querySelector(selector){
    const match=selector.match(/^(meta|link)\[([^=]+)="([^"]+)"\]$/)
    return nodes.find(n=>n.attributes[match[2]]===match[3])||null
  }}
  try {
    const settings={title:"Admin",description:"Private area",canonicalUrl:CANONICAL_URL,ogImage:CANONICAL_URL+"images/social-card.png",noindex:true}
    updatePageSEO(settings)
    assert.equal(nodes.find(n=>n.attributes.name==="robots").attributes.content,"noindex, nofollow")
    const count=nodes.length
    updatePageSEO({...settings,title:publicPageMetadata["/about"].title,noindex:false})
    assert.equal(nodes.length,count)
    assert.equal(nodes.find(n=>n.attributes.name==="robots").attributes.content,"index, follow")
    assert.equal(nodes.find(n=>n.attributes.property==="og:url").attributes.content,CANONICAL_URL)
    assert.equal(nodes.find(n=>n.attributes.name==="twitter:title").attributes.content,publicPageMetadata["/about"].title)
  } finally { globalThis.document=previous }
})
