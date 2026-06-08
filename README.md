# The Armored League Platform

A modern, owned technology stack for **The Armored League** — New York City's premier full-contact armored combat promotion. This platform replaces the organization's legacy Wix site and adds a gamified training tracker plus the nationwide **Santa's Letters** (Santa's Knights) gifting portal.

Built by [Columbia Software Solutions](https://columbiasoftwaresolutions.com) · Fall 2026 · PRD v1.0

🔗 **Live (beta):** https://santas-knights.vercel.app/ — _internal beta on Vercel; not the public production site._

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Phases](#phases)
- [Users & Roles](#users--roles)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Admin Tasks](#admin-tasks)
- [Out of Scope](#out-of-scope)
- [Open Questions](#open-questions)

---

## Overview

The Armored League hosts live events where fighters compete in 60+ lbs of authentic steel armor with real axes, swords, and maces. The organization needs an owned platform to support its growing training program, live events, and the Santa's Letters charitable initiative.

**Goals**

1. Replace the existing Wix site with a modern, owned stack (Next.js + Supabase).
2. Build a training management system with XP-based gamification for fighters and instructors.
3. Launch the Santa's Letters gifting portal as a high-impact, audience-facing feature.

**Sites & brands.** **Santa's Knights, Inc.** is the 501(c)(3) nonprofit / parent org; **Gladiators NYC** is its wholly-owned combat program/team brand; **Letters to Santa** is the nonprofit's charitable gift drive. We build **one primary site — `santasknights.org`** — that hosts both the Gladiators program and Letters to Santa, with `gladiators.nyc` redirecting into it. See [REQUIREMENTS.md](./docs/REQUIREMENTS.md#site-architecture--brand-split) for the full feature split.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), React — SSR/SSG |
| Backend / DB | Supabase — PostgreSQL with Row Level Security, real-time subscriptions |
| Auth | Supabase Auth — email/password, role-based access |
| File Storage | Supabase Storage — letter images, waiver PDFs |
| Deployment | Vercel (frontend) + Supabase Cloud (backend) |
| Version Control | GitHub — CI/CD to Vercel |
| External (redirect only) | Amazon (gifts), Eventbrite (tickets), external donation processor (Donate), external store (Shop/Armory) — no on-site payments or e-commerce |

---

## Phases

The project is delivered across three sequential phases over 10–12 weeks. Each phase builds on the last; **Phases 2 and 3 can run in parallel.**

| Weeks | Phase | Focus | Deliverable |
| --- | --- | --- | --- |
| 1–2 | **Phase 1: Website** | Rebuild site on Next.js + Supabase, migrate Wix content | Deployed public site |
| 3–7 | **Phase 2: Tracker** | Booking + waiver, instructor check-in, XP engine, dashboard | Training management system |
| 8–12 | **Phase 3: Santa's Letters** | Letter upload portal, swipe UI, Amazon redirect, moderation | Live gifting feature |

### Phase 1 — Website Modernization

Migrate off Wix onto an owned stack. Establishes routing, auth scaffolding, and the component library that later phases plug into.

**Pages:** Home (hero, event CTA, social links, newsletter signup) · Tickets (direct Eventbrite link) · Training ("Armored Up") · Sponsors · Links · Contact (email-routed form)

**Requirements:** Next.js App Router · Supabase for auth/DB/storage · mobile-first responsive design · Vercel CI/CD from GitHub · auth scaffolding ready (accounts not yet required for public pages).

### Phase 2 — Training Tracker & Booking

- **Booking & Waiver** — account registration, one-time digital liability waiver with an immutable signed record, class browsing/registration, capacity enforcement, instructor roster view.
- **Instructor Check-In** — elevated-role instructors check in participants; check-ins are timestamped, trigger XP awards, and are stored for grant documentation. Veteran status flagged per participant.
- **XP & Gamification Engine** — participants earn XP for tracked activities along two configurable tracks (Fighter Path, Instructor Path). All XP values, level names, thresholds, and rewards are **admin-editable data, not hardcoded.**
- **Admin Configuration Panel** — set XP values/thresholds, view participants & attendance, export CSV for grant applications.

> **XP design principle:** XP rewards engagement, consistency, volunteering, and learning. It can make a participant *eligible to request* a privilege (e.g. armor rental, sparring) but must **never auto-grant safety-sensitive access**. Those always require instructor/admin certification.

**Waiver record** must capture: waiver version, full waiver text at time of signing, participant name, DOB, parent/guardian name (if under 18), timestamp, checkbox consent, typed legal name, IP/device/browser metadata if available, and a generated PDF (or equivalent immutable record). Material waiver changes require re-signing; minor typo fixes do not. Signed waivers are never auto-deleted.

### Phase 3 — Santa's Letters

A nationwide gifting portal designed around a **swipe/card-style** experience, not a static form.

- **Submission (families)** — a parent/guardian (not the child) submits on behalf of a child: child's first name, age, wish note, and an Amazon product/wishlist link, plus an uploaded photo/scan of the child's handwritten letter. Held in a moderation queue. No account required. Consent to platform terms required.
- **Swipe UI (visitors)** — donors browse one letter per card. The card front shows the handwritten letter; engaging flips it to the related Amazon Wishlist. "Gift This" opens Amazon in a new tab. **No payment is processed on-site** — fulfillment is between donor, Amazon, and the family.
- **Admin moderation** — pending queue with approve/reject/hide/flag/request-edit; mark letters fulfilled (fulfilled letters leave the active swipe pool); view submitted/approved/fulfilled totals.

> **Privacy:** Donors must never see a child's full name, home address, phone, email, school, social handles, or other identifying details. Gifts must be age-appropriate, legal, and safe — no weapons, adult, or unsafe items. The platform terms protect Santa's Knights from misuse by either side (off-platform contact, scraping, harassment, attempts to identify families).
>
> **Future (designed-for, not built in v1):** AI-assisted letter review that scans uploads for sensitive info and prompts the parent to redact before submission. The moderation workflow should be built so AI/human review can be layered in as volume grows.

Designed for **hundreds of letters per season as normal, thousands as possible, with a major Nov–Dec seasonal spike.**

---

## Users & Roles

| Role | Capabilities |
| --- | --- |
| **Public Visitor** | Browse site, buy tickets, interact with Santa's Letters swipe UI |
| **Training Participant** | Register for classes, sign waivers, track personal XP and progress |
| **Instructor** | Check participants into classes, certify milestones, manage rosters |
| **Admin** | Configure XP rules, moderate letters, manage user roles, oversee all content |
| **Letter Submitter** | Submit a Santa's Letter on behalf of a child (no account required) |

Roles are stored on the `users` record and enforced via Supabase Row Level Security. Instructor and admin roles are elevated and assigned by an admin.

---

## Architecture

```
                 ┌─────────────────────────┐
   Public ─────► │   Next.js (App Router)   │ ◄──── Participants / Instructors / Admins
                 │   Vercel (SSR/SSG, CDN)  │
                 └────────────┬─────────────┘
                              │ Supabase JS client
                 ┌────────────▼─────────────┐
                 │         Supabase          │
                 │  • Postgres + RLS         │
                 │  • Auth (email/password)  │
                 │  • Storage (PDFs, images) │
                 │  • Realtime subscriptions │
                 └───────────────────────────┘

   External (redirect only): Eventbrite (tickets) · Amazon (gifting)
```

---

## Data Model

Core entities (see the PRD for full field lists):

| Table | Key fields |
| --- | --- |
| `users` | id, email, role, veteran_status, waiver_signed_at, created_at |
| `classes` | id, title, type, instructor_id, datetime, capacity |
| `registrations` | user_id, class_id, created_at |
| `checkins` | user_id, class_id, instructor_id, checked_in_at |
| `xp_events` | user_id, event_type, xp_amount, source_id, created_at |
| `xp_config` | event_type, xp_value, unlock_threshold (admin-editable) |
| `armor_inventory` | item_id, set_name, item_type, size, condition, status, assigned_to, checkout_time, expected_return, actual_return, damage_notes, repair_notes, photos, admin_notes |
| `armor_rentals` | user_id, armor_item_id, class_id, rented_at, certified_by |
| `waivers` | user_id, version, full_text, participant_name, dob, guardian_name, typed_name, consent, ip/device metadata, pdf_url, signed_at |
| `santa_letters` | id, child_name, child_age, wish_note, amazon_url, image_url, status (pending/approved/fulfilled), created_at |

> Armor is tracked at the **item level**, not just full sets, so individual pieces (size, condition, repair history, photos) can be managed. The rental lifecycle and damage/loss policy are being finalized with the client.

### Reference: v1 XP values & levels

These are **templated defaults**, admin-editable after kickoff.

<details>
<summary>XP event values</summary>

| Event | XP |
| --- | --- |
| Create account / profile | 5 |
| Sign waiver | 5 |
| Attend standard class | 10 |
| Attend veterans / women's / community class | 10 |
| Attend armor intro or special workshop | 15 |
| Volunteer at class/event | 15 |
| Volunteer at major event | 25 |
| Bring a verified new participant | 10 |
| Instructor-approved milestone | 25 |
| Help with setup/breakdown | 10–20 |
| No-show | 0 |

</details>

<details>
<summary>Level thresholds (long growth curve)</summary>

Recruit 0 · Trainee 25 · Novice 75 · Squire 150 · Armsman 300 · Knight Candidate 500 · Knight 750 · Veteran Knight 1,250 · Champion 2,000 · Marshal 3,500 · Legend 5,000

</details>

---

## Local Setup

> The repo is currently a clean slate. These steps describe the intended workflow once the Next.js app is scaffolded.

**Prerequisites:** Node.js 18+, npm (or pnpm), a Supabase account, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
# 1. Clone
git clone <repo-url>
cd santas-knights

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in the values described below

# 4. (Optional) Run Supabase locally
supabase start          # spins up local Postgres, Auth, Storage
supabase db reset       # applies migrations + seed data

# 5. Run the dev server
npm run dev             # http://localhost:3000
```

---

## Environment Variables

Create `.env.local` (and a committed `.env.example` with empty placeholders):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-only — never expose to the client

# External links
NEXT_PUBLIC_EVENTBRITE_URL=    # Tickets page redirect

# Contact form (email routing)
CONTACT_EMAIL_TO=
```

> The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — use it only in server-side code (route handlers / server actions), never in client components.

---

## Deployment

- **Frontend** deploys to **Vercel** with CI/CD from the GitHub `main` branch. Pull requests get preview deployments.
- **Backend** runs on **Supabase Cloud**. Database changes are version-controlled as migrations (`supabase/migrations/`) and applied via `supabase db push`.
- Set all environment variables in the Vercel project settings (Production + Preview).
- **Success target:** Lighthouse score ≥ 90 on the public site.

```bash
# Apply DB migrations to the hosted project
supabase link --project-ref <project-ref>
supabase db push
```

---

## Admin Tasks

| Task | How |
| --- | --- |
| **Assign roles** | Set a user's `role` (participant / instructor / admin) in the Supabase dashboard or the admin panel. |
| **Manage classes** | Create, edit, and cancel class sessions from the admin dashboard. Set type, instructor, datetime, capacity, and prerequisites. |
| **Configure XP** | Edit `xp_config` values, level thresholds, badge names, and unlock rules — no code change required. |
| **Certify unlocks** | Armor rental, sparring, and advanced access require explicit instructor/admin certification (XP alone never grants them). |
| **Track armor** | Manage item-level inventory: status, assignment, checkout/return times, condition, repair notes, photos. |
| **Export grant data** | Export participant XP, attendance, and veteran status as CSV for grant applications. |
| **Moderate letters** | Approve / reject / hide / flag / request edits on Santa's Letters; mark fulfilled to remove from the swipe pool. |

> Admin training is delivered post-completion as part of handoff.

---

## Out of Scope

Explicitly excluded from this engagement (possible future work):

- In-app payment processing or e-commerce
- Native mobile app (iOS/Android)
- Live streaming integration
- CMS for non-technical content editing
- Email notification system (stretch goal only)
- Donor-facing fulfillment confirmation / self-reporting
- Fighter-vs-fighter matchmaking or event bracket management
- Amazon API integration (redirect only)

---

## Open Questions

Tracked decisions pending client input (see PRD §8 and Damion's notes):

- **Minors:** Program assumed 18+; if minors are accepted, a parent/guardian co-sign flow is needed.
- **Waiver:** Final waiver text to be provided before Phase 2. Typed-name e-signature + checkbox consent is acceptable for v1.
- **Classes:** Class types defined (intro, fitness, weapons, armor intro, sparring, women's, veterans, special events, volunteer shifts). Advanced/armor/sparring/weapons require instructor approval. Cancellations allowed and tracked; no automatic XP penalties or bans in v1.
- **Armor:** Rental lifecycle and damage/loss policy still being finalized (coordinating with Shan & Amy).
- **Santa's Letters:** Gift guidelines (max price, validation), expected seasonal volume, and AI-review rollout timing to be confirmed.

---

*Columbia Software Solutions · columbiasoftwaresolutions.com · Fall 2026*
