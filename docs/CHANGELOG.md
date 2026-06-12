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
