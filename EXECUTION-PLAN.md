# Execution Plan — building the one-site Santa's Knights platform

**Status:** active · the *how/when* for the scope defined in [plan-v2.md](./plan-v2.md).

This plan turns the **revised split** into an ordered build for **this repo**. `santasknights.org` ships the nonprofit pages, Letters, **and the Gladiators *content* pages** (class catalog + descriptions, `/online` embeds, team, media, events, founder, brand copy) — the free-class landing pages on the Ad-Grant-eligible domain. The **operational training tracker** (booking, waivers, check-in, XP, dashboards, video management, training admin) **and** the commercial **Shop + Armory** are built on the separate **`gladiators.nyc`** site (a distinct workstream, built soon), which this site **cross-links out** to — class **Book Now** CTAs, shop, and armor rentals all link there. **Identity is shared:** one login across both sites (single Supabase Auth + `profiles` + `app_role`).

- **Scope source of truth:** [plan-v2.md](./plan-v2.md) (§A nonprofit gaps · §B Gladiators · §C Letters · §E copy/IA · §F media). [REQUIREMENTS.md](./REQUIREMENTS.md) is authoritative for *what each feature does*. GLADIATORS-SITE.md (gladiators-nyc repo) specs the training tracker + commercial companion (built on `gladiators.nyc`).
- **Ship discipline:** [ROLLOUT.md](./ROLLOUT.md) — beta stays `noindex`; public cutover is a separate, Nicolas-coordinated event. Commit/push only on request; CHANGELOG row written from the diff at commit time.

## Guiding principles

1. **This repo is the content/marketing site + Letters; the tracker is a separate site.** Ship the content/marketing site, gallery, donate, membership, and Letters improvements here. The Gladiators **operational tracker** (booking, waiver, check-in, XP, dashboards, videos, admin) is **not** in this repo's plan — it's a separate **`gladiators.nyc`** workstream, sequenced on that site's own timeline against the shared identity.
2. **One shared identity across both sites.** Email + password, one login (single Supabase Auth + `profiles` + `app_role`). `public`/`admin` cover the nonprofit/Letters side here; `participant`/`instructor` gate the operational app on `gladiators.nyc`, which **shares this identity**. A donor who is also a participant is one account. (Whether the two apps share one Supabase project or a separate project + shared identity provider is an open decision, below.)
3. **SEO/AEO consolidation is a feature, not an afterthought.** Per-class URLs, `Course`/`Event`/`ReserveAction` + `Organization` schema, NAP consistency, and crawler policy are built in (Phase 0 + Phase 7), because the free-class pages must rank and be agent-bookable on the Ad-Grant-eligible domain.
4. **Payments stay external.** Amazon (gifts), PayPal/Venmo (donate/membership), Eventbrite (tickets), external store (shop). No on-site card processing.
5. **Safety/privacy invariants never bend.** Child identifying data never public (Letters); XP never auto-grants safety-sensitive access; waivers immutable; `SUPABASE_SECRET_KEY` server-only.

---

## Phase 0 — Consolidation (the cheap win) `~0.5–1 day`

Make the one-site decision real in code, before any new backend. Low risk, high clarity.

