# Plan v2 — Replicate the full Santa's Knights site (one nonprofit site; only commercial Shop/Armory off-site)

**Status:** proposed · governs current build scope.

## The split (revised)

**Nonprofit vs. commercial, all on one site except the store.** This repo (`santasknights.org`) builds **everything Santa's Knights does as a 501(c)(3)** — every public Wix feature, the **Letters to Santa** portal, **and the full Gladiators NYC free program**: class content **and** the training tracker (booking, waiver, check-in, XP, dashboards, videos, training admin). The **only** thing carved out is **commercial activity** — the merch **Shop** and the **Armory** (item-level armor inventory & rentals) — which stays on the **separate `gladiators.nyc` site**, kept off the nonprofit domain. This site **cross-links out** to Gladiators for shop purchases and armor rentals.

**In scope here (`santasknights.org`):**

- ✅ All nonprofit pages · **member accounts** (Letters tracking, participant dashboard, newsletter, donations) · gallery · donate + membership tiers · partners · the **Letters to Santa** portal
- ✅ Gladiators **program & class content** (Training/Classes catalog, Online, descriptions, founder, brand copy)
- ✅ Class **booking** + scheduling
- ✅ Digital **waivers** + media/photo consent
- ✅ **Instructor check-in**
- ✅ **XP / gamification** tracking
- ✅ **Participant dashboards**
- ✅ **Training-video upload/management**
- ✅ **Participant / instructor accounts** (one account system across the whole site — `participant`/`instructor` are already in the `app_role` enum)
- ✅ Training **admin** — class management, XP config, certify milestones, CSV grant export

**Lives on `gladiators.nyc` (commercial, NOT in this repo):**

- ❌ Merch **Shop** (swords, axes, apparel — e-commerce)
- ❌ **Armory** — item-level armor inventory & rentals (`armor_inventory`, `armor_rentals`, rental lifecycle, damage/loss policy)

> **Why one site:** consolidating the free program on the nonprofit domain maximizes SEO/answer-engine authority, keeps the free-class landing pages eligible for the Google Ad Grant (which can only point at `santasknights.org`), and gives the org one unified account/identity, one admin, and one deployment. Only commercial activity, which doesn't belong on a 501(c)(3) domain, is carved out.

> **Commercial cross-link rule:** Shop purchases and armor rentals **link out to `gladiators.nyc`** — no e-commerce or armor-inventory logic is built in this repo. Armor-rental *eligibility* is computed here (XP + instructor certification); the rental transaction and inventory live on the commercial site.

> **External links are added manually, not via env vars.** All outbound URLs — the `gladiators.nyc` Shop/Armory targets, the membership "Buy Now" tiers, donation processors — will be **hand-added in code/content later by the user**. Leave clearly-marked placeholders (e.g. `# TODO: link`), do **not** wire them as environment variables.

This plan is organized as:
- **§A** — nonprofit gaps the live Wix site has that we don't (gallery, real donate flow, recurring tiers, partners, member area, groups).
- **§B** — Gladiators on this site: the full free program (content + training tracker) built here; only the commercial Shop/Armory cross-link out.
- **§C** — Letters to Santa adjustments (per-gift guidance + family-facing member account; keep the rest of the current workflow).
- **§D** — data model, routes, sequencing, exclusions, open questions.
- **§E** — frontend overhaul: copy & IA parity with the live site (verbatim copy mapped to placement).
- **§F** — media & imagery overhaul: **all current images are being deleted**; repopulate every image/video slot from `asset-library/` with the right asset in the right place.

> **Privacy/safety invariants carry over unchanged:** never expose a child's identifying details publicly (Letters); on the Gladiators side, XP can make a participant *eligible to request* a privilege but **never auto-grants** safety-sensitive access — instructor/admin certification is always required; `SUPABASE_SECRET_KEY` stays server-only; payments stay **external** (no on-site card processing).

---

## §A — Nonprofit gaps (live Wix has these; we don't)

### A1. Public member accounts / "Members Area"

**Required.** The live site has `/account/my-account` (Wix Members login). We currently only have **admin** auth. Plan v2 introduces a **public member account system on this site** — one identity across the whole site: it backs the family-facing Letters account (§C2), newsletter/donation history, **and the Gladiators participant/instructor experience** (booking, waivers, the participant dashboard — §B3). A donor who is also a participant is one account.

- `[v1]` Email + password registration/login via Supabase Auth (re-use existing `lib/supabase` + `lib/auth.ts` patterns; extend beyond admin-only).
- `[v1]` Roles already modeled: `public`, `participant`, `instructor`, `admin` (`app_role` enum exists in the schema). Elevate the existing admin gate to a general role-aware gate. All four roles are used on this site — `participant`/`instructor` gate the Gladiators training tracker (§B3); `public`/`admin` cover the nonprofit/Letters side.
- `[v1]` Account home (`/account`): profile basics (name, email) + **"My letters"** (§C2) + (for participants) the **training dashboard** — XP/level, attendance, booked classes (§B3).
- `[v1]` Optional Facebook one-click login (the live site offers it) — `[stretch]`, Supabase OAuth provider.
- Accounts are **not required** for public browsing, donating, or adopting a letter — the main reason a family signs in here is to **track a submitted letter** (§C2).
- **One account system:** `participant`/`instructor`/`admin` are all roles on this site's `profiles` (the `app_role` enum already has them). No cross-site sign-on problem — the only thing on `gladiators.nyc` is the commercial Shop/Armory.

