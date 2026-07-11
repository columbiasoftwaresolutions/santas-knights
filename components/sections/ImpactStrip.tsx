"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site";

/**
 * Flood-red stats band. On first scroll into view the cells rise + fade in with
 * a small stagger, and clean integer metrics count up. Non-numeric values
 * (Harlem, 501(c)(3)) and the founding year (2016) never count — a year ticking
 * up from zero reads as a glitch, not an impact number.
 *
 * SSR and the no-JS / reduced-motion paths render every value at its final,
 * visible state, so the band is never blank or stuck at zero without JS.
 */
export function ImpactStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true); // visible by default (SSR + no-JS safe)
  const [counting, setCounting] = useState(false);
  const [armed, setArmed] = useState(false); // JS on, motion allowed, IO available

  useEffect(() => {
    const okMotion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!okMotion || !("IntersectionObserver" in window) || !ref.current) return;

    setArmed(true);
    setRevealed(false); // hide now (still off-screen) so it can animate in on scroll

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          setCounting(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-red text-paper">
      <div ref={ref} className="mx-auto grid w-full max-w-[1440px] grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="border-paper/20 px-6 py-[44px] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:border-r md:px-8 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r [&:last-child]:border-r-0"
            style={{
              transitionDelay: `${i * 90}ms`,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "none" : "translateY(16px)",
            }}
          >
            <div className="font-display text-[clamp(40px,4.4vw,64px)] font-black leading-[0.9] tracking-[-0.03em]">
              <Metric value={stat.value} arm={armed} count={armed && counting} />
              {stat.unit}
            </div>
            <div className="mt-3.5 text-[13px] font-semibold uppercase leading-snug tracking-[0.06em] text-paper/90">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Counts 0→value for clean 1–3 digit integers; renders everything else verbatim. */
function Metric({ value, arm, count }: { value: string; arm: boolean; count: boolean }) {
  const target = /^\d{1,3}$/.test(value) ? parseInt(value, 10) : null;
  const willCount = target !== null && arm;
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!willCount || !count || target === null) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / 1100);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(String(Math.round(eased * target)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(String(target));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [willCount, count, target]);

  if (!willCount) return <>{value}</>;
  return <>{count ? display : "0"}</>;
}
