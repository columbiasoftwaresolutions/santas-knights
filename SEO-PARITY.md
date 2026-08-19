# SEO parity & cutover map

What must exist on the new site before `santasknights.org` points at it, so rankings, inbound links, and Google Ads destinations survive the switch.

This fills in the first two lines of the ROLLOUT.md pre-cutover checklist ("URL map", "301 redirects") and audits the rest against what is actually in the repo.

**Everything below about the live site was verified against `www.santasknights.org` on 2026-08-13/14.** The raw sitemaps and a scrape of every page's title/description/canonical/OG are checked in under [`seo-baseline/`](./seo-baseline/) so we can diff against them later. Re-pull before cutover — Wix pages can be added without anyone telling us.

---

## 1. The old site's real URL surface

`https://www.santasknights.org/sitemap.xml` is an index with **four** children. The indexed surface is **~10,021 URLs**, not the dozen the page list suggests:

| Child sitemap | URLs | `lastmod` | What's in it |
| --- | --- | --- | --- |
| `pages-sitemap.xml` | 13 | 2025-11-10 | the hand-built pages |
| `group-posts-sitemap.xml` | **10,000** | 2026-06-24 | individual letter discussion posts |
| `booking-services-sitemap.xml` | 6 | **2026-07-24** | per-class booking pages |
| `group-lists-sitemap.xml` | 2 | 2025-10-21 | the two group discussion indexes |

> ⚠️ **10,000 is exactly Wix's per-sitemap cap**, so the true post count may be higher. Confirm the real total in Search Console (Coverage → Indexed) before cutover.

### 1a. The 13 pages

| # | Live URL | Live `<title>` | Notes |
| --- | --- | --- | --- |
| 1 | `/` | HOME \| Santa's Knights | canonical is `https://www.santasknights.org` (no trailing slash) |
| 2 | `/santas-knights` | SANTA'S KNIGHTS \| Santa's Knights | the About page |
| 3 | `/donate` | DONATE \| Santa's Knights | no meta description on the live page |
| 4 | `/contact` | CONTACT \| Santa's Knights | |
| 5 | `/gallery` | GALLERY \| Santa's Knights | |
| 6 | `/membership` | MEMBERSHIP \| Santa's Knights | h1s: "MEMBERSHIP", "Choose your pricing plan" |
| 7 | `/letters-to-santa` | LETTERS TO SANTA \| Santa's Knights 2024 Program | **the seasonal money page** |
| 8 | `/in-person` | CLASSES \| Santa's Knights | h1 "CLASSES WITH SANTA'S KNIGHTS!" — the free-class landing page |
| 9 | `/online` | Online \| Santa's Knights | no description, no h1 — thin page |
| 10 | `/members` | MEMBERS \| Santa's Knights | Wix Members area |
| 11 | `/groups` | Groupes \| Santa's Knights | Wix Groups feed. Title is **French** — a live bug worth not reproducing |
| 12 | `/amazon-wishlists` | Discussion - Letters with Amazon Wishlists \| … | self-canonicalises to `/group/letters-with-amazon-wishlists/discussion` |
| 13 | `/landing-page-2` | Landing Page \| Santa's Knights | ⚠️ almost certainly a Google Ads landing page — **ask Nicolas before touching** |
| +1 | `/classes` | — | **existing 301 → `/in-person`.** This redirect must be preserved too |
| +2 | `/home` | — | returns 200, not in the sitemap; duplicate of `/` |

### 1b. The 6 per-class booking pages

Indexed, on the nonprofit domain, and the **most recently updated part of the whole site**. Each maps 1:1 to a class in `content/site.ts`:

| Live URL | `content/site.ts` slug |
| --- | --- |
| `/service-page/gladiator-bootcamp-open-to-all-levels` | `bootcamp` |
| `/service-page/gladiator-armored-practice-advanced` | `armored-practice` |
| `/service-page/women-s-medieval-combat-fitness` | `womens-combat` |
| `/service-page/women-s-premium-combat-class-midtown` | `womens-midtown` |
| `/service-page/gladiators-nyc-for-military-veterans` | `veterans` |
| `/service-page/medieval-combat-fundamentals` | `fundamentals` |

### 1c. The ~10,002 group URLs

- `/group/letters-with-amazon-wishlists/discussion` + 10k `…/discussion/<uuid>` posts
- `/group/santas-knights-group/discussion` + posts

Host canonicalisation today: `http://*` → `https://*` → **`https://www.…` (www wins)**. Unknown URLs return a proper 404.

---

## 2. URL map: old → new

