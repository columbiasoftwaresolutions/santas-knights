---
# DESIGN.md — machine-readable design tokens
# Format: Google Stitch DESIGN.md (alpha). Derived from santas-knights-home.html.
meta:
  name: Santa's Knights
  product: Santa's Knights nonprofit hub (with embedded Gladiators NYC combat brand)
  version: 0.1.0
  status: alpha

colors:
  # Santa's Knights — warm, charitable wrapper
  paper:        "#F7F0E3"   # app background / primary surface
  paperRaised:  "#FBF6EC"   # alternate surface, strips
  card:         "#FFFFFF"   # card surface
  ink:          "#221D17"   # primary text + dark UI surfaces
  muted:        "#6C6256"   # secondary text
  red:          "#9E2536"   # primary brand / CTA
  redDeep:      "#741726"   # primary hover / pressed
  green:        "#2E5E45"   # secondary — giving / community
  greenSoft:    "#E7EFE8"   # green tint surface
  gold:         "#C2912F"   # accent
  goldSoft:     "#F0E2C2"   # accent tint surface
  line:         "#E4D8C4"   # borders / dividers
  focus:        "#9E2536"   # focus ring (= red)
  # Gladiators NYC — steel combat sub-brand
  steel:        "#16171A"   # dark combat surface
  gladRed:      "#C2331F"   # combat accent / CTA
  gladAmber:    "#C98A3A"   # combat eyebrow accent
  bone:         "#E8E2D4"   # text on steel

typography:
  families:
    sans:  '"Hanken Grotesk", system-ui, sans-serif'   # UI + display
    serif: '"Fraunces", Georgia, serif'                 # editorial emphasis (italic)
  base:
    size: "18px"
    lineHeight: 1.55
  weights: [400, 500, 600, 700, 800, 900]
  scale:
    display:  { size: "clamp(44px,5.8vw,76px)", weight: 900, lineHeight: 1.05, letterSpacing: "-0.035em" }
    h2:       { size: "clamp(30px,3.6vw,46px)", weight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }
    h3:       { size: "25px",  weight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }
    lede:     { size: "20px",  weight: 400, lineHeight: 1.55 }
    body:     { size: "18px",  weight: 400, lineHeight: 1.55 }
    small:    { size: "15px",  weight: 600 }
    eyebrow:  { size: "13px",  weight: 700, letterSpacing: "0.16em", transform: "uppercase" }
    quote:    { family: serif, size: "clamp(26px,3.4vw,40px)", weight: 500, lineHeight: 1.3 }

spacing:
  unit: 2
  scale: [8, 12, 14, 18, 22, 26, 32, 38, 46, 54, 64, 74]   # px
  layout:
    maxWidth: "1220px"
    gutter: "32px"
    sectionY: "74px"

roundedCorners:
  sm: "7px"
  md: "14px"
  lg: "18px"
  xl: "22px"
  "2xl": "26px"
  pill: "999px"

elevation:
  cta:    "0 10px 24px -10px rgba(178,58,46,.60)"
  badge:  "0 24px 46px -20px rgba(34,29,23,.40)"
  card:   "0 26px 50px -28px rgba(34,29,23,.45)"   # on hover

components:
  button:
    radius: pill
    padding: "15px 26px"
    fontSize: "16px"
    fontWeight: 700
    hover: "translateY(-2px)"
    variants:
      red:   { bg: red,   fg: "#FFFFFF", shadow: cta, hover: redDeep }
      ink:   { bg: ink,   fg: paper,     hover: "#000000" }
      ghost: { bg: transparent, fg: ink, border: ink, hover: "fill ink" }
      green: { bg: green, fg: "#FFFFFF" }
      cream: { bg: paper, fg: ink }
      onRed: { bg: "#FFFFFF", fg: redDeep, hover: goldSoft }   # on red bands
      steel: { bg: gladRed, fg: "#FFFFFF" }                    # Gladiators
      bone:  { bg: transparent, fg: bone, border: "rgba(232,226,212,.4)" }  # Gladiators
  card:
    bg: card
    border: "1px solid line"
    radius: xl
    hover: "translateY(-4px) + elevation.card"
  input:
    radius: pill
    border: "1.5px solid gold"
    padding: "13px 18px"
    focus: "2px solid red"
  placeholder:   # image stand-in used throughout the mock
    light: "repeating-linear-gradient(135deg,#EBE0CB 0 14px,#E3D6BD 14px 28px)"
    dark:  "repeating-linear-gradient(135deg,#212327 0 14px,#282b30 14px 28px)"
