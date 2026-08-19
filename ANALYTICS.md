# Analytics

How Google Analytics 4 is installed on `santasknights.org`, and what still has to
happen outside this repo.

**Related:** [SEO-PARITY.md](./SEO-PARITY.md) §4/§6 (cutover checklist) ·
[ROLLOUT.md](./ROLLOUT.md) (two-track rollout) · `lib/analytics.ts` (the code).

---

## The starting point: there is nothing to migrate

Measured against the live Wix site on **2026-08-16** — homepage, `/in-person`,
`/donate`, and `/landing-page-2`, rendered in headless Chrome from a US IP with
all network requests logged:

| Checked | Result |
| --- | --- |
| `googletagmanager.com` requests | none |
| `google-analytics.com` requests | none |
| `googleadservices.com` / `doubleclick.net` | none |
| Meta pixel (`connect.facebook.net`) | none |
| `window.dataLayer` | `null` |
| `window.google_tag_manager` | `{}` |
| `_ga` / `_gid` / `_gcl` / `_fbp` cookies | none set |
| Cookie-consent banner that might be gating tags | none rendered |

The only analytics on the live site is **Wix's own** (`frog.wix.com`), which
feeds the visitor stats in the Wix dashboard.

**So: the live site has no Google Analytics, and never has.** This corrects the
assumption in SEO-PARITY.md §4 that the tag IDs merely needed retrieving from
Nicolas — there are no IDs, because there are no tags.

Two things follow, and they drive everything below:

1. **There is no GA4 history to preserve at cutover.** Wix's built-in analytics
   does not export into GA4. A property created on cutover day starts at zero
   either way, so ROLLOUT.md's "historical continuity" item cannot be satisfied
   as written.
2. **The fix is to install now, not at cutover.** Put the container on the Wix
   site today and every month until launch accrues real baseline data in the
   same GA4 property the new site will use. Then cutover is a hostname change
   inside one continuous dataset, and "did the rebuild help or hurt?" becomes a
   question the data can answer. Wait until cutover and it never can.

---

## Architecture: one container, GA4 inside it

```
                 ┌──────────────────────────┐
  Wix site  ────▶│                          │────▶  GA4 property
                 │   GTM container          │────▶  Google Ads conversions
  Next.js   ────▶│   GTM-XXXXXXX            │────▶  anything added later
  (this repo)    │                          │
                 └──────────────────────────┘
                   configured in the GTM UI,
                   no deploy required
```

**GA4 is never installed in the code.** The app loads one GTM container and
pushes semantic events onto the `dataLayer`; the GA4 tag, the Ads conversions,
and any future pixel are configured inside GTM by whoever owns marketing. That
is the entire point — a new conversion goes live without a pull request.

Consequence, stated plainly because it surprises people: **there is no GA4
Measurement ID (`G-XXXXXXXXXX`) anywhere in this repo, and there should never
be one.** If you find yourself adding one, something has gone wrong.

**One container per site.** `santasknights.org` and `gladiators.nyc` are treated
as distinct properties — no cross-domain linker, no shared data stream. This
keeps 501(c)(3) reporting cleanly separate from the commercial side.

> **Known tradeoff:** a visitor who goes `/training` → `gladiators.nyc` and books
> a class shows as an exit on one property and an unattributed referral on the
> other. Accepted deliberately. The cheap mitigation, if attribution ever
> matters, is UTM-stamping the outbound links in `content/site.ts`
> (`GLADIATORS_URL` and the per-class hrefs) — the Gladiators property then at
> least sees the nonprofit site as a source, without the two properties merging.

---

## Part 1 — Google side (do this first, ~20 minutes)

Nothing in this repo works until these IDs exist.

1. **Check for existing assets before creating any.** Ask Nicolas whether a GA4
   property or GTM container already exists for the org, and whether Google Ads
   is live. Thirty seconds of asking beats discovering a duplicate property in
   six months.
