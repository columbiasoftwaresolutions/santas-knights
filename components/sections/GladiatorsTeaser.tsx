import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { gladiatorsMeta, GLADIATORS_HREF } from "@/content/site";

/**
 * Tonal bridge into the Gladiators NYC "steel world". This is only a teaser —
 * the full Gladiators experience is a separate brand/site.
 */
export function GladiatorsTeaser() {
  return (
    <section
      id="training"
      className="relative mt-16 overflow-hidden bg-steel text-[#e8e2d4] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(120%_90%_at_80%_0%,rgba(194,51,31,0.20),transparent_55%)] before:content-['']"
    >
      <Container className="relative grid items-center gap-8 py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-[50px]">
        <div>
          <Eyebrow className="text-glad-amber">The flagship program</Eyebrow>
          <h2 className="mt-3.5 font-sans text-[clamp(34px,4.6vw,60px)] font-black uppercase leading-[0.98] tracking-[-0.02em] text-white">
            Gladiators NYC
          </h2>
          <p className="mt-[18px] mb-7 max-w-[42ch] text-[17px] text-[#b7b1a4]">
            Step into the oldest and premiere league, school, and team of armored combat in New York
            City, full-contact, steel weapons, real armor. Taught free, led by the founder of the
            sport in NYC.
          </p>
          <div className="mb-7 flex flex-wrap gap-[26px]">
            {gladiatorsMeta.map((item) => (
              <div key={item.value} className="text-sm text-[#8d8779]">
                <b className="mb-0.5 block text-[18px] font-extrabold text-[#e8e2d4]">
                  {item.value}
                </b>
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button href={GLADIATORS_HREF} variant="steel" arrow>
              Enter Gladiators NYC
            </Button>
            <Button href={`${GLADIATORS_HREF}`} variant="bone">
              See the classes
            </Button>
          </div>
        </div>

        <Placeholder
          dark
          label="PHOTO: full armored combat, two fighters clashing, intense"
          className="aspect-[5/4] rounded-2xl"
        />
      </Container>
    </section>
  );
}
