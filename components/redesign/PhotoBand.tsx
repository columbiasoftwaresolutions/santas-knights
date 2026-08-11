import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A full-bleed photo section that the paper tears open into.
 *
 * Rule 5 of the redesign: no horizontal divider bars anywhere. Sections are
 * separated either by air, or — when there's a photo — by a torn paper edge, so
 * the paper appears to rip and reveal the image behind it. The tear is filled
 * with the paper color, which is why `tearFill` must match whatever sits above
 * and below; it is only correct against a paper ground.
 *
 * `hero` drops the top tear (nothing above it to tear) and enlarges the H1.
 * Parallax on the background image is added by <RedesignParallax>, mounted once
 * per page by <RedesignShell>.
 *
 * `topTearFill` exists for the case where the two edges don't face the same
 * thing: on the homepage this band runs flush under the red Letters band, so
 * its top tear is filled `red-deep` while its bottom tear is paper. Filling
 * both with paper is what puts a strip of paper between two flush bands.
 */
export function PhotoBand({
  src,
  objectPosition,
  hero = false,
  priority = false,
  tearFill = "var(--color-paper)",
  topTearFill = tearFill,
  className,
  children,
}: {
  src: string;
  objectPosition?: string;
  hero?: boolean;
  priority?: boolean;
  /** Must match the section color above/below the band. */
  tearFill?: string;
  /** Override for the top edge alone, when the section above isn't paper. */
  topTearFill?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("bleed imgsec", hero && "imgsec--hero", className)}>
      {/* Decorative: the copy on top carries the meaning, so no alt text. */}
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        priority={priority}
        sizes="100vw"
        className="bg"
        style={objectPosition ? { objectPosition } : undefined}
      />
      <div className="veil" />
      {!hero && <TornEdge edge="top" fill={topTearFill} />}
      <TornEdge edge="bottom" fill={tearFill} />
      {/* `mcenter`: below 900px the band is a single column with nothing to its
          left or right, so the copy centres over the photo rather than keeping a
          left rag that reads as a column that failed to fill. */}
      <div className="rd-wrap content mcenter">{children}</div>
    </section>
  );
}

/**
 * One torn paper edge. Exported because two sections tear the paper open
 * without being a <PhotoBand>: the About timeline band (no heading, tighter
 * padding) and the Contact page's three colour panels.
 */
export function TornEdge({
  edge,
  fill = "var(--color-paper)",
}: {
  edge: "top" | "bottom";
  /** Must match the section color above/below the band. */
  fill?: string;
}) {
  return (
    <svg
      className={cn("torn", edge === "top" ? "torn--top" : "torn--bot")}
      viewBox="0 0 1440 44"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <use href={edge === "top" ? "#sk-tear-top" : "#sk-tear-bot"} fill={fill} />
    </svg>
  );
}
