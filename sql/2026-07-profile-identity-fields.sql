-- Split the single `name` field into first_name/last_name and add phone +
-- home zipcode, collected at registration on both sites (santasknights.org +
-- gladiators.nyc, one shared identity). Supersedes the `name` column added by
-- 2026-07-profile-name-dob.sql (dob stays as-is). Idempotent.
--
-- Not NOT NULL yet: existing rows predate these fields. The NOT NULL gate is
-- a separate step, applied once existing accounts have been backfilled/reset.
begin;

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name  text;
alter table public.profiles add column if not exists phone      text;
alter table public.profiles add column if not exists zipcode    text;
alter table public.profiles drop column if exists name;

commit;
