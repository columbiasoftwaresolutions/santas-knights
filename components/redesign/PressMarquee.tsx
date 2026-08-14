import { pressLogos } from "@/content/site";
import { R } from "@/components/redesign/Reveal";

/**
 * One pass of the outlets. Rendered twice inside the track — the second copy is
 * what the first scrolls into, so the loop never shows a gap. That copy is
 * `aria-hidden` and its links leave the tab order: it is the same eight
 * articles, and a screen reader or a Tab key hitting all sixteen would read as
 * a bug.
 *
 * Every mark uses its `white` cut, drawn straight onto the photo with no plate
 * behind it. Marks are sized one by one rather than to a shared height — see
 * `pressLogos` in content/site.ts for why a disc has to stand taller than a
 * line of caps to weigh the same.
 */
function Pass({ clone = false }: { clone?: boolean }) {
  return (
    <ul aria-hidden={clone || undefined}>
      {pressLogos.map((logo) => {
        const mark = logo.white;
        if (!mark) return null;
        return (
          <li key={logo.name}>
            <a
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={clone ? -1 : undefined}
              title={`${logo.name} — read the story`}
              aria-label={
                clone ? undefined : `${logo.name}: read the article (opens in a new tab)`
              }
            >
              {/* Plain <img> so every mark keeps its true aspect ratio; these
                  are small static files. Not lazy — the strip is in the hero,
                  above the fold on every screen this site sees. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* The height goes through a custom property rather than
                  straight onto `height`, so one media query can scale the whole
                  set on a phone without eight overrides. Width stays `auto`;
                  the width/height attributes carry the aspect ratio. */}
              <img
                src={mark.src}
                alt={clone ? "" : logo.name}
                width={mark.width}
                height={mark.height}
                decoding="async"
                style={{ "--mark-h": `${mark.displayHeight}px` } as React.CSSProperties}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "As seen in" — the press strip, as a slow autoscrolling line across the foot
 * of the hero. Full-bleed on purpose: the marks run out past the 1240px column
 * and fade at both edges, so the line reads as continuous rather than as a
 * widget that starts and stops.
 *
 * It pauses on hover and on keyboard focus, because every mark is a link to the
 * actual article and a moving target can't be clicked. With `prefers-reduced-
 * motion` it doesn't move at all — it becomes a normal horizontal scroller.
 */
export function PressMarquee() {
  return (
    <R className="pressmarq" delay={240}>
      <p className="lbl">As seen in</p>
      {/* Not a <ul> wrapper: the two passes are the list. The group role +
          label is what names the strip for assistive tech. */}
      <div className="marq" role="group" aria-label="Press coverage">
        <div className="marq-track">
          <Pass />
          <Pass clone />
        </div>
      </div>
    </R>
  );
}
