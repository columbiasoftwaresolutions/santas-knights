# Changelog

Shared log of changes during the Wix → Next.js transition, maintained for **Nicolas** (SEO / marketing / Google Ads / site changes) and the build team.

**Purpose:** track *what* changed, *when*, *where*, and *how it affects* the public site, analytics, ads, SEO, and UX — so any shift in user engagement can be attributed to a specific change.

> **The rule:** No public-facing change ships — on **Wix** or the **new site** — without an entry here **and** a heads-up to Nicolas. Record baseline metrics before mirroring a change so deltas are attributable. See [ROLLOUT.md](./ROLLOUT.md) for the full strategy.

---

## How to add an entry

Add a row to the table for the relevant month. Keep entries one line where possible; use the Notes column for links (PR, Wix page, screenshot, metric snapshot).

**Legend**

- **Where:** `Wix` (live production) · `Beta` (new stack, noindex) · `New` (new site, public after cutover) · `Both` (mirrored on Wix + new)
- **Type:** `Content` · `Layout/UX` · `SEO` · `Ads` · `Analytics` · `Feature` · `Infra`
- **Impact:** expected effect on **SEO / Ads / Analytics / UX** — note "none" explicitly when there's no public exposure (e.g. beta-only).
- **Owner:** who made the change.

---

## 2026-06

