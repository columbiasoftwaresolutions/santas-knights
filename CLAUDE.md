# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

The **Santa's Knights** platform — a Next.js + Supabase rebuild of the **Santa's Knights, Inc.** 501(c)(3) nonprofit site, plus the **Letters to Santa** gifting portal and the **Gladiators NYC free combat program** *content* (the operational training tracker lives on the separate `gladiators.nyc` site), on `santasknights.org`. Built by Columbia Software Solutions.

**Scope is Plan v2** ([docs/plan-v2.md](./docs/plan-v2.md)) — **nonprofit + Gladiators *content* on this site; Gladiators *operations* + commerce on `gladiators.nyc`**: this repo replicates **every public feature of the live Wix site** — nonprofit pages, member accounts, gallery, donate/membership, partners, the Letters portal — **and all Gladiators NYC *content* pages** (class catalog, per-class descriptions, Online, team, media, events, founder, brand copy). The Gladiators **operational training tracker** (class **booking**, **waivers + media consent**, **instructor check-in**, **XP/gamification**, **participant dashboards**, **training videos**, training admin / CSV grant export) is built on the separate **`gladiators.nyc`** site, which this site cross-links out to for booking.

**The separate `gladiators.nyc` site** carries all **operational** Gladiators functionality — booking, waivers, check-in, XP, participant dashboards, training videos, training admin — **plus** the commercial **Shop** and **Armory** (item-level armor inventory & rentals). Commerce is kept **off the nonprofit domain** because Santa's Knights is a 501(c)(3); this site **cross-links out** to `gladiators.nyc` for class booking, shop purchases, and armor rentals (bookings/e-commerce stay external). The two sites share **one identity** (one login). GLADIATORS-SITE.md (gladiators-nyc repo) specs the Gladiators training tracker (built on `gladiators.nyc`) and the commercial companion.

**Deploy (beta):** https://santas-knights.vercel.app/ — internal Vercel beta, auto-deploys from `main`. Not the public production site; keep `noindex` until cutover (see ROLLOUT.md).

Read these before substantial work:
- **[docs/plan-v2.md](./docs/plan-v2.md)** — ⭐ current scope: the build list. This repo builds the nonprofit pages, Letters, and the Gladiators *content* pages; the Gladiators *operational* training tracker and the commercial Shop + Armory live on `gladiators.nyc` (shared identity). Wins on *where* features are built where docs conflict.
- **[README.md](./README.md)** — scope, tech stack, phases, data model, setup, admin tasks.
- **[ROLLOUT.md](./docs/ROLLOUT.md)** — build-≠-cutover strategy, two-track rollout, public cutover checklist.
- **[CHANGELOG.md](./docs/CHANGELOG.md)** — impact-focused log of every change, maintained for Nicolas (SEO/ads/marketing).
- **[REQUIREMENTS.md](./docs/REQUIREMENTS.md)** — full feature scope by stage; site architecture & nonprofit-vs-commercial split.
- **GLADIATORS-SITE.md (gladiators-nyc repo)** — spec for the Gladiators NYC combat program: the *content* pages (built **here**) and the *operational* training tracker + commercial Shop/Armory (built on **`gladiators.nyc`**), sharing one identity.
- **[docs/SETUP-TODO.md](./docs/SETUP-TODO.md)** — remaining manual backend steps (first admin user, donation URLs, consent language, free-tier notes).

## Repo layout & current state

The app is built and the Supabase backend is wired up:

