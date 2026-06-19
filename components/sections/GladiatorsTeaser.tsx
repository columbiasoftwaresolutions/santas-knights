import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { gladiatorsMeta, founder } from "@/content/site";

const CHIP_TONE = ["text-red", "text-amber", "text-bone"];

/** Steel band: the training facts as chips, then the founder's pull-quote. */
export function GladiatorsTeaser() {
  return (
    <section id="training" className="bg-ink py-26 text-bone">
      <Container>
        <div className="mb-20 flex flex-wrap gap-[18px]">
          {gladiatorsMeta.map((item, i) => (
            <div key={item.value} className="flex flex-col gap-1 border-[1.5px] border-bone/30 px-[26px] py-[18px]">
              <span
                className={cn(
                  "font-display text-[24px] font-black uppercase tracking-[-0.01em]",
                  CHIP_TONE[i],
                )}
              >
                {item.value}
              </span>
              <span className="text-[12px] uppercase tracking-[0.08em] text-bone/60">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid items-center gap-14 md:grid-cols-[0.6fr_1.4fr]">
          <Photo
            src="/images/headshot.png"
            alt={`${founder.name}, ${founder.role}`}
            duotone="cool"
            sizes="(min-width: 768px) 24vw, 100vw"
            className="aspect-[4/5]"
          />
          <div>
            <blockquote className="font-serif text-[clamp(28px,3.4vw,46px)] font-normal leading-[1.12] tracking-[-0.02em]">
              <span className="font-semibold text-red">&ldquo;</span>I&apos;m ex-military and I got
              heavily injured while I was in. When I came out I was just a mess. Fitness and sports
              really <em className="italic text-amber">saved my life.</em>&rdquo;
            </blockquote>
            <div className="mt-7 text-[14px] font-semibold uppercase tracking-[0.1em] text-amber">
              {founder.name}, {founder.role}
              <span className="mt-1 block font-medium tracking-[0.06em] text-bone/55">
                To CBS New York
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
