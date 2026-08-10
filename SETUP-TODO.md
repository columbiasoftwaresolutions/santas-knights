# Setup TODO — manual steps to bring the backend live

The site builds and deploys without any of this (features degrade to friendly
notices). These are the human steps left before Letters to Santa, the contact
form, newsletter capture, and `/admin` work against real data.

## 1. Create the Supabase project

Two equivalent paths — pick one:

- **Through Vercel (recommended):** Vercel dashboard → `santas-knights`
  project → **Storage** tab → Create Database → **Supabase** (free plan,
  US East). Env vars are auto-injected into Production/Preview/Development;
  billing for any future paid tier runs through the Vercel invoice.
- **Directly:** supabase.com → New project, then copy keys by hand (step 2).

Either way, finish by applying the schema: open the Supabase project →
**SQL Editor** → paste and run the schema in
[`CLAUDE.md`](../CLAUDE.md#database-schema) (Database schema).

## 2. Environment variables

Skip the Vercel half of this if you used the marketplace integration (it
injects these already) — then just pull them locally:

```bash
vercel env pull .env.local
```

Manual path: copy `.env.example` → `.env.local` and fill from Supabase
Project Settings → API; add the same three in Vercel → Project → Settings →
Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` *(server-only — never expose to the client)*

## 3. Create the first admin

Supabase dashboard → **Authentication** → Add user (email + password), then
in the SQL Editor:

```sql
update profiles set role = 'admin' where email = '<that email>';
```

Sign in at `/admin/login` to reach the Letters admin dashboard.

## 3b. Apply the gift-summary migration

Run [`sql/2026-08-gift-summary.sql`](../sql/2026-08-gift-summary.sql) in the SQL
Editor. It adds `gift_summary` / `gift_value_usd` to `santa_letters` and
re-projects them through the three letter views, so the public letter cards can
show "LEGO Technic set · about $50".

Safe to defer: both the read and the write detect the missing columns and fall
back to the old column set, so the site keeps working — the ask line just
doesn't render, and the submit form's answer is dropped.

## 4. Get from Damion / Nicolas

- Real **PayPal / Venmo / donation-processor URLs** →
  `NEXT_PUBLIC_PAYPAL_URL`, `NEXT_PUBLIC_VENMO_URL`, `NEXT_PUBLIC_DONATE_URL`.
  (The Donate page only renders options whose URLs are set.)
- ⭐ **Recurring-billing links** — the one genuinely missing piece behind the
  Donate and Membership CTAs. Right now every monthly gift falls through to the
  PayPal fundraiser, which does handle recurring gifts, so nothing is a dead
  link — but the donor doesn't land on a page that already knows the amount.
  Turning it on is a change to **one file**, [`content/billing.ts`](../content/billing.ts),
  with no UI work. Either:
  1. paste a per-amount recurring link (Stripe payment link, Donorbox plan,
     Givebutter, …) into `monthlyPlanUrls` for $20 / $50 / $100 / $250 / $500, or
  2. set `NEXT_PUBLIC_BILLING_URL` to a checkout that accepts `?amount=` and
     `?frequency=`, which also covers custom amounts.

  Whichever is set, `recordDonationIntent` still writes the `donations` row
  before the donor leaves, so the lead and the receipt trail are unaffected.
- Final **consent / terms language** to replace the drafts in
  [`content/consent.ts`](../content/consent.ts) — bump the version strings
  when the text changes.

## 5. Optional

- **Resend API key** + `CONTACT_EMAIL_TO` — forwards each contact-form
  message by email. Messages are stored in Supabase regardless.
- `NEXT_PUBLIC_GLADIATORS_URL` — the base URL of the separate **`gladiators.nyc`** site, used for cross-link-out buttons (class **booking**, the participant dashboard, and the commercial **Shop/Armory**), once it's live. (The Gladiators *content* pages — class catalog, descriptions, `/online` — live on this site, but the *operational* training tracker — booking, waivers, check-in, XP, dashboards — lives on `gladiators.nyc` behind this URL, alongside the Shop/Armory. Identity is shared across both sites.)

## After steps 1–3

Tell Claude the backend is live and it can verify the full flow end-to-end:
submit a letter → see it live in the swipe deck at `/letters` → delete if
needed in `/admin` → mark fulfilled. (`/letters?demo=1` previews the swipe
UI with sample letters at any time.)

## Notes for later

- **Free-tier pause:** Supabase free projects pause after ~1 week of
  inactivity and need a one-click restore (data is kept). Before the
  Oct–Nov letter-season ramp, either budget Supabase Pro (~$25/mo, can be
  downgraded in January) or accept the restore click.
- Commits/pushes happen only on request, with a CHANGELOG entry written from
  the diff at commit time (see CLAUDE.md).
