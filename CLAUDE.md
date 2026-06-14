# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

The **Santa's Knights** platform — a Next.js + Supabase rebuild of the **Santa's Knights, Inc.** 501(c)(3) nonprofit site, plus the **Letters to Santa** gifting portal. Built by Columbia Software Solutions.

The nonprofit's combat program, **Gladiators NYC** (training/classes, booking + waiver, armor rentals, instructor check-in, XP/gamification tracker), is a **separate, linked site** at `gladiators.nyc` — **not** built in this repo. Its scope is documented for reference in [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md). Linked but distinct: separate codebase, deployment, and cutover.

**Deploy (beta):** https://santas-knights.vercel.app/ — internal Vercel beta, auto-deploys from `main`. Not the public production site; keep `noindex` until cutover (see ROLLOUT.md).

Read these before substantial work:
- **[README.md](./README.md)** — scope, tech stack, phases, data model, setup, admin tasks.
- **[ROLLOUT.md](./docs/ROLLOUT.md)** — build-≠-cutover strategy, two-track rollout, public cutover checklist.
- **[CHANGELOG.md](./docs/CHANGELOG.md)** — impact-focused log of every change, maintained for Nicolas (SEO/ads/marketing).
- **[REQUIREMENTS.md](./docs/REQUIREMENTS.md)** — full feature scope by stage; site architecture & brand split.
- **[docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)** — reference spec for the separate Gladiators NYC companion site (combat program & training tracker).
- **[docs/SETUP-TODO.md](./docs/SETUP-TODO.md)** — remaining manual backend steps (first admin user, donation URLs, consent language, free-tier notes).

## Repo layout & current state

The app is built and the Supabase backend is wired up:

- **Routes** (App Router, `app/`): `/` home, `/about`, `/contact`, `/get-involved`, `/donate`, `/sponsors`, `/links`, `/letters` (+ `/submit`, `/give`), `/admin` (+ `/login`).
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
- Santa's Letters: never expose a child's identifying details publicly; gifts must be age-appropriate, legal, and safe.
- _Companion-site conventions (Gladiators NYC, [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)): XP values/levels/thresholds/rewards are admin-editable data, never hardcoded; XP can make a participant eligible to **request** a privilege but never auto-grants safety-sensitive access (armor, sparring) — those require instructor/admin certification._

## Environments

- New stack stays **`noindex`** on `beta.*` subdomains until a coordinated public cutover — never let beta compete with the live Wix site in search. See ROLLOUT.md.
- Santa's Knights (`santasknights.org`, this repo) and Gladiators NYC (`gladiators.nyc`, companion site) are on **separate domains** with separate codebases and separate cutovers.

## Database schema

This is the source of truth for the Postgres schema. Apply it on a fresh Supabase project via the **SQL Editor** (paste and run), then create the first admin (insert an Auth user, then `update profiles set role='admin' where email='<that email>'`). The live beta project already has this applied.

**Privacy invariant:** a child's identifying details are NEVER exposed publicly. Guardian contact lives on the same `santa_letters` row, but anonymous visitors can only read approved letters' safe columns through the `public_letters` view. Letter images sit in a private `letters` storage bucket, served via short-lived signed URLs.

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
  'pending',      -- submitted, awaiting moderation
  'approved',     -- live in the swipe pool
  'needs_edits',  -- moderator requested changes from the family
  'flagged',      -- needs a closer look
  'hidden',       -- approved previously but pulled from the pool
  'rejected',     -- will not run
  'fulfilled'     -- gifted — leaves the active pool, kept for totals
);

create table public.santa_letters (
  id                uuid primary key default gen_random_uuid(),
  -- Public-safe fields (surface through public_letters once approved)
  child_first_name  text not null,
  child_age         int  not null check (child_age between 0 and 17),
  wish_note         text not null,
  amazon_url        text not null,
  letter_image_path text,                    -- path in the private "letters" storage bucket
  status            public.letter_status not null default 'pending',
  -- Private fields — never exposed publicly
  guardian_name     text not null,
  guardian_email    text not null,
  moderation_note   text,                    -- internal and/or sent back on needs_edits
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

-- Public-safe projection: approved letters only, safe columns only.
create view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_url, letter_image_path, created_at
  from public.santa_letters
  where status = 'approved';
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