- **Routes** (App Router, `app/`): `/` home, `/santas-knights` about (sponsors folded in at `#sponsors`), `/contact` (volunteer application folded in at `#volunteer`), `/donate`, `/letters` (+ `/submit`, `/give`), `/account` (the member ledger — gifts you're sending and letters you've submitted, behind one switch; login/register redirect to `/login` and `/signup`), `/gallery`, `/membership`, `/training` + `/online`, and `/admin` (+ `/login`). `/about`, `/get-involved`, and `/sponsors` are redirects only — Get Involved is now `/contact#volunteer` and Sponsors is now `/santas-knights#sponsors`. **`/links` (link-in-bio) was deleted** — route, `links.linkInBio`, and its one reference on `/donate` are all gone; the planning docs (README, REQUIREMENTS, plan-v2, REDESIGN-PORT-PLAN) still list it and are stale on that point. Expanded account tracking and admin gallery/partners/donations remain planned. The Gladiators **training tracker** (booking, waiver, instructor check-in, XP, participant dashboard, training videos, training admin) is **not built in this repo** — it lives on the separate `gladiators.nyc` site. `/training` + `/online` here carry program **content**; their booking CTAs **link out** to `gladiators.nyc`. Class booking, the participant dashboard, and the commercial Shop/Armory all route out to `gladiators.nyc` (shared identity). See [docs/plan-v2.md](./docs/plan-v2.md) §D2.
- **Supabase** clients in `lib/supabase/` (`browser` / `server` / `admin` / `config`); the admin gate is `lib/auth.ts`; server actions live in `app/actions/`. Every entry point checks `isSupabaseConfigured()` first, so the site builds and runs with features degraded to friendly empty-states before env vars exist.
- **Env** lives in `.env.local` (template in `.env.example`); the live Supabase project is already configured.
- **Content** copy/config in `content/` (`site.ts`, `consent.ts` — bump consent `version` strings when terms change).
- **E2E**: Playwright scripts in `e2e/` drive the Letters flow against a local dev server + the real Supabase project (see `e2e/README.md`); their screenshot/asset outputs are gitignored.
- **Database schema**: documented in full below (this file is the source of truth — there is no `supabase/migrations/` dir).

## ⭐ Required: update the CHANGELOG at commit/push time

**Update [CHANGELOG.md](./docs/CHANGELOG.md) only as part of a commit/push — never preemptively.** The workflow is:

1. When the user asks to commit or push, first run `git diff` (and `git diff --staged`) to see what *actually* changed.
2. Add a row to CHANGELOG.md describing those real changes.
3. Stage the CHANGELOG edit and create the commit together.

Do not edit CHANGELOG.md at any other time. If you're just creating or editing files without committing, leave the CHANGELOG alone — it gets written from the diff at commit time.

Add the row under the current month's heading (create a new `## YYYY-MM` section if the month doesn't exist yet). Fill every column based on what the diff shows:

