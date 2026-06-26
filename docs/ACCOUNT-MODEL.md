# Account & Identity Model — one Santa's Knights account, role-based capabilities

**Status:** adopted · the canonical account/identity structure. One account system, **email + password the single auth method for every role** (magic-link dropped — see [§7](#7-reconciliation-with-existing-docs)). Refines [plan-v2.md](./plan-v2.md) §A1/§C2 and [GLADIATORS-SITE.md](./GLADIATORS-SITE.md) "Users & Roles".

This document settles **who needs an account, what kind, and how it's created** across every person who uses the site: people who **submit letters**, people who **give gifts**, **coaches**, **admins**, and people **taking classes**. It's the source of truth for the auth surface and the identity-related schema; the full training-tracker tables stay specced in [GLADIATORS-SITE.md](./GLADIATORS-SITE.md#data-model-training-tables).

---

## 1. Core principle — one identity, many capabilities

**One human = one `profiles` row = one login.** There is a single Santa's Knights account system (Supabase Auth + `profiles`) across the whole site — not separate account systems per function. A donor who is also a parent enrolling a kid is **one account**.

`app_role` (the existing enum `public · participant · instructor · admin`) is the **privilege tier** — what elevated things the account may do. It is *not* a label for every persona:

> **"Guardian" and "donor" are NOT roles — they are data *relationships* on a `public` account.**
> - A **guardian** is a `public` account that *owns letters* (`santa_letters.guardian_user_id = me`).
> - A **donor** is a guest, or a `public` account, that *owns fulfillments/donations*.
>
> No new enum values are needed. The enum already captures the only privileged tiers (`participant`, `instructor`, `admin`); everyone else is `public`.

---

## 2. Personas → role → account requirement → auth

| Persona | `app_role` | Account? | Created how | Auth method |
| --- | --- | --- | --- | --- |
| **Letter submitter** (guardian) | `public` | **Required** | Self-signup | **Email + password** |
| **Gift giver** (donor) | `public` *(or none)* | **Optional — guest-first** | Self-signup, opt-in after giving | Guest → optional **email + password** upgrade |
| **Person taking classes** (adult or a guardian's child) | `participant` | **Required** | Self-signup → role granted on first booking | **Email + password** |
| **Coach** | `instructor` | **Required** | **Provisioned by admin** (not self-signup) | **Email + password** (MFA later) |
| **Admin** | `admin` | **Required** | **Provisioned by admin** | **Email + password** (MFA recommended) |

**One auth method everywhere — email + password.** There is a single way to sign in across the whole site; no magic-link / OTP, no per-role auth split. Dropping magic-link removes the dependency on configured email delivery (SMTP) and keeps the mental model trivial: one account, one password, every role. Registration creates an already-confirmed user (server action, admin client) so signup doesn't depend on an email round-trip either.

**The friction asymmetry that remains is about *accounts*, not *auth methods*:** the hard account wall sits only on the recurring/trust-sensitive flows (submitting a letter, booking a class). Gift giving — the impulse, seasonal flow — stays guest-first so a signup wall never costs a fulfillment.

---

## 3. Account creation paths

### 3.1 Self-signup (guardians, donors, participants)
Open registration (email + password) creates an already-confirmed `public` account and signs the user in. A `public` account becomes a `participant` the moment it books its first class (role granted by the booking flow). Guardians and donors stay `public` forever — their "type" is just the data attached to them.

### 3.2 Provisioned only (coaches, admins)
> **Privilege-escalation guard:** no one can self-register *as* `instructor` or `admin`. Elevated roles are **granted** by an existing admin (Supabase dashboard or the admin panel — `update profiles set role=… where …`), never **chosen at signup**. A coach/admin signs up (or is invited) as a normal account first; an admin then elevates it.

This matches the existing bootstrap (`README`/`CLAUDE.md`: create the auth user, then promote) and GLADIATORS-SITE "Instructor and admin roles are elevated and assigned by an admin."

---

## 4. Minors — guardian-owned family accounts

The program serves children (homepage: *"Gladiator Kids (for children)"*), so minors are in scope. A child does **not** hold their own login.

> **Model:** the **guardian** holds the account; each child is a **`family_members` sub-profile** under it. The responsible, authenticating identity is always the guardian's `profiles` row; the child is data hanging off it. Adults who train use their own `profiles` row directly (no `family_members` row needed).

This is what lets the same family account both **submit a Santa letter** and **enroll a kid in classes** under one login — the single biggest friction win for the families the org serves. It supersedes the "program assumed 18+" open question in GLADIATORS-SITE (see §7) and changes how the training tables key their trainee (see §6).

---

## 5. The gift-giving (donor) flow — guest-first details

Guest-first, but two things are non-negotiable even for guests:

- **Capture an email at fulfillment.** Santa's Knights is a 501(c)(3); donors expect a fulfillment/tax acknowledgment, and the org needs a channel to coordinate handoff. Capture email even with no account, then offer *"save this to track your gifts"* as the optional account upgrade (email + password).
- **Self-dealing guard.** Block a guardian from fulfilling their own child's letter.

> **Self-dealing rule:** at fulfillment time, reject (or flag for review) if the fulfilling identity matches the letter's guardian — i.e. `fulfiller_user_id == santa_letters.guardian_user_id` **or** `fulfiller_email == santa_letters.guardian_email`. Enforced in the fulfillment server action; for accounts it's exact, for guests it's a best-effort email match.

---

## 6. Data-model implications

Identity lives on the existing `profiles` table; these are the **additions/changes** the account model requires. Full training-tracker fields remain in [GLADIATORS-SITE.md](./GLADIATORS-SITE.md#data-model-training-tables).

| Table | Change | Why |
| --- | --- | --- |
| `santa_letters` | add `guardian_user_id uuid references profiles(id)` (nullable at DB, **required by the submit action**) | Link a submitted letter to the family account (§2). Nullable so admins can hand-enter letters with no guardian account (paper drives). |
| `santa_letters` *(or a new table)* | capture **fulfiller identity** — `fulfilled_by_user_id uuid null references profiles(id)` + `fulfilled_by_email text` | Donor history, receipts, and the self-dealing guard (§5). See open question on a `letter_fulfillments` table for reservation/hold. |
| `donations` *(planned, plan-v2 §A3)* | add `donor_user_id uuid null references profiles(id)` | Link a donation lead to an account when the donor is signed in; stays null for guests. |
| `family_members` *(new)* | `id`, `guardian_user_id uuid references profiles(id) on delete cascade`, `first_name`, `dob`, `relationship`, `veteran_status bool default false`, `created_at` | Minor trainees under a guardian account (§4). |
| `registrations` / `waivers` / `checkins` / `xp_events` *(training, GLADIATORS-SITE)* | add nullable `family_member_id uuid references family_members(id)` alongside the existing `user_id` | The account (`user_id`) is always the responsible party; `family_member_id` set when the trainee is a minor child (null = the account holder trains themselves). |

> **No commercial tables here.** `armor_inventory` / `armor_rentals` stay on `gladiators.nyc`; rental *eligibility* is computed here and read off the participant dashboard (unchanged from plan-v2).

### Data-access boundaries (RLS)
- `profiles` — user reads own; admin reads all *(existing)*.
- `santa_letters` — **guardian reads own** (`guardian_user_id = auth.uid()`); admin all; **donors never read raw rows**, only the safe `public_letters` view *(add the guardian self-read policy; everything else unchanged)*.
- `donations` / fulfillment rows — donor reads own (`donor_user_id`/`fulfilled_by_user_id = auth.uid()`); admin all.
- `family_members` — guardian reads/writes their own children; instructor reads only children on **their** class rosters (via `registrations`); admin all.
- training tables — participant reads own; instructor reads their rosters; admin all *(per GLADIATORS-SITE)*.

---

## 7. Reconciliation with existing docs

This model **refines** earlier docs; update them to match (don't leave the contradiction):

- **plan-v2 §C2** said "keep submission possible **without** an account (optional)." → **Superseded:** a letter submitter now **needs** an account. (Adopting/donating stays account-optional — that's the donor, §2.)
- **plan-v2 §A1 / EXECUTION-PLAN Phase 1** specify "email + password registration." → **Reaffirmed:** email + password is the single auth method for **every** role. An earlier draft of this doc made magic-link / OTP the default for seasonal users; that is **reverted** — one account, one password, everywhere (§2). This drops the SMTP dependency magic-link would have required.
- **GLADIATORS-SITE "Users & Roles"** → reaffirmed: `instructor`/`admin` are **provisioned, never self-selected** (§3.2).
- **GLADIATORS-SITE open question "Minors: program assumed 18+"** → **Resolved:** minors are in scope and handled via guardian-owned **family accounts** + `family_members`; training tables gain `family_member_id` (§4, §6).

---

## 8. Open questions

- ~~**Universal auth default:** magic-link everywhere, or magic-link for seasonal + password for recurring/privileged?~~ → **Resolved:** **email + password everywhere** (§2). Simplest UX, no SMTP dependency. Password reset (Supabase recovery email) can be added later once SMTP is configured; until then an admin can reset from the dashboard.
- **Fulfillment reservation:** do we need a `letter_fulfillments` claim/hold record to stop two donors buying the same gift, vs. just stamping fields on `santa_letters`? (A hold table is cleaner if reservations are wanted.)
- **Minor cutoff & guardian co-sign:** confirm under-18 handling and the guardian co-sign on the waiver (waiver text pending from Damion — GLADIATORS-SITE).
- **Admin-entered letters:** keep the no-guardian-account path for paper drives (keeps `guardian_user_id` nullable at the DB)?
- **MFA** for `instructor`/`admin` — now or later?

---

*Account & Identity Model · Columbia Software Solutions · one account system across the whole nonprofit site, email + password the single auth method; `role` is the privilege tier, guardian/donor are data relationships, coaches/admins are provisioned, minors train under a guardian's family account.*
