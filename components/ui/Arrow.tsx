import { cn } from "@/lib/cn";

/**
 * The CTA arrow that nudges right on hover. Owns the nudge in one place so it
 * stops being re-implemented at call sites. Requires an ancestor with the
 * `group` class (Button and the pillar card both provide it).
 */
export function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("transition-transform duration-200 group-hover:translate-x-[3px]", className)}
    >
      →
    </span>
  );
}
