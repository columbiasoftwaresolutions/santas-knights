# Rollout & Sequencing Plan

How we move The Armored League off Wix **without a sudden switch**. This plan separates *building* from *launching*, ships value in discrete low-risk pieces, and keeps Nicolas (SEO / marketing / Google Ads / site changes) coordinated at every public-facing step.

> **Core principle: build ≠ cutover.** The new Next.js + Supabase platform is built and tested in a private beta environment while the live Wix site stays the public face. Nothing public changes without a logged entry ([CHANGELOG.md](./CHANGELOG.md)) and a heads-up to Nicolas.

---

## Two parallel tracks

We run two tracks at once. They have different risk profiles and different audiences.

### Track A — Background beta build (functional pieces)

Built fresh on the new stack, gated and `noindex`. No public SEO/ads/analytics exposure. Used internally by staff, instructors, and participants before anything launches.

**Sequence (discrete, low-risk first):**

1. **Member accounts + Letters family tracking** — validates the Supabase + Auth + Storage foundation on this repo. No public-site dependency.
2. **Santa's Letters** — public-facing, launched on its own timeline (mind the **Nov–Dec seasonal spike**).
3. **Public marketing site** (incl. Gladiators program pages, gallery, donate/membership, partners) — built in parallel, but its **public cutover is the last, coordinated step** (see [Public Cutover](#public-cutover-the-coordinated-event)), not an early deliverable.
4. **Training tracker** (booking + waiver, check-in, XP, participant dashboard, training videos, training admin) — **built here**, gated behind `participant`/`instructor` roles ([GLADIATORS-SITE.md](./GLADIATORS-SITE.md)). The heaviest chunk; sequence it after the public-site content lands.

> **Only the commercial Shop & Armory are a separate `gladiators.nyc` workstream** ([GLADIATORS-SITE.md](./GLADIATORS-SITE.md#commercial-companion-gladiatorsnyc)), not this repo. This site **cross-links out** to them for purchases/rentals.

### Track B — Public mirroring on Wix (content changes)

To track engagement cleanly, public-facing changes that *will* appear on the new site are **mirrored as minor edits on the live Wix site first**, starting with whatever is **cheapest to replicate in Wix**. This lets Nicolas baseline metrics and attribute any engagement shift to a specific, logged change.

**Start with the easiest-to-mirror Wix edits** (low effort, low risk):

- Links page consolidation (social/stream links)
- Newsletter signup placement
- Social links / hero CTA copy
- Sponsor logo grid
- Contact routing

> **Why this order:** the waiver/tracker have no Wix equivalent to mirror, so they belong in Track A. Track B intentionally starts with content/layout tweaks Wix can do in minutes — keeping the async mirroring cheap and the analytics attribution clean. Every Track B change is logged in [CHANGELOG.md](./CHANGELOG.md) with its Wix + new-site status.

---

## Environments

| Environment | Purpose | Indexing |
| --- | --- | --- |
| **Production (Wix)** | Current public sites — stay live until cutover | Indexed (live) |
| **Beta (new stack)** | New platform build + QA, gated behind auth/password | **`noindex`, `robots: disallow`** |
| **Preview (Vercel)** | Per-PR preview deployments | `noindex` |

**One nonprofit site + a commercial companion** — under **Plan v2** ([plan-v2.md](./plan-v2.md)), `santasknights.org` (this repo) hosts the **whole nonprofit**: nonprofit pages, Letters to Santa, and the **full Gladiators free program** (class content + training tracker — booking, waiver, check-in, XP, dashboard, videos). `gladiators.nyc` is a **separate site** for the **commercial Shop & Armory only**, kept off the nonprofit domain. The two **cross-link**; only commercial actions (shop/rentals) link out.

| Domain | Role | Production (Wix) | Beta (new stack) |
| --- | --- | --- | --- |
| `santasknights.org` | Nonprofit + Letters + Gladiators free program (content + tracker) | Live | `beta.santasknights.org` |
| `gladiators.nyc` | Commercial Shop + Armory (**separate site/codebase**) | Live (currently standalone) | separate commercial deployment/cutover |

> Both sites migrate off Wix on **separate cutovers**. Consolidating the free program on `santasknights.org` keeps the free-class landing pages on the Ad-Grant-eligible domain and consolidates SEO authority — use per-class URLs + `Course`/`Event` schema. Coordinate any `gladiators.nyc` redirects and cross-link targets with Nicolas so SEO/links and ad destinations are preserved.

> Beta **must stay `noindex`** until cutover so it never competes with the live Wix site in search or cannibalizes ad landing pages. Confirm `robots.txt` + `X-Robots-Tag` before sharing any beta link.

---

## Public Cutover (the coordinated event)

The public switch happens **per domain**, only after beta QA passes and Nicolas signs off. This is where SEO equity, live Google Ads destinations, and analytics history are at risk — so it's a checklist, not a deploy.

**Pre-cutover checklist (with Nicolas):**

- [ ] **URL map** — every live Wix URL → its new path documented.
- [ ] **301 redirects** — old → new for every changed URL, so rankings and inbound links carry over.
- [ ] **Google Ads** — every ad destination URL still resolves (or is updated in lockstep at cutover) to avoid broken links / disapprovals.
- [ ] **Analytics** — GA4 / GTM ported; conversion tracking and historical continuity confirmed.
- [ ] **Metadata parity** — titles, descriptions, OG/structured data match or improve on Wix.
- [ ] **`sitemap.xml`** generated and submitted; `robots.txt` switched to allow indexing.
- [ ] **Lighthouse ≥ 90** on the new public site.
- [ ] **DNS** cutover plan + low TTL set ahead of time.
- [ ] **CHANGELOG entry** drafted and Nicolas notified of the go-live window.

**Post-cutover:**

- [ ] Monitor Search Console for crawl/coverage errors and 404 spikes.
- [ ] Verify redirects resolve in the wild.
- [ ] Watch analytics + ad performance for regressions vs. the pre-cutover baseline.
- [ ] Keep Wix reachable (or fully redirected) until traffic/rankings stabilize.

---

## Coordination with Nicolas

Nicolas owns SEO, marketing, Google Ads, and site-related changes, and tracks how changes affect public site, analytics, ads, SEO, and UX.

- **Single source of truth:** [CHANGELOG.md](./CHANGELOG.md) in this repo (or a shared doc if he prefers — TBD pending his preference / GitHub username).
- **Rule:** no public-facing change ships — on Wix *or* the new site — without a CHANGELOG entry and a heads-up to Nicolas.
- **Baselines:** before any Track B mirroring, Nicolas records baseline engagement/SEO/ad metrics so deltas are attributable.

---

## Rollback

- **Beta:** purely internal — roll back by reverting the deploy; no public impact.
- **Track B (Wix edits):** Wix changes are small and reversible; revert the specific edit and log it.
- **Cutover:** keep Wix intact (not deleted) and DNS TTL low so we can repoint back quickly if a regression appears. Do not decommission Wix until post-cutover metrics are stable.

---

## Open items

- Confirm the two production domain names.
- Confirm Nicolas's preferred tracking tool (this repo's CHANGELOG vs. shared doc/sheet) + GitHub username.
- Confirm baseline metrics set with Nicolas before first Track B change.
- Sequence within Track B: confirm which Wix edit is genuinely lowest-effort to go first.
