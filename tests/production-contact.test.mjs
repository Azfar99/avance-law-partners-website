import test from "node:test"
import assert from "node:assert/strict"
import { webcrypto } from "node:crypto"
import { loadTS, memoryStorage } from "./helpers/load.mjs"
const { resolveProductionConfig, EXPECTED_PROJECT_REF } = await loadTS(
  new URL("../src/lib/productionConfig.ts", import.meta.url),
)
const { createContactClient, ContactFailure } = await loadTS(
  new URL("../src/lib/contactClient.ts", import.meta.url),
)
const payload = {
  name: "Offline test",
  email: "audit@example.invalid",
  phone: "",
  subject: "Corporate Law",
  message: "Never sent",
}
const token =
  "v1.11111111-1111-4111-8111-111111111111." +
  Math.floor((Date.now() + 7 * 86400000) / 1000) +
  "." +
  "a".repeat(64)
function fixture(mode = "success", storage = memoryStorage()) {
  const calls = []
  let currentMode = mode
  const client = createContactClient({
    url: "https://" + EXPECTED_PROJECT_REF + ".supabase.co",
    key: "sb_publishable_offline_fixture_only",
    projectRef: EXPECTED_PROJECT_REF,
    enabled: true,
    storage,
    crypto: webcrypto,
    timeoutMs: 20,
    fetch: async (url, options) => {
      calls.push({ url, options })
      if (options.method === "GET")
        return Response.json({
          ok: true,
          visitor_token: token,
          expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        })
      if (currentMode === "timeout")
        return new Promise((_, reject) => {
          const keepAlive = setTimeout(
            () => reject(Error("fixture watchdog")),
            1000,
          )
          options.signal.addEventListener(
            "abort",
            () => {
              clearTimeout(keepAlive)
              reject(Error("offline timeout"))
            },
            { once: true },
          )
        })
      if (currentMode === "pending")
        return Response.json({ ok: false, code: "delivery_pending" }, {
          status: 503,
        })
      if (currentMode === "rejected")
        return Response.json(
          {
            ok: false,
            code: "email_unavailable",
            error: "NEVER SHOW PROVIDER BODY",
          },
          { status: 502 },
        )
      return Response.json({ ok: true, code: "accepted" })
    },
  })
  return {
    client,
    calls,
    storage,
    mode: (value) => {
      currentMode = value
    },
  }
}
test("only explicitly configured NEW target/public key/production origin can enable contact", () => {
  const valid = {
    VITE_SUPABASE_URL: "https://" + EXPECTED_PROJECT_REF + ".supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_offline_fixture_only",
    VITE_SITE_ORIGIN: "https://avancelawpartners.info",
    VITE_TURNSTILE_SITE_KEY: "0xxxxxxxxxxxxxxxxxxxxxxx",
  }
  assert.equal(resolveProductionConfig({}).contactConfigured, false)
  assert.equal(
    resolveProductionConfig(valid, "https://avancelawpartners.info")
      .contactConfigured,
    true,
  )
  for (const patch of [
    { VITE_SUPABASE_URL: "https://wrongprojectaaaaaaaa.supabase.co" },
    { VITE_SUPABASE_PUBLISHABLE_KEY: "sb_secret_rejected" },
    { VITE_SITE_ORIGIN: "https://unapproved.example.invalid" },
    { VITE_PUBLIC_PREVIEW: "true" },
  ])
    assert.equal(
      resolveProductionConfig({ ...valid, ...patch }).backendConfigured,
      false,
    )
  assert.equal(
    resolveProductionConfig(valid, "https://different.example.invalid")
      .contactConfigured,
    false,
  )
})
test("missing configuration/challenge never issues a request", async () => {
  const f = fixture()
  await assert.rejects(() => f.client.submit(payload, ""), ContactFailure)
  assert.equal(f.calls.length, 0)
  const blocked = createContactClient({
    url: "",
    key: "",
    projectRef: EXPECTED_PROJECT_REF,
    enabled: false,
    storage: memoryStorage(),
    fetch: async () => {
      throw Error("MUST NOT FETCH")
    },
  })
  await assert.rejects(() => blocked.submit(payload, "fixture"), /unavailable/)
})
test("visitor bootstrap, public headers and accepted submission follow the backend contract", async () => {
  const f = fixture()
  assert.deepEqual(await f.client.submit(payload, "fresh-fixture-token"), {
    ok: true,
  })
  assert.equal(f.calls.length, 2)
  const get = f.calls[0],
    post = f.calls[1],
    body = JSON.parse(post.options.body)
  assert.equal(get.options.method, "GET")
  assert.equal(post.options.headers["x-contact-visitor"], token)
  assert.equal(post.options.headers.Authorization, undefined)
  assert.match(body.request_id, /^[0-9a-f-]{36}$/)
  assert.equal(body.turnstile_token, "fresh-fixture-token")
  assert.equal(body.website, "")
  assert.ok(![...f.storage.data.keys()].some((k) => k.endsWith("pending")))
})
test("uncertain retries preserve UUID/session, require fresh challenge and store no enquiry plaintext", async () => {
  const f = fixture("pending")
  await assert.rejects(
    () => f.client.submit(payload, "challenge-one"),
    (e) => e.uncertain,
  )
  const first = JSON.parse(f.calls[1].options.body)
  const saved = [...f.storage.data.values()].join("")
  assert.ok(!saved.includes(payload.email) && !saved.includes(payload.message))
  await assert.rejects(
    () => f.client.submit({ ...payload, message: "edited" }, "challenge-two"),
    (e) => e.uncertain,
  )
  assert.equal(f.calls.length, 2)
  f.mode("success")
  await f.client.submit(payload, "challenge-two")
  const retry = JSON.parse(f.calls.at(-1).options.body)
  assert.equal(retry.request_id, first.request_id)
  assert.equal(retry.turnstile_token, "challenge-two")
  assert.equal(f.calls.at(-1).options.headers["x-contact-visitor"], token)
})
test("definitive rejection allows an edited enquiry with a new UUID and hides raw errors", async () => {
  const f = fixture("rejected")
  await assert.rejects(
    () => f.client.submit(payload, "one"),
    (e) => !e.message.includes("NEVER SHOW"),
  )
  const first = JSON.parse(f.calls[1].options.body).request_id
  f.mode("success")
  await f.client.submit(
    { ...payload, message: "edited after rejection" },
    "two",
  )
  assert.notEqual(JSON.parse(f.calls.at(-1).options.body).request_id, first)
})
test("timeout leaves a recoverable pending ID; parallel clicks do not send twice", async () => {
  const f = fixture("timeout")
  const pending = f.client.submit(payload, "one")
  await assert.rejects(() => f.client.submit(payload, "two"), /already/)
  await assert.rejects(
    () => pending,
    (e) => e.uncertain,
  )
  const first = JSON.parse(f.calls[1].options.body).request_id
  f.mode("success")
  await f.client.submit(payload, "new-challenge")
  assert.equal(JSON.parse(f.calls.at(-1).options.body).request_id, first)
})
test("old uncertain requests and expired visitor credentials cannot create a new identity", async () => {
  for (const kind of ["old", "expired"]) {
    const f = fixture("pending")
    await assert.rejects(() => f.client.submit(payload, "one"))
    const key = [...f.storage.data.keys()].find((k) => k.endsWith("pending"))
    const record = JSON.parse(f.storage.getItem(key))
    if (kind === "old") record.created = Date.now() - 24 * 3600000
    else record.visitor.expires = Date.now() - 1
    f.storage.setItem(key, JSON.stringify(record))
    f.mode("success")
    await assert.rejects(() => f.client.submit(payload, "two"))
    assert.equal(f.calls.length, 2)
  }
})
test("blocked browser storage never allows the email POST", async () => {
  const store = {
    getItem: () => null,
    setItem: () => {
      throw Error("Storage blocked")
    },
    removeItem: () => {},
  }
  const f = fixture("success", store)
  await assert.rejects(() => f.client.submit(payload, "one"), /storage/)
  assert.equal(f.calls.length, 1)
  assert.equal(f.calls[0].options.method, "GET")
})
