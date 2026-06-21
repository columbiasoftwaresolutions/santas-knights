# Execution Plan — building the one-site Santa's Knights platform

**Status:** active · the *how/when* for the scope defined in [plan-v2.md](./plan-v2.md).

This plan turns the **one-nonprofit-site decision** into an ordered build. Everything Santa's Knights does as a 501(c)(3) ships on `santasknights.org` — nonprofit pages, Letters, **and the full Gladiators free program (content + training tracker)**. The **only** carve-out is the commercial **Shop + Armory** on `gladiators.nyc`, which this site cross-links out to.

- **Scope source of truth:** [plan-v2.md](./plan-v2.md) (§A nonprofit gaps · §B Gladiators · §C Letters · §E copy/IA · §F media). [REQUIREMENTS.md](./REQUIREMENTS.md) is authoritative for *what each feature does*. [GLADIATORS-SITE.md](./GLADIATORS-SITE.md) specs the training tracker + commercial companion.
- **Ship discipline:** [ROLLOUT.md](./ROLLOUT.md) — beta stays `noindex`; public cutover is a separate, Nicolas-coordinated event. Commit/push only on request; CHANGELOG row written from the diff at commit time.

## Guiding principles

1. **Public site first, training tracker last.** The tracker (Phase 5) is the heaviest chunk; ship the content/marketing site, gallery, donate, membership, and Letters improvements before it so the public site goes live without waiting on it.
2. **One account, one Supabase project, one admin.** `participant`/`instructor`/`admin` are all roles on this site's `profiles`. A donor who is also a participant is one identity.
3. **SEO/AEO consolidation is a feature, not an afterthought.** Per-class URLs, `Course`/`Event`/`ReserveAction` + `Organization` schema, NAP consistency, and crawler policy are built in (Phase 0 + Phase 7), because the free-class pages must rank and be agent-bookable on the Ad-Grant-eligible domain.
4. **Payments stay external.** Amazon (gifts), PayPal/Venmo (donate/membership), Eventbrite (tickets), external store (shop). No on-site card processing.
5. **Safety/privacy invariants never bend.** Child identifying data never public (Letters); XP never auto-grants safety-sensitive access; waivers immutable; `SUPABASE_SECRET_KEY` server-only.

---

## Phase 0 — Consolidation (the cheap win) `~0.5–1 day`

Make the one-site decision real in code, before any new backend. Low risk, high clarity.

