---
# DESIGN.md — machine-readable design tokens
# Source of truth for the look: design-demos/redesign.html (Donate · Membership · Letters)
#                               design-demos/redesign2.html (About · Contact · Gallery)
#                               design-demos/redesign3.html (Home · Log in / Sign up)
# Implementation: app/redesign.css + components/redesign/
meta:
  name: Santa's Knights
  product: Santa's Knights nonprofit hub (Letters to Santa + Gladiators NYC content)
  version: 0.3.0
  status: current
  supersedes: "0.2.0 — the “Poster” system (Archivo uppercase, Cormorant italics, dark/flood bands)"

colors:
  # One ground for the whole site. Ink appears only in the nav and the footer.
  paper:       "#F7F0E3"   # the ground — every page, every section
  paperRaised: "#FBF6EC"   # row hover only (list rows, gallery tile backing)
  card:        "#FFFFFF"   # the few real cards: give card, tier, letter, swipe front
  ink:         "#16120F"   # text, nav, footer, ink buttons
  ink2:        "#1A1512"   # ink button hover
  bone:        "#E8E2D4"   # text on ink (nav + footer)
  muted:       "#6C6256"   # secondary text
  red:         "#C2331F"   # primary action, the brush underline, the hand arrow
  redDeep:     "#9E2536"   # red hover
  green:       "#2E5E45"   # giving / submit / community
  greenDeep:   "#244C38"   # green hover
  gold:        "#C2912F"   # small labels only (timeline dates, the 501(c)(3) rule)
  goldDeep:    "#B0841F"   # gold hover (contact panel)
  goldInk:     "#6C5418"   # text on gold
  line:        "#E4D8C4"   # hairline between items in a list
  lineStrong:  "#CBBDA4"   # input rules, card borders, text-link underlines
  focus:       "#C2331F"   # focus ring (= red); paper on dark grounds
  legacy:      # still in @theme, NOT part of this system — old poster pages only
    amber:     "#C98A3A"
    greenSoft: "#E7EFE8"
    goldSoft:  "#F0E2C2"
    steel:     "#16171A"   # Button's `bone` variant only; the .theme-steel auth scene is gone

typography:
  families:
    sans:    '"Hanken Grotesk", system-ui, sans-serif'   # body + UI
    display: '"Archivo", system-ui, sans-serif'          # h1–h4, prices, list titles
    # NO serif. Cormorant is banned from this system.
  base:
    size: "17px"
    lineHeight: 1.55
  weights: [400, 500, 600, 700, 800]
  case: "Sentence case. UPPERCASE only for tiny labels (≤13px, letter-spacing .04–.16em)."
  scale:
    h1:        { size: "clamp(40px,5.4vw,68px)", weight: 800, lineHeight: 1.14, letterSpacing: "-0.035em" }
    h1OnPhoto: { size: "clamp(42px,5.8vw,76px)", weight: 800, lineHeight: 1.12, letterSpacing: "-0.035em" }
    mission:   { size: "clamp(30px,4.4vw,58px)", weight: 800, lineHeight: 1.06, letterSpacing: "-0.035em" }
    statement: { size: "clamp(30px,3.8vw,50px)", weight: 800, letterSpacing: "-0.032em" }  # .say / .free-say
    h2:        { size: "clamp(30px,3.6vw,46px)", weight: 800, letterSpacing: "-0.03em" }   # h2.big
    closer:    { size: "clamp(25px,2.8vw,36px)", weight: 800, letterSpacing: "-0.03em" }
    sub:       { size: "clamp(17px,1.5vw,20px)", weight: 400, lineHeight: 1.5, color: muted, measure: "44ch" }
    lede:      { size: "clamp(16px,1.4vw,18.5px)", weight: 400, lineHeight: 1.55, color: muted, measure: "46ch" }
    body:      { size: "17px", weight: 400, lineHeight: 1.55 }
    small:     { size: "15px", weight: 400, color: muted }
    fine:      { size: "12.5–13.5px", weight: 400, color: muted }
    label:     { size: "12px", weight: 700, letterSpacing: "0.1em", transform: uppercase, color: muted }

spacing:
  layout:
    maxWidth: "1240px"                    # .rd-wrap / <Wrap>
    gutter:   "clamp(24px,4vw,56px)"
    edge:     "calc((100vw - min(100vw, 1240px))/2 + gutter)"   # content edge → viewport edge
  section:
    default: "clamp(58px,7vw,104px) 0"
    tight:   "clamp(40px,5vw,68px) 0"
    pageHead: "clamp(48px,6vw,86px) 0 0"
    closer:  "clamp(30px,3.6vw,50px) 0 clamp(64px,7vw,96px)"
    bandGap: "clamp(46px,6vw,90px)"       # air before a full-bleed band
  photoBand:
    padding:  "clamp(92px,11vw,168px) 0 clamp(88px,10vw,156px)"
    hero:     "clamp(72px,8.5vw,124px) 0 clamp(84px,9.5vw,140px)"
    noHeading: "clamp(70px,8vw,116px) 0"  # timeline band
  anchorOffset: "126px"                   # scroll-margin-top under the sticky nav

