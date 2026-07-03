-- Santa's Knights — additive schema migration (account model + content tables)
-- Idempotent: safe to re-run. Additive only; no drops of data-bearing objects.
--
-- The Gladiators training-tracker DDL (classes, registrations, checkins,
-- waivers, media_consents, xp_*, levels, badges, training_videos,
-- family_members, capacity guard, waivers/training-videos buckets) is owned
-- and applied by the gladiators.nyc app — see that repo's sql/ directory.
-- Both apps share this one Supabase project (one identity, one login).
begin;

-- ============================================================ santa_letters: fulfillment + guardian self-read
alter table public.santa_letters add column if not exists fulfilled_by_user_id uuid references public.profiles(id);
alter table public.santa_letters add column if not exists fulfilled_by_email text;
alter table public.santa_letters add column if not exists fulfilled_by_name text;

drop policy if exists "Guardians read own letters" on public.santa_letters;
create policy "Guardians read own letters"
  on public.santa_letters for select
  using (guardian_user_id = auth.uid());

commit;

-- ============================================================
-- Content tables (gallery/partners/donations).
-- Added 2026-06-25 after review. Idempotent.
-- ============================================================
begin;

-- ============================================================ content tables
-- (gallery_media / partners / donations already live on beta; these statements
--  are idempotent and ensure RLS + the public gallery bucket exist on any apply.)
create table if not exists public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  title text, caption text, alt_text text,
  media_type text not null default 'image',
  storage_path text, external_url text, category text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.gallery_media enable row level security;
drop policy if exists "Public reads published gallery media" on public.gallery_media;
create policy "Public reads published gallery media"
  on public.gallery_media for select using (is_published or public.is_admin());
drop policy if exists "Admins manage gallery media" on public.gallery_media;
create policy "Admins manage gallery media"
  on public.gallery_media for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null, logo_path text, website_url text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.partners enable row level security;
drop policy if exists "Public reads published partners" on public.partners;
create policy "Public reads published partners"
  on public.partners for select using (is_published or public.is_admin());
drop policy if exists "Admins manage partners" on public.partners;
create policy "Admins manage partners"
  on public.partners for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null, last_name text not null, email text not null,
  amount numeric, frequency text not null default 'one_time',
  dedicate_to text, designation text, processor text,
  created_at timestamptz not null default now()
);
alter table public.donations enable row level security;
-- Donor PII: admin-read only. Inserts go through the secret-key server action.
drop policy if exists "Admins read donations" on public.donations;
create policy "Admins read donations" on public.donations for select using (public.is_admin());

-- public bucket for gallery + partner images
insert into storage.buckets (id, name, public) values ('gallery','gallery',true)
on conflict (id) do nothing;

commit;
