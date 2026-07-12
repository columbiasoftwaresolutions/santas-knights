import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { pillars } from "@/content/site";

/**
 * Two full-bleed duotone program blocks for giving and training. The whole
 * block is a link. At rest it's clean text over the photo; on hover the title
 * and body gain a marker-style highlight that *wraps* the text (per line, via
 * box-decoration-break) in the block's own accent — red for giving, amber for
 * training — rather than a box that's always on.
 */
export function Pillars() {
  return (
    <section className="grid md:grid-cols-2">
      {pillars.map((pillar, i) => {
        const isGive = pillar.variant === "give";
        return (
          <article
            key={pillar.title}
            className={cn(
              "relative overflow-hidden",
              isGive ? "bg-ink2" : "bg-ink md:border-l md:border-bone/12",
            )}
          >
            <a
              href={pillar.href}
              aria-label={pillar.title}
              className="group relative flex min-h-[520px] flex-col justify-end overflow-hidden p-12 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bone md:p-14"
            >
              <div aria-hidden className="absolute inset-0">
                <Photo
                  src={pillar.image!}
                  alt={pillar.imageAlt ?? pillar.title}
                  duotone={isGive ? "warm" : "cool"}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-full w-full"
                />
                {/* Base darken + bottom gradient so the text reads at rest. */}
                <div className="absolute inset-0 bg-ink/45" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,11,0.30)_0%,rgba(18,14,11,0.92)_72%)]" />
              </div>

              <div data-reveal style={{ transitionDelay: `${i * 120}ms` }} className="relative z-10">
                <h3 className="mb-5 -ml-[0.18em] max-w-[600px] font-display text-[clamp(34px,3.6vw,52px)] font-black uppercase leading-[1.1] tracking-[-0.02em]">
                  <span
                    className={cn(
                      "box-decoration-clone px-[0.18em] py-[0.06em] text-bone transition-colors duration-200 ease-out [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]",
                      isGive
                        ? "group-hover:bg-red group-hover:text-white group-hover:[text-shadow:none] group-focus-visible:bg-red group-focus-visible:text-white group-focus-visible:[text-shadow:none]"
                        : "group-hover:bg-amber group-hover:text-ink group-hover:[text-shadow:none] group-focus-visible:bg-amber group-focus-visible:text-ink group-focus-visible:[text-shadow:none]",
                    )}
                  >
                    {pillar.title}
                  </span>
                </h3>
                <p className="-ml-[0.32em] max-w-[440px] text-base leading-relaxed">
                  <span className="box-decoration-clone px-[0.32em] py-[0.16em] text-bone/90 transition-colors duration-200 ease-out [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] group-hover:bg-ink group-hover:text-bone group-hover:[text-shadow:none] group-focus-visible:bg-ink group-focus-visible:text-bone">
                    {pillar.body}
                  </span>
                </p>
              </div>
            </a>
          </article>
        );
      })}
    </section>
  );
}
