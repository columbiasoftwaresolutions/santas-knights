/**
 * E2E for unified login + gift claim/track against the local app + real Supabase.
 *   - register → lands on /account ; promoted account → login lands on /admin
 *   - claim a pooled letter → drops from public pool → My gifts → mark gifted
 *   - self-dealing guard: can't claim your own child's letter
 * Each actor gets an isolated browser context. Test data is cleaned up after.
 *
 * Run: BASE=http://localhost:3140 node e2e/gift-and-login.mjs
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.BASE || "http://localhost:3140";
const env = {};
for (const l of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

let pass = 0, fail = 0;
const check = (n, c) => (c ? (pass++, console.log("  ✓ " + n)) : (fail++, console.error("  ✗ " + n)));
const stamp = Date.now();
const donorEmail = `sk-donor-${stamp}@example.com`;
const adminEmail = `sk-admin-${stamp}@example.com`;
const password = "test-pass-12345";
const created = { letters: [] };
let browser;

async function makeLetter(extra = {}) {
  const { data } = await admin
    .from("santa_letters")
    .insert({
      child_first_name: "Testkid", child_age: 8,
      wish_note: `E2E wish ${Math.random().toString(36).slice(2, 8)}`,
      amazon_urls: ["https://www.amazon.com/s?k=toy"], amazon_image_urls: [""], status: "live",
      guardian_name: "Guardian",
      guardian_email: `sk-guardian-${stamp}-${created.letters.length}@example.com`,
      created_at: new Date(Date.UTC(2000, 0, 1, 0, created.letters.length)).toISOString(),
      ...extra,
    })
    .select("id").single();
  created.letters.push(data.id);
  return data.id;
}

async function cleanup() {
  for (const id of created.letters) await admin.from("santa_letters").delete().eq("id", id);
  for (const email of [donorEmail, adminEmail]) {
    const { data } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
    if (data?.id) await admin.auth.admin.deleteUser(data.id);
  }
}

/** Fresh isolated context + page. */
async function fresh() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  return { ctx, page };
}

/** Submit the unified login; throws with the on-page error if it doesn't navigate away. */
async function login(page, email, pw, nextParam) {
  const url = nextParam ? `${BASE}/account/login?next=${encodeURIComponent(nextParam)}` : `${BASE}/account/login`;
  await page.goto(url);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pw);
  await Promise.all([
    page.waitForURL((u) => !u.toString().includes("/account/login"), { timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function pollLetter(id, want, tries = 14) {
  for (let i = 0; i < tries; i++) {
    const { data } = await admin.from("santa_letters").select("status, fulfilled_by_user_id, claimed_at").eq("id", id).maybeSingle();
    if (data?.status === want) return data;
    await new Promise((r) => setTimeout(r, 500));
  }
  return (await admin.from("santa_letters").select("status, fulfilled_by_user_id, claimed_at").eq("id", id).maybeSingle()).data;
}

async function pollClaimed(id, tries = 14) {
  for (let i = 0; i < tries; i++) {
    const { data } = await admin.from("santa_letters").select("status, fulfilled_by_user_id, claimed_at").eq("id", id).maybeSingle();
    if (data?.status === "live" && data.claimed_at) return data;
    await new Promise((r) => setTimeout(r, 500));
  }
  return (await admin.from("santa_letters").select("status, fulfilled_by_user_id, claimed_at").eq("id", id).maybeSingle()).data;
}

async function run() {
  browser = await chromium.launch();
  console.log(`\nUnified login + gift claim E2E\n`);

  // Adopt gate copy (logged out)
  {
    const { ctx, page } = await fresh();
    await page.goto(`${BASE}/letters`);
    check("adopt gate shows the login-button copy", (await page.textContent("body")).includes("Log in to gift a kid"));
    await ctx.close();
  }

  // Register a regular user → /account
  {
    const { ctx, page } = await fresh();
    await page.goto(`${BASE}/account/register`);
    await page.fill('input[name="email"]', donorEmail);
    await page.fill('input[name="password"]', password);
    await Promise.all([page.waitForURL(/\/account(?:[?#]|$)/, { timeout: 20000 }).catch(() => {}), page.click('button[type="submit"]')]);
    check("register lands a regular user on /account", /\/account(?:[?#]|$)/.test(page.url()));
    await ctx.close();
  }
  const { data: donor } = await admin.from("profiles").select("id").eq("email", donorEmail).maybeSingle();

  // Promote a second account to admin → unified login routes it to /admin
  {
    await admin.auth.admin.createUser({ email: adminEmail, password, email_confirm: true });
    const { data: a } = await admin.from("profiles").select("id").eq("email", adminEmail).maybeSingle();
    await admin.from("profiles").update({ role: "admin" }).eq("id", a.id);
    const { ctx, page } = await fresh();
    await login(page, adminEmail, password);
    check("same login routes an admin to /admin", /\/admin(?:[?#]|$)/.test(page.url()));
    await ctx.close();
  }

  // Claim flow
  const letterA = await makeLetter();
  {
    const { ctx, page } = await fresh();
    await login(page, donorEmail, password, "/letters");
    check("donor reached the adopt deck", /\/letters(?:[?#]|$)/.test(page.url()));
    const giftBtn = page.getByRole("button", { name: /Gift this/ });
    await giftBtn.waitFor({ timeout: 12000 });
    await giftBtn.click();
    const claimed = await pollClaimed(letterA);
    check("letter stays live while claimed", claimed?.status === "live");
    check("letter has a claim timestamp", Boolean(claimed?.claimed_at));
    check("claim linked to the donor", claimed?.fulfilled_by_user_id === donor?.id);
    const { data: pool } = await admin.from("public_letters").select("id").eq("id", letterA);
    check("claimed letter drops out of the public pool", (pool ?? []).length === 0);

    await page.goto(`${BASE}/account`);
    check("My gifts lists the adopted letter", (await page.textContent("body")).includes("Testkid"));
    await page.getByRole("button", { name: "I sent it" }).first().click();
    const gifted = await pollLetter(letterA, "fulfilled");
    check("mark-as-sent sets status fulfilled", gifted?.status === "fulfilled");
    await ctx.close();
  }

  // Self-dealing guard
  const letterSelf = await makeLetter({ guardian_user_id: donor?.id, guardian_email: donorEmail });
  {
    const { ctx, page } = await fresh();
    await login(page, donorEmail, password, "/letters");
    const giftBtn = page.getByRole("button", { name: /Gift this/ });
    await giftBtn.waitFor({ timeout: 12000 });
    await giftBtn.click();
    await new Promise((r) => setTimeout(r, 2500));
    const { data: still } = await admin.from("santa_letters").select("status, fulfilled_by_user_id").eq("id", letterSelf).maybeSingle();
    check("own child's letter is NOT claimed (stays live)", still?.status === "live");
    check("no donor linked to own letter", !still?.fulfilled_by_user_id);
    await ctx.close();
  }

  await browser.close();
}

run()
  .catch((e) => { fail++; console.error("FATAL:", e.message); })
  .finally(async () => { await cleanup(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0); });
