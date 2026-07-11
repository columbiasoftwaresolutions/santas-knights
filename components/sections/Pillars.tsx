import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";
import { Photo } from "@/components/ui/Photo";
import { pillars } from "@/content/site";

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
              "relative flex min-h-[520px] flex-col justify-end overflow-hidden p-12 md:p-14",
              isGive ? "bg-ink2" : "bg-ink md:border-l md:border-bone/12",
            )}
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
              <div className="absolute inset-0 bg-ink/45" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,11,0.45)_0%,rgba(18,14,11,0.97)_72%)]" />
            </div>

            <div data-reveal style={{ transitionDelay: `${i * 120}ms` }} className="relative z-10">
              <h3 className="mb-4 font-display text-[clamp(34px,3.6vw,52px)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-bone">
                {pillar.title}
              </h3>
              <p className="mb-7 max-w-[440px] text-base leading-relaxed text-bone/85">
                {pillar.body}
              </p>
              <a
                href={pillar.href}
                className={cn(
                  "group inline-flex w-fit items-center gap-2.5 border-b-2 pb-1 text-[14px] font-bold uppercase tracking-[0.08em] text-bone",
                  isGive ? "border-red" : "border-amber",
                )}
              >
                {pillar.cta}
                <Arrow />
              </a>
            </div>
          </article>
        );
      })}
    </section>
  );
}
