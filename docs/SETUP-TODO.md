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
**SQL Editor** → paste and run [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).

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

Sign in at `/admin/login` to reach the moderation dashboard.

## 4. Get from Damion / Nicolas

- Real **PayPal / Venmo / donation-processor URLs** →
  `NEXT_PUBLIC_PAYPAL_URL`, `NEXT_PUBLIC_VENMO_URL`, `NEXT_PUBLIC_DONATE_URL`.
  (The Donate page only renders options whose URLs are set.)
- Final **consent / terms language** to replace the drafts in
  [`content/consent.ts`](../content/consent.ts) — bump the version strings
  when the text changes.

## 5. Optional

- **Resend API key** + `CONTACT_EMAIL_TO` — forwards each contact-form
  message by email. Messages are stored in Supabase regardless.
- `NEXT_PUBLIC_GLADIATORS_URL` — once the companion training site is live.

## After steps 1–3

Tell Claude the backend is live and it can verify the full flow end-to-end:
submit a letter → moderate at `/admin` → see it in the swipe deck at
`/letters/give` → mark fulfilled. (`/letters/give?demo=1` previews the swipe
UI with sample letters at any time.)

## Notes for later

- **Free-tier pause:** Supabase free projects pause after ~1 week of
  inactivity and need a one-click restore (data is kept). Before the
  Oct–Nov letter-season ramp, either budget Supabase Pro (~$25/mo, can be
  downgraded in January) or accept the restore click.
- Commits/pushes happen only on request, with a CHANGELOG entry written from
  the diff at commit time (see CLAUDE.md).