| Old URL | New path | Status | Action |
| --- | --- | --- | --- |
| `/` | `/` | ✅ exists | — |
| `/santas-knights` | `/santas-knights` | ✅ exists | — |
| `/donate` | `/donate` | ✅ exists | — |
| `/contact` | `/contact` | ✅ exists | — |
| `/gallery` | `/gallery` | ✅ exists | — |
| `/membership` | `/membership` | ✅ exists | — |
| `/letters-to-santa` | `/letters-to-santa` | ✅ **exists** — route renamed 2026-08-14 to keep the path | — |
| `/in-person` | ??? | ❌ 404 | needs a decision (§4) |
| `/classes` | ??? | ❌ 404 | 301 to wherever `/in-person` lands |
| `/service-page/*` (6) | ??? | ❌ 404 | needs a decision (§4) |
| `/online` | ??? | ❌ 404 | needs a decision (§4) |
| `/members` | `/members` | ✅ **exists** — route renamed 2026-08-14 to keep the path | — |
| `/groups`, `/amazon-wishlists` | ??? | ❌ 404 | 301 to `/letters-to-santa`, or 410 if the feature is dropped |
| `/group/*/discussion` (2) | ??? | ❌ 404 | 301 to `/letters-to-santa` |
| `/group/*/discussion/<uuid>` (~10k) | ??? | ❌ 404 | **bulk rule** — see §3 |
| `/landing-page-2` | ??? | ❌ 404 | **ask Nicolas first** — a live ad may point here |
| `/home` | `/` | ❌ 404 | 301 |

Meanwhile the repo has redirects for `/about`, `/get-involved`, and `/sponsors` — none of which have ever existed on the Wix site (all three 404 there today). They're new-site internal legacy, not old-site parity, and they don't buy anything at cutover.

---

## 3. The 10,000 letter posts

This is the biggest single cutover risk and it wasn't in the original plan. Ten thousand indexed URLs 404ing on the same day is precisely the "404 spike" ROLLOUT.md's post-cutover step says to watch for — except at that volume it's a site-health signal, not a blip.

Three options, in order of preference:

1. **One wildcard 301** — `/group/letters-with-amazon-wishlists/discussion/*` → `/letters-to-santa`. Cheap, keeps the crawler happy, consolidates any link equity onto the page we actually want ranking. Google will treat mass many-to-one redirects as soft-404s over time, but it survives the transition, which is what matters.
2. **410 Gone** — honest, and tells Google to drop them faster than a 404 does. Right choice *only* if we're sure none of them attract search traffic.
3. Rebuild them as real pages — almost certainly not worth it; they're user-generated forum posts holding children's letter details, which cuts against this repo's privacy invariant.

**Before choosing, pull the Search Console data**: if `/group/*` posts bring in negligible impressions, option 2 is cleaner. If they're a meaningful share of organic traffic, option 1. Nicolas has the account.

---

## 4. What the new site is missing outright

Verified against the repo and against the beta deploy (`santas-knights.vercel.app`).

| Gap | Evidence | Why it matters |
| --- | --- | --- |
| ~~No `robots.txt`~~ | **built 2026-08-14** — `app/robots.ts`, modelled on the Wix file; both states snapshotted in `seo-baseline/` | Driven by the single `INDEXABLE` switch in `content/site.ts`, which also drives the sitewide meta tag, so the file and the tag cannot disagree. |
| ~~No `sitemap.xml`~~ | **built 2026-08-14** — `app/sitemap.ts`, 7 canonical URLs, snapshot in `seo-baseline/new-site-sitemap.xml` | Still needs submitting in Search Console at cutover. Resolves against `SITE_URL`, now `www` (see the host row). |
| ~~No `metadataBase`~~ | **set 2026-08-16** — `app/layout.tsx`, pinned to `SITE_URL` | The canonical on `/` used to render literally as `<link rel="canonical" href="/">`, leaving Next to resolve it against `VERCEL_URL` — canonicals and OG URLs could point at a preview host. Now absolute: verified `<link rel="canonical" href="https://www.santasknights.org"/>` against a production build. |
| ~~Canonicals on 4 of ~11 pages~~ | **all 7 sitemap pages self-canonicalise as of 2026-08-16** — `/donate`, `/contact`, `/gallery`, `/membership` joined `/`, `/santas-knights`, `/letters-to-santa` (plus `/members`, which stays out of the sitemap) | Every live Wix page has a self-canonical, and losing them invites duplicate-content splits (`/home`, `?utm_*` and `?fbclid=` from ads and social, www vs apex). **Every URL in `sitemap.xml` now has a matching canonical tag** — verified against a production build — so the two can't disagree about which address is real. |
| **No `openGraph` anywhere** | grep for `openGraph` across `app/`, `components/`, `content/` → nothing | Every old page had an `og:image`. Shares from Facebook/Instagram are a real traffic source for this org; blank cards cost clicks. |
| **`google-site-verification` not carried over** | live tag is `WJCLm659hAv8-tVndWB0d2cJgaa0smJCFVIIj_RY1W8`; not in this repo | If it disappears at cutover, **Search Console verification breaks at exactly the moment you need it**. Better: verify by DNS TXT ahead of time, which survives any platform change. |
| **No analytics of any kind** | no `gtag`, GTM, GA4 ID, or `@vercel/analytics` in the repo | GA4/Ads/conversion tags need to ship *with* the cutover, not after. Wix injects its tags via its own loader, so the IDs have to come from Nicolas / the Wix dashboard — they aren't recoverable from the page source. |
| ~~`SITE_URL` is the apex, live canonical is www~~ | **decided 2026-08-16: `www` wins.** `SITE_URL` → `https://www.santasknights.org`; apex 308s to it via `next.config.mjs` | The incumbent host keeps its rankings and backlinks; nothing has to be re-earned at cutover. One constant now feeds the sitemap, the `Sitemap:` line in `robots.txt`, JSON-LD, and `metadataBase`, so they cannot drift apart. **Still needs the DNS/host half** — see §6. |
| **`courseSchema` defined but never rendered** | `content/site.ts` exports it; only `organizationSchema` is used, in `app/layout.tsx:87` | ROLLOUT.md's plan is per-class URLs + `Course`/`Event` schema on this domain. Neither the pages nor the schema exist. |
| **Redirects are 307, not 308** | `/sponsors`, `/get-involved`, `/training`, `/letters`, `/account` all use `redirect()` | Correct *for now* — nothing should cache a permanent redirect while Wix is live. But it has to flip at cutover, so it belongs on the checklist. |