- [ ] Rename nav **"Classes" → "Gladiators NYC"** (`content/site.ts` nav config); point at the on-site program section.
- [ ] **Replace the single outbound `TRAINING_HREF`** with internal per-class routes: `/training` hub + `/training/[slug]` per class (Bootcamp, Armored Practice, Women's, Women's Midtown, Veterans, Fundamentals). Fixes the lossy "all six → one generic URL" handoff and unblocks per-class schema.
- [ ] **Flip the "booking lives elsewhere" copy** in `/training`, `/online`, `components/layout/Footer.tsx`, and the links page — booking is now on-site ("coming soon" until Phase 5).
- [ ] Add **`Organization` schema** (Santa's Knights; Gladiators NYC as the program brand; `sameAs` Instagram/Facebook/press) and per-class **`Course` stubs** (price $0). Action endpoints filled in Phase 5.
- [ ] Keep `gladiators.nyc` cross-link var reserved for **Shop/Armory only**.

**Acceptance:** site presents a coherent "Gladiators NYC" section with per-class pages; no copy implies an external training site; `npm run lint && npx tsc --noEmit && npm run build` pass.

---

## Phase 1 — Foundation: role-aware auth + member accounts (§A1) `~2–3 days`

Unblocks family letter-tracking (Phase 3) and the participant experience (Phase 5).

- [ ] Promote `lib/auth.ts` from an admin-only gate to a **general role-aware gate** (`public`/`participant`/`instructor`/`admin`).
- [ ] Public **registration/login** via Supabase Auth (extend existing patterns); `/account` home with profile basics.
- [ ] `[stretch]` Facebook one-click login (Supabase OAuth).
- [ ] Accounts **not required** for public browsing, donating, or adopting a letter.

**Data model:** reuse `profiles` (already has `app_role`). **Acceptance:** a non-admin user can register, log in, see `/account`; admin gate still works; RLS verified.

---

## Phase 2 — Content quick wins (§A2–A5, §C1) `~3–5 days`

Mostly content + light forms; ship early, ideally mirror cheap pieces on Wix first (ROLLOUT Track B).

- [ ] **Gallery (§A2)** — `/gallery` responsive grid + lightbox; admin upload to `gallery` bucket (public); categories/albums; images+video.
- [ ] **Partners roster (§A5)** — real roster into `content/site.ts` (or `partners` table); keep press grid distinct. Flag missing partner logos for client.
- [ ] **Donate full flow (§A3)** — lead form (first/last/email, dedicate-to, amount/frequency) → `donations` table → redirect to external processor; preset chips; tax-deductibility guidance section; keep "where it goes."
- [ ] **Membership tiers (§A4)** — `/membership` 6 tiers from config; each "Buy Now" → external recurring-billing URL placeholder; $0 tier → on-site registration + booking.
- [ ] **Letters per-gift guidance (§C1)** — "$20–50 per child" on submit + adopt; store as editable copy.

**Data model:** `gallery_media`, `donations`, `partners` (+ RLS). **Storage:** `gallery` (public). **Acceptance:** each page renders with real data + degrades gracefully pre-Supabase; forms store leads; Lighthouse ≥ 90.

---

## Phase 3 — Letters family account (§C2) `~1–2 days`

Builds on Phase 1.

- [ ] Keep submission possible **without** an account; offer optional "create an account to track your letter."
- [ ] Associate `santa_letters` rows to `profiles.id` via nullable `guardian_user_id`; **"My letters"** view shows status + any "needs edits" note.
- [ ] Privacy invariant preserved: family sees only their own rows; `public_letters` unchanged.

**Data model:** `santa_letters.guardian_user_id` (FK, nullable) + RLS. **Acceptance:** a guardian with an account sees only their letters and their statuses.

---

## Phase 4 — Frontend/copy parity (§E) + media pass (§F) `~3–5 days`

Land copy + imagery together per page.

- [ ] Rebuild **nav/IA** with dropdowns + sub-tabs (§E1); promote Donate; add Membership/Gallery; "Gladiators NYC" dropdown → In-Person + Online.
- [ ] Restore verbatim live-site copy: mission statement, "The Gift of Martial Arts™", Classes section + free promise, bootcamp blurb, app promo, founder bio, partners roster, donate headline + tax guidance, membership tier copy, Letters privacy line (§E2–E8).
- [ ] **Media pass (§F):** delete current `public/images/` set; repopulate every slot from `asset-library/` (inspect each asset; no duplicates; optimize to webp; accurate alt). Video via YouTube/Vimeo embeds, not raw clips.
- [ ] Resolve **E0 discrepancies with Damion first** (founding year 2015 vs 2016; founder bio framing).

**Acceptance:** copy/IA match the live site "to a T" minus excluded items (mailing address, Shop nav); no image reused across photo slots; alt text accurate.

---

## Phase 5 — Training tracker (§B3) `~4–6 weeks` ⭐ the big build

The Gladiators free-program backend, gated by `participant`/`instructor`/`admin`. Provision the training tables in this Supabase project. Build in sub-phases:

**5a. Booking & waiver**
- [ ] Class browse/register tied to account; capacity enforcement; cancellations + late-cancel/no-show tracking (no auto XP penalties in v1).
- [ ] One-time digital **liability waiver** + **media/photo consent** — immutable signed records (version, full text, name/DOB, guardian if <18, typed signature, metadata, generated PDF); re-sign on material change only. Private `waivers` bucket.
- [ ] Active waiver required to register; booking confirmation in-app. `[stretch]` email confirmation (Resend).

**5b. Instructor check-in**
- [ ] Instructor role opens a session, sees roster, marks check-ins (instructor-initiated only); timestamped; veteran-status flag; triggers configured XP award.

**5c. XP & gamification engine**
- [ ] Admin-editable `xp_config` (values/levels/thresholds/rewards — never hardcoded); Fighter + Instructor paths; long growth curve; badges per level. XP can make a participant *eligible to request* a privilege but **never auto-grants** safety-sensitive access.

**5d. Participant dashboard** (`/account`)
- [ ] Current XP/level, progress to next unlock, attendance history, badges, **armor-rental eligibility status** (computed here), veteran indicator.

**5e. Training video drop (S&C)**
- [ ] Instructor/admin upload to private `training-videos` bucket; per-video metadata; edit/replace/delete; surface on `/online`.

**5f. Training admin** (`/admin`)
- [ ] Class CRUD; XP config; certify milestones/unlocks; view participants (XP/attendance/veteran); **CSV grant export**; manage videos.

**Data model:** `classes`, `registrations`, `checkins`, `xp_config`, `xp_events`, `levels`/`badges`, `waivers`, `media_consents`, `training_videos` (+ RLS: owners read own; instructors read rosters; admin elevated). **Storage:** private `waivers`, `training-videos`. **Acceptance:** a participant can register → sign waiver → get checked in → earn XP → see the dashboard; instructor sees rosters; admin configures XP + exports CSV; safety-gating verified.

> **Blockers (from Damion before 5a):** final waiver text + retention policy, class schedule/structure/prereqs, XP values/thresholds, cancellation policy, minors decision (18+ assumed; co-sign flow if minors accepted).

---

## Phase 6 — Commercial cross-links (§B3 carve-out) `~0.5 day`

- [ ] Wire **Shop** + **Armory** buttons to the `gladiators.nyc` URLs (manual, placeholders until provided — not env vars per Plan v2 §D5).
- [ ] Surface **armor-rental eligibility** (from XP + certification) on the dashboard; decide how the flag reaches the commercial Armory (API / shared identity / manual) — open question.

---

## Phase 7 — SEO/AEO hardening + cutover prep `~2–3 days`

- [ ] Per-class `Course`/`Event` + `offers` ($0) + `potentialAction`/`ReserveAction` → on-site booking URLs (now real).
- [ ] `Organization` entity finalized; NAP consistency (Manhattanville location) + Google Business Profile.
- [ ] `sitemap.xml`, `robots.txt`, `llms.txt`; allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) after `noindex` lifts.
- [ ] Metadata parity; Lighthouse ≥ 90.
- [ ] Run the **Public Cutover checklist** (ROLLOUT.md): URL map, 301s, Google Ads destinations, GA4/GTM, DNS — with Nicolas.

