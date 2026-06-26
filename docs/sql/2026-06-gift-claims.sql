-- Gift claim & track: donors claim a letter to gift it; admins monitor the
-- pipeline (unclaimed -> claimed/pending -> gifted). Idempotent.

-- New donor-facing letter state. ADD VALUE must run outside a transaction.
alter type public.letter_status add value if not exists 'claimed';

begin;

-- When the letter was claimed by a donor (fulfilled_at already exists for "gifted").
alter table public.santa_letters add column if not exists claimed_at timestamptz;

-- A donor may read the letters they have claimed/gifted (for their "My gifts").
drop policy if exists "Donors read own gifts" on public.santa_letters;
create policy "Donors read own gifts"
  on public.santa_letters for select using (fulfilled_by_user_id = auth.uid());

-- Donor-scoped projection for /account "My gifts".
create or replace view public.my_gifts as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         status, claimed_at, fulfilled_at
  from public.santa_letters
  where fulfilled_by_user_id = auth.uid();
grant select on public.my_gifts to authenticated;

commit;