roundedCorners:
  everything: "0px"    # buttons, inputs, cards, photos, panels — no exceptions
  pill: "999px"        # reserved; unused in this system

elevation:
  # Depth is a soft warm bloom under white paper objects. Never a hard drop shadow,
  # never a border-and-shadow "AI card".
  tint:   "rgba(34,29,23,.45)"
  card:   "0 26px 50px -34px tint"    # give card, form card, swipe face
  raised: "0 18px 36px -32px tint"    # tier, letter card (at rest)
  hover:  "0 28px 46px -30px tint"

motion:
  ease: "cubic-bezier(.22,1,.36,1)"
  reveal:   { transform: "translateY(14px)", duration: "420ms", stagger: "≤250ms per group" }
  mark:     { property: "clip-path inset(0 100% 0 0) → inset(0 -2% 0 0)", duration: "620ms", delay: "120ms" }
  arrow:    { property: "stroke-dashoffset 260 → 0", duration: "850ms", delay: "250ms" }
  timeline: { line: "scaleX 900ms", nodes: "scale 400ms, 170ms apart" }
  parallax: { image: "scale(1.10)", travel: "±26px translate3d on scroll" }
  hover:    { button: "translateY(-1px)", card: "translateY(-3…-5px)", listRow: "translateX(9–10px)" }

components:
  button:
    padding: "14px 26px"
    fontSize: "14px"
    fontWeight: 700
    letterSpacing: "0.02em"
    border: "1.5px solid transparent"
    radius: 0
    variants:
      red:   { bg: red,   fg: "#FFFFFF", hover: redDeep }        # primary
      ink:   { bg: ink,   fg: paper,     hover: ink2 }           # closers
      green: { bg: green, fg: "#FFFFFF", hover: greenDeep }      # submit / giving
      ghost: { bg: transparent, fg: ink, border: ink, hover: "fill ink" }
      onImg: { bg: transparent, fg: paper, border: "rgba(247,240,227,.5)", hover: "fill paper" }
      wide:  { width: "100%", padding: "16px 24px", fontSize: "14.5px" }
  textLink:   # .tlink — the secondary action everywhere
    fontSize: "14.5px"
    fontWeight: 700
    border: "1.5px solid lineStrong (bottom)"
    hover: "color+border → red (or greenDeep for .tlink--green)"
  input:
    default:  { border: "0 0 1.5px 0 solid lineStrong", bg: transparent, fontSize: "17px", padding: "9px 0", focus: "border-bottom red" }
    carded:   { border: "1.5px solid lineStrong", bg: card, fontSize: "15.5px", padding: "12px 14px", focus: "border red" }
  card:
    bg: card
    border: "1px solid line (tier) | none (letter)"
    shadow: raised
    hover: "translateY(-3…-5px) + shadow.hover"
---

# Santa's Knights — Design System

The look is a **paper ground with things written and drawn on it**: one cream page, ink
only in the nav and footer, hairlines instead of boxes, air instead of divider bars, and
two hand-drawn marks — a red brush underline and a torn paper edge — doing the work that
italics, tinted panels, and poster bands used to do.

**Source of truth:** open [`design-demos/redesign.html`](./design-demos/redesign.html)
(Donate · Membership · Letters) and [`design-demos/redesign2.html`](./design-demos/redesign2.html)
(About · Contact · Gallery) in a browser. Where this doc and a demo disagree, the demo wins.

**Implementation:** [`app/redesign.css`](./app/redesign.css) (scoped under `.rd`) +
[`components/redesign/`](./components/redesign/). A page opts in by wrapping in
`<RedesignShell>`. Which routes are ported, and the checklist for dropping the scope, live in
[`design-demos/REDESIGN-SYSTEM.md`](./design-demos/REDESIGN-SYSTEM.md) — read it before UI work.

---

## The six rules

1. **One ground: paper.** `#F7F0E3` under every page. Ink appears only in the nav and the
   footer. No alternating light/dark sections, no red flood bands.
2. **No serif italics.** Emphasis is the same sans face plus a **hand-drawn red brush
   underline** that draws in on scroll (`<Mark>`). Never `<em>`, never `italic`, never
   Cormorant.
3. **Sentence case.** Display type is Archivo 800, sentence case, tight tracking.
   UPPERCASE is only for tiny labels: form labels, the tab switch, footer headings,
   timeline dates.
4. **No numbered `01`/`02` labels. No 4-up grids of bordered boxes. No tinted callout
   panels with an accent rail. No poster CTA bands.** Lists flow with hairlines between
   items; guidance is labelled text, not a colored box.
