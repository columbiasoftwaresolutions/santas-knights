-- Lock down the identity fields collected at registration (email, first/last
-- name, dob, phone, zip code) now that every existing profile has values for
-- all of them. Companion to 2026-07-profile-identity-fields.sql.
begin;

alter table public.profiles alter column email      set not null;
alter table public.profiles alter column first_name set not null;
alter table public.profiles alter column last_name  set not null;
alter table public.profiles alter column dob         set not null;
alter table public.profiles alter column phone       set not null;
alter table public.profiles alter column zipcode     set not null;

commit;