| Column | What to put |
| --- | --- |
| **Date** | Commit date, `YYYY-MM-DD`. |
| **Change** | One-line summary of the real diff (not the intent — what changed). |
| **Where** | `Wix` · `Beta` · `New` · `Both` — where the change is visible. Internal/repo-only work is `Beta`. |
| **Type** | `Content` · `Layout/UX` · `SEO` · `Ads` · `Analytics` · `Feature` · `Infra`. |
| **Impact** | Expected effect on **SEO / Ads / Analytics / UX**. Write `None — internal, no public exposure` for beta-only/repo work. |
| **Owner** | Who made the change (e.g. `CSS`, or the author's name). |
| **Notes** | Links: PR, affected Wix page, screenshot, metric snapshot. |

Then write the git commit. Keep the CHANGELOG entry and the commit message consistent.

**The rule from ROLLOUT.md still governs:** no *public-facing* change (Wix or new site) ships without a CHANGELOG entry **and** a heads-up to Nicolas. Purely internal/beta changes still get a CHANGELOG row, marked impact `None`.

## Commit conventions

- Commit messages: short imperative subject, optional body explaining *why*.
- End commit messages with the `Co-Authored-By` trailer for Claude.
- Work on a branch and open a PR rather than committing to `main` directly when the change is non-trivial.
- Only commit/push when the user asks.

## Tech stack & conventions

- **Next.js (App Router)** on Vercel; **Supabase** (Postgres + RLS, Auth, Storage).
- `SUPABASE_SECRET_KEY` is **server-only** — never import it into client components.
- Mobile-first responsive design (audience is heavily social-media-driven).
- **⭐ The site is mid-redesign, and two visual systems coexist. Read
  [design-demos/REDESIGN-SYSTEM.md](./design-demos/REDESIGN-SYSTEM.md) before any UI work** —
  it says which pages are on which system, and how the transition ends.
  - **NEW system** (`design-demos/redesign.html` + `redesign2.html` + `redesign3.html` +
    `redesign4.html` → `app/redesign.css` + `components/redesign/`) — on every public-facing
    page: `/` (home), `/donate`, `/membership`, `/letters`, `/santas-knights`, `/contact`,
    `/gallery`, `/login`, `/signup`, and `/account`. One paper
    ground; ink only in nav + footer. Archivo 800 **sentence case**. **No serif italics** —
    emphasis is `<Mark>`, a hand-drawn red brush underline. No `01`/`02` labels, no 4-up box
    grids, no tinted panels with an accent rail, no poster CTA bands. **No divider bars** —
    sections are separated by air or by a torn-edge `<PhotoBand>`. A page opts in by
    wrapping in `<RedesignShell>`; the CSS is scoped to `.rd` so it can't leak.
  - **OLD poster system** (`design-demos/home.html` + `design-demos/styles.css`) — only
    `/admin/*` is left on it: Archivo 900 uppercase display, Cormorant italic accents, Hanken
    body, warm near-black grounds, paper contrast sections, red/amber flood accents. Every
    public-facing page is now on the new system, so the `.rd` scope can be dropped whenever
    someone wants to (the flip checklist is in REDESIGN-SYSTEM.md; admin is the row it is
    allowed to leave behind, but it still inherits the new base type rules — see the caveat
    there).
  - When you port a page, move it to the new system wholesale and tick it off in the Status
    table in REDESIGN-SYSTEM.md. Never mix the two on one screen — they invert each other.
  - Both systems: Hanken body, square controls/panels, no eyebrows/kickers.
  - **`/account` is the system at working density** — it is a tool, not a page about
    something. Its own vocabulary (`.acct-*` in `app/redesign.css`) is a table: column heads,
    one `--acct-cols` shared by the head row and every data row, status as an aligned column
    rather than a badge, and live filter/search/paging. No photography. The drawn gestures
    (`<Mark>`, `<HandArrow>`) appear once, in the closer, after the work. Spec:
    `design-demos/redesign4.html`.
- Santa's Letters: never expose a child's identifying details publicly; gifts must be age-appropriate, legal, and safe.
- _Gladiators program conventions (training tracker, built on `gladiators.nyc` — GLADIATORS-SITE.md (gladiators-nyc repo)): XP values/levels/thresholds/rewards are admin-editable data, never hardcoded; XP can make a participant eligible to **request** a privilege but never auto-grants safety-sensitive access (armor, sparring) — those require instructor/admin certification. Armor rental eligibility is computed on `gladiators.nyc` (from XP + certification), alongside the rental transaction + item inventory. These conventions govern the `gladiators.nyc` build; this repo only cross-links out to it._

## Environments

- New stack stays **`noindex`** on `beta.*` subdomains until a coordinated public cutover — never let beta compete with the live Wix site in search. See ROLLOUT.md.
- Plan v2 split: **`santasknights.org`** (this repo) = the nonprofit — nonprofit pages, Letters, member accounts, and the Gladiators **content** pages. **`gladiators.nyc`** (separate site) = the Gladiators **operational** training tracker (booking, waivers, check-in, XP, dashboards, videos, admin) **plus** the commercial Shop + Armory, kept off the nonprofit domain. The two share **one identity** (one login); this site cross-links out for class booking, shop purchases, and armor rentals. Payments stay external (Amazon, PayPal/Venmo, Eventbrite, external store). See ROLLOUT.md.

## Database schema

This is the source of truth for the Postgres schema. Apply it on a fresh Supabase project via the **SQL Editor** (paste and run), then create the first admin (insert an Auth user, then `update profiles set role='admin' where email='<that email>'`). The live beta project already has this applied.

> **The training-tracker tables are owned, documented, and operated by the `gladiators.nyc` app — not this repo.** The Gladiators *operational* program (booking, waivers, check-in, XP, dashboards, videos, admin) is built on the separate `gladiators.nyc` site. The two sites share **one identity** (one Supabase Auth + `profiles` in this **one shared Supabase project** — resolved 2026-07-02), so the training tables (`classes`, `registrations`, `checkins`, `waivers`, `media_consents`, `xp_config`, `xp_events`, `levels`/`badges`, `training_videos`, + private `waivers`/`training-videos` buckets, and the profile fields `veteran_status`/`waiver_signed_at` + `is_instructor()`) key off the same `profiles`. Their DDL and spec live in the **gladiators-nyc repo** (`sql/2026-06-training.sql` and GLADIATORS-SITE.md there). This repo's app builds UI only against the nonprofit/Letters tables. The `app_role` enum includes `participant`/`instructor` for the shared identity. `armor_inventory` / `armor_rentals` stay on the commercial `gladiators.nyc` Armory.

**Privacy invariant:** a child's identifying details are NEVER exposed publicly. Guardian contact lives on the same `santa_letters` row, but anonymous visitors can only read live, unclaimed letters' safe columns through the `public_letters` view. Letter images sit in a private `letters` storage bucket, served via short-lived signed URLs.

**The letter pile is public; the two write actions are not.** Anyone — signed out included — can read the pile on `/letters`, so a stranger can see a real wish before deciding to make an account. **Claiming** a letter requires an account (the claim ties the gift to a donor, enables the acknowledgment, and blocks a guardian from gifting their own child's letter — `app/letters/give/actions.ts`). **Submitting** a letter requires an account (the row carries `guardian_user_id`, which powers `/account` → "My letters"). Don't gate reading, and don't ungate either write.

```sql
-- roles -----------------------------------------------------------
create type public.app_role as enum ('public', 'participant', 'instructor', 'admin');

-- Identity fields (first_name/last_name/dob/phone/zipcode) are added on top of
-- this base block by the "Account model + content tables (applied)" section
-- below — they are collected (and required) at registration on both sites.
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       public.app_role not null default 'public',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Auto-create a profile whenever an auth user is created. Identity fields
-- (first_name/last_name/dob/phone/zipcode) are NOT NULL (see the "Account
-- model" section below), so the registration server action passes them as
-- `user_metadata` on createUser() and this trigger reads them off
-- raw_user_meta_data — see sql/2026-07-handle-new-user-identity.sql (applied;
-- fixes a period where every signup failed with "Database error creating new
-- user" because this trigger only inserted id/email).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, dob, phone, zipcode)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce((new.raw_user_meta_data->>'dob')::date, current_date),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'zipcode', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- True when the signed-in user is an admin. SECURITY DEFINER so RLS policies
-- can call it without recursing into profiles' own policies.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Users can read their own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Admins can read all profiles"
  on public.profiles for select using (public.is_admin());
create policy "Admins can update roles"
  on public.profiles for update using (public.is_admin());

-- santa letters ---------------------------------------------------
create type public.letter_status as enum (
  'live',         -- submitted and visible while unclaimed
  'fulfilled',    -- gifted — leaves the active pool, kept for totals
  'deleted'       -- admin removed from the active pool; guardian still sees it
);

create table public.santa_letters (
  id                uuid primary key default gen_random_uuid(),
  -- Public-safe fields (surface through public_letters once live and unclaimed)
  child_first_name  text not null,
  child_age         int  not null check (child_age between 0 and 17),
  wish_note         text not null,
  amazon_urls       text[] not null check (cardinality(amazon_urls) between 1 and 20),  -- one or more Amazon links (any country)
  letter_image_path text,                    -- path in the private "letters" storage bucket
  status            public.letter_status not null default 'live',
  -- Gift description, shown on the public letter cards as "LEGO Technic set · about $50".
  -- Added by sql/2026-08-gift-summary.sql; required on new submissions, nullable so
  -- pre-migration letters stay valid. Describes the gift, never the child.
  gift_summary      text,
  gift_value_usd    numeric,
  -- Private fields — never exposed publicly
  guardian_name     text not null,
  guardian_email    text not null,
  guardian_user_id  uuid references public.profiles(id),
  fulfilled_by_user_id uuid references public.profiles(id),
  fulfilled_by_email text,
  fulfilled_by_name  text,
  claimed_at        timestamptz,
  fulfilled_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index santa_letters_status_idx on public.santa_letters (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger santa_letters_updated_at
  before update on public.santa_letters for each row execute function public.set_updated_at();

alter table public.santa_letters enable row level security;
-- No anon policies: submissions are written by a trusted server action
-- (secret key) and public reads go through the view below.
create policy "Admins manage letters"
  on public.santa_letters for all
  using (public.is_admin()) with check (public.is_admin());

-- Public-safe projection: live, unclaimed letters only, safe columns only.
create view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, created_at
  from public.santa_letters
  where status = 'live' and claimed_at is null and fulfilled_by_user_id is null;
grant select on public.public_letters to anon, authenticated;

-- consent records -------------------------------------------------
create table public.consent_records (
  id            uuid primary key default gen_random_uuid(),
  letter_id     uuid references public.santa_letters (id) on delete cascade,
  type          text not null check (type in ('guardian', 'donor')),
  version       text not null,
  full_text     text not null,              -- exact terms text at time of acceptance
  accepted_name text,                        -- typed guardian name
  accepted_at   timestamptz not null default now(),
  metadata      jsonb                        -- user agent etc., if available
);
alter table public.consent_records enable row level security;
create policy "Admins read consent records"
  on public.consent_records for select using (public.is_admin());

-- contact + newsletter --------------------------------------------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  reason     text,
  message    text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "Admins read contact messages"
  on public.contact_messages for select using (public.is_admin());

create table public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy "Admins read newsletter subscribers"
  on public.newsletter_subscribers for select using (public.is_admin());

-- storage ---------------------------------------------------------
-- Private bucket for handwritten-letter images; served via short-lived signed URLs.
insert into storage.buckets (id, name, public)
values ('letters', 'letters', false)
on conflict (id) do nothing;
```

### Account model + content tables (applied)

These tables were applied on top of the base schema above (account model + gallery/donations/partners). The DDL is idempotent.

```sql
-- profiles: identity fields collected (and required) at registration on both
-- sites (santasknights.org + gladiators.nyc, one shared identity). See
-- sql/2026-07-profile-identity-fields.sql (+ -name-dob / -not-null companions).
-- first_name/last_name back the display name in /admin/users; dob backs the
-- 18-or-older account gate (month + year only, day is always the 1st).
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name  text;
alter table public.profiles add column if not exists dob        date;
alter table public.profiles add column if not exists phone      text;
alter table public.profiles add column if not exists zipcode    text;
-- Made NOT NULL once existing rows were backfilled:
alter table public.profiles alter column email      set not null;
alter table public.profiles alter column first_name set not null;
alter table public.profiles alter column last_name  set not null;
alter table public.profiles alter column dob        set not null;
alter table public.profiles alter column phone      set not null;
alter table public.profiles alter column zipcode    set not null;

-- santa_letters: fulfillment + guardian self-read (account model) --
alter table public.santa_letters add column if not exists guardian_user_id uuid references public.profiles(id);
alter table public.santa_letters add column if not exists fulfilled_by_user_id uuid references public.profiles(id);
alter table public.santa_letters add column if not exists fulfilled_by_email text;
alter table public.santa_letters add column if not exists fulfilled_by_name  text;
alter table public.santa_letters add column if not exists claimed_at timestamptz;          -- gift claim/track
alter type public.letter_status add value if not exists 'live';
alter type public.letter_status add value if not exists 'deleted';
alter table public.santa_letters alter column status set default 'live';
create policy "Guardians read own letters"
  on public.santa_letters for select using (guardian_user_id = auth.uid());
-- A donor may read the letters they have claimed/gifted (their "Gifts I'm sending").
create policy "Donors read own gifts"
  on public.santa_letters for select using (fulfilled_by_user_id = auth.uid());

-- Guardian-scoped projection used by /account ("My letters").
create or replace view public.my_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, status,
         created_at, updated_at
  from public.santa_letters where guardian_user_id = auth.uid();

-- Donor-scoped projection used by /account ("Gifts I'm sending").
create or replace view public.my_gifts as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         status, claimed_at, fulfilled_at
  from public.santa_letters
  where fulfilled_by_user_id = auth.uid() and status in ('live', 'fulfilled');
grant select on public.my_gifts to authenticated;

-- family members (minors under a guardian account) ----------------
create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null, dob date, relationship text,
  veteran_status boolean not null default false, created_at timestamptz not null default now()
);

-- content tables (public-read when published, admin manage) -------
create table public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  title text, caption text, alt_text text,
  media_type text not null default 'image',           -- 'image' | 'video'
  storage_path text,                                    -- path in public 'gallery' bucket
  external_url text, category text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null, logo_path text, website_url text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null, last_name text not null, email text not null,
  amount numeric, frequency text not null default 'one_time',
  dedicate_to text, designation text, processor text,
  created_at timestamptz not null default now()
);

```

**RLS summary for the above:** content tables (`gallery_media`/`partners`) are public-read when `is_published`, admin-manage; `donations` admin-read (insert via server action). `family_members` are guardian-owned (`guardian_user_id = auth.uid()`) and shared with the training tracker (registrations/waivers key minors off it).
