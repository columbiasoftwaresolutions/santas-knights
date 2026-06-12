# Santa's Knights — Nonprofit & Letters to Santa Platform

A modern, owned technology stack for **Santa's Knights, Inc.** — a New York City 501(c)(3) nonprofit — and its nationwide **Letters to Santa** gifting portal. This platform replaces the organization's legacy Wix presence and delivers the swipe-style donor experience that powers the charitable gift drive.

> **Companion site.** The nonprofit's combat program, **Gladiators NYC** (training/classes, booking + waiver, armor rentals, instructor check-in, and the XP/gamification tracker), lives on a **separate, linked site** at `gladiators.nyc`. It is documented in **[docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)**. Linked but distinct: separate codebase, deployment, and cutover.

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
3. Cross-link cleanly to the **Gladiators NYC** companion site (the combat program / training tracker) without merging the two.

---

## Sites & Brands

**Santa's Knights, Inc.** is the 501(c)(3) nonprofit / parent org; **Gladiators NYC** is its combat program/team brand; **Letters to Santa** is the nonprofit's charitable gift drive. We build **two distinct but linked sites:**

| Site | Brand | Scope | Where documented |
| --- | --- | --- | --- |
| **`santasknights.org`** *(this repo)* | Santa's Knights | Nonprofit info pages + **Letters to Santa** portal | This README + [REQUIREMENTS.md](./docs/REQUIREMENTS.md) |
| **`gladiators.nyc`** *(separate site)* | Gladiators NYC | Training/classes, booking + waiver, armor rentals, instructor check-in, XP tracker | [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md) |

The two cross-link but are separate codebases, deployments, and cutovers. `gladiators.nyc` is **not** a redirect into this site — it is its own site. See [REQUIREMENTS.md](./docs/REQUIREMENTS.md#site-architecture--brand-split) for the full feature split.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), React — SSR/SSG |
| Backend / DB | Supabase — PostgreSQL with Row Level Security, real-time subscriptions |
| Auth | Supabase Auth — email/password, role-based access |
| File Storage | Supabase Storage — letter images |
| Deployment | Vercel (frontend) + Supabase Cloud (backend) |
| Version Control | GitHub — CI/CD to Vercel |
| External (redirect only) | Amazon (gifts), external donation processor (Donate) — no on-site payments or e-commerce |

---

## Phases

The engagement is delivered across three sequential phases over 10–12 weeks. **This site owns Phase 1 (nonprofit pages) and Phase 3 (Letters to Santa).** Phase 2 — the training tracker — belongs to the **Gladiators NYC companion site** (see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md)).

| Weeks | Phase | Site | Focus | Deliverable |
| --- | --- | --- | --- | --- |
| 1–2 | **Phase 1: Website** | This site | Rebuild nonprofit site on Next.js + Supabase, migrate Wix content | Deployed public site |
| 3–7 | **Phase 2: Tracker** | _Gladiators NYC →_ | Booking + waiver, check-in, XP engine, dashboard | _See companion doc_ |
| 8–12 | **Phase 3: Santa's Letters** | This site | Letter upload portal, swipe UI, Amazon redirect, moderation | Live gifting feature |

### Phase 1 — Website Modernization

Migrate off Wix onto an owned stack. Establishes routing, auth scaffolding, and the component library/design system later work plugs into.

**Pages:** Home (mission hero, what we do, Letters to Santa teaser, Donate CTA, social links, newsletter signup) · About / Mission · Donate (external processor) · Membership / Get Involved · Contact (email-routed form) · Links (link-in-bio) · Sponsors · Letters to Santa landing. Cross-links out to `gladiators.nyc` for training/classes.

**Requirements:** Next.js App Router · Supabase for auth/DB/storage · mobile-first responsive design · Vercel CI/CD from GitHub · auth scaffolding ready (accounts not yet required for public pages) · migrate existing Wix public content · Lighthouse ≥ 90.

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

| Role | Capabilities |
| --- | --- |
| **Public Visitor** | Browse the nonprofit site, interact with the Santa's Letters swipe UI |
| **Admin** | Moderate letters, manage user roles, oversee all content |
| **Letter Submitter** | Submit a Santa's Letter on behalf of a child (no account required) |

Roles are stored on the `users` record and enforced via Supabase Row Level Security. The admin role is elevated and assigned by an admin.

> **Training Participant** and **Instructor** roles belong to the Gladiators NYC companion site — see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md).

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

   External (redirect only): Amazon (gifting) · donation processor (Donate)
   Cross-link out: gladiators.nyc (separate Gladiators NYC site)
```

---

## Data Model

Core entities for this site (see the PRD for full field lists):

| Table | Key fields |
| --- | --- |
| `users` | id, email, role, created_at |
| `santa_letters` | id, child_name, child_age, wish_note, amazon_url, image_url, status (pending/approved/fulfilled), created_at |
| `consent_records` | id, type (guardian/donor), version, full_text, accepted_at, metadata |

> The training tracker's data model (classes, registrations, check-ins, XP, armor, waivers) lives on the Gladiators NYC companion site — see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#data-model-training-tables).

---

## Local Setup

**Prerequisites:** Node.js 18+, npm (or pnpm), a Supabase account, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

> The site runs without Supabase configured — pages render and forms degrade to friendly notices — but letters, contact, newsletter, and admin features need a Supabase project with `supabase/migrations/0001_init.sql` applied.

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
| **Create the first admin** | Supabase dashboard → Authentication → Add user (email + password), then SQL: `update profiles set role = 'admin' where email = '<that email>';` |
| **Assign roles** | Set a user's `role` (admin) in the Supabase dashboard. |
| **Moderate letters** | Sign in at `/admin/login` → approve / reject / hide / flag / request edits; mark fulfilled to remove from the swipe pool. |
| **Review totals** | The `/admin` dashboard shows submitted / awaiting review / live / fulfilled counts. |
| **Preview the swipe UI** | `/letters/give?demo=1` shows clearly-labeled sample letters before real submissions exist. |

> Combat-program admin tasks (classes, XP config, armor, grant-data export) live on the Gladiators NYC companion site — see [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#admin-tasks-gladiators-side).
>
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
- Amazon API integration (redirect only)

---

## Open Questions

Tracked decisions pending client input (see PRD §8 and Damion's notes):

- **Santa's Letters:** Gift guidelines (max price, validation), expected seasonal volume, and AI-review rollout timing to be confirmed.
- **Consent:** Final parent/guardian consent and donor terms text to be provided; versioned acceptance records stored.
- **Cutover:** Public cutover timing coordinated with Nicolas; keep `noindex` until then (see [ROLLOUT.md](./docs/ROLLOUT.md)).

> Combat-program open questions (minors/waiver, classes, armor, training videos) are tracked in [docs/GLADIATORS-SITE.md](./docs/GLADIATORS-SITE.md#open-questions-gladiators-side).

---

*Columbia Software Solutions · columbiasoftwaresolutions.com · Fall 2026*
