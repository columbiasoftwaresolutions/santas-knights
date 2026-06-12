# Gladiators NYC — Companion Site (Combat Program & Training Tracker)

Reference spec for the **Gladiators NYC** site — a **separate, linked site** from the Santa's Knights / Letters to Santa platform documented in [README.md](../README.md).

**Relationship.** **Santa's Knights, Inc.** is the 501(c)(3) nonprofit / parent org. **Gladiators NYC** is its combat program/team brand — the classes *are* the Gladiators program, delivered free by the nonprofit. The two sites **cross-link** (Santa's Knights links out to Gladiators for training; Gladiators links back to the nonprofit, Donate, and Letters to Santa) but are **separate codebases, deployments, and cutovers** (see [ROLLOUT.md](./ROLLOUT.md)). `gladiators.nyc` is **not** a redirect into `santasknights.org` — it is its own site.

> This document captures the Gladiators-side scope so it isn't lost from the main README. Feature requirements remain authoritative in [REQUIREMENTS.md](./REQUIREMENTS.md) (Stage 1 Gladiators pages + all of Stage 2).

---

## Site scope (`gladiators.nyc`)

| Area | Features (high level) |
| --- | --- |
| **Public pages** | Training/Classes, Team/Fighters, Media/Gallery, Events/Tickets, Shop/Armory |
| **Training tracker** | Booking + waiver, instructor check-in, XP/gamification, armor inventory & rentals, participant dashboard, admin config |

**Payments stay external** (no on-site payments/e-commerce): **Tickets** → Eventbrite; **Shop/Armory** → existing/external store. All redirects.

---

## Public pages (Phase 1, Gladiators side)

