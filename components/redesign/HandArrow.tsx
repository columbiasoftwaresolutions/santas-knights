/**
 * The hand-drawn arrow that points at a closing CTA — the redesign's answer to
 * the old poster CTA band. It parks in the gutter to the left of the button, so
 * it belongs inside a `.cta-wrap` (which is `position: relative`).
 *
 * The stroke draws itself in on scroll when the reveal observer is armed, and
 * renders finished otherwise — same contract as <Mark>. It's decorative: the
 * button next to it carries the meaning, so it is `aria-hidden`.
 */
export function HandArrow() {
  return (
    <svg
      className="arrow-hand"
      data-reveal
      width="96"
      height="58"
      viewBox="0 0 96 58"
      aria-hidden
      focusable="false"
      style={{ left: -104, top: -16 }}
    >
      <path d="M4 6C13 26 30 41 56 45.5" />
      <path d="M45 34c4.4 4.4 8 8.3 11.5 11.8M43.5 51.5c4.6-1.6 8.8-3.7 13-6" />
    </svg>
  );
}
