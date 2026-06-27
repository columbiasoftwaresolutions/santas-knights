# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

The **Santa's Knights** platform — a Next.js + Supabase rebuild of the **Santa's Knights, Inc.** 501(c)(3) nonprofit site, plus the **Letters to Santa** gifting portal and the **Gladiators NYC free combat program** (class content **and** training tracker), on `santasknights.org`. Built by Columbia Software Solutions.

**Scope is Plan v2** ([docs/plan-v2.md](./docs/plan-v2.md)) — **one site for the nonprofit**: this repo replicates **every public feature of the live Wix site** — nonprofit pages, member accounts, gallery, donate/membership, partners, the Letters portal — **and the Gladiators NYC free program in full**: class content **plus** the training tracker (class **booking**, **waivers + media consent**, **instructor check-in**, **XP/gamification**, **participant dashboards**, **training videos**, and training admin / CSV grant export).

**Only the commercial pieces stay on the separate `gladiators.nyc` site** — the merch **Shop** and the **Armory** (item-level armor inventory & rentals). They're kept **off the nonprofit domain** because Santa's Knights is a 501(c)(3); this site **cross-links out** to `gladiators.nyc` for shop purchases and armor rentals (e-commerce stays external). [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md) specs the Gladiators program (built here) and the commercial companion.

**Deploy (beta):** https://santas-knights.vercel.app/ — internal Vercel beta, auto-deploys from `main`. Not the public production site; keep `noindex` until cutover (see ROLLOUT.md).

Read these before substantial work:
- **[docs/plan-v2.md](./docs/plan-v2.md)** — ⭐ current scope: the build list. The whole nonprofit — nonprofit pages, Letters, and the full Gladiators free program (content + training tracker) — is built here; only the commercial Shop + Armory live on `gladiators.nyc`. Wins on *where* features are built where docs conflict.
- **[README.md](./README.md)** — scope, tech stack, phases, data model, setup, admin tasks.
- **[ROLLOUT.md](./docs/ROLLOUT.md)** — build-≠-cutover strategy, two-track rollout, public cutover checklist.
- **[CHANGELOG.md](./docs/CHANGELOG.md)** — impact-focused log of every change, maintained for Nicolas (SEO/ads/marketing).
- **[REQUIREMENTS.md](./docs/REQUIREMENTS.md)** — full feature scope by stage; site architecture & nonprofit-vs-commercial split.
- **[docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)** — spec for the Gladiators NYC combat program & training tracker (built **here**), plus the commercial Shop/Armory companion on `gladiators.nyc`.
- **[docs/SETUP-TODO.md](./docs/SETUP-TODO.md)** — remaining manual backend steps (first admin user, donation URLs, consent language, free-tier notes).

## Repo layout & current state

The app is built and the Supabase backend is wired up:

- **Routes** (App Router, `app/`): `/` home, `/about`, `/contact`, `/get-involved`, `/donate`, `/sponsors`, `/links`, `/letters` (+ `/submit`, `/give`), `/account` (+ login/register scaffolds), `/gallery`, `/membership`, `/training` + `/online`, and `/admin` (+ `/login`). Expanded account tracking and admin gallery/partners/donations remain planned. The Gladiators **training tracker** (booking, waiver, instructor check-in, XP, participant dashboard, training videos, training admin) is in scope for this repo but **not yet built** — `/training` + `/online` currently carry program content with booking CTAs to wire up. Only the commercial Shop/Armory route out to `gladiators.nyc`. See [docs/plan-v2.md](./docs/plan-v2.md) §D2.
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
- Visual source of truth: `design-demos/home.html` + `design-demos/styles.css`. Use the
  poster system: Archivo 900 uppercase display, Fraunces italic accents, Hanken body,
  square controls/panels, warm near-black grounds, paper contrast sections, red/amber
  flood accents, and no eyebrows/kickers.
- Santa's Letters: never expose a child's identifying details publicly; gifts must be age-appropriate, legal, and safe.
- _Gladiators program conventions (training tracker, built here — [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)): XP values/levels/thresholds/rewards are admin-editable data, never hardcoded; XP can make a participant eligible to **request** a privilege but never auto-grants safety-sensitive access (armor, sparring) — those require instructor/admin certification. Armor rental eligibility is computed here, but the rental transaction + item inventory live on the commercial `gladiators.nyc` Armory._

## Environments

- New stack stays **`noindex`** on `beta.*` subdomains until a coordinated public cutover — never let beta compete with the live Wix site in search. See ROLLOUT.md.
- Plan v2 split: **the whole nonprofit on `santasknights.org`** (this repo — nonprofit pages, Letters, and the full Gladiators free program: content + training tracker). **Only the commercial Shop + Armory live on `gladiators.nyc`** (separate site), kept off the nonprofit domain; this site cross-links out for shop purchases and armor rentals. Payments stay external (Amazon, PayPal/Venmo, Eventbrite, external store). See ROLLOUT.md.

