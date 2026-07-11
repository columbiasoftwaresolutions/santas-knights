"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for the whole app. Any server- or client-rendered
 * element can opt into a reveal-on-scroll by adding `data-reveal` (and, for a
 * staggered entrance, an inline `transition-delay`). The hidden/visible states
 * live in globals.css, gated behind `html.reveal-on` — this component only
 * flips `.is-visible` as elements enter the viewport.
 *
 * Mounted once in the root layout. It re-scans on route change so App Router
 * client navigations reveal the next page's content too. It stays inert unless
 * the pre-paint script armed `reveal-on` (JS on + motion allowed), so no-JS,
 * reduced-motion, and crawler renders keep every element visible.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-on")) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