---

# Santa's Knights — Design System

## Overview

Santa's Knights is a 501(c)(3) nonprofit bringing **free** martial arts, fitness, and community to Harlem. The design system carries **two tones in one product**:

- **Santa's Knights (default / wrapper)** — warm, hopeful, trustworthy. A cream "paper" canvas, deep brand red, community green, and gold accents. Editorial serif (Fraunces) used in italic for emotional emphasis. This is the charitable, welcoming voice that fronts the org, donations, and Letters to Santa.
- **Gladiators NYC (sub-brand section)** — gritty, intense, medieval-meets-modern. Near-black steel surfaces, a hotter orange-red, bone-colored text. Used only for the combat program's section as a deliberate *tonal bridge* into "the steel world."

The system is designed so the warm wrapper can hand off to the steel sub-brand without feeling like two different products: same typeface, same geometry (pills, rounded cards), same spacing — only the surface palette and intensity shift.

## Colors

Warm wrapper palette (Santa's Knights):

| Role | Token | Hex |
| --- | --- | --- |
| Background | `paper` | `#F7F0E3` |
| Alt surface | `paperRaised` | `#FBF6EC` |
| Card | `card` | `#FFFFFF` |
| Primary text / dark UI | `ink` | `#221D17` |
| Secondary text | `muted` | `#6C6256` |
| Primary brand / CTA | `red` | `#9E2536` |
| Primary hover | `redDeep` | `#741726` |
| Secondary (giving) | `green` | `#2E5E45` |
| Green tint | `greenSoft` | `#E7EFE8` |
| Accent | `gold` | `#C2912F` |
| Accent tint | `goldSoft` | `#F0E2C2` |
| Border / divider | `line` | `#E4D8C4` |

Steel sub-brand palette (Gladiators NYC):

| Role | Token | Hex |
| --- | --- | --- |
| Dark surface | `steel` | `#16171A` |
| Combat accent / CTA | `gladRed` | `#C2331F` |
| Combat eyebrow | `gladAmber` | `#C98A3A` |
| Text on steel | `bone` | `#E8E2D4` |

**Roles & usage.** `red` is the single primary CTA color in the warm world; `green` is reserved for giving/community contexts (Letters to Santa, "Service & events"); `gold` is accent-only (eyebrows, tints, decorative crowns), never a primary action. On `steel` sections, switch to `gladRed` for actions and `bone` for text. Color alone never carries meaning — pair with label/icon.

## Typography

- **Sans — Hanken Grotesk** is the workhorse for UI, navigation, and display headings. Headings run heavy (800–900) with tight tracking (`-0.02em` to `-0.035em`) and a compressed line-height (1.05) for a confident, athletic feel.
- **Serif — Fraunces**, used **in italic at 500–600 weight**, appears only as emotional/editorial emphasis: a highlighted word inside a headline (`<em>everyone</em>`), the mission pull-quote, and stat flourishes. Never use Fraunces for body copy or UI controls.
- **Eyebrows** (13px, 700, `0.16em`, uppercase, usually `red`) label every section.
- Base body is **18px / 1.55** for comfortable reading; ledes step up to 20px in `muted`.

## Layout

- Centered content column, **max-width `1220px`**, horizontal gutter **`32px`**.
- Vertical rhythm: full sections ~**`74px`** top/bottom; tighter clusters use the spacing scale (`8 → 74`).
- Primary structure is **two-column grids** (`~1fr 1fr`, hero `1.04fr .96fr`) that **collapse to a single column** at the breakpoints below.
- Breakpoints (max-width): `980px` (nav links hide), `880px` (hero stacks), `820px`/`780px`/`720px` (grids → 1–2 col).
- Mobile-first intent: everything must read and tap cleanly on a phone (audience is social-media-driven).

## Elevation & Depth

- Depth is **soft and warm**, not hard drop-shadows. Shadows are large, offset down, low-opacity, and tinted toward ink/red — e.g. CTA glow `0 10px 24px -10px rgba(178,58,46,.6)`, card hover `0 26px 50px -28px rgba(34,29,23,.45)`.
- **Hover = lift**: buttons rise `2px`, cards rise `4px` and gain the card shadow.
- The **sticky nav** is a translucent paper bar (`rgba(247,240,227,.88)`) with `backdrop-filter: blur(10px)` and a bottom hairline.
- **Tonal depth via dark bands**: the `steel` Gladiators teaser and `ink` footer create contrast valleys; the `red` donate band is a high-saturation peak. These full-bleed colored bands are the main device for sectioning, often with an oversized translucent glyph (`♔`, `✶`) bleeding off-edge.

## Shapes

- **Pills everywhere for actions**: buttons and inputs use `radius: pill (999px)`.
- **Cards & panels** use `xl (22px)`; the Letters card uses `2xl (26px)`; media/photos `lg (16–20px)`; small chips/date chips `md (14px)`; logo placeholders `sm (7px)`.
- Decorative **circular crest** (`♔` in a red disc) is the brand mark; social icons are 36px circles.
- Image placeholders are diagonal hatch fills (light on warm surfaces, dark on steel) labeled with the intended photo direction.

## Components

- **Utility bar** — slim `ink` bar; left "501(c)(3) · 100% free" status badge (green dot), right donation quick-links (Donate · PayPal · Venmo).
- **Nav** — sticky translucent paper bar: crest + wordmark, center links, right-aligned "Gladiators NYC ↗" (ghost) + "Donate" (red). Gladiators link hover underlines in `steel`, others in `red`.
- **Hero** — two-column: heading with serif-italic emphasis word + lede + CTA pair + reassurance note; media side has a 4:5 photo with an overlapping white stat badge.
- **Impact strip** — 4 stats on `paperRaised`; big number with a small serif-italic red unit suffix.
- **Mission quote** — large serif pull-quote with red italic emphasis and a gold-rule byline.
- **Pillar cards** — two linked cards (`train` red-tagged / `give` green-tagged): media + tag chip + title + copy + colored "go" arrow link.
- **Gladiators teaser** — full-bleed `steel` band (tonal bridge), uppercase heavy heading, amber eyebrow, meta stat row, `steel`/`bone` buttons, radial red glow overlay.
- **Letters to Santa** — `green` gradient card with cream/clear buttons and a faint corner `✶`.
- **Event + Newsletter** — white event card with an ink date-chip; gold-soft newsletter card with pill email input + red submit.
- **Press row** — centered "As featured in" with grayscale logo placeholders.
- **Donate band** — full-bleed `red` with oversized `♔` watermark; white + ink buttons.
- **Footer** — `ink`, 4-column (brand/mission + 501(c)(3) note, Explore, Visit, Follow), bottom bar with copyright + circular socials.

## Do's and Don'ts

**Do**
- Keep the warm `paper` canvas as the default; reserve `steel` strictly for Gladiators content.
- Use `red` for primary actions, `green` for giving/community, `gold` for accent only.
- Lead sections with an uppercase eyebrow; use Fraunces italic sparingly for one emphasis beat per block.
- Maintain pill buttons, `xl` cards, and the 1220px/32px layout frame across new pages.
- Reinforce "100% free · 501(c)(3) · tax-deductible" wherever donations or classes appear.

**Don't**
- Don't mix the steel palette into warm sections (or vice-versa) — the hand-off should be a clean, intentional band.
- Don't set body copy or UI controls in Fraunces; don't use gold as a primary action color.
- Don't introduce hard, high-contrast drop shadows — keep elevation soft and warm.
- Don't rely on color alone to signal meaning; keep labels/icons.
- Don't add on-site payment/e-commerce UI — Donate/Shop/Tickets/Gifts are external redirects (see REQUIREMENTS.md).

## Agent Prompt Guide

When generating new screens or components for this product:

- Default to the **Santa's Knights warm theme** (`paper` background, `ink` text, `red` primary). Only switch to the **Gladiators steel theme** (`steel` background, `bone` text, `gladRed` primary) for combat-program screens, and mark the transition with a full-bleed band.
- Pull all colors, type, spacing, radii, and shadows from the YAML tokens above — do not invent values.
- Headings: Hanken Grotesk 800–900, tight tracking; one optional Fraunces-italic emphasis word in red.
- Every section starts with an uppercase eyebrow; primary CTA is a red pill that lifts on hover.
- Layout: 1220px max width, 32px gutters, two-column grids that collapse to one column on mobile; design mobile-first.
- Always surface the nonprofit framing (free / 501(c)(3) / tax-deductible) near classes or donations.
- Source of truth for behavior/scope: `README.md` and `docs/REQUIREMENTS.md`. Reference mock: `santas-knights-home.html`.
