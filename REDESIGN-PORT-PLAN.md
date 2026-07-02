# Redesign port plan — "Poster" system → Next.js frontend

Porting the approved **"Poster"** visual design (warm near-black grounds, Archivo 900
uppercase display, Fraunces italic serif accents, Hanken body; red/amber accents on warm
paper; duotone photography; flood-color emphasis bands) **with the homepage hero from
"Design A"** (warm-paper, serif headline + italic-red accent + community photo) into the
real app.

- **Branch:** `redesign/poster-system`
- **Visual spec:** the static mockups in `design-demos/` (`home.html` is canonical; `styles.css` is the token reference).
- **Approach:** reskin in place — keep the component tree, `content/site.ts`, and Supabase wiring; replace only the visual layer. One branch, fully ported before merge (the theme flips dark, so half-ported `main` would look broken).

## Locked decisions
1. **`/letters/give`** keeps the existing **`SwipeDeck`** (swipe) interaction, reskinned.
2. **Tokens** are repointed in place (no rename) to minimize ripple.
3. **Migration** = single branch: foundation → chrome → homepage → content pages → account/admin.
4. **No eyebrows/kickers** anywhere (global). `Eyebrow.tsx` to be removed once unused.

## Phase status

### Phase 0 — Foundation ✅ DONE
- `app/layout.tsx`: added `Archivo` via `next/font` (`--font-archivo`); Fraunces gained weight 400.
- `app/globals.css` `@theme`: repointed `--color-ink #16120f`, added `--color-ink2 #1a1512`,
  promoted `--color-bone`, `--color-red #c2331f`, `--color-red-deep #9e2536`, `--color-amber #c98a3a`,
  added `--font-display` (→ `font-display` utility). Body flipped to `bg-ink text-bone`.
- Removed `UtilityBar` from the layout.

### Phase 1 — Chrome + UI primitives ✅ DONE
- `components/layout/Navbar.tsx` — dark poster nav (dropdowns + mobile kept).
- `components/layout/Footer.tsx` — dark poster footer (uses `footerColumns`).
- `components/layout/Brand.tsx` — Archivo wordmark + amber trademark (♔ emoji removed).
- `components/ui/Button.tsx` — square + uppercase, added `size` (`md`/`lg`).
- `components/ui/Photo.tsx` — added `duotone` prop (`cool` ink→red / `warm` ink→amber).
- `components/ui/Container.tsx` — widened to `max-w-[1440px]`, 24/56px gutters.

### Phase 2 — Homepage ✅ DONE (verified rendering at localhost)
Rewrote each section to the demo and recomposed `app/page.tsx`:
`Hero` (paper) · `ImpactStrip` (red stats band) · `Mission` (giant `01`) · `Pillars` (two duotone blocks) ·
`LettersToSanta` (flood-red feature + steps) · `GladiatorsTeaser` (steel chips + founder quote) ·
`Press` (dark strip) · `Partners` (new — "In good company" tiles) · `DonateBand` (oversized closing CTA).

### Phase 3 — Content pages ✅ DONE
Each demo file is the spec. Restyle a shared `PageHero` for inner pages. Forms keep their
existing client components + server actions (reskin only). Real data, not the demo's samples.

| Route | Demo spec | Notes |
| --- | --- | --- |
| `/about` | `about.html` | story timeline, founder block (`#founder`), values |
| `/donate` | `donate.html` | ways to give, tax list, membership teaser |
| `/letters` | `letters.html` | overview: feature + steps + origin + privacy + gift guidance |
| `/letters/give` | `letters-give.html` | **keep `SwipeDeck`** (swipe); reads `public_letters` |
| `/letters/submit` | `letters-submit.html` | reskin `SubmitLetterForm`; keep server action + consent |
| `/get-involved` | `get-involved.html` | ways to help, volunteer roles, ways to give |
| `/contact` | `contact.html` | reskin `ContactForm`; details + FAQs |
| `/sponsors` | `sponsors.html` | partner tiles + press strip |
| `/links` | `links.html` | link-in-bio, minimal centered layout |
| `/membership` | `membership.html` | 6 tiers; free tier distinct; billing URLs manual |
| `/training` | `training.html` | class catalog (content); **Book Now** CTAs **link out to `gladiators.nyc`** (training tracker on `gladiators.nyc` — Plan v2 §B3). _Booking flow not wired; CTAs are placeholders until that site is live._ |
| `/online` | `online.html` | content page; video embeds + (later) uploaded training videos |
| `/gallery` | `gallery.html` | 4 real photos + honest placeholders |

### Phase 4 — Account + Admin ✅ DONE
`/account` (+`/login`,`/register`) and `/admin` (+`/login`). Reskin `AdminLoginForm` and the
moderation dashboard; keep `app/admin/actions.ts`, `lib/auth.ts`, and the gating/empty-states.

## Cross-cutting (every page)
- Real data via `isSupabaseConfigured()` + restyled empty-states; demos used placeholders.
- No eyebrows; `noindex` stays (ROLLOUT.md); responsive + a11y pass; CHANGELOG row at commit time.
- Update `DESIGN.md`/`CLAUDE.md` token docs so they don't drift from `globals.css`.

## Cleanup at the end
- ✅ Removed `components/ui/Eyebrow.tsx` and `components/layout/UtilityBar.tsx`.
- ✅ Deleted superseded exploration HTML (`A-warm-editorial.html`, `v2-*.html`) from `design-demos/`.

## Verification — 2026-06-19

- ✅ `npm run lint`
- ✅ `npx tsc --noEmit`
- ✅ `npm run build`
- ✅ Desktop + mobile browser review of home, About, Gallery, and letter submission
- ✅ Full real-Supabase E2E: submit three letters → admin login/moderation → donor swipe deck →
  fulfill one letter → verify pool shrinks
- ✅ E2E mock rows and uploaded images cleaned up afterward
- The beta Supabase database still uses legacy `amazon_url`; the app now reads/writes that shape
  as a compatibility fallback while retaining documented `amazon_urls` multi-link support for the
  eventual schema migration.
