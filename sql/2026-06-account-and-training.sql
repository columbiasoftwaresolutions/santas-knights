-- Santa's Knights — additive schema migration (account model + training tracker)
-- Idempotent: safe to re-run. Additive only; no drops of data-bearing objects.
begin;

-- ============================================================ helpers / profiles
alter table public.profiles add column if not exists veteran_status boolean not null default false;
alter table public.profiles add column if not exists waiver_signed_at timestamptz;

-- True when the signed-in user is an instructor or admin.
create or replace function public.is_instructor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('instructor','admin'));
$$;

-- ============================================================ santa_letters: fulfillment + guardian self-read
alter table public.santa_letters add column if not exists fulfilled_by_user_id uuid references public.profiles(id);
alter table public.santa_letters add column if not exists fulfilled_by_email text;
alter table public.santa_letters add column if not exists fulfilled_by_name text;

drop policy if exists "Guardians read own letters" on public.santa_letters;
create policy "Guardians read own letters"
  on public.santa_letters for select
  using (guardian_user_id = auth.uid());

-- ============================================================ family_members
create table if not exists public.family_members (
  id               uuid primary key default gen_random_uuid(),
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  first_name       text not null,
  dob              date,
  relationship     text,
  veteran_status   boolean not null default false,
  created_at       timestamptz not null default now()
);
create index if not exists family_members_guardian_idx on public.family_members (guardian_user_id);
alter table public.family_members enable row level security;
drop policy if exists "Guardians manage own family" on public.family_members;
create policy "Guardians manage own family"
  on public.family_members for all
  using (guardian_user_id = auth.uid()) with check (guardian_user_id = auth.uid());
drop policy if exists "Staff read family members" on public.family_members;
create policy "Staff read family members"
  on public.family_members for select using (public.is_instructor());

