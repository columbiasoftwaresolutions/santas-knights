import { stats } from "@/content/site";

/** Flood-red stats band. */
export function ImpactStrip() {
  return (
    <section className="bg-red text-paper">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-paper/20 px-6 py-[44px] md:border-r md:px-8 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r [&:last-child]:border-r-0"
          >
            <div className="font-display text-[clamp(40px,4.4vw,64px)] font-black leading-[0.9] tracking-[-0.03em]">
              {stat.value}
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