### A2. Photo / video Gallery

Live `/gallery` is a ~25–30 image grid with a lightbox, no captions. We have none. (This also satisfies the Gladiators "Media / Gallery" page from REQUIREMENTS Stage 1.)

- `[v1]` `/gallery` route — responsive mobile-first grid, lightbox on tap/click.
- `[v1]` Admin-managed media: upload to Supabase Storage (`gallery` bucket, public), optional caption, category/tag, sort order, published flag.
- `[v1]` Categories/albums (e.g. Letters event, Classes, Press, Events) with a simple filter — improves on the live site's single undifferentiated grid.
- `[v1]` Support both images and video (YouTube/embedded link or uploaded short clip).
- `[v1]` **Source imagery from `asset-library/photography/gallery/` (+ `community-classes/`, `combat-training/`)** — see §F. Do not reuse the same photo across slots.
- `[stretch]` Lazy-load / pagination for performance (Lighthouse ≥ 90 target).

### A3. Donate — full flow (not just outbound links)

Live `/donate` has a **donation form** (first name, last name, email, "dedicate this donation to someone") + a long **tax-deduction guide**, then routes to PayPal/Venmo. Ours is just outbound buttons. Payments stay **external** — we capture donor intent, then redirect.

- `[v1]` **Donation lead form**: first name, last name, email, optional "Dedicate this gift to someone" (honoree name + optional notify email), optional amount/frequency selection. Store in a `donations` table (lead capture only — no card data), then redirect to the chosen external processor (PayPal Giving Fund / Venmo / online).
- `[v1]` **Preset amount chips** + one-time vs. monthly toggle (live site has no presets — this is an improvement). Amounts map to outbound processor URLs.
- `[v1]` **Tax-deductibility guidance** content section: 501(c)(3) status, itemized-deduction note, IRS AGI limits (e.g. 60% AGI for cash), carryover, non-cash/vehicle valuation, QCDs for donors 70½+. Port/condense from the live site; keep it review-friendly (not legal advice).
- `[v1]` Keep existing "Where it goes" budget breakdown (Christmas presents / free classes / keeping the lights on).
- `[v1]` Optional email acknowledgement via Resend (reuse the contact-form Resend integration) — `[stretch]`.
- `[v1]` "Dedicate a donation" + honoree handling recorded on the `donations` row.

### A4. Membership / recurring sponsorship tiers

Live `/membership` sells **6 monthly tiers**. We only describe sponsorship qualitatively. Rebuild as structured, selectable tiers — **payment still external** (each "Buy Now" → external recurring-donation/subscription URL).

| Tier | Price/mo | What it does |
| --- | --- | --- |
| Class Membership | $0 | Free membership to sign up for all classes (on-site account registration + booking, §A1/§B3) |
| Gifts | $20 | A present for a child in need per month |
| Gifts + Equipment | $50 | A present and a foam sword for a child-student in need |
| Sponsor 2 Children | $100 | 2 children/month: gifts + foam swords |
| Sponsor 5 Children | $250 | 5 children/month |
| Corporate | $500 | Company tier ≈ sponsoring 10 children with gear + gifts |

- `[v1]` `/membership` route (or a section under `/get-involved`) rendering tiers from `content/site.ts` config (admin-editable copy/prices via content, not hardcoded in JSX).
- `[v1]` Each tier "Buy Now" → external processor URL (PayPal subscription/Venmo). **Links are added manually in code/content later (NOT env vars)** — leave a clearly-marked placeholder per tier.
- `[v1]` The **$0 Class Membership** tier is not a payment — it goes to **this site's account registration + class booking** (§A1/§B3).
- `[v1]` Cross-reference with `/donate` (§A3) and `/sponsors` (§A5) so the three giving surfaces are coherent, not duplicative.

### A5. Partners / sponsors roster (real names)

Live About lists real partners: **Google, Graham Windham, Whole Foods, NYU, Kohl's, Wounded Warrior Project, Combat Wounded Veterans of America, ClassPass, NYPD Community Affairs, New York Adventure Club**, plus venues. Our `/sponsors` shows only Manhattanville Community Center + a placeholder.

