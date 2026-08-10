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
 */
export function PhotoBand({
  src,
  objectPosition,
  hero = false,
  priority = false,
  tearFill = "var(--color-paper)",
  className,
  children,
}: {
  src: string;
  objectPosition?: string;
  hero?: boolean;
  priority?: boolean;
  /** Must match the section color above/below the band. */
  tearFill?: string;
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
      {!hero && <TornEdge edge="top" fill={tearFill} />}
      <TornEdge edge="bottom" fill={tearFill} />
      <div className="rd-wrap content">{children}</div>
    </section>
  );
}

function TornEdge({ edge, fill }: { edge: "top" | "bottom"; fill: string }) {
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
