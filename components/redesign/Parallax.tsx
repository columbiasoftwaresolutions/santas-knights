"use client";

import { useEffect } from "react";

/**
 * A slow drift on every <PhotoBand> background image as it crosses the viewport
 * — just enough that the torn paper edge reads as an opening onto something
 * rather than a flat crop.
 *
 * One rAF-throttled scroll listener for the whole page. Inert under reduced
 * motion, where the images keep the static 1.10 scale the CSS gives them.
 */
export function RedesignParallax() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const paint = () => {
      ticking = false;
      const bands = document.querySelectorAll<HTMLElement>(".rd .imgsec");
      for (const band of bands) {
        const rect = band.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const image = band.querySelector<HTMLElement>(".bg");
        if (!image) continue;
        // -1 (below the fold) … 1 (above it)
        const progress =
          (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        image.style.transform = `translate3d(0, ${(progress * -26).toFixed(2)}px, 0) scale(1.10)`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
