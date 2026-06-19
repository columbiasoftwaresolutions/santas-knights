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
    <Link href={href} className={cn("flex items-baseline gap-3", className)}>
      <span className="font-display text-[19px] font-black uppercase tracking-[0.01em]">
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
