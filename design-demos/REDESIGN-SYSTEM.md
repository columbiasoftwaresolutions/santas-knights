# The redesign — how it lands, and how to flip it global

**Source of truth for the look:** [`redesign.html`](./redesign.html) — Donate · Membership · Letters —
[`redesign2.html`](./redesign2.html) — About (sponsors folded in) · Contact · Gallery — and
[`redesign3.html`](./redesign3.html) — Home · Log in / Sign up.
Open any of them in a browser. Same six rules throughout; each demo adds the shapes its pages needed.
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
| About | `/about` | ➡️ redirects to `/santas-knights` |
| Training | `/training`, `/training/[slug]` | ➡️ redirects out to `gladiators.nyc/classes` |
| Home | `/` | ✅ ported (demo 3) |
| Login / Signup | `/login`, `/signup` | ✅ ported (demo 3) — `theme-steel` retired, both pages on paper |
| Account | `/account` | ⬜ old system |
| Admin | `/admin/*` | ⬜ old system — internal, port last or never |

Keep this table current. It is what tells you whether the global flip is safe yet.

**`/links` is gone.** The link-in-bio page was deleted (route, `links.linkInBio`, and the
one reference to it on `/donate`, which now points at Instagram). There is no way to reach
it and nothing left to port.

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

**The sanctioned exceptions** (all kept by request): the three green / red / gold panels on
`/contact` (`.panels`), and on the homepage the `red-deep` Santa's Letters band and the dark
"Seen in" press band. What they have in common — and the non-negotiable part — is that they
are **full-bleed**. A coloured section inset inside the page column is exactly the poster CTA
band rule 4 bans, and there is no argument that saves it.

Torn edges are the second half, and they depend on what the band *is*. A band that carries a
section of the page's argument is torn into, so it reads as the paper opening up: the Contact
panels, the Letters band. A band that merely sits there — the press strip — is squared off,
because tearing into everything turns the device into wallpaper. Read the exceptions list in
DESIGN.md before adding a fourth.

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
| `<PhotoBand>` | `components/redesign/PhotoBand.tsx` | Full-bleed photo with torn edges. `hero` drops the top tear. `tearFill` **must match the section color above and below**. `topTearFill` overrides the top edge alone, for a band running flush under a coloured one — the homepage's Letters → Gladiators seam. |
| `<TornEdge>` | `components/redesign/PhotoBand.tsx` | One torn edge on its own, for a full-bleed band that isn't a `<PhotoBand>` — the About timeline strip and the Contact colour panels. |
| `<R>` | `components/redesign/Reveal.tsx` | Rise-in on scroll. `delay` staggers a group; keep a group under ~250ms total. |
| `<HandArrow>` | `components/redesign/HandArrow.tsx` | The hand-drawn arrow that points at a closing CTA. Goes inside a `.cta-wrap`; steps out below 900px, where there's no gutter left to park in. |
| `<RedesignDefs>` | `components/redesign/Defs.tsx` | The shared brush + tear paths. Mounted by the shell; you never call it directly. |
| `<GiveCard>` | `components/redesign/GiveCard.tsx` | The donation widget. Two steps: amount → details. The second step is not optional (see below). |

### Two form treatments

`.formcard` is the boxed one — white card, filled inputs — and it is what `/letters/submit`
and `<GiveCard>` use, because those forms sit on top of other content and need an edge.
`.form-paper` is the other one, from demo 2: no card, no filled boxes, a field is a ruled
line. Contact, the volunteer application, and both auth forms use it. Don't mix them on one
screen, and don't "unify" them by changing `.rd .field` globally — that restyles the submit
form.

`<SelectMenu>` has a `variant` matching the two: `boxed` (default) and `ruled`. Pick the one
the fields beside it use — the signup DOB pair is `ruled`, the admin letter filters `boxed`.

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

3. **Promote the local tokens.** `--rd-green-deep`, `--rd-gold-ink`, `--rd-gold-deep`,
   `--rd-shadow-tint`, and `--rd-ease` move into `@theme` in `globals.css` as
   `--color-green-deep`, `--color-gold-ink`, etc. Record them in `DESIGN.md` at the same time
   so the palette doc doesn't drift. `--rd-line-strong` has already made the move — it is
   `--color-line-strong` in `@theme`, aliased locally — because the ruled `<SelectMenu>`
   needs it as a Tailwind utility.

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

8. ~~**`theme-steel`.**~~ **Settled and done.** `/login` and `/signup` are on the paper
   ground (demo 3), and the `.theme-steel` class is deleted from `globals.css` — nothing
   else used it. The `--color-steel*` tokens stay only because `Button`'s `bone` variant
   still refers to them; they go when the old poster system does.

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

## What came with the homepage + auth port (demo 3)

- **Nine section components deleted**, all of them imported only by the old `app/page.tsx`:
  `Hero`, `ImpactStrip`, `Mission`, `Pillars`, `LettersToSanta`, `GladiatorsTeaser`, `Press`,
  `Partners`, `DonateBand` — plus `components/ui/Photo.tsx`, whose only three consumers were
  among them. The redesign layer uses `next/image` directly inside `.figbox` / `<PhotoBand>`.
- **`pillars` deleted from `content/site.ts`** (only `Pillars.tsx` read it). **`founder.programsQuote`
  added** — the two-programs pull-quote was hardcoded inside `GladiatorsTeaser`, and it is
  the one bit of copy that would have been lost with the component.
- **The homepage no longer carries a partners strip.** The sponsor wall lives at
  `/santas-knights#sponsors`, and demo 3 doesn't repeat it. `sponsors[].featured` is now
  unread — leave it or drop it when someone touches that list next.
- **`.theme-steel` deleted** from `globals.css`; see flip step 8.
- **`--color-line-strong` promoted** into `@theme` ahead of the flip (flip step 3).

---

## Open decisions

| # | Question | Blocks |
| --- | --- | --- |
| ~~1~~ | ~~Do `/login` + `/signup` keep the dark `theme-steel` scene?~~ **Settled: paper.** Both pages are ported and `.theme-steel` is deleted. | ~~Global flip step 8~~ |
| 2 | Page column: 1240px (redesign) or 1440px (old `Container`)? | Global flip step 4, and the homepage press strip's chip metrics (`CHIP_SCALE` in `app/page.tsx` exists only to squeeze eight logos into 1240) |
| 3 | Is `/admin` in scope for the redesign at all, or does it keep the old system as an internal tool? | The Status table |
| 4 | Real recurring-billing links — which processor? | `content/billing.ts`, and whether the tier CTAs are honest |
| 5 | Is there a password-reset flow? Demo 3 draws a "Forgot your password?" link on `/login`; the app has no reset action, so the link is **not built**. | Whether `/login` can offer recovery at all |
