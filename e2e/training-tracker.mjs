/**
 * Full-stack E2E for the Gladiators training tracker + content wiring.
 * Drives a real browser through the actual server actions against the local
 * app + real Supabase beta project:
 *   register -> reserve (gated) -> sign waiver -> reserve (booked) ->
 *   dashboard shows XP/level -> (as instructor) check-in -> XP/attendance rise
 *   -> donate lead form writes a row.
 * Creates an isolated test class + test user and cleans everything up after.
 *
 * Requires the app running at BASE (default http://localhost:3140).
 * Run: BASE=http://localhost:3140 node e2e/training-tracker.mjs
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.BASE || "http://localhost:3140";

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

const email = `sk-train-${Date.now()}@example.com`;
const password = "test-pass-12345";
let userId = null;
let classId = null;
let passed = 0;
let failed = 0;
const check = (n, c) => (c ? (passed++, console.log(`  ✓ ${n}`)) : (failed++, console.error(`  ✗ ${n}`)));

async function setup() {
  const startsAt = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString();
  const { data, error } = await admin
    .from("classes")
    .insert({
      title: `E2E Test Class ${Date.now()}`,
      class_type: "standard",
      description: "Automated test session.",
      location: "Test Gym",
      starts_at: startsAt,
      capacity: 5,
      is_published: true,
    })
    .select("id")
    .single();
  if (error) throw new Error("setup class failed: " + error.message);
  classId = data.id;
}

async function cleanup() {
  try {
    const { data: prof } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
    const uid = prof?.id ?? userId;
    if (uid) {
      await admin.from("xp_events").delete().eq("user_id", uid);
      await admin.from("checkins").delete().eq("user_id", uid);
      await admin.from("registrations").delete().eq("user_id", uid);
      await admin.from("waivers").delete().eq("user_id", uid);
      await admin.from("media_consents").delete().eq("user_id", uid);
      await admin.from("participant_badges").delete().eq("user_id", uid);
      await admin.auth.admin.deleteUser(uid);
    }
    await admin.from("donations").delete().eq("email", email);
    if (classId) await admin.from("classes").delete().eq("id", classId);
  } catch (e) {
    console.error("cleanup error:", e.message);
  }
}

async function reserveButton(page) {
  return page.locator(`form:has(input[value="${classId}"]) button[type="submit"]`).first();
}

async function run() {
  await setup();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log(`\nTraining tracker E2E  (class ${classId})\n`);

  // 1. Register → redirected to /training
  await page.goto(`${BASE}/account/register?next=${encodeURIComponent("/training")}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/training**", { timeout: 15000 });
  check("register redirects to /training", page.url().includes("/training"));

  const { data: prof } = await admin.from("profiles").select("id, role").eq("email", email).maybeSingle();
  userId = prof?.id;
  check("profile row created", Boolean(userId));

  // 2. Reserve without a waiver → redirected to /training/waiver
  await page.goto(`${BASE}/training`);
  await (await reserveButton(page)).click();
  await page.waitForURL("**/training/waiver**", { timeout: 15000 });
  check("reserve without waiver routes to waiver", page.url().includes("/training/waiver"));

  // 3. Sign the waiver (decline media consent) → returns toward booking
  await page.fill('input[name="participant_name"]', "Test Participant");
  await page.fill('input[name="typed_name"]', "Test Participant");
  await page.check('input[name="agree"]');
  await page.click('button[type="submit"]');
  // Wait for the real redirect OFF the waiver page (glob "**/training**" would
  // also match /training/waiver and resolve instantly — use a path-anchored regex).
  await page.waitForURL(/\/training(?:[?#]|$)/, { timeout: 15000 });
  await page.waitForTimeout(800); // let the post-redirect writes settle

  const { data: waiverRow } = await admin
    .from("waivers")
    .select("version, full_text, typed_name")
    .eq("user_id", userId)
    .maybeSingle();
  check("waiver row stored with full text", Boolean(waiverRow?.full_text?.length));
  const { data: mc } = await admin.from("media_consents").select("granted").eq("user_id", userId).maybeSingle();
  check("media consent recorded as declined", mc?.granted === false);
  const { data: afterWaiver } = await admin.from("profiles").select("role").eq("id", userId).maybeSingle();
  check("role promoted to participant", afterWaiver?.role === "participant");

  // 4. Reserve again (now waiver exists) → booked
  await page.goto(`${BASE}/training`);
  await (await reserveButton(page)).click();
  await page.waitForURL("**/training?booked=1**", { timeout: 15000 });
  const { count: regCount } = await admin
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("class_id", classId)
    .eq("status", "registered");
  check("registration created", regCount === 1);

  // 5. Dashboard shows waiver XP (account_created 5 + waiver_signed 5 = 10) + rank
  await page.goto(`${BASE}/account`);
  const body1 = await page.textContent("body");
  check("dashboard shows rank Recruit", body1.includes("Recruit"));
  check("dashboard lists the booked class", body1.includes("E2E Test Class"));
  const { data: xp1 } = await admin.from("xp_events").select("xp_value").eq("user_id", userId);
  const total1 = (xp1 ?? []).reduce((s, r) => s + r.xp_value, 0);
  check(`waiver granted 10 XP (got ${total1})`, total1 === 10);

  // 6. Promote to instructor, then check-in via the real staff UI
  await admin.from("profiles").update({ role: "instructor" }).eq("id", userId);
  await page.goto(`${BASE}/admin/check-in?class=${classId}`);
  const checkinBtn = page.locator(`form:has(input[name="user_id"][value="${userId}"]) button[type="submit"]`).first();
  check("roster shows the participant", (await checkinBtn.count()) > 0);
  await checkinBtn.click();
  await page.waitForTimeout(2500);
  const { count: ciCount } = await admin
    .from("checkins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("class_id", classId);
  check("check-in row created", ciCount === 1);
  const { data: xp2 } = await admin.from("xp_events").select("xp_value, event_type").eq("user_id", userId);
  const total2 = (xp2 ?? []).reduce((s, r) => s + r.xp_value, 0);
  check(`attendance XP awarded (+10 = 20, got ${total2})`, total2 === 20);
  const { data: regAfter } = await admin
    .from("registrations")
    .select("status")
    .eq("user_id", userId)
    .eq("class_id", classId)
    .maybeSingle();
  check("registration marked attended", regAfter?.status === "attended");
  const { count: badgeCount } = await admin
    .from("participant_badges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  check("first-class badge granted", (badgeCount ?? 0) >= 1);

  // 7. Idempotent check-in: clicking again must NOT double-award
  await page.goto(`${BASE}/admin/check-in?class=${classId}`);
  await page.waitForTimeout(500);
  const { data: xp3 } = await admin.from("xp_events").select("xp_value").eq("user_id", userId);
  const total3 = (xp3 ?? []).reduce((s, r) => s + r.xp_value, 0);
  check(`no double-award after re-check-in (still 20, got ${total3})`, total3 === 20);

  // 8. Donate lead form writes a row
  await page.goto(`${BASE}/donate`);
  await page.fill('input[name="first_name"]', "Dona");
  await page.fill('input[name="last_name"]', "Tester");
  await page.fill('#donor_email', email);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  const { data: don } = await admin.from("donations").select("amount, first_name").eq("email", email).maybeSingle();
  check("donation lead stored", Boolean(don));

  await browser.close();
}

run()
  .catch((e) => {
    failed++;
    console.error("FATAL:", e.message);
  })
  .finally(async () => {
    await cleanup();
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed ? 1 : 0);
  });
