/**
 * Full-stack UI test for the account-gated multi-gift submission.
 * Drives a real browser through the actual server actions:
 *   register -> redirected back to /letters?do=submit -> fill form with 2 gifts
 *   -> success -> My Letters shows the letter.
 * Cleans up the test user + letter afterwards.
 *
 * Requires the app running at BASE (default http://localhost:3139).
 * Run: node e2e/account-submit-ui.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.BASE || "http://localhost:3139";

function loadEnv() {
  const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const env = {};
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return env;
}
const env = loadEnv();
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

// 1x1 px PNG for the required letter image.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);
const imgPath = "/tmp/sk-test-letter.png";
writeFileSync(imgPath, PNG);

const email = `sk-ui-${Date.now()}@example.com`;
const password = "test-pass-12345";
let passed = 0,
  failed = 0;
const check = (n, c) => (c ? (passed++, console.log(`  ✓ ${n}`)) : (failed++, console.error(`  ✗ ${n}`)));

async function cleanup() {
  const { data: rows } = await admin.from("santa_letters").select("id").eq("guardian_email", email);
  for (const r of rows ?? []) await admin.from("santa_letters").delete().eq("id", r.id);
  const { data: prof } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (prof?.id) await admin.auth.admin.deleteUser(prof.id);
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log("Full-stack account-gated submission\n");

  // Register, expecting a redirect back to the submit side of the Letters page.
  await page.goto(`${BASE}/account/register?next=${encodeURIComponent("/letters?do=submit")}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForURL("**/letters?do=submit", { timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);
  check("register redirected to /letters?do=submit", page.url().includes("/letters?do=submit"));

  // The form is now visible (account satisfied the gate).
  await page.waitForSelector('input[name="child_first_name"]', { timeout: 10000 });
  check("submit form visible once signed in", true);
  const emailVal = await page.inputValue('input[name="guardian_email"]');
  check("guardian email prefilled from account", emailVal === email);

  // Fill the letter with TWO gifts via "+ Add gift".
  await page.fill('input[name="child_first_name"]', "Uitest");
  await page.fill('input[name="child_age"]', "8");
  await page.fill('textarea[name="wish_note"]', "A telescope and a star map.");
  await page.locator('input[name="amazon_url"]').nth(0).fill("https://www.amazon.com/dp/TELE1");
  await page.click("text=+ Add gift");
  await page.locator('input[name="amazon_url"]').nth(1).fill("https://www.amazon.com/dp/MAP22");
  await page.fill('input[name="guardian_name"]', "UI Test Guardian");
  await page.setInputFiles('input[name="letter_image"]', imgPath);
  await page.check('input[name="consent"]');

  await page.click('button:has-text("Submit the letter")');
  await page.waitForSelector("text=The letter is in", { timeout: 20000 });
  check("submission succeeded", true);

  // Verify in DB: stored as array of 2, linked to the account.
  const { data: prof } = await admin.from("profiles").select("id").eq("email", email).single();
  const { data: letter } = await admin
    .from("santa_letters")
    .select("amazon_urls, guardian_user_id, status")
    .eq("guardian_email", email)
    .single();
  check("letter stored 2 gifts as array", letter?.amazon_urls?.length === 2);
  check("letter linked to guardian account", letter?.guardian_user_id === prof?.id);
  check("letter status pending", letter?.status === "pending");

  // My Letters shows it.
  await page.goto(`${BASE}/account`);
  await page.waitForSelector("text=My letters", { timeout: 10000 });
  const body = await page.textContent("body");
  check("My Letters lists the child", body.includes("Uitest"));
  check("My Letters shows 2 gifts", body.includes("2 gifts"));

  await browser.close();
  await cleanup();
  check("cleanup done", true);
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

run().catch(async (e) => {
  console.error("\nFATAL:", e.message);
  await cleanup();
  process.exit(1);
});
