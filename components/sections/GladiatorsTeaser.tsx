import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gladiatorsMeta, links, GLADIATORS_HREF } from "@/content/site";

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
          <SectionHeading
            tone="onDark"
            size="displaySteel"
            eyebrow="The training side"
            title="Gladiators NYC"
            intro="Full-contact armored combat with steel weapons and real armor, taught free in Harlem. It's the oldest league of its kind in the city, and Damion started it. The schedule and booking live on its own site."
            introClassName="max-w-[44ch] text-[17px]"
          />
          <div className="mt-7 mb-7 flex flex-wrap gap-[26px]">
            {gladiatorsMeta.map((item) => (
              <div key={item.value} className="text-sm text-[#8d8779]">
                <b className="mb-0.5 block text-[18px] font-extrabold text-[#e8e2d4]">{item.value}</b>
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button href={GLADIATORS_HREF} variant="steel" arrow>
              Go to the training site
            </Button>
            <Button href={links.about} variant="bone">
              More about the org
            </Button>
          </div>
        </div>

        <Photo
          src="/images/combat-helmet.jpg"
          alt="Steel helmet and gauntlet from full-contact armored combat"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-[5/4] rounded-2xl"
        />
      </Container>
    </section>
  );
}
