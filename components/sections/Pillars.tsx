import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { pillars } from "@/content/site";

const TITLE_TILE_SWATCHES = [
  "group-hover:bg-[#0a0a0a] group-hover:text-white group-focus-visible:bg-[#0a0a0a] group-focus-visible:text-white",
  "group-hover:bg-[#ff2e20] group-hover:text-[#0a0a0a] group-focus-visible:bg-[#ff2e20] group-focus-visible:text-[#0a0a0a]",
  "group-hover:bg-[#f0c2f7] group-hover:text-[#0a0a0a] group-focus-visible:bg-[#f0c2f7] group-focus-visible:text-[#0a0a0a]",
  "group-hover:bg-[#22e58b] group-hover:text-[#0a0a0a] group-focus-visible:bg-[#22e58b] group-focus-visible:text-[#0a0a0a]",
  "group-hover:bg-[#7c4dff] group-hover:text-white group-focus-visible:bg-[#7c4dff] group-focus-visible:text-white",
  "group-hover:bg-[#ffe14d] group-hover:text-[#0a0a0a] group-focus-visible:bg-[#ffe14d] group-focus-visible:text-[#0a0a0a]",
];

/** Two full-bleed duotone program blocks for giving and training. */
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
              aria-label={`${pillar.cta}: ${pillar.title}`}
              className="group relative flex min-h-[520px] flex-col justify-end overflow-hidden p-12 outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-inset md:p-14"
            >
              <div className="absolute inset-0">
                <Photo
                  src={pillar.image!}
                  alt={pillar.imageAlt ?? pillar.title}
                  duotone={isGive ? "warm" : "cool"}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-full w-full"
                />
                {/* Flat darken for overall legibility + bottom gradient for the text. */}
                <div className="absolute inset-0 bg-ink/45 transition-colors duration-200 group-hover:bg-ink/72 group-focus-visible:bg-ink/72" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,11,0.36)_0%,rgba(18,14,11,0.98)_70%)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
              </div>

              <div data-reveal style={{ transitionDelay: `${i * 120}ms` }} className="relative z-10">
                <h3 className="mb-4 flex max-w-[640px] flex-wrap items-start font-display text-[clamp(34px,3.6vw,52px)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-bone/95 transition-colors duration-200 group-hover:text-bone group-focus-visible:text-bone">
                  {pillar.title.split(" ").map((word, wordIndex) => (
                    <span
                      key={`${pillar.title}-${word}-${wordIndex}`}
                      className={cn(
                        "inline-block px-[0.12em] py-[0.04em] transition-[background-color,color] duration-200 ease-out",
                        TITLE_TILE_SWATCHES[wordIndex % TITLE_TILE_SWATCHES.length],
                      )}
                    >
                      {word}
                    </span>
                  ))}
                </h3>
                <div className="w-fit max-w-[480px] bg-ink/58 px-4 py-3 transition-colors duration-200 group-hover:bg-ink/82 group-focus-visible:bg-ink/82">
                  <p className="text-base leading-relaxed text-bone/88 transition-colors duration-200 group-hover:text-bone group-focus-visible:text-bone">
                    {pillar.body}
                  </p>
                  <span
                    className={cn(
                      "mt-5 inline-flex w-fit border-b-2 pb-1 text-[14px] font-bold uppercase tracking-[0.08em] text-bone transition-colors duration-200",
                      isGive
                        ? "border-red group-hover:border-bone group-focus-visible:border-bone"
                        : "border-amber group-hover:border-bone group-focus-visible:border-bone",
                    )}
                  >
                    {pillar.cta}
                  </span>
                </div>
              </div>
            </a>
          </article>
        );
      })}
    </section>
  );
}
