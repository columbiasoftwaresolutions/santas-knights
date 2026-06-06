# Rollout & Sequencing Plan

How we move The Armored League off Wix **without a sudden switch**. This plan separates *building* from *launching*, ships value in discrete low-risk pieces, and keeps Nicolas (SEO / marketing / Google Ads / site changes) coordinated at every public-facing step.

> **Core principle: build ≠ cutover.** The new Next.js + Supabase platform is built and tested in a private beta environment while the live Wix site stays the public face. Nothing public changes without a logged entry ([CHANGELOG.md](./CHANGELOG.md)) and a heads-up to Nicolas.

---

## Two parallel tracks

We run two tracks at once. They have different risk profiles and different audiences.

### Track A — Background beta build (functional pieces)

Built fresh on the new stack, gated and `noindex`. No public SEO/ads/analytics exposure. Used internally by staff, instructors, and participants before anything launches.

**Sequence (discrete, low-risk first):**

1. **Waiver capture** — standalone, immediate operational value, validates the Supabase + Auth + Storage foundation. No public-site dependency.
2. **Training tracker** — booking, instructor check-in, XP engine, participant dashboard. Internal beta for participants/instructors.
3. **Santa's Letters** — public-facing, launched on its own timeline (mind the **Nov–Dec seasonal spike**).
4. **Public marketing site** — built in parallel, but its **public cutover is the last, coordinated step** (see [Public Cutover](#public-cutover-the-coordinated-event)), not an early deliverable.

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

**Separate domains** — The Armored League and Santa's Knights live on different domains, so each gets its own beta subdomain and its own cutover:

| Property | Production (Wix) | Beta (new stack) |
| --- | --- | --- |
| The Armored League | `<armored-league-domain>` *(TBD)* | `beta.<armored-league-domain>` |
| Santa's Knights / Letters | `<santas-knights-domain>` *(TBD)* | `beta.<santas-knights-domain>` |

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