- **Training ("Armored Up") / Classes** — class catalog (Gladiator Bootcamp, Armored Practice, Women's Medieval Combat, Fundamentals, Veterans program, etc.), all free; booking CTA (booking itself = Phase 2).
- **Team / Fighters** — roster, competition history, combat identity.
- **Media / Gallery** — photos, press, highlights.
- **Events / Tickets** — prominent CTA out to Eventbrite (no embed, avoids CLS).
- **Shop / Armory** — swords, axes, armor, apparel → links out to **external** store (e-commerce not built here).

---

## Training Tracker & Booking (Phase 2)

- **Booking & Waiver** — account registration, one-time digital liability waiver with an immutable signed record, class browsing/registration, capacity enforcement, instructor roster view.
- **Media release / photo consent** — separate opt-in for use of participant photos/video in marketing (Instagram, etc.), captured at registration and versioned + stored like the liability waiver. Parent/guardian consent for minors.
- **Instructor Check-In** — elevated-role instructors check in participants; check-ins are timestamped, trigger XP awards, and are stored for grant documentation. Veteran status flagged per participant. Check-in is instructor-initiated only (no self-report).
- **Strength & Conditioning — Training Video Drop** — instructor/admin upload of training videos/demos to the Training / S&C area; per-video metadata (title, description, category, uploader, date); basic edit/replace/delete. Stored in Supabase Storage.
- **XP & Gamification Engine** — participants earn XP for tracked activities along two configurable tracks (Fighter Path, Instructor Path). All XP values, level names, thresholds, and rewards are **admin-editable data, not hardcoded.**
- **Armor — Inventory & Rental** — item-level inventory (not just full sets); rental is a privilege unlocked after a configured XP/class threshold **and** instructor certification (not auto-granted by XP); rental log.
- **Participant Dashboard** — current XP and level, progress bar to next unlock, attendance history, badges, armor rental eligibility, veteran status.
- **Admin Configuration Panel** — set XP values/thresholds, view participants & attendance, export CSV for grant applications, manage training videos.

> **XP design principle:** XP rewards engagement, consistency, volunteering, and learning. It can make a participant *eligible to request* a privilege (e.g. armor rental, sparring) but must **never auto-grant safety-sensitive access**. Those always require instructor/admin certification.

**Waiver record** must capture: waiver version, full waiver text at time of signing, participant name, DOB, parent/guardian name (if under 18), timestamp, checkbox consent, typed legal name, IP/device/browser metadata if available, and a generated PDF (or equivalent immutable record). Material waiver changes require re-signing; minor typo fixes do not. Signed waivers are never auto-deleted.

> **Volume context:** ~67 active participants per cycle, roughly **half new each session** — first-time waiver + media-release signing must be fast and frictionless (typed name + checkbox acceptable). Damion to provide an updated waiver document. Historical participant/attendance data is available from the current and previous sites (existing Wix booking tracks **basic attendance only**); import what's usable.

---

## Users & Roles (Gladiators side)

| Role | Capabilities |
| --- | --- |
| **Public Visitor** | Browse site, buy tickets (Eventbrite), browse the shop |
| **Training Participant** | Register for classes, sign waivers, track personal XP and progress |
| **Instructor** | Check participants into classes, certify milestones, manage rosters |
| **Admin** | Configure XP rules, manage user roles, manage classes & armor, oversee content |

Roles are stored on the `users` record and enforced via Supabase Row Level Security. Instructor and admin roles are elevated and assigned by an admin. (Gladiators-side accounts are distinct from any Santa's Knights / Letters consent records.)

---

## Data Model (training tables)

| Table | Key fields |
| --- | --- |
| `users` | id, email, role, veteran_status, waiver_signed_at, created_at |
| `classes` | id, title, type, instructor_id, datetime, capacity |
| `registrations` | user_id, class_id, created_at |
| `checkins` | user_id, class_id, instructor_id, checked_in_at |
| `xp_events` | user_id, event_type, xp_amount, source_id, created_at |
| `xp_config` | event_type, xp_value, unlock_threshold (admin-editable) |
| `armor_inventory` | item_id, set_name, item_type, size, condition, status, assigned_to, checkout_time, expected_return, actual_return, damage_notes, repair_notes, photos, admin_notes |
| `armor_rentals` | user_id, armor_item_id, class_id, rented_at, certified_by |
| `waivers` | user_id, version, full_text, participant_name, dob, guardian_name, typed_name, consent, ip/device metadata, pdf_url, signed_at |

> Armor is tracked at the **item level**, not just full sets, so individual pieces (size, condition, repair history, photos) can be managed. The rental lifecycle and damage/loss policy are being finalized with the client.

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

## Admin Tasks (Gladiators side)

| Task | How |
| --- | --- |
| **Assign roles** | Set a user's `role` (participant / instructor / admin) in the Supabase dashboard or the admin panel. |
| **Manage classes** | Create, edit, and cancel class sessions. Set type, instructor, datetime, capacity, and prerequisites. |
| **Configure XP** | Edit `xp_config` values, level thresholds, badge names, and unlock rules — no code change required. |
| **Certify unlocks** | Armor rental, sparring, and advanced access require explicit instructor/admin certification (XP alone never grants them). |
| **Track armor** | Manage item-level inventory: status, assignment, checkout/return times, condition, repair notes, photos. |
| **Export grant data** | Export participant XP, attendance, and veteran status as CSV for grant applications. |
| **Manage training videos** | Upload/edit/replace/delete S&C training videos (instructor/admin only). |

---

## Open Questions (Gladiators side)

- **Minors:** Program assumed 18+; if minors are accepted, a parent/guardian co-sign flow is needed.
- **Waiver:** Final waiver text to be provided before Phase 2. Typed-name e-signature + checkbox consent is acceptable for v1.
- **Classes:** Class types defined (intro, fitness, weapons, armor intro, sparring, women's, veterans, special events, volunteer shifts). Advanced/armor/sparring/weapons require instructor approval. Cancellations allowed and tracked; no automatic XP penalties or bans in v1.
- **Armor:** Rental lifecycle and damage/loss policy still being finalized (coordinating with Shan & Amy).
- **Training videos:** Max file size / accepted formats; viewer access (public vs. logged-in); per-class linkage; thumbnail/poster handling; transcoding/streaming vs. direct file serving.

---

*Columbia Software Solutions · columbiasoftwaresolutions.com · Fall 2026*