5. **No horizontal divider bars** — not even a hairline between sections. Sections are
   separated by air, or by a full-bleed band the paper appears to **tear open** into.
   Hairlines survive only *between items in a list*.
6. **Copy is the shortest true version.** Nothing is said twice on one screen.

### Banned outright

| Banned | What replaces it |
| --- | --- |
| Serif-italic emphasis word in a heading | `<Mark>` — the brush underline |
| `01` / `02` / `03` section labels | Nothing. The heading is the label. |
| 4-up grids of bordered feature boxes | A hairline list (`.facts`, `.pairs`, `.ways`) |
| Tinted callout panels (green "free!" block) | A statement set big on the paper (`.say`) |
| Full-bleed poster CTA bands ("ADOPT A LETTER & *give.*") | `.closer` — one line, one button, air above it |
| Divider bars between sections | Air, or a torn-edge `<PhotoBand>` |
| Stacked hairlines over a photo | One rule-free row of columns (`.facts--onimg`) |
| Long explainer prose with italic emphasis | An accordion (`<details>`) beside a short lede |
| Eyebrows / kickers above headings | Nothing |

Five deliberate exceptions, each with a reason. The three coloured/dark ones are all
**full-bleed** — a coloured section inset inside the page column is the poster band rule 4
bans, with no argument available. Whether it is *torn into* depends on what it is: a
section of the page's argument gets a torn edge, a strip that merely sits there does not.

- **The membership tier grid** stays a 3-across card grid. Comparable prices genuinely
  scan better side by side.
- **The three colour panels on Contact** (green / red / gold) stay — full-bleed, entered
  through the same torn edge as a photo band, so they read as the paper tearing open into
  colour, not as a poster band bolted on.
- **The Santa's Letters band on the homepage** keeps the live site's `red-deep` ground and
  its copy (heading, the whole intro paragraph, two buttons), laid out as a photo on the
  left with the copy **right-aligned** against the content edge on the right. The photo
  stops at the page column rather than running off the viewport edge, so the band keeps a
  margin on both sides. Below 900px the copy reverts to left-aligned — a right rag on a
  narrow column reads as broken, not deliberate. The paper tears
  into it at the top, and it runs **flush** into the Gladiators `<PhotoBand>` below — one
  shared edge, no strip of paper between them, which means that band's `tearFill` is
  `red-deep`. The brush goes `paper` there (`.mark--onred`) because a red stroke on red is
  nothing, and the primary button inverts to paper-on-ink, since neither of the two button
  fills works on a red ground.
- **The "Seen in" press band on the homepage** keeps the live site's dark ground and white
  logo chips, and has **straight edges** — no tears. It is a credential strip, not a section
  of the argument, and tearing into it would make the device wallpaper. Its old `border-y`
  hairlines are still gone; rule 5 has no exception. The label is reset from Cormorant
  italic to the 12px tracked uppercase label. The chips are tuned smaller than the live
  values (54px tall / 14px sides / 24px marks / 10px gaps) so all eight fit one row inside
  the 1240px column; at 1440 the live numbers fit and should come back.
- **The letters submit form** keeps its white card (`.formcard`). It is the object of the
  page, not a section of it. Every other form is written straight on the paper.

---

## Colour

One ground, one primary, two supports, and gold reduced to a label colour.

| Role | Token | Hex | Where it is allowed |
| --- | --- | --- | --- |
| Ground | `paper` | `#F7F0E3` | Every page. Also the fill of every torn edge. |
| Row hover | `paper-raised` | `#FBF6EC` | List-row hover, gallery tile backing. Never a section band. |
| Card | `card` | `#FFFFFF` | Give card, tier, letter, swipe front, form card. |
| Text / dark chrome | `ink` | `#16120F` | Body text, nav, footer, ink buttons, swipe back. |
| Text on ink | `bone` | `#E8E2D4` | Nav + footer only. |
| Secondary text | `muted` | `#6C6256` | Ledes, hints, fine print. |
| Primary action | `red` | `#C2331F` | Buttons, the brush stroke, the hand arrow, focus, the live timeline node. |
| Giving / submit | `green` | `#2E5E45` | Submit buttons, the free-membership link, the first contact panel. |
| Label accent | `gold` | `#C2912F` | Timeline dates, the 501(c)(3) rule, the swipe-card kicker, the third contact panel. |
| Hairline | `line` | `#E4D8C4` | Between items in a list. Never between sections. |
| Rule / border | `line-strong` | `#CBBDA4` | Input underlines, card borders, text-link underlines. |

On a photo, text is `paper` and secondary text is `rgba(247,240,227,.78–.86)`.

Colour never carries meaning alone — the label says it. Gold is never an action colour;
red and green are the only fills a button gets, plus ink for closers.

