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
