// Targeted re-run: request edits on Sofia with a proper wait for the card to
// leave the pending queue, then re-capture the affected admin screenshots.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const here = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(here, "..", "e2e-screenshots");
const log = (m) => console.log(`• ${m}`);
const shot = (page, name) => page.screenshot({ path: path.join(SHOTS, name), fullPage: true });

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
  const page = await context.newPage();

  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await page.fill("#email", "routsiddharth2911@gmail.com");
  await page.fill("#password", "routsiddharth2911@gmail.com");
  await page.getByRole("button", { name: /Sign in/i }).click();
  await page.getByRole("heading", { name: "Letter moderation" }).waitFor();
  await page.waitForLoadState("networkidle");

  const sofiaHeading = page.getByRole("heading", { name: "Sofia, 5", exact: true });
  if (await sofiaHeading.count()) {
    log("Requesting edits on Sofia (with wait-for-removal)…");
    const card = page.locator("div").filter({ has: sofiaHeading })
      .filter({ has: page.locator("form") }).last();
    await card.getByRole("textbox").fill("Please retake the photo in better light — the wish is hard to read.");
    await card.getByRole("button", { name: "Request edits", exact: true }).click();
    // Wait until Sofia actually leaves the pending queue.
    await sofiaHeading.waitFor({ state: "detached", timeout: 20000 });
    await page.waitForLoadState("networkidle");
    log("Sofia left the pending queue.");
  } else {
    log("Sofia not in pending — already moderated.");
  }

  // Re-capture pending (should now be empty) and needs-edits (should show Sofia).
  await page.goto(`${BASE}/admin?status=pending`, { waitUntil: "networkidle" });
  await shot(page, "08-admin-after-moderation.png");
  await page.goto(`${BASE}/admin?status=needs_edits`, { waitUntil: "networkidle" });
  await shot(page, "10-admin-needs-edits.png");

  await browser.close();
  log("DONE.");
};
run().catch((e) => { console.error("FAILED:", e); process.exit(1); });
