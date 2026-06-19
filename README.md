# Santa's Knights — Nonprofit & Letters to Santa Platform

A modern, owned technology stack for **Santa's Knights, Inc.** — a New York City 501(c)(3) nonprofit — covering its full public site, **extensive Gladiators NYC program content**, member accounts, and its nationwide **Letters to Santa** gifting portal. This platform replaces the organization's legacy Wix presence, **replicating every public feature** of the live site.

> **Scope (Plan v2 — content here, training backend elsewhere).** This repo builds **everything the live Wix site shows publicly on `santasknights.org`** — nonprofit pages, member accounts, gallery, donate/membership, partners, the Letters to Santa portal, **and rich Gladiators content** (class catalog, descriptions, online/video, founder, partners). The **Gladiators training-tracker backend lives on the separate `gladiators.nyc` site, NOT in this repo:** class **booking**, **waivers**, **instructor check-in**, **XP/gamification**, **participant dashboards**, **training-video uploads**, plus the merch **Shop** and **Armory**. This site **cross-links out** to `gladiators.nyc` for any booking/registration. The full build list is **[docs/plan-v2.md](./docs/plan-v2.md)**; the Gladiators training spec is **[docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)**.

Built by [Columbia Software Solutions](https://columbiasoftwaresolutions.com) · Fall 2026 · PRD v1.0

🔗 **Live (beta):** https://santas-knights.vercel.app/ — _internal beta on Vercel; not the public production site._

---

## Table of Contents

- [Overview](#overview)
- [Sites & Brands](#sites--brands)
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

**Santa's Knights, Inc.** is a 501(c)(3) nonprofit. **Letters to Santa** is its charitable gift drive: families submit a child's handwritten letter, and donors browse and fulfill wishes through a swipe-style portal — all gift fulfillment handled externally via Amazon. The organization needs an owned platform to host its nonprofit presence and run this high-impact, audience-facing program.

**Goals**

1. Replace the existing Wix presence with a modern, owned stack (Next.js + Supabase) for the nonprofit.
2. Launch the **Letters to Santa** gifting portal as the platform's flagship, audience-facing feature.
3. Carry **extensive Gladiators NYC program content** (class catalog, descriptions, online/video) on this site, **cross-linking out to `gladiators.nyc`** for booking and the training tracker.

---

## Sites & Brands

**Santa's Knights, Inc.** is the 501(c)(3) nonprofit / parent org; **Gladiators NYC** is its combat program/team brand; **Letters to Santa** is the nonprofit's charitable gift drive. **Plan v2 splits by content vs. backend, not by brand:**

| Domain | Brand | Scope | Where documented |
| --- | --- | --- | --- |
| **`santasknights.org`** *(this repo)* | Santa's Knights + Letters to Santa + Gladiators **content** | Nonprofit pages, member accounts, gallery, donate/membership, partners · the Letters to Santa portal · **Gladiators informational pages** (class catalog, descriptions, online/video) with Book-Now CTAs that link out | This README + [docs/plan-v2.md](./docs/plan-v2.md) |
| **`gladiators.nyc`** *(separate site)* | Gladiators NYC | **Training-tracker backend** (booking + waiver, instructor check-in, XP/gamification, participant dashboards, training-video uploads) · merch **Shop** + **Armory** | [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md) |

The two **cross-link** (this site → `gladiators.nyc` for booking/training; Gladiators → back to Donate/Letters) but are **separate codebases, deployments, and cutovers**. See [docs/plan-v2.md](./docs/plan-v2.md) for the full build list and the content-vs-backend boundary.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), React — SSR/SSG |
| Backend / DB | Supabase — PostgreSQL with Row Level Security, real-time subscriptions |
| Auth | Supabase Auth — email/password, role-based access |
| File Storage | Supabase Storage — letter images, gallery media |
| Deployment | Vercel (frontend) + Supabase Cloud (backend); mobile-first responsive |
| Version Control | GitHub — CI/CD to Vercel |
| External (cross-link only) | Amazon (gifts), donation/membership processors (PayPal/Venmo), and **`gladiators.nyc`** for class booking, the training tracker, shop & armory — no on-site payments or e-commerce |

---

## Phases

This repo delivers the nonprofit site, member accounts, the Letters portal, and Gladiators **content**. The Gladiators **training tracker** is a separate `gladiators.nyc` workstream (see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)). The full build list is **[docs/plan-v2.md](./docs/plan-v2.md)**.

| Phase | Site | Focus | Deliverable |
| --- | --- | --- | --- |
| **Website + content** | This repo | Nonprofit pages, member accounts, gallery, donate/membership, partners, Gladiators content pages (Book-Now links out) | Deployed public site |
| **Santa's Letters** | This repo | Letter upload portal, swipe UI, Amazon redirect, moderation, per-gift guidance, family letter-tracking account | Live gifting feature |
| **Training Tracker** | _`gladiators.nyc` →_ | Booking + waiver, check-in, XP engine, dashboard, training videos | _See [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)_ |

### Website + Content (this repo)

Migrate off Wix onto an owned stack. Establishes routing, the public **member-account system** (Letters/nonprofit side), and the component library/design system.

**Pages:** Home · About / Mission / Founder · Donate (lead form + tax guidance → external processor) · Membership (recurring tiers → external) · Get Involved · Contact (email-routed form) · Links (link-in-bio) · Sponsors / Partners (real roster) · **Gallery** · **Account / Members area** (Letters tracking) · **Training / Classes + Online** (Gladiators content; Book-Now links out) · Letters to Santa portal.

**Requirements:** Next.js App Router · Supabase for auth/DB/storage · mobile-first responsive design · Vercel CI/CD from GitHub · member-account system · migrate existing Wix public content · Lighthouse ≥ 90.

### Training Tracker (Gladiators program — `gladiators.nyc`, not this repo)

The combat-program backend lives on the **separate Gladiators site** — booking + waiver, instructor check-in, XP/gamification, participant dashboard, training-video uploads, plus shop & armory. This site carries the **class content** and **links out** for all of it. Full spec: [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md).

### Phase 3 — Santa's Letters

A nationwide gifting portal designed around a **swipe/card-style** experience, not a static form.

- **Submission (families)** — a parent/guardian (not the child) submits on behalf of a child: child's first name, age, wish note, and an Amazon product/wishlist link, plus an uploaded photo/scan of the child's handwritten letter. Held in a moderation queue. No account required. Consent to platform terms required (versioned, with stored acceptance records).
- **Swipe UI (visitors)** — donors browse one letter per card; **right-swipe = purchase intent.** The card front shows the handwritten letter; engaging flips it to the related Amazon Wishlist. "Gift This" opens Amazon in a new tab. Target **≤2–3 taps/clicks from swipe to a completed purchase**. **No payment is processed on-site** — fulfillment is between donor, Amazon, and the family.
- **Admin moderation** — pending queue with approve/reject/hide/flag/request-edit; mark letters fulfilled (fulfilled letters leave the active swipe pool); view submitted/approved/fulfilled totals.

> **Privacy:** Donors must never see a child's full name, home address, phone, email, school, social handles, or other identifying details. Gifts must be age-appropriate, legal, and safe — no weapons, adult, or unsafe items. The platform terms protect Santa's Knights from misuse by either side (off-platform contact, scraping, harassment, attempts to identify families).
>
> **Future (designed-for, not built in v1):** AI-assisted letter review that scans uploads for sensitive info and prompts the parent to redact before submission. The moderation workflow should be built so AI/human review can be layered in as volume grows.

Designed for **hundreds of letters per season as normal, thousands as possible, with a major Nov–Dec seasonal spike.** Target launch ahead of the Oct–Nov ramp so it's live for the Christmas season.

---

## Users & Roles

| Role (`app_role`) | Capabilities |
| --- | --- |
| **`public`** | Browse the site, interact with the Santa's Letters swipe UI, donate; optionally register an account to track a submitted letter |
| **`admin`** | Moderate letters, manage gallery/partners/donations, manage roles, oversee all content |

Roles are stored on the `profiles` record (enum `app_role`) and enforced via Supabase Row Level Security. `admin` is elevated and assigned by an admin. A **Letter Submitter** is any `public` visitor — submitting on behalf of a child requires no account, though an optional account lets a family track their letter's status.

> **`participant` / `instructor` roles** are primarily meaningful on the **Gladiators training tracker** (`gladiators.nyc`), which has its own account system — see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md). The enum includes them so the schema is shared-ready, but class booking, check-in, and XP are not built in this repo.