- [ ] Rename nav **"Classes" → "Gladiators NYC"** (`content/site.ts` nav config); point at the on-site program section.
- [ ] **Replace the single outbound `TRAINING_HREF`** with internal per-class routes: `/training` hub + `/training/[slug]` per class (Bootcamp, Armored Practice, Women's, Women's Midtown, Veterans, Fundamentals). Fixes the lossy "all six → one generic URL" handoff and unblocks per-class schema. These are **content** pages; each class's **Book Now** CTA links **out to `gladiators.nyc`** (per-class deep-link, placeholder until that site is live).
- [ ] **Keep the "booking lives elsewhere" framing** in `/training`, `/online`, `components/layout/Footer.tsx`, and the links page — booking runs on `gladiators.nyc`; the class pages' **Book Now** CTAs link out there (placeholder until the site is live).
- [ ] Add **`Organization` schema** (Santa's Knights; Gladiators NYC as the program brand; `sameAs` Instagram/Facebook/press) and per-class **`Course` stubs** (price $0). Each stub's `potentialAction`/booking URL points to `gladiators.nyc` (placeholder).
- [ ] Reserve the `gladiators.nyc` cross-link var for the **whole Gladiators operational site** — class booking + tracker (participant dashboard, instructor check-in) **and** the commercial Shop/Armory.

**Acceptance:** site presents a coherent "Gladiators NYC" **content** section with per-class pages; each class's **Book Now** CTA links out to `gladiators.nyc` (placeholder); `npm run lint && npx tsc --noEmit && npm run build` pass.

---

## Phase 1 — Foundation: role-aware auth + member accounts (§A1) `~2–3 days`

Unblocks family letter-tracking (Phase 3) and gives `gladiators.nyc` a **shared identity** to build its participant/instructor experience against.

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
- [ ] **Membership tiers (§A4)** — `/membership` 6 tiers from config; each "Buy Now" → external recurring-billing URL placeholder; $0 tier → on-site account registration (booking links out to `gladiators.nyc`).
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

## Phase 5 — Training tracker (§B3) — ⛳ NOT in this repo · built on `gladiators.nyc`

**Off-repo / separate site / separate plan.** The Gladiators operational tracker is **not a phase in this repo's execution plan**. It is built on the separate **`gladiators.nyc`** site as its own workstream, gated by `participant`/`instructor`/`admin` roles **against the shared identity** (Phase 1). Its tables and private buckets (`waivers`, `training-videos`) are **provisioned and operated by `gladiators.nyc`**, not this project. This repo's only tracker-related work is the class-page **Book Now** cross-links (Phase 0 + Phase 6).

The sub-phase outline below is retained **as a reference for the `gladiators.nyc` build** — it is not scheduled or built here.

**5a. Booking & waiver** *(gladiators.nyc)*
- [ ] Class browse/register tied to account; capacity enforcement; cancellations + late-cancel/no-show tracking (no auto XP penalties in v1).
- [ ] One-time digital **liability waiver** + **media/photo consent** — immutable signed records (version, full text, name/DOB, guardian if <18, typed signature, metadata, generated PDF); re-sign on material change only. Private `waivers` bucket.
- [ ] Active waiver required to register; booking confirmation in-app. `[stretch]` email confirmation (Resend).

**5b. Instructor check-in** *(gladiators.nyc)*
- [ ] Instructor role opens a session, sees roster, marks check-ins (instructor-initiated only); timestamped; veteran-status flag; triggers configured XP award.

**5c. XP & gamification engine** *(gladiators.nyc)*
- [ ] Admin-editable `xp_config` (values/levels/thresholds/rewards — never hardcoded); Fighter + Instructor paths; long growth curve; badges per level. XP can make a participant *eligible to request* a privilege but **never auto-grants** safety-sensitive access.

**5d. Participant dashboard** *(gladiators.nyc)*
- [ ] Current XP/level, progress to next unlock, attendance history, badges, **armor-rental eligibility status** (computed on `gladiators.nyc`), veteran indicator. This repo's `/account` links out to it for signed-in participants.

**5e. Training video drop (S&C)** *(gladiators.nyc)*
- [ ] Instructor/admin upload to private `training-videos` bucket; per-video metadata; edit/replace/delete; surface on the `gladiators.nyc` dashboard. (Only public embeds render here, on `/online`.)

**5f. Training admin** *(gladiators.nyc)*
- [ ] Class CRUD; XP config; certify milestones/unlocks; view participants (XP/attendance/veteran); **CSV grant export**; manage videos.

**Data model (operated by `gladiators.nyc`, not this project):** `classes`, `registrations`, `checkins`, `xp_config`, `xp_events`, `levels`/`badges`, `waivers`, `media_consents`, `training_videos` (+ RLS keyed off the shared `profiles`). **Storage:** private `waivers`, `training-videos`. **Acceptance (on `gladiators.nyc`):** a participant can register → sign waiver → get checked in → earn XP → see the dashboard; instructor sees rosters; admin configures XP + exports CSV; safety-gating verified.

> **Blockers for the `gladiators.nyc` build (from Damion before 5a):** final waiver text + retention policy, class schedule/structure/prereqs, XP values/thresholds, cancellation policy, minors decision (18+ assumed; co-sign flow if minors accepted).

---

## Phase 6 — Cross-links out to `gladiators.nyc` (operational + commercial) `~0.5 day`

Wire every hand-off from this site to the Gladiators operational/commercial site. All URLs are **manual placeholders** until provided — not env vars (Plan v2 §D5).

- [ ] **Operational:** class **Book Now** / booking (per-class deep-links), **participant dashboard**, **instructor check-in** → `gladiators.nyc`.
- [ ] **Commercial:** **Shop** + **Armory** buttons → `gladiators.nyc`.
- [ ] **Armor-rental eligibility** is computed **on `gladiators.nyc`** (from XP + certification, which live there) and surfaced on its dashboard/Armory — this site just links out. No cross-boundary eligibility hand-off to build here.

---

## Phase 7 — SEO/AEO hardening + cutover prep `~2–3 days`

- [ ] Per-class `Course`/`Event` + `offers` ($0) + `potentialAction`/`ReserveAction` → `gladiators.nyc` booking URLs (real per-class deep-links once that site is live).
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
| `family_members` (guardian-owned; also referenced by the tracker via shared identity) | 1 / 3 |
| `santa_letters.guardian_user_id` | 3 |
| Storage bucket: `gallery` (public) | 2 |
| `groups`/`group_posts` (only if §A6 greenlit) | optional |

> **Operated by `gladiators.nyc`, not this project:** the training-tracker tables (`classes`, `registrations`, `checkins`, `xp_config`, `xp_events`, `levels`/`badges`, `waivers`, `media_consents`, `training_videos`) + their private buckets (`waivers`, `training-videos`), **and** the commercial `armor_inventory` / `armor_rentals` + merch store. Because identity is shared, those tables key their user off the same `profiles`; whether they physically live in this Supabase project or a separate one is an open decision (below). This repo provisions only the nonprofit/Letters tables.

**Testing:** extend Playwright `e2e/` beyond the Letters flow to cover **auth + member accounts** here. (The booking → waiver → check-in → XP flow is `gladiators.nyc`'s test scope, not this repo's.) `npm run lint && npx tsc --noEmit && npm run build` before every commit.

**Manual/client dependencies (track in [SETUP-TODO.md](./SETUP-TODO.md)):**
- Donation/membership processor URLs; `gladiators.nyc` cross-link URLs — class **booking** + participant dashboard + instructor check-in **and** Shop/Armory (manual, not env vars).
- Partner logos; founder headshot/bio + founding year; final consent/terms for the Letters/donate side.
- Waiver text, XP values/thresholds, class schedule/prereqs, and historical participant/attendance import are `gladiators.nyc` dependencies (tracker off-repo).

## Open decisions

- **Shared-identity mechanics:** the two sites share one login (Phase 1) — but *how*? Same Supabase project (the `gladiators.nyc` app reads/writes the shared `profiles` + training tables) vs. a separate project with a shared identity provider / SSO. Decide before the `gladiators.nyc` build starts.
- **Groups (§A6):** rebuild vs. drop for social links? (Recommend drop/defer.)
- **Minors:** 18+ assumed; guardian co-sign flow if minors accepted (a `gladiators.nyc` concern).
- **Spin-off caveat:** with the operational program and commerce now living on `gladiators.nyc`, this matters more — if Gladiators ever becomes a separate (for-profit) entity, the shared-identity and cross-link boundaries drawn here keep the nonprofit content authority on `santasknights.org` intact while the two sites can cleanly diverge.

---

*Columbia Software Solutions · execution plan for the one-site build (see [plan-v2.md](./plan-v2.md) for scope).*
