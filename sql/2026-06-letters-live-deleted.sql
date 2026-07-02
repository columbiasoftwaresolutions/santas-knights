-- Letters status simplification: no moderation queue.
-- Public vocabulary is now live / fulfilled / deleted. Donor claims are tracked
-- by claimed_at + fulfilled_by_user_id while status remains live.
--
-- ADD VALUE must run outside a transaction.
alter type public.letter_status add value if not exists 'live';
alter type public.letter_status add value if not exists 'deleted';

begin;

alter table public.santa_letters alter column status set default 'live';

update public.santa_letters
set status = case
  when status in ('hidden', 'rejected') then 'deleted'::public.letter_status
  when status in ('pending', 'approved', 'needs_edits', 'flagged', 'claimed') then 'live'::public.letter_status
  else status
end;

alter table public.santa_letters
  drop constraint if exists santa_letters_status_live_fulfilled_deleted;
alter table public.santa_letters
  add constraint santa_letters_status_live_fulfilled_deleted
  check (status in ('live', 'fulfilled', 'deleted'));

-- Public-safe projection: live, unclaimed letters only. Claimed live rows stay
-- visible to their donor through my_gifts, but drop out of the public pool.
create or replace view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, created_at
  from public.santa_letters
  where status = 'live'
    and claimed_at is null
    and fulfilled_by_user_id is null;
grant select on public.public_letters to anon, authenticated;

-- Guardian-scoped projection: families can see all submitted letters, including
-- deleted ones, but no internal admin notes. Drop first because this removes
-- the old moderation_note projection column.
drop view if exists public.my_letters;
create view public.my_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, status, created_at
  from public.santa_letters
  where guardian_user_id = auth.uid();
grant select on public.my_letters to authenticated;

-- Donor-scoped projection: claimed live rows are "to send"; fulfilled rows are
-- sent history. Deleted rows are intentionally omitted from donor task lists.
create or replace view public.my_gifts as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         status, claimed_at, fulfilled_at
  from public.santa_letters
  where fulfilled_by_user_id = auth.uid()
    and status in ('live', 'fulfilled');
grant select on public.my_gifts to authenticated;

commit;
