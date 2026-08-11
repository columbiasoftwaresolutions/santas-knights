import Link from "next/link";
import { cn } from "@/lib/cn";
import { TRADEMARK } from "@/content/site";

/**
 * Wordmark lockup for the poster system: Archivo display name + optional amber
 * trademark line. Reused in the nav (inline tagline) and footer (stacked).
 */
export function Brand({
  className,
  tagline = true,
  href = "/",
}: {
  className?: string;
  tagline?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("flex shrink-0 items-baseline gap-3", className)}>
      {/* A notch down on phones: at 19px the wordmark, the auth button, and the
          hamburger together are wider than a 360px screen. */}
      <span className="font-display text-[17px] font-black whitespace-nowrap uppercase tracking-[0.01em] sm:text-[19px]">
        Santa&apos;s Knights
      </span>
      {tagline && (
        <span className="hidden text-[11px] uppercase tracking-[0.18em] text-amber sm:inline">
          {TRADEMARK}
        </span>
      )}
    </Link>
  );
}