## Database schema

This is the source of truth for the Postgres schema. Apply it on a fresh Supabase project via the **SQL Editor** (paste and run), then create the first admin (insert an Auth user, then `update profiles set role='admin' where email='<that email>'`). The live beta project already has this applied.

> **Training-tracker tables are now in scope for this project** (the Gladiators free program is built here, not on a separate site). The DDL below currently covers the nonprofit/Letters side that is live; the training tables — `classes`, `registrations`, `checkins`, `waivers`, `media_consents`, `xp_config`, `xp_events`, `levels`/`badges`, `training_videos` — and their private storage buckets (`waivers`, `training-videos`) are specced in [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#data-model-training-tables) and will be added to this same Supabase project when the tracker is built. The `app_role` enum already includes `participant` and `instructor` for exactly this. **Only `armor_inventory` / `armor_rentals` stay out** — those belong to the commercial Armory on `gladiators.nyc`.

**Privacy invariant:** a child's identifying details are NEVER exposed publicly. Guardian contact lives on the same `santa_letters` row, but anonymous visitors can only read live, unclaimed letters' safe columns through the `public_letters` view. Letter images sit in a private `letters` storage bucket, served via short-lived signed URLs.

```sql
-- roles -----------------------------------------------------------
create type public.app_role as enum ('public', 'participant', 'instructor', 'admin');

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       public.app_role not null default 'public',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Auto-create a profile whenever an auth user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
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

These tables were applied on top of the base schema above (account model + gallery/donations/partners + the full Gladiators training tracker). The DDL is idempotent.

```sql
-- helpers + profile fields ----------------------------------------
alter table public.profiles add column if not exists veteran_status boolean not null default false;
alter table public.profiles add column if not exists waiver_signed_at timestamptz;

create or replace function public.is_instructor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('instructor','admin'));
$$;

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

-- training tracker (Gladiators free program) ----------------------
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text, class_type text not null default 'standard', description text,
  instructor_id uuid references public.profiles(id), location text,
  starts_at timestamptz not null, ends_at timestamptz,
  capacity int not null default 20 check (capacity >= 0),
  requires_approval boolean not null default false, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  status text not null default 'registered'
    check (status in ('registered','waitlisted','cancelled','attended','no_show')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);  -- unique (class_id, user_id, coalesce(family_member_id, zero-uuid))
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.registrations(id) on delete set null,
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  checked_in_by uuid references public.profiles(id),
  checked_in_at timestamptz not null default now(), xp_awarded int not null default 0
);
create table public.waivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  version text not null, full_text text not null, participant_name text not null,
  dob date, guardian_name text, typed_name text not null, consent boolean not null default true,
  ip text, user_agent text, pdf_path text, signed_at timestamptz not null default now()
);
create table public.media_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  version text not null, full_text text not null, granted boolean not null default true,
  typed_name text, guardian_name text, metadata jsonb, signed_at timestamptz not null default now()
);
create table public.xp_config (   -- admin-editable XP values; never hardcoded
  id uuid primary key default gen_random_uuid(),
  event_type text not null unique, label text not null, xp_value int not null default 0,
  track text not null default 'fighter' check (track in ('fighter','instructor')),
  unlock_threshold int, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.xp_events (   -- immutable XP ledger
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  event_type text not null, xp_value int not null, track text not null default 'fighter',
  source_type text, source_id uuid, note text,
  created_by uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.levels (      -- admin-editable level names/thresholds
  id uuid primary key default gen_random_uuid(),
  name text not null, threshold int not null, track text not null default 'fighter',
  sort_order int not null default 0, unlock text, unique (track, threshold)
);
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, name text not null, description text, icon text,
  created_at timestamptz not null default now()
);
create table public.participant_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_by uuid references public.profiles(id), awarded_at timestamptz not null default now()
);
create table public.training_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, category text,
  uploader_id uuid references public.profiles(id),
  storage_path text, external_url text, duration_seconds int, thumbnail_path text,
  is_published boolean not null default true, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- private buckets for the tracker
insert into storage.buckets (id, name, public) values
  ('waivers','waivers',false), ('training-videos','training-videos',false)
on conflict (id) do nothing;
```

**RLS summary for the above:** content tables (`gallery_media`/`partners`) are public-read when `is_published`, admin-manage; `donations` admin-read (insert via server action). Training tables: participant reads own rows (`user_id = auth.uid()`), instructors read via `is_instructor()`, admins manage; `classes` are public-read when published; `xp_config`/`levels`/`badges` are public-read, admin-manage; `training_videos` readable by any signed-in member when published, instructor/admin-manage. `family_members` are guardian-owned (`guardian_user_id = auth.uid()`). Seed data: `xp_config` (11 event types), `levels` (Recruit→Legend, 11 tiers), `badges` (5) per [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#reference-v1-xp-values--levels).