---

## 5. Two decisions that need Damion + Nicolas

**(a) Where do the class pages live?**

The old site has **seven** indexed class URLs on the nonprofit domain: `/in-person` (title "CLASSES", h1 "CLASSES WITH SANTA'S KNIGHTS!") plus the six `/service-page/*` booking pages — which carry the **most recent `lastmod` on the entire site** (2026-07-24), i.e. they're the actively maintained part.

In this repo, `/training` and `/training/[slug]` are **pure redirects off-domain to `gladiators.nyc/classes`**, and there is no class content on `santasknights.org` at all.

That contradicts ROLLOUT.md, which says keeping the free-class content here "keeps the landing pages on the Ad-Grant-eligible domain and consolidates SEO authority." As built, cutover hands seven maintained, indexed pages' authority to a different domain.

It's also worth confirming the Ad Grants angle with Nicolas: Google Ad Grants requires ads to land on the approved nonprofit domain, and a redirect to a different domain is the kind of thing that gets destinations disapproved. If any Ad Grant campaign points at `/in-person`, `/classes`, or a `/service-page/*` URL today, redirecting off-domain is a policy problem before it's an SEO one.

**Pick one:** build the class content pages on `santasknights.org` (per ROLLOUT.md) with `Book Now` deep-linking out, or accept the off-domain redirect and tell Nicolas the ad destinations need rewriting first.

**(b) What is `/landing-page-2`?**

Untitled, thin, and not linked from the site's own navigation — the classic shape of a paid-traffic landing page. If a live ad points there, it must resolve at cutover or the ad breaks. Nicolas will know in ten seconds; nobody should guess.

---

## 6. Cutover-day flip list

Everything here is currently in the "keeps beta out of search" state and must be flipped **together**, in one deploy:

- [ ] **`INDEXABLE = true` in `content/site.ts`** — the one switch. Flips the sitewide `robots` meta tag *and* `robots.txt` together; preview of what ships is `seo-baseline/new-site-robots.cutover.txt`
- [ ] `sitemap.xml` submitted in Search Console (the route already exists) — submit it for the **`www` property**, and make sure that property, not the apex, is the one being watched
- [x] ~~`metadataBase` set to `https://www.santasknights.org`~~ — done 2026-08-16, pinned to `SITE_URL`
- [x] ~~`SITE_URL` in `content/site.ts` aligned to the same host (www)~~ — done 2026-08-16
- [ ] **Both domains added in Vercel with `www` set as primary**, so the apex is answered at the edge. The in-app `next.config.mjs` rule is the belt-and-braces copy — it can only fire once the apex's DNS points here, and it does nothing if the edge redirects first
- [ ] `redirect()` → `permanentRedirect()` on every old→new mapping in §2
- [ ] The §3 bulk rule for `/group/*` in place
- [ ] `google-site-verification` present (or DNS TXT verified in advance)
- [ ] GA4 / GTM / Ads conversion tags installed with the IDs from Nicolas
- [ ] **The Vercel beta domain stays `noindex` after cutover** — otherwise it becomes a full duplicate of the production site competing with it
- [ ] Wix left reachable (not deleted), DNS TTL low, per ROLLOUT.md rollback

Then post-cutover, per ROLLOUT.md: watch Search Console coverage, verify each §2 redirect in the wild, and compare against Nicolas's pre-cutover baseline.
