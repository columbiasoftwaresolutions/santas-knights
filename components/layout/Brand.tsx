import Link from "next/link";
import { cn } from "@/lib/cn";

/** Crest + wordmark lockup, reused in the nav and footer. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 text-[19px] font-black tracking-[-0.02em]", className)}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 flex-none place-items-center rounded-full bg-red text-[19px] text-gold-soft"
      >
        ♔
      </span>
      SANTA&apos;S KNIGHTS
    </Link>
  );
}
