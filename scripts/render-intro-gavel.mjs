// Optional asset-authoring command, never part of the website build/runtime.
// Requires the existing local Vite server and Playwright + Chrome on this machine.
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/azfar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "audit/intro-render");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/__intro_render", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><style>body{margin:0;background:#000}</style><script type="module" src="/scripts/intro-gavel-scene.js"></script>' }));
  await page.goto("http://localhost:8443/__intro_render");
  await page.waitForFunction(() => window.gavelRendererReady, { timeout: 30000 });
  const poses = await page.evaluate(() => [0, 130, 260, 400, 520, 540, 590, 635, 730, 790, 1033].map(ms => window.getGavelPoseMetrics(ms)));
  const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
  const maxGripMovement = Math.max(...poses.map(p => distance(p.grip, poses[0].grip)));
  const maxGripScreenMovement = Math.max(...poses.map(p => distance(p.gripScreen, poses[0].gripScreen)));
  const contact = poses.find(p => p.ms === 540);
  const lift = poses.find(p => p.ms === 260).head[1] - contact.head[1];
  assert(maxGripMovement < 1e-9, "Rear grip must remain fixed in world coordinates");
  assert(maxGripScreenMovement < 1e-7, "Rear grip must remain fixed on screen");
  assert(lift > 1.2, "Head must rise and fall, not the rear handle");
  assert(Math.abs(contact.contact[1]) < 1e-9, "Head must meet the floor at 540ms");
  assert(Math.abs(contact.contactScreen[0] - 256) < 1e-7, "Strike must align with the logo centre line");
  assert(poses.every(p => p.headCameraDistance < p.gripCameraDistance), "Head must face the audience, with the handle behind it");
  await fs.writeFile(path.join(output, "pose-checks.json"), JSON.stringify({ result: "PASS", maxGripMovement, maxGripScreenMovement, headLift: lift, contactPixel: contact.contactScreen, poses }, null, 2));
  for (let i = 0; i < 32; i++) {
    const png = await page.evaluate(ms => window.renderGavelFrame(ms), i * 1000 / 30);
    await fs.writeFile(path.join(output, `frame-${String(i).padStart(2, "0")}.png`), Buffer.from(png, "base64"));
  }
  if (errors.length) throw new Error(errors.join("; "));
  console.log(JSON.stringify({ result: "PASS", frames: 32, maxGripMovement, maxGripScreenMovement, headLift: lift, contactPixel: contact.contactScreen }));
} finally {
  await browser.close();
}
