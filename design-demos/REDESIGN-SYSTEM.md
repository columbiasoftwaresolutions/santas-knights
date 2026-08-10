# The redesign — how it lands, and how to flip it global

**Source of truth for the look:** [`redesign.html`](./redesign.html) — Donate · Membership · Letters —
and [`redesign2.html`](./redesign2.html) — About (sponsors folded in) · Contact · Gallery.
Open either in a browser. Same six rules; demo 2 adds the shapes those three pages needed.
**Implementation:** [`app/redesign.css`](../app/redesign.css) + [`components/redesign/`](../components/redesign/).

This is a full-site redesign being landed **one page at a time**. Until every page is
ported, the new system is **scoped** so it can't touch pages that still use the old poster
system. This file is the instruction manual for the transition, and — most importantly —
[the checklist for turning the scope off](#the-global-flip) when the port is finished.

---

## Status

| Page | Route | State |
| --- | --- | --- |
| Donate | `/donate` | ✅ ported |
| Membership | `/membership` | ✅ ported |
| Letters to Santa | `/letters` | ✅ ported |
| About + sponsors | `/santas-knights` (`#sponsors`) | ✅ ported (demo 2) |
| Contact + volunteer | `/contact` (`#volunteer`) | ✅ ported (demo 2) |
| Gallery | `/gallery` | ✅ ported (demo 2) |
| Get involved | `/get-involved` | ➡️ redirects to `/contact#volunteer` |
| Sponsors | `/sponsors` | ➡️ redirects to `/santas-knights#sponsors` |
| Home | `/` | ⬜ old system |
| Links | `/links` | ⬜ old system |
| Training | `/training`, `/training/[slug]` | ⬜ old system |
| Account | `/account` | ⬜ old system |
| Login / Signup | `/login`, `/signup` | ⬜ old system — **see the note on `theme-steel` below** |
| Admin | `/admin/*` | ⬜ old system — internal, port last or never |

Keep this table current. It is what tells you whether the global flip is safe yet.

**Two pages became sections.** Volunteering and sponsorship no longer have routes of
their own — the volunteer application is the second half of `/contact` and the sponsor
wall is the tail of `/santas-knights`. `links.getInvolved` / `links.volunteer` /
`links.sponsors` in `content/site.ts` point at the anchors, the nav and footer follow
them, and the two old routes stay as `redirect()`s for bookmarks. Both anchored sections
carry `.anchored` (`scroll-margin-top: 100px`) so they clear the sticky nav.

---

## The rules

These are the new rules. They are not suggestions, and several of them **reverse** a
convention the old system used, which is why the two can't be mixed on one screen.

1. **One ground: paper.** Ink appears only in the nav and the footer. No alternating
   dark sections, no red flood bands.
2. **No serif italics.** The old system used Cormorant italic for emphasis. The new system
   emphasises with the same sans face plus a hand-drawn red brush underline that draws in
   on scroll — `<Mark>`. Never reach for `<em>` or `italic` to stress a word.
3. **Sentence case.** Display type is Archivo 800, sentence case, tight tracking.
   `UPPERCASE` is reserved for tiny labels (form labels, the tab switch, footer headings).
4. **No numbered `01`/`02` labels. No 4-up box grids. No tinted panels with an accent
   rail. No poster CTA bands.** Lists flow with hairlines between items; guidance is
   labelled text, not a colored box.
5. **No horizontal divider bars.** Sections are separated by air, or — when there's a
   photo — by a full-bleed band the paper appears to tear open into (`<PhotoBand>`).
6. **Copy is the shortest true version.** Nothing is said twice on one screen.

**The one sanctioned exception** (kept by request): the three green / red / gold panels on
`/contact` (`.panels`). They survive rules 1 and 4 because they are full-bleed and entered
through the same torn paper edge as a photo band, so they read as the paper tearing open
into colour rather than a poster CTA band bolted onto the page. This is the only place
colour is allowed to be the ground. Don't take it as licence for a second one.

---

## How a page opts in

Wrap the page in `<RedesignShell>`. That's the entire opt-in — it adds the `.rd` class the
CSS is scoped to, mounts the shared SVG shapes, and starts the parallax listener.

```tsx
import { Mark } from "@/components/redesign/Mark";
import { PhotoBand } from "@/components/redesign/PhotoBand";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";

export default function Page() {
  return (
    <RedesignShell>
      <section className="phead">
        <Wrap>
          <R as="h1">Keep the classes <Mark>free</Mark>.</R>
          <R as="p" delay={80} className="sub">One sentence that earns its place.</R>
        </Wrap>
      </section>

      <div className="band-gap">
        <PhotoBand src="/images/…">
          <R as="h2" className="big">A claim <Mark alt>worth</Mark> making</R>
        </PhotoBand>
      </div>
    </RedesignShell>
  );
}
```

Inside `.rd` you can still use Tailwind utilities for one-offs — the redesign CSS lives in
`@layer components`, so utilities win. Prefer the named classes below; they're what makes
the pages consistent.

### Primitives

| Thing | Where | Notes |
| --- | --- | --- |
| `<RedesignShell>` | `components/redesign/RedesignShell.tsx` | The opt-in wrapper. Also exports `<Wrap>`, the 1240px page column. |
| `<Mark>` | `components/redesign/Mark.tsx` | The brush underline. `alt` swaps to the second stroke — alternate them when two marks are near each other. `thin` for marks inside body copy. |
| `<PhotoBand>` | `components/redesign/PhotoBand.tsx` | Full-bleed photo with torn edges. `hero` drops the top tear. `tearFill` **must match the section color above and below** — it is only correct against paper. |
| `<TornEdge>` | `components/redesign/PhotoBand.tsx` | One torn edge on its own, for a full-bleed band that isn't a `<PhotoBand>` — the About timeline strip and the Contact colour panels. |
| `<R>` | `components/redesign/Reveal.tsx` | Rise-in on scroll. `delay` staggers a group; keep a group under ~250ms total. |
| `<HandArrow>` | `components/redesign/HandArrow.tsx` | The hand-drawn arrow that points at a closing CTA. Goes inside a `.cta-wrap`; steps out below 900px, where there's no gutter left to park in. |
| `<RedesignDefs>` | `components/redesign/Defs.tsx` | The shared brush + tear paths. Mounted by the shell; you never call it directly. |
| `<GiveCard>` | `components/redesign/GiveCard.tsx` | The donation widget. Two steps: amount → details. The second step is not optional (see below). |

### Two form treatments

`.formcard` is the boxed one — white card, filled inputs — and it is what `/letters/submit`
and `<GiveCard>` use, because those forms sit on top of other content and need an edge.
`.form-paper` is the other one, from demo 2: no card, no filled boxes, a field is a ruled
line. Contact and the volunteer application use it. Don't mix them on one screen, and
don't "unify" them by changing `.rd .field` globally — that restyles the submit form.

### Motion

The reveal rides the app's single `IntersectionObserver` (`components/ui/Reveal.tsx`) via
`data-reveal`, so there is exactly one observer for the whole site. Everything degrades to
"fully visible, fully drawn" when the observer isn't armed — no JS, reduced motion, or a
crawler. **Never write a style that only looks right after `.is-visible` lands.**

---

## The global flip

Do this **only when the Status table above has no `⬜` rows left** (admin excepted if you
decide not to port it). Half-flipped is worse than either state: the theme inverts from
dark to light, so an unported page would render dark text on dark ground.

Work on one branch, top to bottom:

1. **Drop the scope in `app/redesign.css`.** Every rule is written as `.rd .thing`. Remove
   the `.rd ` prefix throughout, and move the `.rd { … }` block's declarations onto
   `body`. This is a mechanical find-and-replace — `.rd .` → `.`, then fix the handful of
   `html.reveal-on .rd …` rules the same way.

2. **Flip the ground in `app/globals.css`.** In `@layer base`:
   - `body` becomes `background: var(--color-paper); color: var(--color-ink);`
     (currently ink/bone).
   - Delete the `main section.py-section:not([class*="bg-"])` override — it exists only to
     force paper onto inner pages under the old dark default, and becomes a no-op.
   - Delete the `h1, h2, h3` base rule; the redesign's type rules take over.

3. **Promote the local tokens.** `--rd-line-strong`, `--rd-green-deep`, `--rd-gold-ink`,
   `--rd-shadow-tint`, and `--rd-ease` move into `@theme` in `globals.css` as
   `--color-line-strong`, `--color-green-deep`, `--color-gold-ink`, etc. Record them in
   `DESIGN.md` at the same time so the palette doc doesn't drift.

4. **Decide `--rd-maxw` vs `Container`.** The redesign column is **1240px**; the old
   `Container` is **1440px**. Pick one and make `Wrap`/`Container` the same component.
   The full-bleed math (`--rd-edge`) depends on this value.

5. **Drop Cormorant.** Once no page uses `font-serif`, remove the `Cormorant` import and
   the `--font-cormorant` variable from `app/layout.tsx`, and `--font-serif` from `@theme`.
   That's one less font file on every page load.
   Check first: `grep -rn "font-serif" app components`.

6. **Delete `<RedesignShell>` and unwrap the pages.** The `.rd` div and the `Wrap` alias
   disappear; `<RedesignDefs>` and `<RedesignParallax>` move into `app/layout.tsx` so
   they mount once for the whole site.

7. **Rename out of "redesign".** `app/redesign.css` → merge into `globals.css` (or keep as
   `app/system.css`); `components/redesign/*` → `components/ui/*`. At this point the old
   site should be unrecoverable and unremembered, which is the goal.

8. **`theme-steel`.** `/login` and `/signup` render a deliberately dark auth scene
   (`components/account/AuthScene.tsx`) that mirrors `gladiators.nyc`. Rule 1 says one
   paper ground; the shared-identity story says these two pages should match the other
   site. **This is an open decision — settle it before step 1**, because it determines
   whether `.theme-steel` survives the flip.

9. **Verify:** `npm run lint`, `npx tsc --noEmit`, `npm run build`, then walk every route
   at 1440px and 390px. Check `document.documentElement.scrollWidth > window.innerWidth`
   is `false` on each — full-bleed sections make horizontal overflow the likeliest
   regression.

10. **CHANGELOG + Nicolas.** A visual change this size is exactly what ROLLOUT.md's
    heads-up rule is for.

---

## Backend changes that came with these three pages

Not cosmetic. If you're reviewing the redesign, review these too.

### The letter pile is public

`/letters` used to hide every letter behind a login. It no longer does — anyone can read
the pile, because a stranger should be able to see a real wish before deciding to make an
account. The reads go through the `public_letters` view, which projects only public-safe
columns; guardian contact and claim state never leave the base table.

Two things are still gated, deliberately and for different reasons:

- **Claiming a letter** needs an account — the claim ties the gift to a donor so handoff
  can be coordinated, an acknowledgment sent, and a guardian blocked from gifting their
  own child's letter. `SwipeDeck` sends signed-out visitors to `/login?next=/letters`.
- **Submitting a letter** needs an account — the row carries `guardian_user_id`, which is
  what powers "My letters" on `/account` and how we reach a guardian about a submission.

### New columns: `gift_summary`, `gift_value_usd`

Run **[`sql/2026-08-gift-summary.sql`](../sql/2026-08-gift-summary.sql)** on the Supabase
project. The public letter cards show a one-line "LEGO Technic set · about $50" that
nothing in the schema could produce — scraping it off Amazon is too fragile for a public
page, so the guardian supplies it at submit time. `gift_summary` is required on new
submissions and nullable at the DB level so pre-migration letters stay valid.

**Until the SQL is applied**, both the read (`lib/letters.ts`) and the write
(`app/letters/submit/actions.ts`) detect the missing columns and fall back to the old
column set, so nothing breaks — the ask line just doesn't render.

### Recurring billing is stubbed, not real

`content/billing.ts` is the single place that answers "where does a gift go?". Today every
monthly link falls through to the PayPal fundraiser, which does support recurring gifts,
so no button is dead. Turning real billing on is a data change in that one file — paste
per-amount links into `monthlyPlanUrls`, or set `NEXT_PUBLIC_BILLING_URL` to a checkout
that accepts `?amount=&frequency=`. **No UI has to change.** See SETUP-TODO.md.

### Donation lead capture is preserved

The demo's give card is a frequency + amount + one button. Built literally, that would
stop writing the `donations` table — the org's only record of the lead and the basis for
the tax acknowledgment. `<GiveCard>` keeps the demo's card as step one and asks for name +
email as step two, then calls `recordDonationIntent` before handing off to the processor.
**Don't "simplify" step two away.**

### Consent text stays on the submit form

The demo replaced the scrollable consent block with a one-line checkbox. It can't: the
server action writes a `consent_records` row storing the exact `full_text` and `version`
a guardian accepted. The scroll block is that text. It stays.

### `membershipTiers` was restructured

The `$0` free tier is no longer one of the priced cards (`freeMembership` is separate —
pricing $0 next to $500 reads as "the cheap plan"). Tiers now carry `price: number | null`,
a `note` for the one tier we steer people to, and no `href` — `/membership` resolves each
through `checkoutUrl(price, "monthly")`.

### Removed

`components/donate/DonateForm.tsx` — imported nowhere, superseded by `<GiveCard>`.

---

## Open decisions

| # | Question | Blocks |
| --- | --- | --- |
| 1 | Do `/login` + `/signup` keep the dark `theme-steel` scene, or go paper like everything else? | Global flip step 8 |
| 2 | Page column: 1240px (redesign) or 1440px (old `Container`)? | Global flip step 4 |
| 3 | Is `/admin` in scope for the redesign at all, or does it keep the old system as an internal tool? | The Status table |
| 4 | Real recurring-billing links — which processor? | `content/billing.ts`, and whether the tier CTAs are honest |