- `[v1]` Populate `content/site.ts` `sponsors`/partners with the real roster (logos where available, text tiles otherwise). **Note:** `asset-library/press/` holds *press-outlet* logos, **not** partner logos (Google, Whole Foods, NYU, etc.) — those likely aren't in the library; use text tiles or flag for the client to supply (§F).
- `[v1]` Keep the existing sponsorship-tier copy (back the letter drive / season of classes / event) and "your logo here" CTA.
- `[v1]` Reconcile with the press logo grid already present (Guardian, Men's Journal, Yahoo, Business Insider, NY Mag, Gizmodo, ABC News) — keep press and partners as distinct sections.
- `[v1]` Optionally drive the grid from a `partners` table or content config so it's editable without code.

### A6. Community Groups

Live `/groups` is a Wix Groups social feature (the old Wix **Forum** it relied on is already discontinued/broken on the live site). Lowest priority; rebuild lightweight or defer.

- `[stretch]` Simple community area: list of groups, join (account required, §A1), post/comment. Backed by `groups` / `group_posts` tables with RLS.
- `[future]` Richer feed, notifications, moderation tooling.
- Decision needed: is this worth rebuilding, or replace with links to existing Instagram/Facebook communities? **Recommend deferring** — see Open Questions.

---

## §B — Gladiators on this site: the full free program is built here; only Shop/Armory cross-link out

This site carries the **full Gladiators free program** — both the informational content (REQUIREMENTS.md Stage 1 Gladiators *pages*) **and** the training tracker (REQUIREMENTS.md Stage 2 — booking, waiver, check-in, XP, dashboards, video uploads, training admin). All of it is built in this repo and documented in [GLADIATORS-SITE.md](./GLADIATORS-SITE.md). The **only** Gladiators features that live off-site are the **commercial Shop and Armory** (§B3) — those cross-link out.

### B1. Training / Classes pages — `[v1]` BUILT HERE (content)

- `[v1]` **Training ("Armored Up") / Classes** catalog page with full descriptive content. Class catalog (copy in §E3): Gladiator Bootcamp (all levels), Gladiator Armored Practice (advanced), Women's Medieval Combat & Fitness, Women's (Premium) Combat – Midtown, Gladiators NYC for Military Veterans, Medieval Combat Fundamentals.
- `[v1]` Per-class detail: audience, duration, location, description, "100% FREE… no-questions-asked" messaging.
- `[v1]` **Book Now / Register** CTAs go to the **on-site booking flow** (§B3) — per-class deep-links to `/training/[slug]` or the booking route. Replace the single generic outbound `TRAINING_HREF` with real per-class booking URLs (also fixes agent-bookability — see SEO notes).
- `[v1]` Reuse existing brand/components; mobile-first.

### B2. Online classes — `[v1]` BUILT HERE (content + video)

- `[v1]` `/online` page surfacing virtual/instructional content as **embeds** (e.g. the YouTube "Gladiators NYC — Intro Class") plus the uploaded training videos from the video-drop (§B3). Curated list: title, description, embedded/uploaded player.

### B3. Training tracker — `[v1]` BUILT HERE (the free-program backend)

Per the revised split this **lives in this repo**, gated by `participant`/`instructor`/`admin` roles. Full spec + data model: [GLADIATORS-SITE.md](./GLADIATORS-SITE.md) + REQUIREMENTS.md Stage 2.

- ✅ **Booking & scheduling** — class registration, capacity enforcement, cancellations/no-show tracking, session management.
- ✅ **Digital waiver + media/photo consent** — immutable signed records (waiver version, full text, name/DOB, guardian, typed signature, metadata, PDF). Private `waivers` bucket.
- ✅ **Instructor check-in** — instructor-initiated, timestamped, grant documentation, veteran-status flag, triggers XP.
- ✅ **XP & gamification** — admin-editable values/levels/thresholds/badges, Fighter & Instructor paths; XP makes a participant *eligible to request* a privilege but never auto-grants safety-sensitive access.
- ✅ **Participant dashboard** — XP/level, progress, attendance history, badges, veteran status, armor-rental eligibility status.
- ✅ **Training-video upload/management** ("video drop") — instructor/admin upload, metadata, edit/replace/delete. Private `training-videos` bucket; surfaced on `/online` (§B2).
- ✅ **Training admin config** — XP rules, class management, certify milestones, **CSV grant export** — in this repo's `/admin`.

> **Commercial carve-out (⛔ NOT here — `gladiators.nyc`):** the merch **Shop** (swords/axes/apparel e-commerce) and the **Armory** (`armor_inventory`, `armor_rentals`, rental lifecycle, damage/loss policy). Armor-rental *eligibility* is computed here from XP + certification; the rental transaction and inventory live on the commercial site, which this site links out to.

### B4. The "free app"

The live site promotes a "100% FREE app" for class registration/management.

- `[v1]` That app is the **booking experience built here** — class browsing, registration, and the participant dashboard on `santasknights.org`. The "free app" CTAs point to the on-site flow, not out.
- `[stretch]` Ship the site as a mobile-first **PWA** (installable, offline shell) so the "100% FREE app" messaging is literally satisfied by this site.

---

## §C — Letters to Santa adjustments

**Keep the entire current workflow** (parent/guardian submits on behalf of child, no account *required*, moderated queue, privacy-safe `public_letters` view, swipe/card adopt UI, Amazon-URL gift fulfillment in a new tab, signed-URL letter images, versioned guardian/donor consent). **No offline / mailed-gift path** — Amazon-only stays. Two additions:

### C1. Stated per-gift value guidance

The live site states **"$20–50 in total value of gifts per child/person."** We don't surface any guidance.

- `[v1]` Add a clear **suggested gift value range** (e.g. "$20–50 per child") on:
  - the **submit** flow (so families build appropriately-scoped wishlists/links), and
  - the **adopt/swipe** UI (so donors know the expected commitment).
- `[v1]` Store the range as editable copy in `content/site.ts` (and/or `content/consent.ts` where it's part of donor terms) so it can change per season without code edits.
- `[v1]` Reflect it in donor terms / gift guidelines already enforced at moderation (age-appropriate, legal, safe).

### C2. Family-facing account to track letter status

Today submission is fire-and-forget for the guardian; status lives only in admin. The live site requires an account to post a letter. Add an **optional** family account so guardians can track their letter.

- `[v1]` Keep submission possible **without** an account (preserve low friction). Offer an **optional** "create an account to track your letter" step at/after submit.
- `[v1]` When a guardian has an account (§A1), associate their submitted `santa_letters` rows to their `profiles.id` (nullable `guardian_user_id` FK) and show a **"My letters"** view: current status (pending / needs edits / approved-live / fulfilled / etc.), and any moderator "needs edits" note.
- `[v1]` "Needs edits" surfaces the moderator's requested changes to the family in their account (today this only exists internally).
- `[v1]` Privacy invariant preserved: a family only ever sees **their own** rows; the public `public_letters` view is unchanged; guardian contact never exposed to donors.
- `[future]` Email-link/magic-link status lookup for families who don't make an account.

---

## §D — Data model, routes, sequencing, exclusions

### D1. New / changed tables

Reuse existing: `profiles` (already has `app_role`), `santa_letters`, `consent_records`, `contact_messages`, `newsletter_subscribers`. Add the nonprofit/Letters tables **and** the training-tracker tables (the program is built here):

| Table | Key fields | For |
| --- | --- | --- |
| `gallery_media` | id, kind(image/video), storage_path/url, caption, category, sort, published | A2 |
| `donations` | id, first_name, last_name, email, amount, frequency, dedicate_to, notify_email, processor, created_at | A3 |
| `partners` | id, name, logo_path, url, kind(partner/press/sponsor), sort | A5 |
| `groups` / `group_posts` | (only if A6 is built) | A6 `[stretch]` |
| **Training tracker** | `classes`, `registrations`, `checkins`, `waivers`, `media_consents`, `xp_config`, `xp_events`, `levels`/`badges`, `training_videos` — full fields in [GLADIATORS-SITE.md](./GLADIATORS-SITE.md#data-model-training-tables) | §B3 |

Schema changes to existing tables:
- `santa_letters`: add nullable `guardian_user_id uuid references profiles(id)` for §C2 (family letter-tracking).
- Add RLS for every new table (owners read own rows; admin elevated; instructors read their rosters; public read only where intended, e.g. `gallery_media.published`, `partners`).

> Storage buckets to add: `gallery` (public), **`waivers` (private)** and **`training-videos` (private/signed)** for the tracker. Keep `letters` private as-is.
>
> **Stays off this project (commercial):** `armor_inventory` / `armor_rentals` and the merch store live on `gladiators.nyc` (see §B3). Everything else is in this Supabase project.

### D2. Route map (App Router)

Existing: `/`, `/about`, `/contact`, `/get-involved`, `/donate`, `/sponsors`, `/links`, `/letters` (+ `/submit`, `/give`), `/admin` (+ `/login`).

Add (this repo):
- `/account` (+ `/login`, `/register`, `/account/letters`) — A1, C2 · **plus the participant dashboard** (XP/level/attendance) for the training tracker
- `/gallery` — A2
- `/membership` — A4
- `/training` (or `/classes`) + `/training/[slug]` + `/online` — B1/B2 (content) **and the on-site booking flow** (B3); per-class Book Now → on-site booking
- `/instructor` — B3 instructor check-in / roster (instructor role)
- `/admin/*` extensions: gallery, partners, donations config (A2/A5) **and training admin** — class management, XP config, certify milestones, CSV grant export (B3)
- `/groups` — A6 `[stretch]`
- Update `/donate` (form + tax guidance), `/sponsors` (real partners), `/letters/submit` & `/letters/give` (per-gift guidance) in place.

Cross-link out to `gladiators.nyc` (commercial only): merch Shop, Armory (armor inventory & rentals).

### D3. Suggested sequencing

1. **Foundation:** public member-account system (§A1) + role-aware auth — unblocks family letter tracking.
2. **Quick content wins (low risk, high value):** Gallery (§A2), Partners roster (§A5), Donate form + tax guidance (§A3), Membership tiers (§A4), Letters per-gift guidance (§C1). Mostly content + light forms; ship early.
3. **Letters family account (§C2)** — small, builds on §A1.
4. **Gladiators content pages** — Training/Classes catalog (§B1) + Online (§B2). Pure content; can land alongside step 2. Replace the generic `TRAINING_HREF` with per-class routes.
5. **Frontend overhaul / copy + IA parity (§E)** — nav dropdowns, restored copy, brand marks.
6. **Media & imagery pass (§F)** — delete current images, repopulate every slot from `asset-library/`. Do this alongside §E (copy + imagery land together per page).
7. **Training tracker (§B3)** — the big build: booking + waiver, instructor check-in, XP engine, participant dashboard, training videos, training admin/CSV export (REQUIREMENTS Stage 2). Gated by `participant`/`instructor` roles; provision the training tables in this Supabase project.
8. **Groups (§A6)** if greenlit.

> The training tracker (step 7) is the heaviest chunk (REQUIREMENTS Stage 2) and is now **in this repo**. Sequence it after the content/copy/media wins so the public site ships first.

### D4. Explicit exclusions (NOT built in this repo)

- ❌ **Merch Shop / Armory storefront** (swords, axes, apparel, e-commerce). Commercial — external store on `gladiators.nyc`.
- ❌ **Armor inventory & item-level rental** (`armor_inventory`, `armor_rentals`, rental lifecycle, damage/loss policy). Commercial — on `gladiators.nyc`. (Rental *eligibility* is computed here.)
- ❌ On-site card payments / in-app e-commerce (all payments external: Amazon, PayPal/Venmo, Eventbrite, external store).
- ❌ Native mobile app, live-streaming integration, Amazon API integration (redirect only).

> ✅ **Built here:** the entire Gladiators **free program** — class content, Online/video, **and the training tracker** (booking, waiver, check-in, XP, dashboards, video uploads, training admin) — alongside all nonprofit/Letters features. Only the commercial Shop/Armory link out.

### D5. Open questions

- **Cross-link targets:** the `gladiators.nyc` Shop/Armory URLs and the membership/donation "Buy Now" URLs are **added manually later** — build with placeholders, no env vars. Also: how does armor-rental *eligibility* (computed here) surface to the commercial Armory?
- **Groups (§A6):** rebuild vs. drop in favor of social links? (Recommend drop/defer.)
- **Membership/donation processors:** which external recurring-billing URLs back the 6 tiers and the donate presets?
- **Brand/copy (§E0):** founding year (2015 vs 2016) and founder bio framing to reconcile with Damion.
- **Training tracker (§B3):** waiver text + retention, class structure/prereqs, full XP values/thresholds, minors/guardian co-sign, training-video specs — see [GLADIATORS-SITE.md](./GLADIATORS-SITE.md#open-questions).
- **SEO/ads:** keep `noindex` on beta until a Nicolas-coordinated cutover. The free program now lives on `santasknights.org` (Ad-Grant-eligible, authority-consolidated); use per-class URLs + `Course`/`Event` schema so the class pages rank and are agent-bookable. Coordinate any `gladiators.nyc` redirects with Nicolas (ROLLOUT.md).

---

## §E — Frontend overhaul (copy & IA parity with the live Wix site)

Our current frontend (the v1 rebuild) **deliberately reframed the brand around the charity** — warm, Letters-first, tagline *"A Harlem nonprofit. Free training all year, and a letter to Santa answered every December."* The **live Wix site leads with the martial-arts brand** — trademark *"The Gift of Martial Arts™"* — and carries a lot of specific copy, a deeper nav, and sub-tabs we dropped. To "replicate the existing site to a T," this section catalogs every frontend gap and maps the **verbatim live-site copy** to where it belongs in the new site. **Copy below is quoted exactly from the live site — reuse it as-is** unless a decision in §E0 says otherwise.

### E0. Brand & tone decisions (resolve before building copy)

The live site is **martial-arts-brand-first**; our rebuild is **charity-first**. Plan v2 keeps the warmer charity framing as the *primary* homepage narrative **but restores the live brand assets the rebuild dropped**, so nothing is lost:

- `[v1]` Restore the trademark line **"The Gift of Martial Arts™"** as a brand mark (hero eyebrow / footer / about), even if the main hero headline stays charity-led.
- `[v1]` Adopt the **official mission statement** verbatim (below) as the canonical mission text on Home + About (our rebuild paraphrased it):
  > "Santa's Knights' mission is to bring free martial arts, fitness, and activities to everyone, equitably, transcending socioeconomic, racial, and location boundaries, positively changing children's and adults' lives through exposure and lifestyle enhancement."
- **Discrepancies to reconcile with Damion (don't silently overwrite):**
  - **Founding year:** live says **established 2015**; our About says **2016** (training 2013 → nonprofit later). Confirm the correct year and use one consistently.
  - **Founder framing:** live says **"service-disabled military veteran"**, "Wall Street", "a bachelor's and master's at Ivy League universities", "teaching martial arts for 5+ years"; our About says "Air Force veteran, Columbia student, Harvard MBA, ex-Wall Street" + a CBS quote. Reconcile into one bio (see E2).
  - **Offline/mailed-gift path:** live Letters lists a mailing address; **we intentionally exclude it** (Amazon-only, per §C). Do **not** port the mailing-address copy.

### E1. Navigation / information architecture parity

Live nav is deeper than ours (dropdowns + sub-tabs). Ours: About · Santa's Letters · Get Involved · Training (external) · Contact. Rebuild the IA to match (Shop excluded):

| Live nav item | Sub-tabs (live) | In our site | Plan |
| --- | --- | --- | --- |
| **Home** | — | ✅ `/` | keep |
| **Donate** (top-level) | — | exists but not top-level nav | `[v1]` promote **Donate** to top-level nav |
| **Santa's Knights** ▾ | About Us · Partners · Founder · Members | `/about` only | `[v1]` dropdown → `/about` (About Us), `/sponsors`→**Partners**, `/about#founder` (Founder), `/account` (**Members**) |
| **Classes** ▾ | In-Person · Online | external link only | `[v1]` dropdown → `/training` (In-Person) + `/online` (§B1–B2) |
| **Letters to Santa** ▾ | Write a Letter · Adopt a Letter | `/letters` only | `[v1]` dropdown → `/letters/submit` (Write) + `/letters/give` (Adopt) |
| **Membership** | — | missing | `[v1]` `/membership` (§A4) |
| **Shop** | — | external | ❌ excluded (external store) |
| **Gallery** | — | missing | `[v1]` `/gallery` (§A2) |
| **Contact** ▾ | Volunteer | `/contact` only | `[v1]` dropdown → `/contact` + `/get-involved#volunteer` |
| **Groups** | — | missing | `[stretch]` `/groups` (§A6) — or drop |

Also surface the **PayPal / Venmo / Gladiators NYC** quick links the live site pins near the top.

### E2. Home page — missing copy & sections

Restore these live-site blocks (verbatim) into the homepage:

- `[v1]` **Brand mark / hero eyebrow:** "The Gift of Martial Arts™"
- `[v1]` **Mission statement** (the E0 verbatim text) as the mission block.
- `[v1]` **Classes section** — heading **"CLASSES WITH SANTA'S KNIGHTS!"** with the free-promise line **"All classes are 100% FREE, 100% of the time, no-questions-asked!"** and the 6 class cards (E3) each with a Book Now CTA.
- `[v1]` **Featured-class blurb:** "Modern-methods; gladiatorial awakening; undeniable results" plus the full bootcamp description:
  > "Inspired by classes such as Barry's Bootcamp®, SoulCycle®, and GRIT BXNG®, Gladiator Kids (for children) and Gladiator Bootcamp (for adults) teaches students how to fight as an armored combatant (using foam weapons and armor to train with) in the style of high-energy, high-intensity, non-stop, music-driven, headset-wearing instructors, bringing gladiatorial and medieval training into the modern age of fitness and martial arts practice."
- `[v1]` **App promo:** "Use the app to register for and manage your classes! The app is 100% FREE, always!" (the registration app **is this site's on-site booking flow** — §B3/§B4; optionally a PWA).
- `[v1]` Keep our existing impact strip, Letters teaser, Get-Involved, press grid, and donate band.

### E3. Classes / Training pages — per-class copy (verbatim)

Page heading **"CLASSES WITH SANTA'S KNIGHTS!"**, free line **"All classes are 100% FREE, 100% of the time, no-questions-asked!"**, then these cards (name · audience/duration · exact tagline):

| Class (exact name) | Audience / Duration | Verbatim tagline |
| --- | --- | --- |
| **Gladiator Bootcamp (open to all levels)** | Adults & Teens · "Duration Varies" | — (uses the E2 bootcamp blurb) |
| **Gladiator Armored Practice (advanced)** | "Adults (as fighters & spectators) & Teens/Children as spectators" | — |
| **Women's Medieval Combat & Fitness** | 2 hr | "Empowerment through Strength, Skill, and Sisterhood" |
| **Women's (Premium) Combat Class – Midtown** | luxury Midtown studio | "Combat, conditioning, and community — now in a luxury Midtown studio." |
| **Gladiators NYC for Military Veterans** | 2 hr | "This class is (only) for U.S. Military Veterans (sponsored by the Department of Veterans Services)" |
| **Medieval Combat Fundamentals** | 1 hr 30 min | "Step into the world of historical martial arts with Gladiators NYC" |

Each card's **Book Now** → the **on-site booking flow** (per-class route, §B3). `/online` carries the virtual content as embeds + uploaded training videos (§B2).

### E4. About / Mission / Founder — missing copy

- `[v1]` **Mission:** the E0 verbatim statement.
- `[v1]` **Founder (Damion DiGrazia)** — reconcile (E0) into one bio incorporating the live wording: established the org (year TBD) as a **"service-disabled military veteran"** 501(c)(3); inspired by receiving **"a very thoughtful gift from Operation Santa Claus"** as a child and by recovering through martial arts after a military injury; background includes **"a career on Wall Street, and a bachelor's and master's at Ivy League universities, and also teaching martial arts for 5+ years"**; wanted to build **"a free platform/program for people to be able to pursue their best-selves through martial arts and fitness."** (Keep our CBS quote.)
- `[v1]` **Partners** (live calls this out as its own sub-tab — see §A5). Full verbatim roster to display:
  > Google · Graham Windham · Whole Foods Market · NYU · Kohl's · Wounded Warrior Project · Combat Wounded Veterans of America · Futurelabs · ClassPass · NYPD · New York Adventure Club · Armored Combat Worldwide · Bohemian Hall · Draft Barn Beach
  > _(plus our existing Manhattanville Community Center)_

### E5. Letters to Santa — copy to add (keep our workflow)

Keep our moderated swipe/submit workflow. Add the live-site copy that we're missing — **except the mailing address (excluded, E0):**

- `[v1]` **Per-gift value** on submit + adopt (§C1), verbatim phrasing: "It's best to keep your request to $20-50 in total value of gifts per child/person."
- `[v1]` **Privacy instruction** on the submit form, verbatim: "do NOT include your, or your child's, last name or mailing address in your physical letter or online post!"
- `[v1]` Frame the two sub-tabs as the live site does — **"Write a Letter"** (= our `/letters/submit`) and **"Adopt a Letter"** (= our `/letters/give`).

### E6. Donate — copy to add

Wrap our new donate lead-form (§A3) in the live site's copy:

- `[v1]` **Headline:** "Join Santa's Knights mission: Empowering Lives Through Martial Arts and Fitness!"
- `[v1]` **Encouragement line:** "No amount is too small; every dollar makes a difference."
- `[v1]` **Tax-deduction guidance** (port these points, verbatim intent): cash donations deductible up to **60% of AGI**; property donations **20–50%** depending on type; excess contributions **carry over up to five years**; non-cash/vehicle donations valued at **fair market value**; donors **70½+** can make **qualified charitable distributions up to $100,000/yr** from IRAs. _(Label as general info, not tax advice.)_
- `[v1]` **Form fields** matching live: First Name · Last Name · E-mail · "Make a donation in the name of" · submit button "Make a donation".

### E7. Membership — tier copy (verbatim)

`/membership` (§A4) cards, exact copy:

| Tier | Price | Verbatim description |
| --- | --- | --- |
| **Class Membership** | $0/mo | "100% free membership that lets you sign up for all classes!" |
| **Gifts** | $20/mo | "A present for a child in need per month!" |
| **Gifts and Equipment** | $50/mo | "A present and a foam sword for a child-student in need!" |
| **Sponsor 2 Children** | $100/mo | 2 children/month: foam swords + gifts |
| **Sponsor 5 Children** | $250/mo | 5 children/month |
| **Corporate Membership** | $500/mo | company tier ≈ sponsoring 10 children with equipment + gifts |

Each "Buy Now" → external recurring-billing URL; the $0 tier → account registration + booking.

### E8. Gallery & Groups

- `[v1]` **Gallery** (§A2) — the live site has a populated `/gallery`; ours has none. Port the event/class/press imagery into the new gallery (with our album/category improvement).
- `[stretch]` **Groups** (§A6) — live `/groups` exists (its underlying Wix Forum is already defunct). Rebuild lightweight or drop in favor of social links (decision in §D5).

### E9. Frontend build checklist (summary)

1. `[v1]` Rebuild **nav/IA** with dropdowns + sub-tabs (E1); promote Donate; add Membership/Gallery.
2. `[v1]` Home: add **mission statement, Classes section, featured-class blurb, app promo, brand mark** (E2).
3. `[v1]` **Training/Classes + Online** pages with all 6 class cards (E3).
4. `[v1]` **About/Founder/Partners** copy reconciled + partner roster (E4).
5. `[v1]` **Letters** per-gift + privacy copy (E5).
6. `[v1]` **Donate** headline + tax guidance + form (E6).
7. `[v1]` **Membership** tiers (E7).
8. `[v1]` **Gallery** populated (E8).
9. `[v1]` **Media pass (§F)** — delete current images, place the right `asset-library/` asset in every slot (inspect before placing; no duplicates).
10. Resolve **E0 brand/year/founder discrepancies** with Damion first.

> Store all of this copy in `content/site.ts` (and `content/consent.ts` for gift/privacy terms) so it's editable without touching JSX — consistent with the existing content-config pattern.

---

## §F — Media & imagery overhaul (asset-library → site)

**Problem.** The current site's imagery is wrong: at least one image is reused **3×** where it doesn't belong, and several slots show mismatched/placeholder photos. **Decision: delete all current web images and repopulate every slot from `asset-library/`**, choosing the *right* asset for each place. This is a deliberate, slot-by-slot pass — not a bulk copy.

### F0. Ground rules

- `[v1]` **Delete the existing `public/images/` set** (`hero-community.jpg`, `combat-helmet.jpg`, `gladiators-sparring.jpg`, `headshot.png`, and `public/images/press/*`). Every reference in `content/site.ts` will be re-pointed (don't leave dead paths).
- `[v1]` **Inspect before placing.** Filenames in `asset-library/` are opaque (hashes, `IMG_*`, `wix-BG (N)`). **Open/view each candidate image** to confirm what it actually depicts before assigning it — do not guess from the filename. (This is exactly how the "same image 3×" bug happened.)
- `[v1]` **No duplicates across slots.** Each page/section gets a *distinct* image. Never reuse one photo in multiple places. Skip everything under `asset-library/_review/duplicates/` and treat `_review/uncategorized/` as unvetted.
- `[v1]` **Pick one of each `*_edited` pair** (e.g. `…_edited.jpg` vs original) — don't ship both.
- `[v1]` **Optimize on copy-in:** convert to `.webp` (or sized `.jpg`), reasonable dimensions, descriptive kebab-case names, into `public/images/…`; then reference from `content/site.ts`. Keep `asset-library/` as the untouched source of truth (app code never points at it).
- `[v1]` **Brand-appropriate sourcing.** Santa's Knights / Letters / community slots → `brand/santas-knights`, `photography/community-classes`, `photography/gallery` (holiday/community shots). **Gladiators *content* pages on this site** (Training/Classes/Online) → `brand/gladiators-nyc`, `photography/combat-training`, combat `graphics/`. (Shop/armory renders stay unused here — those pages live on `gladiators.nyc`.)
- `[v1]` **Video is heavy (~460 MB).** Do **not** commit raw clips to git. Prefer **YouTube/Vimeo embeds** for `/online` and the homepage; if a background-loop is wanted, use one optimized/compressed clip from `video/background-loops/` via Git LFS or external hosting — not the raw `.mov`s. Note any clip dropped for size in a comment.
- `[v1]` **Verify caption/alt accuracy.** Every image's alt text and surrounding copy must match what the photo actually shows (the live site failed this). Add meaningful `alt` for accessibility.

### F1. Placement map (slot → asset-library source)

Inspect and pick the best, non-duplicate asset per slot:

| Page / section | Slot | Source folder(s) — pick & verify |
| --- | --- | --- |
| **Global** | Header/footer logo, favicon | `brand/santas-knights/` (`logo1200x630.webp`, `Santa's Knights.png`) |
| **Global** | Value/feature spot icons | `brand/icons/` (the SVGs) |
| **Home** | Hero (charity-led) | `photography/gallery/` (holiday/community event) or a compressed `video/background-loops/` plate |
| **Home** | Letters teaser | `photography/gallery/` (kids/letters) + `photography/community-classes/k1.jpg` |
| **Home** | Featured-class / bootcamp blurb | `photography/combat-training/` (armored fighters, e.g. `heroBg.jpg`, `SK 1.jpg`) |
| **Home** | Classes section cards (6) | `photography/combat-training/` + combat `graphics/` — a **distinct** image per class |
| **Home / global** | Press logo grid | `asset-library/press/` — map each tile to the **correct outlet** (Guardian, Business Insider, ABC Nightline, Yahoo, NY Mag, Gizmodo, Men's Journal, …); replace the current `public/images/press/*` |
| **About / Mission** | Story / mission imagery | `photography/gallery/` (community, distinct from Home) |
| **About** | Founder headshot (Damion) | `photography/combat-training/Portrait.jpg` or `SK 1.jpg` — **verify it's actually him** before use |
| **Partners / Sponsors** | Partner logos | ⚠️ **likely NOT in the library** (`press/` = press outlets). Use text tiles or flag for client to supply (§A5) |
| **Training / Classes** | Page hero + per-class images | `photography/combat-training/`, combat `graphics/` (e.g. gladiator/colosseum art), `brand/gladiators-nyc/` |
| **Online** | Video embeds | YouTube ("Gladiators NYC — Intro Class"); optionally `video/clips/` or `video/promos/` (`29 - 100% free…mp4`) re-hosted |
| **Gallery** | Grid (images + a few clips) | `photography/gallery/` (39 photos) + `community-classes/`, `combat-training/`, select `video/clips/` |
| **Donate** | Supporting imagery | `photography/gallery/` (holiday/gift event) — distinct from other slots |
| **Membership** | Tier/section imagery | `photography/community-classes/` or `graphics/` (avoid reusing Home/Donate shots) |
| **Backgrounds** | Section/hero plates | `backgrounds/` — prefer `BG*.jpg`/`HBG.png` over the legacy `wix-*` exports unless a `wix-*` is clearly better |

### F2. Process per slot

1. `[v1]` List candidates in the mapped folder(s); **open each** to see the real content.
2. `[v1]` Choose the single best, on-brand, **not-yet-used** asset; reject blurry/low-res/`_review` items.
3. `[v1]` Optimize → `public/images/<descriptive-name>.webp`; write accurate `alt`.
4. `[v1]` Point `content/site.ts` (and any component) at the new path; remove the old reference.
5. `[v1]` After the pass, **grep for any image path used more than once** and confirm each repeat is intentional (logos/icons may legitimately repeat; photos should not).

### F3. Open questions (media)

- **Partner logos** (Google, Whole Foods, NYU, Kohl's, ClassPass, WWP, …) — source from client if not in the library.
- **Founder headshot** — confirm which `asset-library` photo is actually Damion (or get a clean headshot).
- **Video hosting** — confirm YouTube/Vimeo embeds vs. self-hosted; raw `video/` stays out of git.

---

*Plan v2 · Columbia Software Solutions · the whole nonprofit on this site — nonprofit pages, Letters, and the full Gladiators free program (content + training tracker); only the commercial Shop & Armory on Gladiators NYC.*
