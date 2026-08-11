import { cn } from "@/lib/cn";

/**
 * Emphasis in the redesign system: the phrase stays in the same sans face and a
 * hand-drawn red brush stroke is painted underneath it, left to right, as it
 * scrolls into view.
 *
 * This replaces the old system's Cormorant italic accents outright — rule 2 of
 * the redesign (see app/redesign.css). Never wrap a word in <em>/italics to
 * emphasise it on a redesigned page; wrap it in <Mark>.
 *
 * The draw-in rides the app's single IntersectionObserver (components/ui/Reveal)
 * via `data-reveal`. When the observer isn't armed — no JS, reduced motion, or a
 * crawler — the stroke simply renders drawn, so emphasis is never lost.
 *
 * `alt` swaps to the second, differently-wobbled stroke. Alternate them when two
 * marks sit close together so the "hand" doesn't look like a stamp.
 */
export function Mark({
  children,
  alt = false,
  thin = false,
  className,
}: {
  children: React.ReactNode;
  alt?: boolean;
  /** A lighter stroke, for marks inside body copy rather than headlines. */
  thin?: boolean;
  className?: string;
}) {
  return (
    // suppressHydrationWarning: the reveal observer writes `.is-visible` onto
    // this node as soon as it scrolls in. Inside a <Suspense> boundary that
    // hydrates later than the root layout — /login and /signup — the class is
    // already on the DOM node by the time React reaches it, and React reports
    // the mutation it caused itself as a mismatch. Same reason <html> carries
    // the flag for the pre-paint `reveal-on` script.
    <span
      data-reveal
      suppressHydrationWarning
      className={cn("mark", thin && "mark--thin", className)}
    >
      {children}
      <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden focusable="false">
        <use href={alt ? "#sk-brush2" : "#sk-brush"} />
      </svg>
    </span>
  );
}
