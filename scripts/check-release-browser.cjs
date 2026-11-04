// Local Chromium QA. Backend and email requests are always mocked or blocked.
const fs = require("node:fs")
const path = require("node:path")
const assert = require("node:assert/strict")
const {
  chromium,
} = require("C:/Users/azfar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright")

const root = path.resolve(__dirname, "..")
const backendOrigin = "https://xweeslmfqpgnxfkgrbat.supabase.co"
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain",
  ".xml": "text/xml",
}
const widths = [320, 390, 768, 1024, 1440]
const reports = []

async function main() {
  const { loadSourceContent } = await import(
    "file:///G:/Avance-Law-New-Backend/scripts/source-content.mjs"
  )
  const { content, homeBlocks } = loadSourceContent()
  const rows = {
    site_settings: [
      {
        firm_name: content.siteSettings.firmName,
        tagline: content.siteSettings.tagline,
        established: "1998",
        location: content.siteSettings.location,
        address_line_1: content.siteSettings.address[0],
        address_line_2: content.siteSettings.address[1],
        address_line_3: content.siteSettings.address[2],
        phone: content.siteSettings.phone,
        email: content.siteSettings.email,
        whatsapp: content.siteSettings.whatsapp,
        office_hours: content.siteSettings.officeHours,
        logo_url: "/images/avance-law-partners-logo.png",
        footer_text: content.siteSettings.copyright,
        social_links: content.siteSettings.social.map((row) => ({
          label: row.label,
          url: row.href || row.url,
        })),
        map_location: null,
      },
    ],
    lawyers: content.lawyers.map((row, i) => ({
      ...row,
      id: `qa-lawyer-${i}`,
      display_order: i + 1,
    })),
    services: content.services.map((row, i) => ({
      ...row,
      id: `qa-service-${i}`,
      index_number: row.index,
      published: true,
      display_order: i + 1,
    })),
    page_content: Object.entries(homeBlocks).map(([section_key, value]) => ({
      page_key: "home",
      section_key,
      content: value,
    })),
    legal_pages: [],
  }
  // A published filter must exclude this record from public directory requests.
  rows.lawyers.push({
    ...rows.lawyers[0],
    name: "QA unpublished fixture",
    slug: "qa-unpublished",
    published: false,
  })
  const publicRoutes = [
    "/",
    "/about",
    "/approach",
    "/lawyers",
    "/services",
    "/contact",
    "/privacy",
    "/disclaimer",
    "/terms",
    ...content.lawyers.map((x) => "/lawyers/" + x.slug),
    ...content.services.map((x) => "/services/" + x.slug),
    "/qa-missing-page",
  ]
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  })
  try {
    for (const staging of [false, true]) {
      const origin = staging
        ? "https://avance-law-staging.isratarni1422.workers.dev"
        : "https://avancelawpartners.info"
      const dist = path.join(
        staging ? "G:/Avance-Law-Staging-Frontend" : root,
        "dist",
      )
      let dataMode = "seeded"
      let publicAudit = true
      let reviewPublicAssets = false
      const errors = [],
        contactMethods = [],
        contentHeaders = [],
        assetsMissing = [],
        titles = {}
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      })
      await context.addInitScript(
        ({ staging }) => {
          if (!staging) {
            localStorage.setItem(
              "alp_prod_xweeslmfqpgnxfkgrbat_auth_token",
              "expired-offline-fixture",
            )
            localStorage.setItem(
              "alp_prod_xweeslmfqpgnxfkgrbat_auth_user",
              JSON.stringify({ id: "qa-user" }),
            )
          }
          window.turnstile = {
            render(element, options) {
              window.__qaChallenge = () =>
                options.callback("offline-challenge-fixture")
              return "offline-widget"
            },
            remove() {
              window.__qaChallenge = undefined
            },
          }
        },
        { staging },
      )
      await context.route("**/*", async (route) => {
        const request = route.request(),
          url = new URL(request.url())
        if (url.origin === backendOrigin) {
          if (url.pathname.startsWith("/rest/v1/")) {
            if (
              publicAudit &&
              Object.hasOwn(rows, url.pathname.split("/").pop())
            )
              contentHeaders.push({
                hasAuthorization: !!request.headers().authorization,
              })
            if (dataMode === "error")
              return route.fulfill({
                status: 503,
                json: { message: "Offline fixture unavailable" },
              })
            let result =
              dataMode === "empty"
                ? []
                : [...(rows[url.pathname.split("/").pop()] || [])]
            for (const [key, value] of url.searchParams)
              if (value.startsWith("eq."))
                result = result.filter(
                  (row) => String(row[key]) === value.slice(3),
                )
            return route.fulfill({ json: result })
          }
          if (url.pathname === "/functions/v1/send-contact-enquiry") {
            contactMethods.push(request.method())
            if (request.method() === "GET")
              return route.fulfill({
                json: {
                  ok: true,
                  code: "visitor_session",
                  visitor_token:
                    "v1.11111111-1111-4111-8111-111111111111.1999999999." +
                    "a".repeat(64),
                  expires_at: "2033-05-18T03:33:19Z",
                },
              })
            return route.fulfill({
              json: {
                ok: true,
                code: "accepted",
                request_id: "offline-fixture",
              },
            })
          }
          return route.fulfill({
            status: 401,
            json: { message: "Offline fixture rejects authentication" },
          })
        }
        if (url.origin === origin) {
          const relative =
            url.pathname === "/"
              ? "index.html"
              : decodeURIComponent(url.pathname).replace(/^\//, "")
          const file = path.resolve(dist, relative)
          if (!file.startsWith(dist + path.sep) || !fs.existsSync(file)) {
            assetsMissing.push(url.pathname)
            return route.fulfill({ status: 404, body: "" })
          }
          return route.fulfill({
            body: fs.readFileSync(file),
            contentType:
              types[path.extname(file)] || "application/octet-stream",
          })
        }
        if (reviewPublicAssets && request.method() === "GET" && ["fonts.googleapis.com", "fonts.gstatic.com", "images.unsplash.com"].includes(url.hostname)) return route.continue()
        // The route matrix uses fixtures for third-party fonts and photos.
        if (request.resourceType() === "image")
          return route.fulfill({
            body: fs.readFileSync(
              path.join(dist, "images/avance-law-partners-logo.webp"),
            ),
            contentType: "image/webp",
          })
        if (request.resourceType() === "stylesheet")
          return route.fulfill({ body: "", contentType: "text/css" })
        return route.fulfill({ body: "", contentType: "text/html" })
      })
      const page = await context.newPage()
      page.on("pageerror", (error) => errors.push(error.message))
      let routeChecks = 0
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 })
        for (const route of publicRoutes) {
          await page.goto(origin + "/#" + route)
          await page.locator("h1").waitFor()
          await page.waitForFunction(
            () =>
              !document.body.textContent.includes("Loading profile...") &&
              !document.body.textContent.includes("Loading practice area..."),
          )
          assert.equal(await page.locator("h1").count(), 1, route)
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth + 1,
            ),
            false,
            `${
              staging ? "staging" : "production"
            } ${width} ${route} horizontal overflow`,
          )
          const robots = await page
            .locator('meta[name="robots"]')
            .getAttribute("content")
          assert.equal(
            robots.includes("noindex"),
            staging || route === "/qa-missing-page",
            route + " robots",
          )
          assert.equal(
            await page.locator('link[rel="canonical"]').getAttribute("href"),
            origin + "/",
          )
          assert.equal(
            await page.locator("img:not([alt])").count(),
            0,
            route + " image alt",
          )
          assert.equal(
            await page
              .getByText("QA unpublished fixture", { exact: true })
              .count(),
            0,
          )
          const internalLinks = await page.locator('a[href^="#/"]').evaluateAll(elements => elements.map(element => element.getAttribute("href").slice(1).split("?")[0]))
          assert.ok(internalLinks.every(link => publicRoutes.includes(link)), route + " has an unknown internal link")
          if (route === "/about") {
            const counter = page.locator('[data-count="practice-areas"]')
            await counter.scrollIntoViewIfNeeded()
            await page.waitForFunction(
              () =>
                document.querySelector('[data-count="practice-areas"]')
                  ?.textContent === "43",
            )
          }
          assert.equal(await page.locator('footer a[href^="tel:"]').getAttribute("href"), "tel:" + content.lawyers[0].phone.replace(/[^+\d]/g, ""))
          assert.equal(await page.locator('footer a[href^="mailto:"]').getAttribute("href"), "mailto:" + content.lawyers[0].email)
          assert.equal(await page.locator('footer a[href="#/terms"]').count(), 1)
          if (["/privacy", "/terms", "/disclaimer"].includes(route)) await page.getByText("Draft content. Awaiting review by the firm.", { exact: true }).waitFor()
          if (route === "/lawyers") {
            await page.waitForFunction(
              () =>
                document.querySelectorAll("article.lawyer-entry").length === 3,
            )
            if (width < 768)
              assert.equal(
                await page
                  .locator(".lawyer-grid")
                  .evaluate(
                    (element) =>
                      getComputedStyle(element).gridTemplateColumns.split(" ")
                        .length,
                  ),
                2,
              )
          }
          if (route === "/services") {
            await page.getByRole("button", { expanded: true }).first().waitFor()
            const button = page.locator('button[id^="svc-btn-"]').nth(1)
            await button.click()
            assert.equal(await button.getAttribute("aria-expanded"), "true")
          }
          if (width === 390) titles[route] = await page.title()
          routeChecks++
        }
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(origin + "/#/contact")
      const send = page.getByRole("button", {
        name: "Send enquiry",
        exact: true,
      })
      await send.waitFor()
      assert.ok(await send.isDisabled())
      await page.waitForFunction(
        () => typeof window.__qaChallenge === "function",
      )
      await page.evaluate(() => window.__qaChallenge())
      await send.click()
      await page.locator('[aria-invalid="true"]').first().waitFor()
      assert.equal(contactMethods.length, 0)
      await page.locator("#name").fill("Offline QA")
      await page.locator("#email").fill("offline@example.invalid")
      await page.locator("#subject").selectOption({ index: 1 })
      await page
        .locator("#message")
        .fill("Offline browser contract fixture. No email will be sent.")
      await send.click()
      await page.getByText("Enquiry sent", { exact: true }).waitFor()
      assert.deepEqual(contactMethods, ["GET", "POST"])
      await page.goto(origin + "/#/lawyers")
      await page.getByRole("button", { name: "Open menu", exact: true }).click()
      const dialog = page.getByRole("dialog", { name: "Site menu" })
      await dialog.waitFor()
      await page.keyboard.press("Shift+Tab")
      assert.ok(
        await dialog.evaluate((element) =>
          element.contains(document.activeElement),
        ),
      )
      await page.keyboard.press("Escape")
      await page.getByRole("button", { name: "Open menu", exact: true }).focus()
      assert.ok(
        await page
          .getByRole("button", { name: "Open menu", exact: true })
          .evaluate((element) => element === document.activeElement),
      )
      await page
        .getByRole("button", { name: "Switch website language to Bengali" })
        .first()
        .click()
      assert.equal(await page.locator("html").getAttribute("lang"), "bn")
      await page
        .locator('button[data-no-translate][aria-pressed="true"]:visible')
        .click()
      assert.equal(await page.locator("html").getAttribute("lang"), "en")
      if (!staging) {
        for (const mode of ["empty", "error"]) {
          dataMode = mode
          await page.goto(origin + "/#/lawyers")
          await page.reload()
          await page
            .getByRole("status")
            .filter({
              hasText: mode === "empty" ? /no published/i : /could not/,
            })
            .waitFor()
          assert.equal(await page.locator("article.lawyer-entry").count(), 0)
          if (mode === "error") {
            await page
              .getByRole("button", { name: "Try again", exact: true })
              .click()
            await page
              .getByRole("status")
              .filter({ hasText: /could not/ })
              .waitFor()
            await page.goto(origin + "/#/lawyers/" + content.lawyers[0].slug)
            await page
              .getByText("This profile could not load. Please try again.", {
                exact: true,
              })
              .waitFor()
            await page.goto(origin + "/#/about")
            await page
              .getByText("Practice figures could not load. Please try again.", {
                exact: true,
              })
              .waitFor()
            assert.equal(
              await page.locator('[data-count="practice-areas"]').count(),
              0,
            )
          }
        }
        dataMode = "seeded"
        publicAudit = false
        await page.goto(origin + "/#/admin")
        await page.locator('input[type="password"]').waitFor()
        assert.equal(
          (
            await page.locator('meta[name="robots"]').getAttribute("content")
          ).includes("noindex"),
          true,
        )
      }
      dataMode = "seeded"
      await page.emulateMedia({ reducedMotion: "no-preference" })
      await page.goto(origin + "/#/about")
      await page.reload()
      await page.waitForFunction(
        () =>
          !document.getElementById("root").inert &&
          (!document.getElementById("brand-intro") ||
            getComputedStyle(document.getElementById("brand-intro"))
              .visibility === "hidden"),
        { timeout: 5000 },
      )
      const practiceCounter = page.locator('[data-count="practice-areas"]')
      await practiceCounter.scrollIntoViewIfNeeded()
      await page.waitForFunction(
        () =>
          document.querySelector('[data-count="practice-areas"]')
            ?.textContent === "43",
      )
      await page.waitForTimeout(120)
      assert.equal(await practiceCounter.textContent(), "43")
      await page.evaluate(() => {
        location.hash = "#/lawyers"
      })
      await page.locator("article.lawyer-entry").first().waitFor()
      assert.ok(
        await page.evaluate(() => !document.getElementById("root").inert),
      )
      if (!staging) {
        fs.mkdirSync(path.join(root, "audit/screenshots"), { recursive: true })
        await page.screenshot({
          path: path.join(root, "audit/screenshots/master-lawyers-mobile.png"),
          fullPage: true,
        })
        await page.setViewportSize({ width: 1440, height: 1000 })
        reviewPublicAssets = true
        await page.goto(origin + "/#/")
        await page.reload()
        await page.locator("h1").waitFor()
        await page.waitForFunction(() => document.querySelector('nav[aria-label="Primary"] a[aria-current="page"]')?.textContent === "Home")
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(1200)
        await page.screenshot({
          path: path.join(root, "audit/screenshots/master-home-desktop.png"),
        })
        for (const width of [320, 390, 768, 1440]) {
          await page.setViewportSize({ width, height: 900 })
          for (const path of ["/", "/lawyers", "/contact"]) {
            await page.goto(origin + "/#" + path)
            await page.waitForTimeout(120)
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "Real-font overflow at " + width + " " + path)
          }
        }
      }
      assert.deepEqual(errors, [], "Browser JavaScript exceptions")
      assert.deepEqual(assetsMissing, [], "Missing local asset")
      if (!staging)
        assert.ok(
          contentHeaders.every((headers) => !headers.hasAuthorization),
          "Public reads must be anonymous",
        )
      reports.push({
        artifact: staging ? "staging" : "production",
        result: "PASS",
        routeChecks,
        widths,
        routes: publicRoutes,
        titles,
        browserExceptions: errors.length,
        missingLocalAssets: assetsMissing.length,
        contact: "Mock GET then POST, validation and disabled state passed",
        aboutPracticeEntries: 43,
        opening:
          "Dismisses within five-second check budget; content accessible, no intro replay on internal navigation. Normal and reduced motion checked.",
        network:
          "All backend, widget and email requests mocked or blocked. Public Google fonts and Unsplash images allowed only for final desktop visual review; route matrix used local asset fixtures.",
        accessibility:
          "Keyboard menu containment, Escape, language toggle, labelled validation and image alt presence checked. No complete WCAG certification.",
      })
      await context.close()
    }
    fs.writeFileSync(
      path.join(root, "audit/master-browser-checks.json"),
      JSON.stringify(reports, null, 2) + "\n",
    )
    console.log(
      JSON.stringify(reports.map(({ titles, routes, ...summary }) => summary)),
    )
  } finally {
    await browser.close()
  }
}
main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
