# Gladiators NYC — Combat Program & Training Tracker (spec)

> ⚠️ **See [plan-v2.md](./plan-v2.md) for the build boundary.** The Gladiators NYC **free program is built on this site** (`santasknights.org`): class/program content **and** the full training tracker — booking + waiver, instructor check-in, XP/gamification, participant dashboard, training-video uploads, training admin. The **only** Gladiators features kept off this site are the **commercial Shop and Armory** (item-level armor inventory & rentals), which live on the separate `gladiators.nyc` site because Santa's Knights is a 501(c)(3) and commercial activity stays off the nonprofit domain. This document is the authoritative spec for the training tracker's behavior and data model (built here) **and** the commercial companion (linked out).

**Relationship.** **Santa's Knights, Inc.** is the 501(c)(3) nonprofit / parent org. **Gladiators NYC** is its combat program/team brand — the classes *are* the Gladiators program, delivered free by the nonprofit. The free program runs **on this site, under one account system and one deployment**, branded as a Gladiators "steel" sub-brand section. The site **cross-links out** to `gladiators.nyc` only for commercial purchases (merch) and armor rentals; armor-rental *eligibility* is computed here.

> Feature requirements remain authoritative in [REQUIREMENTS.md](./REQUIREMENTS.md) (Stage 1 Gladiators pages + all of Stage 2). This doc captures the Gladiators-specific scope, data model, and reference XP values so they aren't lost from the main README.

---

## Scope

| Area | Where | Features (high level) |
| --- | --- | --- |
| **Public pages** | **This site** | Training/Classes, Team/Fighters, Media/Gallery, Events/Tickets |
| **Training tracker** | **This site** | Booking + waiver, instructor check-in, XP/gamification, participant dashboard, training-video uploads, admin config |
| **Commercial** | **`gladiators.nyc`** | Merch **Shop**; **Armory** — item-level armor inventory & rentals |

**Payments stay external** (no on-site payments/e-commerce): **Tickets** → Eventbrite; **Shop/Armory** → external store on `gladiators.nyc`. All redirects.

---

## Public pages (built here)

