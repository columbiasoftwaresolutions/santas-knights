# Requirements

Everything to be built, organized by stage. Derived from the PRD (v1.0), the client clarifications (Damion's notes), the rollout strategy ([ROLLOUT.md](./ROLLOUT.md)), and feature requests logged since.

**Legend:** `[v1]` in scope for first release · `[stretch]` stretch goal · `[future]` designed-for but not built now.

See also: [README.md](../README.md) (overview/data model), [ROLLOUT.md](./ROLLOUT.md) (how we ship).

---

## Cross-cutting (all stages)

- Next.js (App Router) on Vercel; Supabase (Postgres + RLS, Auth, Storage).
- Role-based access: `public`, `participant`, `instructor`, `admin`. Roles on the `users` record, enforced via RLS.
- Mobile-first responsive design.
- New stack built in a **`noindex` beta** environment; public cutover is a separate, Nicolas-coordinated event (see ROLLOUT.md).
- **Marketing context:** as a nonprofit, the org has a **~$10k/month Google Ads grant** and a marketing lead to optimize campaigns. SEO/landing-page quality and a clean cutover matter — the live Wix site must not be undercut in search before cutover. Discovery today is heavily **Instagram-driven**.
- **This site = `santasknights.org`** — the Santa's Knights nonprofit as a whole **plus the Letters to Santa program.** **Gladiators NYC (`gladiators.nyc`) is a separate, linked site** carrying training/classes, booking + waiver, armor rentals, and the XP tracker (see Site Architecture below). Linked but distinct: separate codebases, separate deployments, separate cutovers.
- `SUPABASE_SECRET_KEY` server-only.

---

## Site Architecture & Brand Split

**Santa's Knights, Inc.** is the 501(c)(3) nonprofit / parent org. **Gladiators NYC** is its combat program/team brand. The classes *are* the Gladiators program, delivered free by the nonprofit. **Letters to Santa** is the nonprofit's charitable gift drive.

**Decision (updated):** build **two distinct but linked sites**, not one:

1. **`santasknights.org` — this site/repo.** The Santa's Knights nonprofit as a whole **plus the Letters to Santa program.** Warm, charitable brand tone. Scope: nonprofit/shared info pages + the Letters to Santa info and submission/swipe portal.
2. **`gladiators.nyc` — separate site.** The Gladiators NYC combat program: training/classes, **booking + waiver, armor inventory & rentals, instructor check-in, the XP/gamification tracker,** team/fighters, media, events, shop/armory. Gritty combat identity.

The two **cross-link** (Santa's Knights links out to Gladiators for training; Gladiators links back to the nonprofit, Donate, and Letters to Santa) but are **separate codebases, deployments, and cutovers** (see ROLLOUT.md). `gladiators.nyc` is **not** a redirect into this site — it is its own site.

| Site | Brand | Features (high level) | Stages here |
| --- | --- | --- | --- |
| **`santasknights.org`** *(this repo)* | Santa's Knights | Home, About/Mission, Donate, Membership/Get Involved, Contact, Links, Sponsors, newsletter, auth · **Letters to Santa** info + submission portal + swipe/donor UI | Stage 1 (nonprofit pages) + Stage 3 |
| **`gladiators.nyc`** *(separate site)* | Gladiators NYC | Training/Classes, Team/Fighters, Media/Gallery, Events/Tickets, Shop/Armory · booking + waiver, instructor check-in, XP/gamification, armor inventory & rentals, dashboards, admin config | Stage 1 (Gladiators pages) + Stage 2 |

**Payments stay external** (PRD excludes in-app payments/e-commerce): **Donate** → external donation processor; **Shop/Armory** → existing/external store; **Tickets** → Eventbrite; **Gifts** → Amazon. All redirects, no on-site processing.

---

## Stage 1 — Website Modernization (Weeks 1–2)

**Objective:** migrate off Wix onto an owned stack; establish routing, auth scaffolding, and the component library Phases 2 & 3 plug into.

**Blockers before start:** Wix access, brand materials (logos, media images), domain registrar access, newsletter provider access.

### Pages — Nonprofit / shared (Santa's Knights)
- `[v1]` **Home** — mission hero, what we do (free combat training + charity), upcoming-event CTA, Letters to Santa teaser, donate CTA, social links, newsletter signup.
- `[v1]` **About / Mission** — 501(c)(3) story, Harlem focus, founder, impact.
- `[v1]` **Donate** — tax-deductible donation CTA → **external** processor (no on-site payment).
- `[v1]` **Membership / Get Involved** — how to join, volunteer.
- `[v1]` **Contact** — form with email routing.
- `[v1]` **Links** — consolidated social/stream links (link-in-bio style).
- `[v1]` **Sponsors** — logo grid + contact.

### Pages — Gladiators NYC (separate `gladiators.nyc` site)
> These live on the **separate Gladiators NYC site**, not in this repo. Listed here for engagement completeness; this site only **cross-links out** to them. Stage 2 (below) also belongs to the Gladiators site.
- `[v1]` **Training ("Armored Up") / Classes** — class catalog (Gladiator Bootcamp, Armored Practice, Women's Medieval Combat, Fundamentals, Veterans program, etc.), all free; booking CTA (booking itself = Stage 2).
- `[v1]` **Team / Fighters** — roster, competition history, combat identity.
- `[v1]` **Media / Gallery** — photos, press, highlights.
- `[v1]` **Events / Tickets** — prominent CTA out to Eventbrite (no embed, avoids CLS).
- `[v1]` **Shop / Armory** — swords, axes, armor, apparel → links out to **external** store (e-commerce not built here).

### Cross-link from this site
- `[v1]` Santa's Knights pages (Home, Get Involved, etc.) link out to `gladiators.nyc` for training/classes; the Gladiators site links back to Donate and Letters to Santa.

### Pages — Letters to Santa *(this site)*
- `[v1]` **Letters to Santa** — info / landing page explaining the gift drive (submission + swipe portal = Stage 3).

### Technical
- `[v1]` Next.js App Router for all pages.
- `[v1]` Supabase wired for auth, DB, storage.
- `[v1]` Auth scaffolding in place (accounts not required for public pages, but the system is ready).
- `[v1]` Vercel deployment with CI/CD from GitHub.
- `[v1]` Migrate all existing Wix public content.
- `[v1]` **Historical data import** — participant/attendance data available from the current and previous sites (the existing Wix booking system tracks **basic attendance only**); import what's usable. Damion to provide admin access to current systems.
- `[v1]` Lighthouse ≥ 90.

### Out of scope for Stage 1
Booking flows, dashboards/XP, Santa's Letters.

---

## Stage 2 — Training Tracker & Booking (Weeks 3–7)

> **Site:** this entire stage lives on the **separate `gladiators.nyc` site**, not on `santasknights.org`. Documented here for engagement completeness. (Auth/accounts here are Gladiators-side and distinct from any Santa's Knights / Letters consent records.)

**Objective:** booking + digital waiver, instructor check-in, and a gamified XP system.

**Blockers before start:** waiver document, XP values/thresholds, class schedule & structure, registration/cancellation policy.

### 2.1 Booking & Waiver
- `[v1]` Account registration (email + password via Supabase Auth).
- `[v1]` Digital liability waiver presented on first login / first registration; **signed once, stored permanently, not re-prompted** every login.
- `[v1]` **Immutable signed waiver record** capturing: waiver version, full waiver text at time of signing, participant name, DOB, parent/guardian name (if under 18), timestamp, checkbox consent, typed legal name, IP/device/browser metadata if available, and a generated PDF (or equivalent immutable record). Stored in Supabase Storage.
- `[v1]` Typed-name e-signature + checkbox consent is acceptable for v1.
- `[v1]` Re-sign required when waiver text **materially** changes; minor typo fixes do not trigger re-sign.
- `[v1]` **Media release / photo consent** — separate opt-in for use of participant photos/video in marketing (Instagram, etc.), captured at registration and versioned + stored like the liability waiver. Parent/guardian consent for minors.
- `[v1]` Waivers never auto-deleted.

  _Volume context: ~67 active participants per cycle, roughly **half new each session** — first-time waiver + media-release signing must be fast and frictionless (checkbox + typed name acceptable; see above). Damion to provide an updated waiver document._
- `[v1]` Class browsing + registration tied to the participant's account.
- `[v1]` Class capacity enforced at registration.
- `[v1]` Active waiver required to register for any class/event.
- `[v1]` Cancellations allowed; track late cancellations / no-shows. **No** automatic XP penalties or bans in v1; admins can manually restrict someone later.
- `[v1]` Admin can create, edit, cancel class sessions.
- `[v1]` Booking confirmation shown in-app.
- `[stretch]` Email confirmation.
- `[future]` Parent/guardian co-sign flow if minors are accepted (program assumed 18+ for v1 — confirm).

### 2.2 Classes
- `[v1]` Admin-created and editable class/event types (not hard-coded narrowly). Initial types: intro/beginner, fitness/conditioning, weapons basics/footwork, armor intro, sparring/advanced, women's program, veterans program, special event/workshop, volunteer shift/event support.
- `[v1]` Prerequisites: intro/fitness/general have minimal prereqs; **armor, sparring, weapons escalation, advanced require instructor/admin approval** (not auto-unlocked).

### 2.3 Instructor Check-In
- `[v1]` Instructor role distinct from admin and participant (set by admin).
- `[v1]` Instructor opens a session and sees the registered roster.
- `[v1]` Instructor marks each participant checked in; **check-in is instructor-initiated only** (no self-report).
- `[v1]` Check-in is timestamped and stored for reporting / grant documentation.
- `[v1]` Check-in triggers the configured XP award.
- `[v1]` Veteran status flag tracked per participant for grant eligibility.

### 2.4 Strength & Conditioning — Training Video Drop ⭐ (new request)
- `[v1]` **Video upload ("video drop") for the training / strength & conditioning section** — authorized users can upload training videos / demos.
- `[v1]` Upload restricted to **instructor/admin** roles; stored in Supabase Storage.
- `[v1]` Videos surface in the Training ("Armored Up") / S&C area for participants to view.
- `[v1]` Per-video metadata: title, description, category/class type, uploader, date.
- `[v1]` Basic management: instructor/admin can edit metadata, replace, and delete videos.
- Decisions to confirm: max file size / accepted formats; who can view (public vs. logged-in participants only); whether videos link to a specific class type; thumbnail/poster handling; need for transcoding/streaming vs. direct file serving.
- `[future]` Tie a demo video to a specific milestone or class so it appears in context.

### 2.5 XP & Gamification Engine
- `[v1]` Participants earn XP for tracked activities; XP accumulates on profile.
- `[v1]` **All XP values, level names, thresholds, and rewards are admin-editable data — not hardcoded.** Initial values templated at kickoff.
- `[v1]` Long growth curve (engagement/consistency/volunteering/learning over time).
- `[v1]` Two configurable tracks: **Fighter Path** and **Instructor Path**.
- `[v1]` **XP can make a participant eligible to *request* a privilege but must never auto-grant** safety-sensitive access (armor, sparring, leadership). Those require instructor/admin certification.
- `[v1]` XP event types (configurable): class attended (check-in required), instructor-certified milestone, event participation, attendance thresholds, volunteering, bringing a verified new participant, setup/breakdown help. (No-show = 0.)
- `[v1]` Rewards/badges can be attached to XP levels.
- `[future]` Physical/symbolic rewards (shirts, patches, priority access, gear) attached to levels.

  _v1 default values are templated in [README.md](../README.md#reference-v1-xp-values--levels); exact numbers admin-editable._

### 2.6 Armor — Inventory & Rental
- `[v1]` **Item-level inventory** (not just full sets). Fields: item ID, set name/number, item type, size, condition, current status, assigned participant/event/class, checkout time, expected return, actual return, damage notes, repair notes, photos, admin notes.
- `[v1]` Armor rental is a privilege unlocked after a configured XP/class threshold **and** instructor certification (not auto-granted by XP).
- `[v1]` Rental log: who rented, which item, which session, dates.
- To confirm with Shan & Amy: rental lifecycle (per class / per week / etc.) and damage/loss policy.

### 2.7 Participant Dashboard
- `[v1]` Current XP and level (prominent); progress bar to next unlock; class attendance history; badges earned; armor rental eligibility status; veteran status indicator.

### 2.8 Admin Configuration Panel
- `[v1]` Set XP values per event type; define unlock thresholds (armor, paths, badges).
- `[v1]` View all participants — XP, attendance, veteran status.
- `[v1]` Export participant data (CSV) for grant applications.
- `[v1]` Manage training videos (see 2.4).

---

## Stage 3 — Santa's Letters / Santa's Knights (Weeks 8–12)

**Objective:** a nationwide, swipe/card-style gifting portal (not a static form). Scale: hundreds of letters/season normal, thousands possible, **Nov–Dec spike**. **Target launch ahead of the Oct–Nov ramp** so it's live for the Christmas season.

**Blockers before start:** gift validation policy.

### 3.1 Submission (Families)
- `[v1]` **Parent/guardian submits on behalf of a child** (not the child directly). No account required.
- `[v1]` Form: child's first name, age, brief wish note, Amazon product/wishlist link (required).
- `[v1]` **Upload a photo/scan of the child's handwritten letter** (Supabase Storage). In the swipe concept the handwritten letter is the card front, so treat the image as central rather than optional.
- `[v1]` Parent/guardian confirms/provides the wishlist.
- `[v1]` Parent/guardian agrees to platform terms + consent language (versioned, with stored acceptance records — separate parent/guardian consent and donor/user terms).
- `[v1]` Submissions held in a **moderation queue** before going live.
- `[v1]` Never display full names, addresses, phone, email, school, social handles, or other identifying details publicly.
- `[future]` Wishlist items added manually now; **AI-assisted** wishlist generation from the letter later.
- `[future]` **AI-assisted letter review** — scan upload for sensitive info (last name, address, phone, school, email, socials) and prompt the parent to redact/confirm before submission. Design the workflow so AI/human review can be layered in as volume grows.

### 3.2 Swipe UI (Donors / Site Visitors)
- `[v1]` Swipe/card interface, one letter per card, mobile + desktop. **Right-swipe = purchase intent.**
- `[v1]` **Minimize friction: target ≤2–3 taps/clicks from swipe to a completed Amazon purchase.**
- `[v1]` Card front shows the **handwritten letter**; engaging flips/opens to the related Amazon Wishlist.
- `[v1]` Card contents: child's first name + age, short wish note/excerpt, handwritten letter image.
- `[v1]` "Gift This" opens the Amazon product/wishlist in a **new tab**. **No checkout/payment on-site** — Amazon handles fulfillment; Santa's Knights never receives purchase money.
- `[v1]` Fulfilled letters are removed from the active swipe pool.
- `[future]` Donor self-reporting of fulfillment.

### 3.3 Admin Moderation
- `[v1]` Queue of pending submissions.
- `[v1]` Approve / reject / hide / flag / request edits on submissions and wishlist items.
- `[v1]` Mark letters fulfilled.
- `[v1]` Totals: submitted / approved / fulfilled.
- `[v1]` Gift guidelines enforced via moderation: age-appropriate, legal, safe; no weapons, adult, unsafe, or inappropriate items.
- `[v1]` Platform terms protecting Santa's Knights from misuse by either side (off-platform contact, scraping, harassment, attempts to identify/contact families).

---

## Out of scope (this engagement)

In-app payments/e-commerce · native mobile app · live streaming integration · CMS for non-technical editing · email notification system (`[stretch]` only) · donor fulfillment confirmation · fighter-vs-fighter matchmaking/brackets · Amazon API integration (redirect only).

---

## Open questions

Tracked in PRD §8 / Damion's notes — minors & guardian flow, final waiver text & retention, class structure/prereqs, full XP values & unlock thresholds, armor inventory count & rental lifecycle & damage policy, Santa's Letters gift price caps & validation & seasonal volume. Plus the **training-video** decisions in §2.4.

**Business/legal (project-level, outside the build):** the team was advised to establish legal protection — contracts, liability coverage, and a business entity — before launch; Damion also stressed protecting the dev team legally. Out of scope for the site itself but flagged here so it isn't lost. The for-profit **Armored League** expansion was discussed as a future opportunity beyond this engagement.
