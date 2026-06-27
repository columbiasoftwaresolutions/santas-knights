begin;

alter table public.santa_letters
  add column if not exists amazon_image_urls text[];

update public.santa_letters
set amazon_image_urls = array_fill(
  ''::text,
  array[cardinality(coalesce(amazon_urls, array[]::text[]))]
)
where amazon_image_urls is null;

-- Public-safe projection: live, unclaimed letters only.
create or replace view public.public_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         created_at, coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls
  from public.santa_letters
  where status = 'live'
    and claimed_at is null
    and fulfilled_by_user_id is null;
grant select on public.public_letters to anon, authenticated;

-- Guardian-scoped projection: families can see all submitted letters, including
-- deleted ones, but no internal admin notes.
create or replace view public.my_letters as
  select id, child_first_name, child_age, wish_note, amazon_urls, status, created_at,
         coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls
  from public.santa_letters
  where guardian_user_id = auth.uid();
grant select on public.my_letters to authenticated;

-- Donor-scoped projection: claimed live rows are "to send"; fulfilled rows are
-- sent history. Deleted rows are intentionally omitted from donor task lists.
create or replace view public.my_gifts as
  select id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path,
         status, claimed_at, fulfilled_at,
         coalesce(amazon_image_urls, array[]::text[]) as amazon_image_urls
  from public.santa_letters
  where fulfilled_by_user_id = auth.uid()
    and status in ('live', 'fulfilled');
grant select on public.my_gifts to authenticated;

commit;