**Token drift to fix at the global flip:** `green-deep`, `gold-deep`, `gold-ink`,
`shadow-tint`, and `ease` currently live as `--rd-*` locals in `app/redesign.css`. They move
into `@theme` in `globals.css` when the `.rd` scope is dropped. `line-strong` has already made
that move — the ruled `<SelectMenu>` needs it as a Tailwind utility, so `--color-line-strong`
is in `@theme` and `--rd-line-strong` aliases it. `amber`, `green-soft`, `gold-soft`, and the
`steel` palette belong to the old poster system and are kept only for pages not yet ported.

---

## Typography

**Archivo 800** for everything structural — h1–h4, prices, list-row titles, the brand mark,
accordion summaries. Sentence case, `letter-spacing:-.028em` (tighter as sizes grow),
`line-height:1.08`, `text-wrap:balance`.

**Hanken Grotesk 400–700** for body, ledes, buttons, labels, form fields. Base is
**17px / 1.55**.

**No third face.** Cormorant is gone; where the old system reached for an italic, this one
reaches for `<Mark>`.

Measures are short and deliberate: `sub` 44ch, `lede` 46ch, list copy 34–52ch, accordion
bodies 70ch, timeline entries 21ch. Headlines are capped by `max-width` in `ch` (14–26ch)
so they break where the sentence breaks.

Uppercase is allowed at four places only, always ≤13px and always tracked out:
form labels (`.1em`), the Adopt/Submit tab switch (`.07em`), footer column headings
(`.12em`), timeline dates and the swipe-card kicker (`.14–.16em`).

---

## Layout and flow

- Page column **1240px** (`.rd-wrap` / `<Wrap>`), gutter `clamp(24px,4vw,56px)`.
- Full bleed is `width:100vw; margin-left:calc(50% - 50vw)`. To bleed one side only, use
  the `--edge` token — **percentage margins on a grid child resolve against the track, not
  the viewport**, so `margin-right:calc(50% - 50vw)` silently does nothing there.
- Section rhythm: `clamp(46px,7vw,104px)` default, `clamp(32px,5vw,68px)` tight. The page
  head pads top only. Before a full-bleed band, `clamp(46px,6vw,90px)` of air.
- Structure is two-column splits — `1fr 1fr`, `.9fr 1.1fr` (`--wide`), `.62fr .38fr`
  (`--rail`) — collapsing to one column at 900–960px. A left column that is only a heading
  can be `.sticky` (`top:126px`).
- Anchor targets need `scroll-margin-top:126px` to clear the sticky nav.

**Breakpoints:** 1280 (desktop nav → hamburger) · 960 (rail and form grid collapse) ·
**900 — the one that matters** (splits, page-head grid, letters hero, stats, preview deck,
and the switch to centred head copy) · 860 (photo-band fact row, timeline goes vertical) ·
820 (ways list, statement rows, contact panels, steps) · 780 (pair lists) · 640 (tiers,
roles, gallery columns, lightbox controls) · 560 (action rows stack full-width, deck bar,
field rows) · 360 (the header's auth button moves into the menu).

Everything must read and tap cleanly on a phone — the audience arrives from social.

### Below 900px: one column, centred

Every two-column shape has collapsed by 900, so there is no left/right distinction left to
hold. **Head copy centres; lists, forms, and long-form body copy keep their left edge.** A
heading that keeps a left rag inside a single centred column reads as a layout that broke,
not as a decision.

`mcenter` is the marker, and it does nothing above 900. It recentres the measures inside it
(`.lede`, `.sub`, `.narrow-*`, `.mission`, `.fineprint` all carry a `max-width` in `ch`,
which stays pinned left without it) and centres the flex rows (`.linkrow`, `.cta`,
`.legal`, `.where`, `.press`).

- **Applied structurally**, no markup needed: `<PhotoBand>`'s content, `.closer .in`, a
  page head's first column, the statement half of a `.say` / `.free-say`, the `.redband`
  copy, the press band, the contact panels.
- **Applied by hand** on the intro column of a `.split`, a lone section `h2`, a `.headrow`,
  a stats grid, a pull-quote.
- **Never** on: a form's fields (a label belongs over its input's left edge — only the
  form's own `h3` centres), the founder bio, hairline lists (`.ways`, `.facts`, `.pairs`,
  `.protect`, `.classlist`), the accordion, the timeline.

Below 560 every action row (`.linkrow`, `.cta`, `.cta-wrap`, `.state .actions`) becomes one
centred column of full-width buttons — two buttons sharing a phone row either wrap ragged or
squeeze their labels.

**Two things that only exist on a phone:** boxed `.field` inputs go to 16px under 700px
(iOS zooms the page in when a focused field is smaller), and the letters preview `.deck`
becomes a bleed-to-edge scroll-snap carousel rather than three stacked cards.

---

## The four signature devices

### 1. `<Mark>` — the brush underline

