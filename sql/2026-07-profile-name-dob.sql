-- Profile identity fields: full name + date of birth.
-- Captured at registration on both sites (santasknights.org + gladiators.nyc,
-- one shared identity). `name` autofills the Letters submit form; `dob` backs
-- the 18-or-older account gate. Idempotent; additive only.
--
-- DOB is stored as a real date but only month + year are collected, so the day
-- is always the 1st (e.g. someone born July 2002 => 2002-07-01). The 18+ gate
-- compares the first of the birth month + 18 years against today.
begin;

alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists dob  date;

commit;