---

## Cross-cutting

**Data model additions (this Supabase project), by phase**

| Table / change | Phase |
| --- | --- |
| `gallery_media`, `donations`, `partners` | 2 |
| `santa_letters.guardian_user_id` | 3 |
| `classes`, `registrations`, `checkins`, `xp_config`, `xp_events`, `levels`/`badges`, `waivers`, `media_consents`, `training_videos` | 5 |
| Storage buckets: `gallery` (public), `waivers` + `training-videos` (private) | 2 / 5 |
| `groups`/`group_posts` (only if §A6 greenlit) | optional |

> `armor_inventory` / `armor_rentals` + the merch store stay on `gladiators.nyc` (commercial) — not this project.

**Testing:** extend Playwright `e2e/` beyond the Letters flow to cover auth, booking → waiver → check-in → XP, and admin config once Phase 5 lands. `npm run lint && npx tsc --noEmit && npm run build` before every commit.

**Manual/client dependencies (track in [SETUP-TODO.md](./SETUP-TODO.md)):**
- Donation/membership processor URLs; `gladiators.nyc` Shop/Armory URLs (manual, not env vars).
- Final consent/terms + waiver text; XP values/thresholds; class schedule/prereqs; partner logos; founder headshot/bio + founding year.
- Historical participant/attendance import (Wix tracks basic attendance only).

## Open decisions

- **Groups (§A6):** rebuild vs. drop for social links? (Recommend drop/defer.)
- **Minors:** 18+ assumed; guardian co-sign flow if minors accepted.
- **Armor eligibility hand-off:** how the eligibility flag (computed here) reaches the commercial Armory.
- **Spin-off caveat:** if Gladiators ever becomes a separate (for-profit) entity, revisit — the consolidate-now/301-later path keeps that option open without sacrificing authority today.

---

*Columbia Software Solutions · execution plan for the one-site build (see [plan-v2.md](./plan-v2.md) for scope).*
