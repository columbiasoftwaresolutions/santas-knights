-- Guardian-owned Amazon wishlist links (link-only).
--
-- A letter can now be shopped via EITHER 1–20 individual product links (the
-- existing model) OR a single Amazon wishlist URL the guardian pastes. The
-- swipe deck shows a "see their wishlist" button for wishlist letters; swiping
-- right just records the claim (no auto-open). Address privacy is the
-- guardian's responsibility — since March 2026 Amazon can reveal a list's
-- shipping address to third-party sellers, so we tell guardians to ship the
-- list to a P.O. box / non-residential address in the submit UI.
--
-- Idempotent; additive. Only touches santa_letters (this app's table) — no
-- impact on the shared Gladiators training tables.
begin;

alter table public.santa_letters add column if not exists wishlist_url text;

-- A letter needs at least one way to shop it. Drop the old amazon_urls-only
-- cardinality check (live name: santa_letters_amazon_urls_card; the inline
-- unnamed form would be santa_letters_amazon_urls_check) so an empty amazon_urls
-- is allowed as long as a wishlist_url is present.
alter table public.santa_letters drop constraint if exists santa_letters_amazon_urls_card;
alter table public.santa_letters drop constraint if exists santa_letters_amazon_urls_check;
alter table public.santa_letters drop constraint if exists santa_letters_gift_source_check;
alter table public.santa_letters
  add constraint santa_letters_gift_source_check check (
    cardinality(amazon_urls) between 1 and 20
    or (cardinality(amazon_urls) = 0 and wishlist_url is not null)
  );

-- Re-project wishlist_url through the views the UI reads. CREATE OR REPLACE VIEW
-- requires the existing columns unchanged and in the same order, so wishlist_url
-- is appended at the END of each select list.
create or replace view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         created_at, coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls,
         wishlist_url
  from public.santa_letters
  where status = 'live'
    and claimed_at is null
    and fulfilled_by_user_id is null;
grant select on public.public_letters to anon, authenticated;

create or replace view public.my_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, status, created_at,
         coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls,
         wishlist_url
  from public.santa_letters
  where guardian_user_id = auth.uid();
grant select on public.my_letters to authenticated;

create or replace view public.my_gifts as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         status, claimed_at, fulfilled_at,
         coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls,
         wishlist_url
  from public.santa_letters
  where fulfilled_by_user_id = auth.uid()
    and status in ('live', 'fulfilled');
grant select on public.my_gifts to authenticated;

commit;
