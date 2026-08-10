-- Gift summary + approximate value on a letter.
--
-- The redesigned /letters page shows a public preview of the pile, and each
-- card carries a one-line "what they asked for" under the wish, e.g.
--   "LEGO Technic set · about $50"
-- Nothing in the schema could produce that: santa_letters held the wish prose,
-- the Amazon links, and the scraped preview images, but no item name and no
-- value. Scraping the title/price off Amazon is too fragile to put on a public
-- page, so the guardian tells us at submit time.
--
-- gift_summary  — short noun phrase, entered by the guardian, required on new
--                 submissions (validated in app/letters/submit/actions.ts).
--                 NULLABLE at the DB level so the letters submitted before this
--                 migration stay valid; the UI omits the line when it's null.
-- gift_value_usd — optional. Guardians are asked to stay in the $20–50 band
--                 (content/site.ts → giftGuidance), so this is bounded to catch
--                 typos, not to enforce the guidance.
--
-- Both columns are public-safe: they describe the gift, never the child.
--
-- Idempotent; additive. Only touches santa_letters (this app's table) — no
-- impact on the shared Gladiators training tables.
begin;

alter table public.santa_letters add column if not exists gift_summary   text;
alter table public.santa_letters add column if not exists gift_value_usd numeric;

alter table public.santa_letters drop constraint if exists santa_letters_gift_summary_len;
alter table public.santa_letters
  add constraint santa_letters_gift_summary_len
  check (gift_summary is null or char_length(gift_summary) between 2 and 120);

alter table public.santa_letters drop constraint if exists santa_letters_gift_value_range;
alter table public.santa_letters
  add constraint santa_letters_gift_value_range
  check (gift_value_usd is null or (gift_value_usd > 0 and gift_value_usd <= 1000));

-- Re-project through the views the UI reads. CREATE OR REPLACE VIEW requires the
-- existing columns unchanged and in the same order, so the new columns are
-- appended at the END of each select list.
create or replace view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         created_at, coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls,
         wishlist_url,
         gift_summary, gift_value_usd
  from public.santa_letters
  where status = 'live'
    and claimed_at is null
    and fulfilled_by_user_id is null;
grant select on public.public_letters to anon, authenticated;

create or replace view public.my_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, status, created_at,
         coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls,
         wishlist_url,
         gift_summary, gift_value_usd
  from public.santa_letters
  where guardian_user_id = auth.uid();
grant select on public.my_letters to authenticated;

create or replace view public.my_gifts as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         status, claimed_at, fulfilled_at,
         coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls,
         wishlist_url,
         gift_summary, gift_value_usd
  from public.santa_letters
  where fulfilled_by_user_id = auth.uid()
    and status in ('live', 'fulfilled');
grant select on public.my_gifts to authenticated;

commit;