---

## Architecture

```
                 ┌─────────────────────────┐
   Public ─────► │   Next.js (App Router)   │ ◄──── Admins / Moderators
                 │   Vercel (SSR/SSG, CDN)  │
                 └────────────┬─────────────┘
                              │ Supabase JS client
                 ┌────────────▼─────────────┐
                 │         Supabase          │
                 │  • Postgres + RLS         │
                 │  • Auth (email/password)  │
                 │  • Storage (letter images)│
                 │  • Realtime subscriptions │
                 └───────────────────────────┘

   External (cross-link only): Amazon (gifting) · PayPal/Venmo (donate/membership)
                              · gladiators.nyc (booking, training tracker, shop, armory)
```

---

## Data Model

The full SQL schema is the source of truth in [CLAUDE.md](./CLAUDE.md#database-schema). Core entities, by area:

**Nonprofit + Letters (live):**

| Table | Key fields |
| --- | --- |
| `profiles` | id, email, role (`app_role`), created_at |
| `santa_letters` | id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, status, guardian_*, `guardian_user_id` *(planned, for family tracking)*, created_at |
| `consent_records` | id, type (guardian/donor), version, full_text, accepted_at, metadata |
| `contact_messages`, `newsletter_subscribers` | contact + newsletter capture |

**Planned here (Plan v2 — see [docs/plan-v2.md](./docs/plan-v2.md)):** `donations`, `gallery_media`, `partners`, plus `santa_letters.guardian_user_id` for family letter-tracking.

> **Not built here:** all training tables — `classes`, `registrations`, `checkins`, `waivers`, `media_consents`, `xp_events`, `xp_config`, `badges`/`levels`, `training_videos`, `armor_inventory`, `armor_rentals` — live on the **`gladiators.nyc`** project. See [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#data-model-training-tables).

---

## Local Setup

**Prerequisites:** Node.js 18+, npm (or pnpm), a Supabase account, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

> The site runs without Supabase configured — pages render and forms degrade to friendly notices — but letters, contact, newsletter, and admin features need a Supabase project with the database schema (in [CLAUDE.md](./CLAUDE.md#database-schema)) applied.

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
# then apply the schema from CLAUDE.md (Database schema) via the SQL editor

# 5. Run the dev server
npm run dev             # http://localhost:3000
```

---

## Environment Variables

Create `.env.local` (and a committed `.env.example` with empty placeholders):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=           # server-only — never expose to the client

# External links (redirects only — no on-site payments)
NEXT_PUBLIC_DONATE_URL=        # external donation processor
NEXT_PUBLIC_PAYPAL_URL=
NEXT_PUBLIC_VENMO_URL=
NEXT_PUBLIC_GLADIATORS_URL=    # https://gladiators.nyc once live

# Contact form email routing (optional — messages are always stored in Supabase)
RESEND_API_KEY=
CONTACT_EMAIL_TO=
```

> The `SUPABASE_SECRET_KEY` bypasses RLS — use it only in server-side code (route handlers / server actions), never in client components.

---

## Deployment

- **Frontend** deploys to **Vercel** with CI/CD from the GitHub `main` branch. Pull requests get preview deployments.
- **Backend** runs on **Supabase Cloud**. The schema is documented in [CLAUDE.md](./CLAUDE.md#database-schema) (Database schema) and applied via the Supabase SQL Editor.
- Set all environment variables in the Vercel project settings (Production + Preview).
- **Success target:** Lighthouse score ≥ 90 on the public site.

> Apply the schema to the hosted project from the Supabase dashboard → **SQL
> Editor** → paste and run the schema in [CLAUDE.md](./CLAUDE.md#database-schema).

---

## Admin Tasks

| Task | How |
| --- | --- |
| **Create the first admin** | Supabase dashboard → Authentication → Add user (email + password), then SQL: `update profiles set role = 'admin' where email = '<that email>';` |
| **Assign roles** | Set a user's `role` (admin) in the Supabase dashboard. |
| **Moderate letters** | Sign in at `/admin/login` → approve / reject / hide / flag / request edits; mark fulfilled to remove from the swipe pool. |
| **Review totals** | The `/admin` dashboard shows submitted / awaiting review / live / fulfilled counts. |
| **Preview the swipe UI** | `/letters/give?demo=1` shows clearly-labeled sample letters before real submissions exist. |

> Combat-program admin tasks (manage classes, configure XP, certify milestones, instructor check-in, manage training videos, export grant CSV, armor) live on the **`gladiators.nyc`** training tracker — see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#admin-tasks-gladiators-side). This repo's admin covers Letters moderation plus gallery/partners/donations content.
>
> Admin training is delivered post-completion as part of handoff.

---

## Out of Scope

Explicitly excluded from this repo (live on `gladiators.nyc`, external, or future):

- **Gladiators training-tracker backend** — class booking, waivers, instructor check-in, XP/gamification, participant dashboards, training-video uploads, training admin/CSV export. On `gladiators.nyc`; this site links out. (Gladiators *content* pages ARE built here.)
- **Merch Shop** and **Armory (armor inventory & item-level rental)** — external Gladiators store
- In-app payment processing or e-commerce (all payments external: Amazon, PayPal/Venmo)
- Native mobile app (iOS/Android)
- Live streaming integration
- CMS for non-technical content editing
- Email notification system (stretch goal only)
- Donor-facing fulfillment confirmation / self-reporting
- Amazon API integration (redirect only)

---

## Open Questions

Tracked decisions pending client input (see PRD §8 and Damion's notes):

- **Santa's Letters:** Gift guidelines (max price, validation), expected seasonal volume, and AI-review rollout timing to be confirmed.
- **Consent:** Final parent/guardian consent and donor terms text to be provided; versioned acceptance records stored.
- **Cutover:** Public cutover timing coordinated with Nicolas; keep `noindex` until then (see [ROLLOUT.md](./docs/ROLLOUT.md)).

- **Cross-links (Plan v2):** confirm the `gladiators.nyc` URLs that this site's Book-Now / Register / "free app" CTAs deep-link to. See [docs/plan-v2.md](./docs/plan-v2.md) §D5.

> Combat-program open questions (minors/waiver, classes, training videos, armor) are tracked on the Gladiators side — see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#open-questions-gladiators-side).

---

*Columbia Software Solutions · columbiasoftwaresolutions.com · Fall 2026*