| Date | Change | Where | Type | Impact (SEO / Ads / Analytics / UX) | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-06-06 | Repo initialized; README, ROLLOUT, CHANGELOG added | Beta | Infra | None — internal, no public exposure | CSS | Project kickoff |
| 2026-06-07 | Add CLAUDE.md (commit workflow + conventions) and REQUIREMENTS.md (full scope by stage); add S&C training-video-drop feature | Beta | Infra | None — internal, no public exposure | CSS | Planning docs |
| 2026-06-08 | Site architecture decision: santasknights.org is the primary hub for both Gladiators & Letters to Santa; gladiators.nyc redirects in. README/REQUIREMENTS/ROLLOUT updated; docs moved to docs/ | Beta | Infra | None yet — informs redirect/SEO plan at cutover | CSS | Affects future 301 mapping (coordinate w/ Nicolas) |
| 2026-06-08 | Add DESIGN.md (Stitch design-md format) derived from the home mock | Beta | Infra | None — internal | CSS | Design tokens / brand spec |
| 2026-06-08 | Scaffold Next.js 16 + Tailwind v4 app; build Santa's Knights homepage (9 sections, component library, tokens wired to theme) | Beta | Feature | None — beta, noindex, not public | CSS | First app code; build passes, verified locally |
| 2026-06-08 | Add Vercel beta deploy link to README.md and CLAUDE.md | Beta | Infra | None — internal doc link | CSS | https://santas-knights.vercel.app/ |
| 2026-06-09 | Architecture deepening: complete design-token seam (spacing/elevation/type scale in @theme); add SectionHeading, Card, Arrow modules; refactor sections to use them | Beta | Infra | None — internal refactor, homepage renders unchanged | CSS | No visual regression; build + lint pass |
| 2026-06-09 | Add real imagery: organize asset-library/ (press, armory, icons, site-files); place hero, Gladiators pillar/teaser photos + 7 press logos on homepage; add Photo component | Beta | Content | None — beta only; replaces homepage placeholders with real photos | CSS | Pillar 2 + Letters stay placeholders (no matching photo) |
| 2026-06-10 | Build About, Contact, and Get Involved pages (real routes); add PageHero + ContactForm components + founder headshot; populate content/site.ts with researched org/founder details (Damion DiGrazia bio, mission, programs, volunteer roles, FAQ); repoint nav/footer to real routes; correct email to contact@santasknights.org; embed Google Map on Contact | Beta | Feature | None — beta, noindex, not public | CSS | Details researched from santasknights.org, gladiators.nyc, CBS NY, Gothamist; build + interaction verified locally |
| 2026-06-10 | Reposition the site around Santa's Letters and overview: expand the Letters homepage section into a how-it-works + Operation Santa origin (founder Damion did USPS Operation Santa as a kid); add Operation Santa to the About story/founder; reframe training (Gladiators NYC) as a separate site throughout; reorder homepage to lead with Letters; rewrite copy across all pages + nav/footer in a plain human voice | Beta | Content | None — beta, noindex, not public | CSS | Per owner direction (separate training site coming); Operation Santa facts verified via USPS; build + console verified locally |
| 2026-06-12 | Wire the Supabase backend: Letters to Santa flow (submit → moderate → swipe-to-give → fulfill), admin dashboard + auth gate, donate/sponsors/links pages, engagement + letter server actions, and the RLS schema migration (0001_init); adopt Supabase's new publishable/secret API keys (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY`, replacing the legacy anon/service_role env names) | Beta | Feature | None — beta, noindex, not public; backend stays degraded until env vars are set | CSS | Build + typecheck pass locally; schema applied to Supabase separately |
| 2026-06-15 | Make CLAUDE.md the DB-schema source of truth (full schema + repo-layout/current-state notes) and delete `supabase/migrations/0001_init.sql`; rewire its references in README, `.env.example`, admin UI notice, and SETUP-TODO; add Playwright + `e2e/` Letters-flow scripts (outputs gitignored); remove obsolete `_stage1-design-brief.md` | Beta | Infra | None — internal, no public exposure | CSS | Schema now in CLAUDE.md → Database schema; typecheck passes |
| 2026-06-19 | Port the approved poster design across the full beta site; add account, gallery, membership, training, and online routes; reskin Letters and admin flows; reorganize source assets; rewrite public copy in a direct editorial voice; add legacy Supabase gift-link compatibility | Beta | Layout/UX | None, beta remains noindex; UX: consistent visual system, clearer copy, responsive routes, and verified Letters workflow | CSS | Lint, typecheck, production build, route smoke test, desktop/mobile review, and full Supabase E2E passed |
| 2026-06-21 | Simplify the site header by removing the brand tagline and duplicate Donate navigation link | Beta | Layout/UX | None, beta remains noindex; UX: less crowded header with one clear Donate action | CSS | Lint passed |
| 2026-06-21 | Rename the Santa's Knights navbar dropdown to About without changing its links | Beta | Content | None, beta remains noindex; UX: clearer navigation label | CSS | Lint passed |
| 2026-06-21 | Reverse the site-split decision in all docs: the whole nonprofit — including the **full Gladiators free program (content + training tracker)** — now lives on santasknights.org; only the commercial Shop + Armory stay on gladiators.nyc. Updated CLAUDE/README/plan-v2/REQUIREMENTS/GLADIATORS-SITE/ROLLOUT/SETUP-TODO/DESIGN/REDESIGN-PORT-PLAN; added docs/EXECUTION-PLAN.md (phased build plan) | Beta | Infra | None — internal docs, no public exposure; informs future architecture, SEO consolidation, and 301/redirect plan at cutover | CSS | Docs-only; app code unchanged. Affects future cross-link/redirect mapping (coordinate w/ Nicolas) |
| 2026-06-21 | Execution-Plan Phase 0 (consolidation): bring the Gladiators NYC program on-site in code. Rename the nav dropdown Classes → Gladiators NYC; replace the single outbound training link with internal per-class pages at /training/[slug] (6 classes); flip all "booking lives on a separate training site" copy (home, /training, /online, /about, /account, /contact, footer) to on-site with booking "coming soon"; reserve SHOP_HREF/ARMORY_HREF for the gladiators.nyc commercial Shop/Armory only; add sitewide Organization (NGO) JSON-LD + per-class Course schema stubs (price $0) | Beta | SEO | None now — beta stays noindex; at cutover: consolidates training authority onto the Ad-Grant domain, adds 6 indexable per-class URLs + Organization/Course structured data, removes external-site handoff | CSS | Lint + typecheck + production build pass; runtime smoke test (nav label, JSON-LD present, /training/[slug] 200, bad slug 404, no external-site copy in served HTML). Booking backend lands in Phase 5 |
| 2026-06-25 | Account model + Letters tracking: **single email+password account** for every role (drop magic-link); gate letter submission behind an account and link letters to the guardian (`guardian_user_id`); add /account "My letters" dashboard via the `my_letters` view | Beta | Feature | None — beta stays noindex, not public | CSS | E2E (DB/RLS + full-stack UI) pass; superseded the magic-link draft in ACCOUNT-MODEL.md |
| 2026-06-26 | Build the **full Gladiators training tracker** — class booking with atomic capacity enforcement, one-time liability waiver + media-consent records, instructor check-in, admin-editable XP/levels/badges, participant dashboard, members-only S&C video library, training admin + **grant CSV export**; wire **/gallery, /sponsors, /donate** to Supabase (gallery_media / partners / donations) with admin CRUD + role management; apply the training schema to beta (family_members, classes, registrations, checkins, waivers, media_consents, xp_config/xp_events, levels, badges, training_videos, private buckets, capacity trigger); update ACCOUNT-MODEL.md + CLAUDE.md schema | Beta | Feature | None — beta stays noindex, not public | CSS | tsc + lint + prod build green; **42/42 E2E pass** (training-tracker 17, account-letters 15, account-submit-ui 10) vs local prod build + real beta DB; security-review clean; principal-review findings fixed (role-demotion, atomic capacity, RLS/migration completeness, admin-lockout guard). Waiver text is placeholder pending Damion |
| 2026-06-26 | Gate **adopt-a-letter** behind a free account (reverses the guest-first donor model): `/letters/give` shows a sign-in card to logged-out visitors; reconcile the now-stale "no account needed" copy on the submit/letters/account pages and in ACCOUNT-MODEL.md | Beta | Layout/UX | None — beta stays noindex, not public | CSS | tsc + lint + build green; logged-out gate + logged-in deck verified live |
| 2026-06-26 | **Unified login + gift claim/track.** One sign-in form for everyone (`/account/login`), role decides the landing (admin→/admin, member→/account); retire /admin/login. Adopting now **records a claim** in Supabase (new `claimed` letter state + `claimed_at` + `my_gifts` view): "Gift this" claims a letter atomically, drops it from the public pool, with a self-dealing guard; members get action cards + "Gifts I'm sending"; admins get **Gifts** (pipeline) + **Signups** (rosters) monitors. Adopt-gate button copy → "Log in to gift a kid". | Beta | Feature | None — beta stays noindex, not public | CSS | tsc + lint + prod build green; **53/53 E2E pass** (gift-and-login 11, training-tracker 17, account-submit-ui 10, account-letters 15) vs local prod build + real beta DB. Provisioned beta accounts: 1 admin (Damion) + 3 member test accounts |
| _e.g._ 2026-06-XX | _Consolidate social/stream links on Links page_ | Both | Content | _SEO: neutral · Ads: none · Analytics: track click-through delta · UX: fewer dead links_ | Nicolas | _Baseline recorded first; mirror on Wix, then build on new site_ |

<!--
Copy this row to add an entry:
| YYYY-MM-DD | <what changed> | Wix/Beta/New/Both | Content/Layout/SEO/Ads/Analytics/Feature/Infra | SEO: … · Ads: … · Analytics: … · UX: … | <owner> | <links/notes> |
-->

---

## Pre-cutover baselines

Record before the first Track B (Wix-mirrored) change, so engagement shifts are attributable. _(To be filled in with Nicolas.)_

| Metric | Baseline | Date recorded | Source |
| --- | --- | --- | --- |
| Sessions / mo | _TBD_ | | GA4 |
| Organic clicks / mo | _TBD_ | | Search Console |
| Top landing pages | _TBD_ | | GA4 |
| Active Google Ads destinations | _TBD_ | | Google Ads |
| Core Web Vitals / Lighthouse | _TBD_ | | PageSpeed / Lighthouse |
