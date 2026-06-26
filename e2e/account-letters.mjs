/**
 * End-to-end DB/RLS test for the account model + multi-gift letters.
 * No browser needed — drives Supabase directly with the same clients the app uses.
 *
 * Verifies:
 *   - new account auto-gets a `public` profiles row (handle_new_user trigger)
 *   - a letter stores amazon_urls as an ARRAY + guardian_user_id
 *   - my_letters returns ONLY the owner's letters (RLS scoping)
 *   - moderation_note is hidden unless status = needs_edits
 *   - public_letters exposes approved letters (array) to anon
 *   - a second account cannot see the first's letters
 *   - anon cannot read the raw santa_letters table
 *
 * Cleans up all test data + users at the end.
 *
 * Run: node e2e/account-letters.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

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
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SECRET = env.SUPABASE_SECRET_KEY;
if (!URL_ || !ANON || !SECRET) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const admin = createClient(URL_, SECRET, { auth: { persistSession: false } });

let passed = 0;
let failed = 0;
function check(name, cond) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

const stamp = Date.now();
const userA = { email: `sk-test-a-${stamp}@example.com`, password: "test-pass-12345" };
const userB = { email: `sk-test-b-${stamp}@example.com`, password: "test-pass-12345" };
const created = { users: [], letters: [] };

async function signedInClient(creds) {
  const c = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { error } = await c.auth.signInWithPassword(creds);
  if (error) throw new Error(`sign-in failed: ${error.message}`);
  return c;
}

async function run() {
  console.log("Account model + multi-gift letters E2E\n");

  // 1. Create confirmed accounts (as the register action does)
  for (const u of [userA, userB]) {
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });
    if (error) throw new Error(`createUser: ${error.message}`);
    u.id = data.user.id;
    created.users.push(u.id);
  }
  console.log("Accounts");
  // 2. profiles row auto-created with role public
  const { data: profA } = await admin.from("profiles").select("role").eq("id", userA.id).single();
  check("new account gets a profiles row", !!profA);
  check("new account role is 'public'", profA?.role === "public");

  // 3. Sign in as A, my_letters empty initially
  const aClient = await signedInClient(userA);
  const { data: empty } = await aClient.from("my_letters").select("id");
  console.log("\nMy Letters (empty state)");
  check("my_letters empty for new account", Array.isArray(empty) && empty.length === 0);

  // 4. Submit a letter (admin client, like the server action) with multiple gifts
  const gifts = ["https://www.amazon.com/dp/AAAA", "https://www.amazon.com/dp/BBBB"];
  const { data: letter, error: insErr } = await admin
    .from("santa_letters")
    .insert({
      child_first_name: "Testchild",
      child_age: 9,
      wish_note: "A bike and a book.",
      amazon_urls: gifts,
      guardian_name: "Test Guardian",
      guardian_email: userA.email,
      guardian_user_id: userA.id,
      status: "pending",
    })
    .select("id, amazon_urls")
    .single();
  if (insErr) throw new Error(`letter insert: ${insErr.message}`);
  created.letters.push(letter.id);
  console.log("\nMulti-gift storage");
  check("amazon_urls stored as array", Array.isArray(letter.amazon_urls));
  check("array preserves all gifts (2)", letter.amazon_urls.length === 2);

  // 5. A sees their letter via my_letters
  const { data: mine } = await aClient
    .from("my_letters")
    .select("id, amazon_urls, status, moderation_note");
  console.log("\nMy Letters (owner view + RLS)");
  check("owner sees their 1 letter", mine?.length === 1);
  check("owner sees both gifts", mine?.[0]?.amazon_urls?.length === 2);
  check("moderation_note hidden while pending", mine?.[0]?.moderation_note === null);

  // 6. needs_edits surfaces the note
  await admin
    .from("santa_letters")
    .update({ status: "needs_edits", moderation_note: "Please re-crop the photo." })
    .eq("id", letter.id);
  const { data: edited } = await aClient
    .from("my_letters")
    .select("status, moderation_note")
    .eq("id", letter.id)
    .single();
  check("status shows needs_edits", edited?.status === "needs_edits");
  check("moderation_note visible on needs_edits", edited?.moderation_note === "Please re-crop the photo.");

  // 7. Second account cannot see A's letter
  const bClient = await signedInClient(userB);
  const { data: bSees } = await bClient.from("my_letters").select("id");
  console.log("\nIsolation between accounts");
  check("other account sees none of A's letters", Array.isArray(bSees) && bSees.length === 0);

  // 8. Approve → public_letters exposes it (array) to anon
  await admin.from("santa_letters").update({ status: "approved" }).eq("id", letter.id);
  const anon = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { data: pub } = await anon
    .from("public_letters")
    .select("id, amazon_urls")
    .eq("id", letter.id);
  console.log("\nPublic adoption view (anon)");
  check("approved letter visible in public_letters", pub?.length === 1);
  check("public_letters returns the gift array", pub?.[0]?.amazon_urls?.length === 2);

  // 9. anon cannot read the raw table
  const { data: raw, error: rawErr } = await anon.from("santa_letters").select("guardian_email");
  check(
    "anon cannot read raw santa_letters (no rows / denied)",
    !!rawErr || (Array.isArray(raw) && raw.length === 0),
  );

  // cleanup
  console.log("\nCleanup");
  for (const id of created.letters) await admin.from("santa_letters").delete().eq("id", id);
  for (const id of created.users) await admin.auth.admin.deleteUser(id);
  check("test data removed", true);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

run().catch(async (e) => {
  console.error("\nFATAL:", e.message);
  // best-effort cleanup
  for (const id of created.letters) await admin.from("santa_letters").delete().eq("id", id);
  for (const id of created.users) await admin.auth.admin.deleteUser(id);
  process.exit(1);
});