The emphasis device. A phrase in the same face and weight with an irregular red stroke
painted under it, left to right, as it scrolls in. Modelled on a kid ruling a line in with
a marker.

- Two stroke paths (`#sk-brush`, `#sk-brush2`); `alt` swaps to the second — alternate them
  when two marks sit near each other so the "hand" doesn't look like a stamp. `thin` for
  marks inside body copy.
- `fill:currentColor` must live **on the `<svg>`** — a `.mark svg path` rule cannot reach
  `<use>` shadow content, which is why the stroke first drew black.
- Draws in via `clip-path: inset(0 100% 0 0)` → `inset(0 -2% 0 0)`, 620ms.
- One mark per heading. Mark the phrase that carries the claim — `free`, `$0`,
  `actually`, `off the pile`, `don't bend` — never a whole clause.
- On a photo, `.mark--paper` keeps the stroke legible against the veil.

### 2. `<PhotoBand>` — the torn paper edge

The only way one section becomes another when a photo is involved: the paper rips open and
the image is behind it.

- Full-bleed photo, `scale(1.10)`, gentle ±26px parallax; a two-axis veil (a horizontal
  wash *and* a vertical one — a vertical-only veil can't hold text over a bright photo).
- The tear is a `<use>` of `#sk-tear-top` / `#sk-tear-bot` filled with the paper colour, so
  **`tearFill` must match whatever sits above and below**. It is only correct against paper.
- `hero` drops the top tear (nothing above it to tear) and takes the larger h1.
- `TornEdge` is exported separately for the two bands that tear the paper open without a
  photo: the About timeline and the Contact colour panels.

### 3. `<HandArrow>` — the arrow at the CTA

A scribbled red arrow that parks in the gutter to the left of a closing button and draws
itself in. It lives inside `.cta-wrap` (which is `position:relative`), and is decorative —
the button carries the meaning. The same squiggle, smaller, separates the three steps on
the Letters hero.

### 4. Hairline lists

Structure without boxes. Items are separated by a 1px `line` rule, the row is the link, and
the hover moves the text rather than filling a card:

- `.ways` — big Archivo title / description / a red "Email us →" that fades in on hover;
  the whole row slides 10px right.
- `.classlist` — name left, audience right, title slides 9px.
- `.facts` / `.pairs` / `.protect` — heading + one sentence, rules top and bottom.
- `.roles` — checkboxes as hairline rows, two columns.

Over a photo, drop the rules entirely (`.facts--onimg`): three stacked hairlines read as
three panels, which is the thing we removed everywhere else.

---

## Motion

One `IntersectionObserver` for the whole site (`components/ui/Reveal.tsx`), driven by
`data-reveal`. `<R>` is the wrapper that adds it plus a stagger delay.

| Thing | Movement |
| --- | --- |
| Reveal | 14px rise + fade, 420ms, `cubic-bezier(.22,1,.36,1)`; stagger a group ≤250ms total |
| Brush underline | clip-path wipe, 620ms, 120ms in |
| Hand arrow | dash draw, 850ms, 250ms in |
| Timeline | rule scales out 900ms; nodes pop 170ms apart; the "today" node is red with a glow |
| Photo band | image scale 1.10, ±26px parallax on scroll (rAF-throttled) |
| Buttons | `translateY(-1px)`; the `→` slides 3px |
| Cards | tier −3px, letter −5px and un-rotates; shadow deepens |
| Contact panels | body expands `grid-template-rows: 0fr → 1fr` (not `max-height` — 0fr→1fr interpolates to the real content height, so panels with different copy lengths finish on the same beat) |
| Tab switch | the red/green accent slides across 340ms; the panel fades out, swaps, fades in (190ms) |

**The no-JS contract:** every animated state must be the *finished* state by default.
Reveals only hide behind `html.reveal-on`, which a pre-paint script adds only when JS runs
and motion is allowed. **Never write a style that only looks right after `.is-visible`
lands.** `prefers-reduced-motion` freezes reveals, the brush, the arrow, the timeline, the
parallax, and the tile hovers.

> **Known drift:** the demos reveal at 420ms/14px; the app's global rule in `globals.css`
> is still 700ms/18px, so ported pages currently move slower than the spec. Fix by scoping
> a `.rd [data-reveal]` override, or by changing the global values at the flip.

---

## Components

### Chrome

- **Nav** — sticky, `ink` ground, 68px: Archivo wordmark, links in `rgba(bone,.72)` with a
  red 2px underline on hover/current, then "Log in" and a red **Donate** button. Links hide
  under 960px.
- **Footer** — `ink`, four columns (`1.5fr 1fr 1fr 1.3fr` → 2-up at 820px): brand +
  mission + the 501(c)(3) line, Explore, Get involved, Visit. Uppercase column headings.
  Bottom bar carries the copyright and the tax-deductible line.

### Page head (`.phead`)

H1 with one `<Mark>`, a 44ch sub, and — depending on the page — a photo, a give card, or a
pair of text links, in a `1.12fr .88fr` grid aligned to the baseline. No eyebrow.

### Statement blocks

- `.say` / `.free-say` — a big claim (`clamp(30px,3.8vw,50px)`) with the action as a
  `.tlink` on the right. This is what replaced every tinted callout.
- `.mission` — the mission sentence at `clamp(30px,4.4vw,58px)`, capped at 20–26ch,
  followed by `.legal`: a 34px gold rule and the registered-nonprofit line.
- `.stats` — four figures in Archivo over one hairline. Air between columns, never a band.
- `.tl` — the timeline on a photo band: date above the line, one fact below, the rule
  fading out past the last node (the org is still running; a hard stop reads like it ended).

### Cards (the only four)

- **Give card** — frequency segment, four amounts + "Another amount", a live impact line,
  one wide red button, and one line of alternatives. In the app it is `<GiveCard>` and
  keeps a second step (name + email) that writes the donation lead before handing off to
  the processor. **Don't "simplify" step two away.**
- **Tier** — price in Archivo 34px, what it buys, one button. Six of them, 3-across.
  The "you choose" tier is dashed and transparent.
- **Letter** — white, unbordered, each rotated ~1° and straightening on hover: name + age
  over a hairline, the wish, the one-line ask, a wide red "Gift this".
- **Swipe card** — 440px flip card: the letter on white on the front, the wish on ink on
  the back with a gold kicker, an Amazon CTA, and Next / Gift this beneath with a counter.

### Forms

Two treatments, chosen by what the form *is*:

- **On the paper** (`.form-paper`, default) — no card, no filled boxes. A field is a ruled
  line: uppercase 12px label, a 17px input with only a bottom rule, focus turns the rule
  red. Used on Contact and Volunteer.
- **Carded** (`.formcard`) — white, `1px line-strong`, soft shadow, boxed 15.5px inputs.
  Only where the form is the object of the page: the letters submit form.

Success is `.sent` — a 2px green rule and a sentence, never a filled panel. The guidance
`.rail` beside a form is labelled text (uppercase 12px heading, one line of muted copy),
colour-coded by heading colour only.

The letters consent block stays a scrollable text block, not a one-line checkbox — the
server stores the exact text and version a guardian accepted.

### Lists, accordion, closer

- `<details>` accordions with hairlines top and bottom, an Archivo summary and a chevron
  that rotates. This is how long explainers (tax, FAQ) are told.
- `.closer` — the page ending: air above it, no bar, a `clamp(25px,2.8vw,36px)` line and
  one sentence on the left, one ink button (often with the hand arrow) on the right.

### Contact panels

Three full-bleed colour panels (green / red / gold), entered through torn edges, each a
link: the heading sits at the bottom and lifts 4px on hover while the body copy expands
under it. Below 821px the body is always shown — hover doesn't exist on a phone.

### Sponsor and press walls

Logos sit **straight on the paper**, no tiles: grayscale, `mix-blend-mode:multiply` to drop
each logo's own white background into the cream, colour and a 2px lift on hover. Sponsors
without a logo file appear as their name in Archivo 800. Press is the same treatment at
24px, under a small "Seen in" label.

### Gallery

CSS-column masonry (4 / 3 / 2), tiles keyed to each photo's real aspect ratio so nothing
reflows, staggered reveal capped at 8 tiles. The lightbox is ink at 96%: click, arrow keys,
Esc, and pointer drag to move between photos; focus is trapped and returned. No shadow on
the image — against a 96% backdrop it renders as nothing.

---

## Accessibility

- Focus is visible everywhere: `red` outline on paper, `paper` outline on colour panels and
  photo bands. Never remove it.
- The tab switch is a real `role="tablist"` with `aria-selected`; the swipe card is a
  keyboard-activatable control with a live `aria-label` naming the letter and position.
- Photos inside a `<PhotoBand>` are decorative (`alt=""`, `aria-hidden`) — the copy on top
  carries the meaning. Content photos get real alt text describing what is happening.
- Contrast: `muted` on `paper` is for secondary copy, never for anything ≤13px that
  matters. On a photo, always the veil plus `rgba(paper,.78+)`.
- Every interactive row is a real `<a>` or `<button>`, not a click handler on a div.
- Child privacy is a design constraint: a letter shows a first name, an age, the wish, and
  the letter image — never a last name, address, school, or handle.

---

## Gotchas

Learned the hard way; each one cost a debugging session.

- `.mark svg path { fill }` does **not** reach `<use>` shadow content — put
  `fill:currentColor` on the `<svg>`.
- `.mark` is an **inline-block**, so there is a line-break opportunity right after it. In a
  heading long enough to wrap, the punctuation following a mark can orphan onto its own line
  (`… is free` / `. Somebody pays for it.`). Keep the mark away from the end of a multi-line
  heading, or wrap mark + punctuation in a `white-space:nowrap` span.
- A marked phrase **longer than the space left on its line wraps anyway** — `nowrap` can't
  save an inline-block that doesn't fit — and the stroke then draws under the first fragment
  only. This is the mechanical reason for "mark the word that carries the claim, never a
  whole clause": long marks don't just read badly, they render wrong.
- Percentage margins on a **grid child** resolve against the grid track, so
  `margin-right:calc(50% - 50vw)` doesn't bleed. Use `--edge`.
- **`padding: <v> 0` on a `.rd-wrap content` div silently deletes the page gutter.** The
  shorthand's horizontal `0` outranks `.rd-wrap`'s own `padding: 0 var(--gutter)`, so band
  copy runs flush to the viewport edge — invisible at 1440 where the column is inset anyway,
  obvious at 390. It shipped that way — `.rd .imgsec .content`, `.imgsec--hero .content`, and
  `.imgsec--tl .content` all used the shorthand, so every `<PhotoBand>` heading on `/donate`,
  `/membership`, `/letters`, and `/santas-knights` touched the screen edge on a phone. **Fixed
  with the demo-3 port**: all three are `padding-top` / `padding-bottom` longhand now. Keep
  them that way.
- `.bleed-left` is a single class (`0,1,0`). **Any** rule that sets `margin` on the same
  element and scores higher kills the bleed — not just the inline `margin:0` already noted,
  but an ordinary descendant rule like `.redband figure { margin: 0 }` (`0,2,0`). The symptom
  is a photo that sits obediently at the content edge instead of running off the viewport.
- **`.ways` rows don't share column widths.** Every row is its own grid, so the tracks are
  sized per row: the `auto` action column takes the width of *that row's* label, which
  changes what's left for the flexible first column, which staggers where each description
  starts. Demo 2 hid this because all three of its rows end in the same words ("Email us →").
  The moment the labels differ the copy's left edge goes ragged by ~15px and reads as a
  rendering fault. It shipped that way — `.rd .ways a` used `minmax(180px, 0.34fr) 1fr auto`,
  and `/donate`'s "Other ways to help" has four rows with four different labels. **Fixed with
  the demo-3 port**: column 1 is now a **percentage** (`minmax(180px, 34%)`, which resolves
  against each row's own width — identical for every row) and `.ways em` carries a `min-width`
  so column 3 is stable too. All four `/donate` rows start their copy on the same pixel.
- The first `.ways` row's `border-top` sits directly under the section heading. At demo 2's
  `margin-top:10px` it reads as an underline of the h2 rather than the top of the list —
  demo 2 got away with it only because a second line of copy sat in that gap. A heading
  standing alone needs `clamp(22px,2.6vw,36px)` above the list: that is `.ways--air`, which
  the homepage adds and `/donate` (whose heading has a second line under it) does not.
- **A full-bleed page with no footer has to reach the bottom of the viewport itself.**
  `<body>` is still ink under the redesign layer, so wherever the `.rd` wrapper stops short,
  a dark strip shows below it and the page reads as broken. It bit `/login` and `/signup`
  stacked on a phone, where the demo drops the auth grid's `min-height` to 0. Keep the
  `100vh` floor and stretch the form row (`grid-template-rows: auto 1fr`) instead. This
  disappears at the global flip, when `body` goes paper.
- **The reveal observer's own DOM writes look like a hydration mismatch.** `<Mark>` and
  `[data-reveal]` get `.is-visible` written onto them by `components/ui/Reveal.tsx`. Inside a
  `<Suspense>` boundary that hydrates after the root layout — the `(auth)` group, which needs
  it for `useSearchParams` — the class is on the node before React reaches it, and React
  reports its own mutation as a mismatch. `<Mark>` carries `suppressHydrationWarning` for
  this. Any new client-rendered reveal in a Suspense boundary needs the same.
- `width: 100vw` (i.e. `.bleed`) **counts the scrollbar**. Harmless under a solid band or a
  cover photo, but on a grid of images it pushes the last column ~15px past the content edge
  and shaves it. A plain block child of a full-width section is already edge to edge.
- A vertical-only veil can't hold text over a bright photo — add the horizontal wash.
- `tearFill` must match the sections above *and* below the band, or the tear shows a seam.
  It is **not** always paper. Where two full-bleed bands run flush — the homepage's red
  Letters band into the Gladiators `<PhotoBand>` — the lower band's top tear is filled with
  the *upper band's* colour (`#9E2536`), and the upper band drops its bottom tear entirely.
  Giving both bands their own paper-filled tear is what puts a strip of paper between them.
- Use `grid-template-rows: 0fr → 1fr` for expanding copy, not a guessed `max-height`.
- `input:not([type="checkbox"])` in the ruled-field rule — a checkbox stripped of its
  border is an invisible control.
- Anchor targets need `scroll-margin-top`, or the sticky nav eats the heading.
- Full-bleed sections make horizontal overflow the likeliest regression: check
  `document.documentElement.scrollWidth > window.innerWidth` is `false` at 1440px and 390px.

---

## Agent prompt guide

When generating a screen or component for this product:

- Wrap the page in `<RedesignShell>` and the content column in `<Wrap>`. Use the named
  classes in `app/redesign.css` before reaching for Tailwind one-offs.
- Paper ground. Ink only in nav and footer. If you are about to add a coloured section
  band, you are about to break rule 1.
- Archivo 800 sentence-case headings, one `<Mark>` on the phrase that carries the claim.
  No `<em>`, no `font-serif`, no eyebrow, no `01`/`02`.
- Separate sections with air, or a `<PhotoBand>`. Never a rule, never a bordered box grid.
- Lists get hairlines between items. Guidance gets a label and a sentence, not a tint.
- Every animated element must render finished without JS. Reveal with `<R>`; keep a
  staggered group under ~250ms.
- Square corners, 1.5px borders, soft warm shadows only under white paper objects.
- Say the nonprofit facts once, in the shortest true form: free · 501(c)(3) ·
  tax-deductible. Payments are external (Amazon, PayPal/Venmo, Eventbrite,
  gladiators.nyc) — never build on-site checkout.
- Pull every value from the tokens above. Don't invent a colour, a size, or a shadow.

---

## What this document does not cover

- **Pages not yet ported** still run the old "Poster" system (Archivo uppercase, Cormorant
  italics, dark grounds, flood bands). The two systems invert each other and must never
  meet on one screen. The status table and the flip checklist are in
  [`design-demos/REDESIGN-SYSTEM.md`](./design-demos/REDESIGN-SYSTEM.md).
- **`/login` and `/signup`** are **built** on the paper ground, per
  [`design-demos/redesign3.html`](./design-demos/redesign3.html): ruled `.form-paper` fields,
  the photo kept as a full-height panel down the left edge, and the Log in / Sign up switch
  as the Adopt/Submit control, unchanged. The dark `.theme-steel` scene that mirrored
  `gladiators.nyc` is **gone**, and so is the class — nothing else used it. There is no
  explanatory copy on either page: no "one account, both sites", no 18+ paragraph under the
  button, no "back to santasknights.org" (the wordmark on the panel is that link). The one
  thing the demo drew that isn't built is the **"Forgot your password?"** link — there is no
  password-reset flow in the app, and a link to nowhere is worse than its absence. Add the
  link when the flow exists.
- **The homepage** is **built**, to
  [`design-demos/redesign3.html`](./design-demos/redesign3.html). The hero is a full-bleed
  torn-edge `<PhotoBand>` (`hero`, so no top tear) carrying the h1, a `.facts--onimg` row,
  and two buttons — no lede, since the three columns are the substance and a summary
  sentence above them only said the same thing in worse order. The earlier framed
  photo-grid variant was cut. **The old page's words
  are kept verbatim** — the mission statement, the Santa's Letters paragraph, the founder's
  quote about the two programs, and the eight-outlet press wall are the originals, reset in
  Archivo/Hanken. Only the shapes changed, and two of them barely: Santa's Letters keeps its
  red band and the press strip keeps its dark one (see the exceptions above). The two
  side-by-side pillars are gone — Gladiators NYC takes a second `<PhotoBand>` instead.
  Section order is hero → mission → red letters band → Gladiators band → founder quote →
  ways to help → press band → closer. Three of those carry a photo beside their copy —
  mission, Letters, founder — each stopping at the page column, none bleeding.
  The two verbatim passages (`missionStatement`, `founder.programsQuote`) are **not** retyped
  into the page: `app/page.tsx` slices the string around the one word the brush goes under, so
  the copy cannot drift from `content/site.ts`, and a word that moves costs the emphasis
  rather than the sentence.
- The quote block parked at
  [`design-demos/parked/founder-quote.html`](./design-demos/parked/founder-quote.html) —
  the quote in Archivo 600 with a brush underline — is the layout the homepage founder quote
  now uses, carrying the old homepage's two-programs quote rather than the parked Gothamist
  one. **Two changes from the parked file:** the photo no longer bleeds off the left viewport
  edge (it stops at the page column, like the Letters band), and the image column is narrower
  and taller — the parked block was drawn for a wide environmental photo, and with the square
  `headshot.png` a wide column makes `cover` crop the portrait into a letterbox of face. Do
  not paraphrase either quote.
- **`.bleed-left` is no longer used on the homepage.** Both photos that used it now stop at
  the page column. The rule survives in the parked file only; don't reintroduce it without
  checking that a photo running off the viewport edge is actually wanted.
