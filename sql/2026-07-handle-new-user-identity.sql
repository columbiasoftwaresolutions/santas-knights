-- Fix: 2026-07-profile-identity-not-null.sql made first_name/last_name/dob/
-- phone/zipcode NOT NULL on profiles, but handle_new_user() (the auth.users
-- AFTER INSERT trigger) only ever inserted (id, email) — every signup since
-- has failed at the database level ("Database error creating new user").
-- registerAccount (both sites) now passes all five identity fields as
-- user_metadata on createUser(), so the trigger can populate them directly.
-- The coalesce fallbacks keep the insert safe even if metadata is missing.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, dob, phone, zipcode)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce((new.raw_user_meta_data->>'dob')::date, current_date),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'zipcode', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