- **Training ("Armored Up") / Classes** — class catalog (Gladiator Bootcamp, Armored Practice, Women's Medieval Combat, Fundamentals, Veterans program, etc.), all free; **on-site booking** (per-class routes; the booking flow itself = Training Tracker, below).
- **Team / Fighters** — roster, competition history, combat identity.
- **Media / Gallery** — photos, press, highlights.
- **Events / Tickets** — prominent CTA out to Eventbrite (no embed, avoids CLS).

> **Commercial — links out to `gladiators.nyc`:** **Shop / Armory** — swords, axes, armor, apparel, and item-level armor rentals → external store (e-commerce not built here). See [Commercial companion](#commercial-companion-gladiatorsnyc).

---

## Training Tracker & Booking (built here)

- **Booking & Waiver** — account registration, one-time digital liability waiver with an immutable signed record, class browsing/registration, capacity enforcement, instructor roster view.
- **Media release / photo consent** — separate opt-in for use of participant photos/video in marketing (Instagram, etc.), captured at registration and versioned + stored like the liability waiver. Parent/guardian consent for minors.
- **Instructor Check-In** — elevated-role instructors check in participants; check-ins are timestamped, trigger XP awards, and are stored for grant documentation. Veteran status flagged per participant. Check-in is instructor-initiated only (no self-report).
- **Strength & Conditioning — Training Video Drop** — instructor/admin upload of training videos/demos to the Training / S&C area; per-video metadata (title, description, category, uploader, date); basic edit/replace/delete. Stored in Supabase Storage (private `training-videos` bucket).
- **XP & Gamification Engine** — participants earn XP for tracked activities along two configurable tracks (Fighter Path, Instructor Path). All XP values, level names, thresholds, and rewards are **admin-editable data, not hardcoded.**
- **Participant Dashboard** — current XP and level, progress bar to next unlock, attendance history, badges, **armor rental eligibility status** (computed here; the rental itself happens on the commercial Armory), veteran status. Lives under `/account`.
- **Admin Configuration Panel** — set XP values/thresholds, view participants & attendance, export CSV for grant applications, manage training videos. In **this repo's** `/admin`.

> **XP design principle:** XP rewards engagement, consistency, volunteering, and learning. It can make a participant *eligible to request* a privilege (e.g. armor rental, sparring) but must **never auto-grant safety-sensitive access**. Those always require instructor/admin certification.

**Waiver record** must capture: waiver version, full waiver text at time of signing, participant name, DOB, parent/guardian name (if under 18), timestamp, checkbox consent, typed legal name, IP/device/browser metadata if available, and a generated PDF (or equivalent immutable record). Material waiver changes require re-signing; minor typo fixes do not. Signed waivers are never auto-deleted.

> **Volume context:** ~67 active participants per cycle, roughly **half new each session** — first-time waiver + media-release signing must be fast and frictionless (typed name + checkbox acceptable). Damion to provide an updated waiver document. Historical participant/attendance data is available from the current and previous sites (existing Wix booking tracks **basic attendance only**); import what's usable.

---

## Users & Roles

Roles live on this site's `profiles` record (enum `app_role`) and are enforced via Supabase Row Level Security — **one account system across the whole site** (a donor/letter-submitter can be the same person as a participant). Instructor and admin roles are elevated and assigned by an admin.

| Role (`app_role`) | Capabilities |
| --- | --- |
| **`public`** | Browse site, donate, use the Letters swipe UI, buy tickets (Eventbrite), browse the external shop |
| **`participant`** | Register for classes, sign waivers, track personal XP and progress |
| **`instructor`** | Check participants into classes, certify milestones, manage rosters |
| **`admin`** | Configure XP rules, manage user roles, manage classes, certify unlocks, export grant CSV, oversee content |

---

## Data Model (training tables)

Provisioned in **this project's** Supabase (alongside the nonprofit/Letters tables). Identity is the existing `profiles` table — the participant fields below extend it / reference it.

| Table | Key fields |
| --- | --- |
| `profiles` *(existing)* | id, email, role (`app_role`), veteran_status, waiver_signed_at, created_at |
| `classes` | id, title, type, instructor_id, datetime, capacity |
| `registrations` | user_id, class_id, created_at |
| `checkins` | user_id, class_id, instructor_id, checked_in_at |
| `xp_events` | user_id, event_type, xp_amount, source_id, created_at |
| `xp_config` | event_type, xp_value, unlock_threshold (admin-editable) |
| `waivers` | user_id, version, full_text, participant_name, dob, guardian_name, typed_name, consent, ip/device metadata, pdf_url, signed_at |
| `media_consents` | user_id, version, full_text, typed_name, consent, signed_at |
| `training_videos` | id, title, description, category, uploader_id, storage_path, created_at |

> Storage buckets: private **`waivers`** (signed PDFs) and **`training-videos`**.
>
> **On `gladiators.nyc`, not this project (commercial):** `armor_inventory`, `armor_rentals` — see [Commercial companion](#commercial-companion-gladiatorsnyc).

### Reference: v1 XP values & levels

These are **templated defaults**, admin-editable after kickoff.

<details>
<summary>XP event values</summary>

| Event | XP |
| --- | --- |
| Create account / profile | 5 |
| Sign waiver | 5 |
| Attend standard class | 10 |
| Attend veterans / women's / community class | 10 |
| Attend armor intro or special workshop | 15 |
| Volunteer at class/event | 15 |
| Volunteer at major event | 25 |
| Bring a verified new participant | 10 |
| Instructor-approved milestone | 25 |
| Help with setup/breakdown | 10–20 |
| No-show | 0 |

</details>

<details>
<summary>Level thresholds (long growth curve)</summary>

Recruit 0 · Trainee 25 · Novice 75 · Squire 150 · Armsman 300 · Knight Candidate 500 · Knight 750 · Veteran Knight 1,250 · Champion 2,000 · Marshal 3,500 · Legend 5,000

</details>

---

## Commercial companion (`gladiators.nyc`)

The **only** Gladiators features that live off this site. Commercial activity is kept off the nonprofit (501(c)(3)) domain; this site cross-links out to it.

- **Shop** — swords, axes, armor, apparel; external e-commerce store.
- **Armory — Inventory & Rental** — item-level inventory (not just full sets); rental is a privilege unlocked after a configured XP/class threshold **and** instructor certification (not auto-granted by XP); rental log. **Armor-rental eligibility is computed on this site** (from XP + certification) and surfaced on the participant dashboard; the rental transaction and inventory live on the commercial companion.

**Commercial-side tables** (on `gladiators.nyc`, not this project):

| Table | Key fields |
| --- | --- |
| `armor_inventory` | item_id, set_name, item_type, size, condition, status, assigned_to, checkout_time, expected_return, actual_return, damage_notes, repair_notes, photos, admin_notes |
| `armor_rentals` | user_id, armor_item_id, class_id, rented_at, certified_by |

> Armor is tracked at the **item level**, not just full sets, so individual pieces (size, condition, repair history, photos) can be managed. The rental lifecycle and damage/loss policy are being finalized with the client. **Open question:** how the eligibility flag (computed here) is shared with the commercial Armory (API, shared identity, or manual).

---

## Admin Tasks

| Task | How |
| --- | --- |
| **Assign roles** | Set a user's `role` (participant / instructor / admin) in the Supabase dashboard or the admin panel. |
| **Manage classes** | Create, edit, and cancel class sessions. Set type, instructor, datetime, capacity, and prerequisites. |
| **Configure XP** | Edit `xp_config` values, level thresholds, badge names, and unlock rules — no code change required. |
| **Certify unlocks** | Armor rental, sparring, and advanced access require explicit instructor/admin certification (XP alone never grants them). |
| **Export grant data** | Export participant XP, attendance, and veteran status as CSV for grant applications. |
| **Manage training videos** | Upload/edit/replace/delete S&C training videos (instructor/admin only). |
| **Track armor** *(commercial)* | Manage item-level inventory on `gladiators.nyc`: status, assignment, checkout/return times, condition, repair notes, photos. |

---

## Open Questions

- **Minors:** Program assumed 18+; if minors are accepted, a parent/guardian co-sign flow is needed.
- **Waiver:** Final waiver text to be provided before the tracker build. Typed-name e-signature + checkbox consent is acceptable for v1.
- **Classes:** Class types defined (intro, fitness, weapons, armor intro, sparring, women's, veterans, special events, volunteer shifts). Advanced/armor/sparring/weapons require instructor approval. Cancellations allowed and tracked; no automatic XP penalties or bans in v1.
- **Armor (commercial):** Rental lifecycle and damage/loss policy still being finalized (coordinating with Shan & Amy). How eligibility (computed here) crosses to the `gladiators.nyc` Armory.
- **Training videos:** Max file size / accepted formats; viewer access (public vs. logged-in); per-class linkage; thumbnail/poster handling; transcoding/streaming vs. direct file serving.

---

*Columbia Software Solutions · columbiasoftwaresolutions.com · Fall 2026*