-- ============================================================ classes (scheduled sessions)
create table if not exists public.classes (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text,                       -- catalog slug from content/site.ts (e.g. 'bootcamp')
  class_type        text not null default 'standard',
  description       text,
  instructor_id     uuid references public.profiles(id),
  location          text,
  starts_at         timestamptz not null,
  ends_at           timestamptz,
  capacity          int not null default 20 check (capacity >= 0),
  requires_approval boolean not null default false,
  is_published      boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists classes_starts_at_idx on public.classes (starts_at);
drop trigger if exists classes_updated_at on public.classes;
create trigger classes_updated_at before update on public.classes
  for each row execute function public.set_updated_at();
alter table public.classes enable row level security;
drop policy if exists "Public reads published classes" on public.classes;
create policy "Public reads published classes"
  on public.classes for select using (is_published or public.is_instructor());
drop policy if exists "Admins manage classes" on public.classes;
create policy "Admins manage classes"
  on public.classes for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ registrations
create table if not exists public.registrations (
  id               uuid primary key default gen_random_uuid(),
  class_id         uuid not null references public.classes(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  status           text not null default 'registered'
                     check (status in ('registered','waitlisted','cancelled','attended','no_show')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index if not exists registrations_unique_idx
  on public.registrations (class_id, user_id, coalesce(family_member_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists registrations_user_idx on public.registrations (user_id);
create index if not exists registrations_class_idx on public.registrations (class_id);
drop trigger if exists registrations_updated_at on public.registrations;
create trigger registrations_updated_at before update on public.registrations
  for each row execute function public.set_updated_at();
alter table public.registrations enable row level security;
drop policy if exists "Users read own registrations" on public.registrations;
create policy "Users read own registrations"
  on public.registrations for select using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "Admins manage registrations" on public.registrations;
create policy "Admins manage registrations"
  on public.registrations for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ checkins
create table if not exists public.checkins (
  id               uuid primary key default gen_random_uuid(),
  registration_id  uuid references public.registrations(id) on delete set null,
  class_id         uuid not null references public.classes(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  checked_in_by    uuid references public.profiles(id),
  checked_in_at    timestamptz not null default now(),
  xp_awarded       int not null default 0
);
create unique index if not exists checkins_unique_idx
  on public.checkins (class_id, user_id, coalesce(family_member_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists checkins_user_idx on public.checkins (user_id);
alter table public.checkins enable row level security;
drop policy if exists "Users read own checkins" on public.checkins;
create policy "Users read own checkins"
  on public.checkins for select using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "Admins manage checkins" on public.checkins;
create policy "Admins manage checkins"
  on public.checkins for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ waivers
create table if not exists public.waivers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  version          text not null,
  full_text        text not null,
  participant_name text not null,
  dob              date,
  guardian_name    text,
  typed_name       text not null,
  consent          boolean not null default true,
  ip               text,
  user_agent       text,
  pdf_path         text,
  signed_at        timestamptz not null default now()
);
create index if not exists waivers_user_idx on public.waivers (user_id);
alter table public.waivers enable row level security;
drop policy if exists "Users read own waivers" on public.waivers;
create policy "Users read own waivers"
  on public.waivers for select using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "Admins manage waivers" on public.waivers;
create policy "Admins manage waivers"
  on public.waivers for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ media_consents
create table if not exists public.media_consents (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  version          text not null,
  full_text        text not null,
  granted          boolean not null default true,
  typed_name       text,
  guardian_name    text,
  metadata         jsonb,
  signed_at        timestamptz not null default now()
);
create index if not exists media_consents_user_idx on public.media_consents (user_id);
alter table public.media_consents enable row level security;
drop policy if exists "Users read own media consents" on public.media_consents;
create policy "Users read own media consents"
  on public.media_consents for select using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "Admins manage media consents" on public.media_consents;
create policy "Admins manage media consents"
  on public.media_consents for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ xp_config (admin-editable)
create table if not exists public.xp_config (
  id               uuid primary key default gen_random_uuid(),
  event_type       text not null unique,
  label            text not null,
  xp_value         int not null default 0,
  track            text not null default 'fighter' check (track in ('fighter','instructor')),
  unlock_threshold int,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
drop trigger if exists xp_config_updated_at on public.xp_config;
create trigger xp_config_updated_at before update on public.xp_config
  for each row execute function public.set_updated_at();
alter table public.xp_config enable row level security;
drop policy if exists "Public reads xp config" on public.xp_config;
create policy "Public reads xp config" on public.xp_config for select using (true);
drop policy if exists "Admins manage xp config" on public.xp_config;
create policy "Admins manage xp config"
  on public.xp_config for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ xp_events (ledger)
create table if not exists public.xp_events (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  event_type       text not null,
  xp_value         int not null,
  track            text not null default 'fighter',
  source_type      text,
  source_id        uuid,
  note             text,
  created_by       uuid references public.profiles(id),
  created_at       timestamptz not null default now()
);
create index if not exists xp_events_user_idx on public.xp_events (user_id, created_at desc);
alter table public.xp_events enable row level security;
drop policy if exists "Users read own xp" on public.xp_events;
create policy "Users read own xp"
  on public.xp_events for select using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "Admins manage xp events" on public.xp_events;
create policy "Admins manage xp events"
  on public.xp_events for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ levels (admin-editable)
create table if not exists public.levels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  threshold  int not null,
  track      text not null default 'fighter',
  sort_order int not null default 0,
  unlock     text,
  unique (track, threshold)
);
alter table public.levels enable row level security;
drop policy if exists "Public reads levels" on public.levels;
create policy "Public reads levels" on public.levels for select using (true);
drop policy if exists "Admins manage levels" on public.levels;
create policy "Admins manage levels"
  on public.levels for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ badges + participant_badges
create table if not exists public.badges (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  description text,
  icon        text,
  created_at  timestamptz not null default now()
);
alter table public.badges enable row level security;
drop policy if exists "Public reads badges" on public.badges;
create policy "Public reads badges" on public.badges for select using (true);
drop policy if exists "Admins manage badges" on public.badges;
create policy "Admins manage badges"
  on public.badges for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.participant_badges (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete cascade,
  badge_id         uuid not null references public.badges(id) on delete cascade,
  awarded_by       uuid references public.profiles(id),
  awarded_at       timestamptz not null default now()
);
create unique index if not exists participant_badges_unique_idx
  on public.participant_badges (badge_id, user_id, coalesce(family_member_id, '00000000-0000-0000-0000-000000000000'::uuid));
alter table public.participant_badges enable row level security;
drop policy if exists "Users read own badges" on public.participant_badges;
create policy "Users read own badges"
  on public.participant_badges for select using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "Admins manage participant badges" on public.participant_badges;
create policy "Admins manage participant badges"
  on public.participant_badges for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================ training_videos
create table if not exists public.training_videos (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  category       text,
  uploader_id    uuid references public.profiles(id),
  storage_path   text,
  external_url   text,
  duration_seconds int,
  thumbnail_path text,
  is_published   boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
drop trigger if exists training_videos_updated_at on public.training_videos;
create trigger training_videos_updated_at before update on public.training_videos
  for each row execute function public.set_updated_at();
alter table public.training_videos enable row level security;
drop policy if exists "Members read published videos" on public.training_videos;
create policy "Members read published videos"
  on public.training_videos for select
  using ((is_published and auth.uid() is not null) or public.is_instructor());
drop policy if exists "Staff manage videos" on public.training_videos;
create policy "Staff manage videos"
  on public.training_videos for all using (public.is_instructor()) with check (public.is_instructor());

-- ============================================================ storage buckets (private)
insert into storage.buckets (id, name, public) values ('waivers','waivers',false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('training-videos','training-videos',false) on conflict (id) do nothing;

-- ============================================================ seed: xp_config (templated defaults, admin-editable)
insert into public.xp_config (event_type, label, xp_value, track) values
  ('account_created','Create account / profile',5,'fighter'),
  ('waiver_signed','Sign waiver',5,'fighter'),
  ('attend_standard','Attend standard class',10,'fighter'),
  ('attend_community','Attend veterans / women''s / community class',10,'fighter'),
  ('attend_workshop','Attend armor intro or special workshop',15,'fighter'),
  ('volunteer_class','Volunteer at class/event',15,'instructor'),
  ('volunteer_major','Volunteer at major event',25,'instructor'),
  ('referral','Bring a verified new participant',10,'fighter'),
  ('milestone','Instructor-approved milestone',25,'fighter'),
  ('setup_breakdown','Help with setup/breakdown',15,'instructor'),
  ('no_show','No-show',0,'fighter')
on conflict (event_type) do nothing;

-- ============================================================ seed: levels (fighter path)
insert into public.levels (name, threshold, track, sort_order) values
  ('Recruit',0,'fighter',0),
  ('Trainee',25,'fighter',1),
  ('Novice',75,'fighter',2),
  ('Squire',150,'fighter',3),
  ('Armsman',300,'fighter',4),
  ('Knight Candidate',500,'fighter',5),
  ('Knight',750,'fighter',6),
  ('Veteran Knight',1250,'fighter',7),
  ('Champion',2000,'fighter',8),
  ('Marshal',3500,'fighter',9),
  ('Legend',5000,'fighter',10)
on conflict (track, threshold) do nothing;

-- ============================================================ seed: badges
insert into public.badges (code, name, description, icon) values
  ('first_class','First Class','Checked in to your first class','🛡️'),
  ('waiver_signed','Cleared to Train','Signed the liability waiver','📜'),
  ('veteran','Veteran','U.S. military veteran','🎖️'),
  ('ten_classes','Ten Classes','Attended ten classes','⚔️'),
  ('volunteer','Volunteer','Volunteered at a class or event','🤝')
on conflict (code) do nothing;

commit;

-- ============================================================
-- Content tables (gallery/partners/donations) + atomic capacity guard.
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

-- ============================================================ capacity guard
-- Atomic enforcement: locks the class row so concurrent bookings can't oversell.
create or replace function public.enforce_class_capacity()
returns trigger language plpgsql as $$
declare
  cap int;
  taken int;
begin
  if new.status not in ('registered','attended') then
    return new;
  end if;
  select capacity into cap from public.classes where id = new.class_id for update;
  if cap is null then
    return new;
  end if;
  select count(*) into taken
    from public.registrations
    where class_id = new.class_id
      and status in ('registered','attended')
      and id is distinct from new.id;
  if taken >= cap then
    raise exception 'class % is at capacity', new.class_id using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
drop trigger if exists registrations_capacity on public.registrations;
create trigger registrations_capacity
  before insert or update of status on public.registrations
  for each row execute function public.enforce_class_capacity();

commit;
