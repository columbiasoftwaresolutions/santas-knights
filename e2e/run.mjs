// End-to-end test of the Letters to Santa flow against the local dev server.
// Drives a fresh headless Chromium (Playwright) so it never touches the user's
// real Chrome. Screenshots land in ../e2e-screenshots.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const ADMIN_EMAIL = "routsiddharth2911@gmail.com";
const ADMIN_PASSWORD = "routsiddharth2911@gmail.com";
const here = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(here, "..", "e2e-screenshots");
const ASSETS = path.join(here, "..", "e2e-assets");

const KIDS = [
  {
    name: "Maya", age: "7",
    wish: "I have been very good this year. I would love a watercolor paint set so I can paint the park near my building.",
    amazon: "https://www.amazon.com/s?k=watercolor+paint+set+kids",
    guardian: "Rosa Delgado", email: "rosa.delgado.test@example.com",
    image: path.join(ASSETS, "letter-maya.jpg"),
  },
  {
    name: "Jaylen", age: "10",
    wish: "My sneakers are too small now. Size 5 please, any color but mostly blue. Thank you and say hi to the reindeer.",
    amazon: "https://www.amazon.com/s?k=kids+sneakers+size+5",
    guardian: "Tasha Brooks", email: "tasha.brooks.test@example.com",
    image: path.join(ASSETS, "letter-jaylen.jpg"),
  },
  {
    name: "Sofia", age: "5",
    wish: "deer santa. a stuffed dog pleese. a big one. i wil name him biscit.",
    amazon: "https://www.amazon.com/s?k=large+stuffed+dog+plush",
    guardian: "Ana Ruiz", email: "ana.ruiz.test@example.com",
    image: path.join(ASSETS, "letter-sofia.jpg"),
  },
];

const log = (m) => console.log(`• ${m}`);

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS, name), fullPage: true });
  log(`screenshot ${name}`);
}

// Find the moderation card form for a given child name ("Maya, 7") and click a button by label.
async function moderate(page, heading, buttonLabel, note) {
  const card = page.locator("div").filter({
    has: page.getByRole("heading", { name: heading, exact: true }),
  }).filter({ has: page.locator("form") }).last();
  if (note) await card.getByRole("textbox").fill(note);
  await card.getByRole("button", { name: buttonLabel, exact: true }).click();
  await page.waitForLoadState("networkidle");
}

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
  const page = await context.newPage();
  page.on("console", (msg) => { if (msg.type() === "error") console.log("  [browser error]", msg.text()); });

  // Letter submission is account-gated. Sign in with the test admin account
  // before creating the sample submissions, then sign out before the admin step
  // below so the login screenshot still exercises the unified auth flow.
  log("Signing in for account-gated submission…");
  await page.goto(`${BASE}/account/login?next=${encodeURIComponent("/letters?do=submit")}`, { waitUntil: "networkidle" });
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", ADMIN_PASSWORD);
  await page.getByRole("button", { name: /Sign in/i }).click();
  await page.waitForURL("**/letters?do=submit", { timeout: 20000 });

  // ---- 1. Submit letters as three different families ------------------------
  let first = true;
  for (const kid of KIDS) {
    log(`Submitting ${kid.name}'s letter…`);
    await page.goto(`${BASE}/letters?do=submit`, { waitUntil: "networkidle" });
    if (first) { await shot(page, "01-submit-form-empty.png"); }
    await page.fill("#child_first_name", kid.name);
    await page.fill("#child_age", kid.age);
    await page.fill("#wish_note", kid.wish);
    await page.fill("#amazon_url", kid.amazon);
    await page.setInputFiles("#letter_image", kid.image);
    await page.fill("#guardian_name", kid.guardian);
    await page.fill("#guardian_email", kid.email);
    await page.check('input[name="consent"]');
    if (first) { await shot(page, "02-submit-maya-filled.png"); }
    await page.getByRole("button", { name: /Submit the letter/i }).click();
    await page.getByText("The letter is in").waitFor({ timeout: 20000 });
    await shot(page, first ? "03-submit-maya-success.png"
      : kid.name === "Jaylen" ? "04-submit-jaylen-success.png" : "05-submit-sofia-success.png");
    first = false;
  }

  await page.goto(`${BASE}/account`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Sign out/i }).click();
  await page.getByRole("link", { name: /Create an account/i }).waitFor({ timeout: 20000 });

  // ---- 2. Admin signs in -----------------------------------------------------
  log("Admin signing in…");
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await shot(page, "06-admin-login.png");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", ADMIN_PASSWORD);
  await page.getByRole("button", { name: /Sign in/i }).click();
  await page.getByRole("heading", { name: "Letter moderation" }).waitFor({ timeout: 20000 });
  await page.waitForLoadState("networkidle");
  await shot(page, "07-admin-pending-3.png");

  // ---- 3. Moderate: approve two, request edits on one ------------------------
  log("Approving Maya…");
  await moderate(page, "Maya, 7", "Approve");
  log("Approving Jaylen…");
  await moderate(page, "Jaylen, 10", "Approve");
  log("Requesting edits on Sofia…");
  await moderate(page, "Sofia, 5", "Request edits", "Please retake the photo in better light — the wish is hard to read.");
  await shot(page, "08-admin-after-moderation.png"); // pending tab, now empty

  await page.goto(`${BASE}/admin?status=approved`, { waitUntil: "networkidle" });
  await shot(page, "09-admin-approved.png");
  await page.goto(`${BASE}/admin?status=needs_edits`, { waitUntil: "networkidle" });
  await shot(page, "10-admin-needs-edits.png");

  // ---- 4. Donor side: the swipe deck shows the two approved letters ----------
  log("Loading donor swipe deck…");
  await page.goto(`${BASE}/letters`, { waitUntil: "networkidle" });
  await page.getByText(/Letter 1 of/).waitFor({ timeout: 20000 });
  await shot(page, "11-give-deck-front.png");
  await page.getByRole("button", { name: /See the wish/i }).click();
  await page.waitForTimeout(800); // flip animation
  await shot(page, "12-give-deck-wish.png");

  // ---- 5. Admin marks one fulfilled, pool shrinks ----------------------------
  log("Marking Maya fulfilled…");
  await page.goto(`${BASE}/admin?status=approved`, { waitUntil: "networkidle" });
  await moderate(page, "Maya, 7", "Mark fulfilled");
  await page.goto(`${BASE}/admin?status=fulfilled`, { waitUntil: "networkidle" });
  await shot(page, "13-admin-fulfilled.png");

  log("Reloading donor deck (should be one fewer)…");
  await page.goto(`${BASE}/letters`, { waitUntil: "networkidle" });
  await page.getByText(/Letter 1 of/).waitFor({ timeout: 20000 });
  await shot(page, "14-give-deck-after-fulfill.png");

  await browser.close();
  log("DONE — full flow exercised.");
};

run().catch((err) => { console.error("E2E FAILED:", err); process.exit(1); });
