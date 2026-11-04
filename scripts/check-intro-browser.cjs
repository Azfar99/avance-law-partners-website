// Local browser verification only. Never submits forms or contacts remote APIs.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/azfar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const checks = [];
  const contactPixel = JSON.parse(fs.readFileSync("audit/intro-render/pose-checks.json", "utf8")).contactPixel;
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.route("**/*", route => new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort());
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto("http://localhost:8443/brand-intro-preview.html");
      await page.waitForTimeout(1100);
      const result = await page.evaluate(async ([contactX]) => {
        document.getElementById("review-stage").replaceChildren(document.getElementById("intro-template").content.cloneNode(true));
        const canvas = document.querySelector("#brand-intro canvas").getBoundingClientRect();
        const logo = document.querySelector("#brand-intro .brand-intro__mark").getBoundingClientRect();
        const alignmentError = Math.abs(canvas.left + contactX / 512 * canvas.width - (logo.left + logo.width / 2));
        const start = performance.now();
        const reason = await window.startAvanceOpening();
        return { ms: Math.round(performance.now() - start), reason, removed: !document.getElementById("brand-intro"), alignmentError };
      }, contactPixel);
      assert(result.ms >= 950 && result.ms < 1250);
      assert(result.removed);
      assert(result.alignmentError < .05, "Strike must be centred below the logo at every viewport width");
      assert.equal(errors.length, 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      checks.push({ width, ...result, errors: 0, overflow: false });
      if (width === 390) {
        // Freeze the same renderer/poses used by normal playback for visual QA.
        await page.evaluate(() => {
          const original = window.createAvanceOpeningScene;
          window.createAvanceOpeningScene = intro => {
            const scene = original(intro);
            return { draw(t) { scene.draw(window.frozenIntroTime ?? t); }, dispose: () => scene.dispose() };
          };
        });
        for (const time of [260, 640, 780, 1120, 1550]) {
          await page.evaluate(t => { window.frozenIntroTime = t; document.getElementById("replay").click(); }, time);
          await page.waitForTimeout(100);
          await page.evaluate(t => document.getElementById("brand-intro").getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = t / 2; }), time);
          await page.screenshot({ path: `audit/intro-final-${time}.png` });
        }
        await page.evaluate(() => { window.frozenIntroTime = undefined; });
      }
      await page.close();
    }
    const page = await browser.newPage();
    await page.goto("http://localhost:8443/brand-intro-preview.html");
    await page.waitForTimeout(1100);
    const slow = await page.evaluate(async () => {
      document.getElementById("review-stage").replaceChildren(document.getElementById("intro-template").content.cloneNode(true));
      const start = performance.now();
      await window.startAvanceOpening({ slow: true });
      return Math.round(performance.now() - start);
    });
    assert(slow >= 1900 && slow < 2300);
    checks.push({ reviewOnlySlowReplay: "PASS", ms: slow });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator("#replay").click();
    assert.equal(await page.locator("#brand-intro").count(), 0);
    checks.push({ reducedMotion: "PASS" });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator("#replay").click();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#brand-intro").count(), 0);
    checks.push({ escapeSkip: "PASS" });
    // Image errors and Canvas failures must release the page, not strand an overlay.
    await page.route("**/images/intro-gavel-*", route => route.abort());
    await page.reload();
    await page.waitForTimeout(600);
    assert.equal(await page.locator("#brand-intro").count(), 0);
    checks.push({ imageFailure: "PASS" });
    await page.unroute("**/images/intro-gavel-*");
    await page.evaluate(() => { window.createAvanceOpeningScene = () => { throw Error("Offline canvas test"); }; });
    await page.locator("#replay").click();
    await page.waitForTimeout(1100);
    assert.equal(await page.locator("#brand-intro").count(), 0);
    checks.push({ canvasFailure: "PASS" });
    const nojs = await browser.newPage({ javaScriptEnabled: false });
    await nojs.goto("http://localhost:8443/");
    assert.equal(await nojs.locator("#brand-intro").isVisible(), false);
    checks.push({ noJavaScript: "PASS" });
    const normal = await browser.newPage();
    await normal.route("**/*", route => new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort());
    await normal.goto("http://localhost:8443/");
    await normal.waitForTimeout(1100);
    assert.equal(await normal.locator("#brand-intro").count(), 0);
    assert.equal(await normal.locator("#root").getAttribute("inert"), null);
    await normal.evaluate(() => { location.hash = "/about"; });
    await normal.waitForTimeout(100);
    assert.equal(await normal.locator("#brand-intro").count(), 0);
    checks.push({ normalWebsiteCleanupAndInternalNavigation: "PASS" });
    fs.writeFileSync("audit/intro-gavel-checks.json", JSON.stringify({ result: "PASS", checks }, null, 2));
    console.log(JSON.stringify({ result: "PASS", checks }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