2. **Create the GA4 property** — [analytics.google.com](https://analytics.google.com)
   → Admin → Create property. Add a **Web data stream** for
   `https://www.santasknights.org` (the `www` host, matching `SITE_URL`). Note
   the Measurement ID `G-XXXXXXXXXX`; it goes into GTM, not into this repo.
3. **Create the GTM container** — [tagmanager.google.com](https://tagmanager.google.com)
   → Create Account → container type **Web**. Note the container ID
   `GTM-XXXXXXX`. **This is the only ID the repo needs.**
4. **In GTM, add the GA4 tag:**
   - Tag type **Google Tag**, Tag ID = the `G-XXXXXXXXXX` from step 2.
   - Trigger: **Initialization — All Pages**.
   - Leave "send a page view event when this configuration loads" **on**. This
     covers the first page of every visit.
5. **Add the SPA page-view tag** — this is the step people skip, and without it
   the new site records one page view per visit no matter how much someone
   browses:
   - New trigger: **Custom Event**, event name `page_view`.
   - New tag: **Google Analytics: GA4 Event**, event name `page_view`, with
     event parameters `page_location` = `{{Page URL}}` and `page_title` =
     a Data Layer Variable reading `page_title`. Fire it on that trigger.
   - (The code pushes `page_path`, `page_location`, and `page_title` on every
     client-side navigation — see `components/analytics/RouteChangeTracker.tsx`.)
6. **Submit the container.** Nothing in GTM is live until you hit Submit.

## Part 2 — Wix site (do this today, before cutover)

Wix Premium — which this site is on, since it has a custom domain — supports
custom tags:

**Wix dashboard → Settings → Marketing Integrations → Google Tag Manager →
Connect**, paste `GTM-XXXXXXX`, publish the site.

Verify with GTM's **Preview** mode against `www.santasknights.org`, or by
reloading the live site with DevTools open and confirming a request to
`googletagmanager.com/gtm.js`. Then watch GA4 **Realtime** for your own visit.

From here, baseline data accumulates. **Take a written snapshot of the first
full month** — sessions, top landing pages, traffic sources — and put it where
Nicolas and the CHANGELOG can point at it. That snapshot is what post-cutover
performance gets compared against; ROLLOUT.md's "watch for regressions vs. the
pre-cutover baseline" is otherwise unenforceable.

## Part 3 — This repo (done)

Already built and verified. To turn it on:

```bash
# .env.local, and Vercel → Settings → Environment Variables
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

| File | Role |
| --- | --- |
| `lib/analytics.ts` | The `GTM_ID` / `ANALYTICS_ENABLED` gate, the `SiteEvent` union, and `track()` |
| `components/analytics/Analytics.tsx` | Loads the container; renders `null` when disabled |
| `components/analytics/RouteChangeTracker.tsx` | `page_view` on client-side navigation |
| `app/layout.tsx` | Mounts `<Analytics />` |

### The tag stays off until cutover — on purpose

`ANALYTICS_ENABLED` requires `NEXT_PUBLIC_GTM_ID` **and** `INDEXABLE` — the same
single switch in `content/site.ts` that drives `robots.txt` and the sitewide
robots meta tag. So analytics turns on in the cutover commit, alongside
everything else, with a CHANGELOG entry.

This is not caution for its own sake. The plan puts the *same* container on the
Wix site now. If the Vercel beta also fired into that property, every QA click,
every Playwright run, and every internal design review would be
indistinguishable from real visitors — and the baseline the entire rollout is
measured against would be fiction.

**To QA the container before cutover**, set `NEXT_PUBLIC_ANALYTICS_PREVIEW=1` on
a *preview* deployment (GTM Preview mode needs the container present to
connect). Never set it in production.

Verified in both states against a production build: with no `NEXT_PUBLIC_GTM_ID`
the served HTML contains no `googletagmanager`, no `dataLayer`, and issues zero
requests to Google; with the ID set, `gtm.js?id=GTM-…` loads.

### Emitting events

```ts
import { track } from "@/lib/analytics";

track("donate_click", { method: "paypal", placement: "donate_page" });
```

`track()` no-ops when analytics is disabled, so call sites need no guard of
their own. Event names are a TypeScript union in `lib/analytics.ts` rather than
free-form strings, because GTM triggers match exact strings — a typo at a call
site is a silently dead conversion that nobody notices for a quarter.

Adding an event is two steps, and one is not in this repo: **add it to the
`SiteEvent` union, then build the matching trigger in GTM.** Code alone does
nothing.

---

## ⚠️ Never push PII onto the dataLayer

No child first names, no wish text, no gift descriptions, no guardian emails, no
`auth.uid()`. Sending personally identifiable data to GA4 violates Google's
terms and can get a property purged — and on this site that data belongs to
children.

The privacy invariant in CLAUDE.md governs the dataLayer exactly as it governs
the `public_letters` view. Events carry counts, slugs, and enum labels only:
`letter_submit` records *that* a letter was submitted, never a word of what it
said.

---

## Events to wire (not yet built)

The container and page views are in. Individual events still need call sites,
and the list should be confirmed with Nicolas before building — GTM triggers get
built against it.

| Event | Fires on | Notes |
| --- | --- | --- |
| `donate_click` | Outbound click to PayPal/Venmo | **Not a completed donation** — payment is off-site and unmeasurable from here. Name the GA4 conversion accordingly, or someone will read it as revenue. |
| `membership_tier_select` | Tier chosen on `/membership` | Tier label + amount |
| `letter_submit` | Successful guardian submission | No letter content |
| `gift_claim` | Donor claims a letter | No child details |
| `volunteer_apply` | `/contact#volunteer` submission | |
| `contact_submit` | Contact form | `reason` enum only, never the message |
| `newsletter_signup` | Newsletter form | Never the email address |
| `gladiators_outbound` | Any click through to `gladiators.nyc` | Booking / shop / armory |

---

## Open questions for Nicolas

1. **Does a GA4 property or GTM container already exist?** Check before creating.
2. **Are Google Ads campaigns live, and where do they point?** If so, **no
   conversions are currently being measured** — clicks and cost are visible in
   the Ads UI, but nothing on the site reports back what a click did. For an Ad
   Grants account that is both a performance blind spot and a compliance risk
   (Ad Grants expects conversion tracking). This compounds the `/training`
   off-domain redirect issue already flagged in SEO-PARITY.md §5.
3. **What is `/landing-page-2`?** It has the shape of a paid landing page and it
   currently has zero measurement of any kind.
4. **Is a cookie-consent banner required?** The audience is US-based and the
   live Wix site runs none today, so this is currently a no. If EU traffic ever
   matters, it becomes Consent Mode v2 — which is GTM configuration plus a
   banner, not a code change here.
