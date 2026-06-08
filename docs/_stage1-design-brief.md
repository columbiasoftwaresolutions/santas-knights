# Stage 1 — Website Design Brief (temp)

Rebuilding off Wix onto Next.js + Supabase. This brief covers the **two brand identities** and how they fit into **one primary website**.

## The org structure (important)
- **Santa's Knights, Inc.** — the 501(c)(3) **nonprofit / parent org**. Mission: free martial arts, fitness, and activities for everyone regardless of background, focused on Harlem, NYC. Receives tax-deductible donations; runs membership, class booking, and the **Letters to Santa** gift drive.
- **Gladiators NYC** — the **combat program / team brand**, *wholly owned and operated by Santa's Knights*. The actual sport: full-contact armored combat with steel weapons + armor, competition, team identity, media, and the merch/armory shop.
- The classes ARE the Gladiators program, delivered for free by the nonprofit. One operation, historically two front doors.

## Architecture decision (NEW)
**santasknights.org is THE main site** — the single info hub for **both** the Gladiators program **and** Letters to Santa.
- **gladiators.nyc → redirects to santasknights.org** (its Gladiators section). No separate standalone Gladiators site to build.
- So you're designing **one site that holds two brand tones**: Santa's Knights as the warm, mission-driven wrapper; the Gladiators section keeping its gritty combat identity.

## Two brand identities to differentiate
| | **Santa's Knights** (wrapper / charity) | **Gladiators NYC** (combat section) |
|---|---|---|
| Role | Nonprofit hub, mission, giving | The sport, the team, the training |
| Tone | Warm, inclusive, hopeful, trustworthy | Gritty, bold, intense, medieval-meets-modern |
| Feel | Community, accessibility, charity | Steel, armor, competition, strength |
| Drives | Donations, membership, Letters to Santa | Classes, events, team pride, shop |

The design challenge: make these cohesive in one site — a warm charitable shell that can shift into a bold combat tone for the Gladiators section without feeling like two different products.

## Site map / pages (Stage 1 = info & marketing pages)
**Shared / Santa's Knights (nonprofit) level**
1. **Home** — mission hero, what we do (free combat training + charity), upcoming-event CTA, Letters to Santa teaser, donate CTA, social links, newsletter signup.
2. **About / Mission** — the 501(c)(3) story, Harlem focus, founder, impact.
3. **Donate** — tax-deductible donation CTA → external processor (no on-site payment in scope).
4. **Membership / Get Involved** — how to join, volunteer.
5. **Contact** — form with email routing.
6. **Links** — consolidated social/stream links (link-in-bio style).

**Gladiators NYC section (combat program)**
7. **Training ("Armored Up") / Classes** — class catalog (Gladiator Bootcamp, Armored Practice, Women's Medieval Combat, Fundamentals, Veterans program, etc.), all free; booking CTA (booking itself = Stage 2).
8. **Team / Fighters** — roster, competition history, the combat identity.
9. **Media / Gallery** — photos, press, highlights.
10. **Events / Tickets** — prominent CTA out to Eventbrite (no embed).
11. **Shop / Armory** — swords, axes, armor, apparel → links out to existing/external store (e-commerce not built here).

**Letters to Santa**
12. **Letters to Santa** — info / landing page explaining the gift drive (the submission + swipe portal is Stage 3).

## Design constraints
- **Mobile-first**, fully responsive — audience is heavily social-media-driven.
- Performance: target **Lighthouse ≥ 90** (optimized hero/media, no layout shift).
- Use brand materials (logos, media images) for both identities — to be provided.
- Build a **reusable component library**; Stages 2 & 3 (training tracker, Letters swipe UI) plug into the same system.
- No login needed on public pages yet, but leave room for a future "Sign in / My Training" entry point.
- Donate + Shop are **redirects to external providers** (no in-app payment/e-commerce in scope).

## Out of scope for Stage 1
Class booking/waiver (Stage 2), training tracker & XP (Stage 2), Letters to Santa submission + swipe portal (Stage 3), in-app payments/e-commerce (external links only).
