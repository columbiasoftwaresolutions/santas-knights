-- Santa's Knights — initial schema.
-- Apply via the Supabase SQL editor or `supabase db push` (see README).
--
-- Privacy invariant: a child's identifying details are NEVER exposed publicly.
-- Guardian contact info lives on the same row as the letter but anonymous
-- visitors can only read through the `public_letters` view, which exposes
-- safe columns of approved letters only.

-- ---------------------------------------------------------------- roles

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
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- True when the signed-in user is an admin. SECURITY DEFINER so RLS policies
-- can call it without recursing into profiles' own policies.
create or replace function public.is_admin()
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update roles"
  on public.profiles for update
  using (public.is_admin());

-- ---------------------------------------------------------- santa letters

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
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger santa_letters_updated_at
  before update on public.santa_letters
  for each row execute function public.set_updated_at();

alter table public.santa_letters enable row level security;

-- No anon policies: submissions are written by a trusted server action
-- (service role) and public reads go through the view below.
create policy "Admins manage letters"
  on public.santa_letters for all
  using (public.is_admin())
  with check (public.is_admin());

-- Public-safe projection: approved letters only, safe columns only.
-- security_invoker = false (default): the view owner bypasses santa_letters RLS,
-- and we grant SELECT on the view itself to anon/authenticated.
create view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_url, letter_image_path, created_at
  from public.santa_letters
  where status = 'approved';

grant select on public.public_letters to anon, authenticated;

-- -------------------------------------------------------- consent records

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
  on public.consent_records for select
  using (public.is_admin());

-- ------------------------------------------------- contact + newsletter

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
  on public.contact_messages for select
  using (public.is_admin());

create table public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Admins read newsletter subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

-- ----------------------------------------------------------- storage

-- Private bucket for handwritten-letter images; the app serves them via
-- short-lived signed URLs so pending/rejected uploads are never reachable.
insert into storage.buckets (id, name, public)
values ('letters', 'letters', false)
on conflict (id) do nothing;
