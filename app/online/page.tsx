import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { DonateBand } from "@/components/sections/DonateBand";
import { links, TRAINING_HREF } from "@/content/site";

export const metadata: Metadata = {
  title: "Online Classes · Santa's Knights",
  description:
    "Free virtual classes and instructional videos from Gladiators NYC.",
};

export default function OnlinePage() {
  return (
    <>
      <PageHero
        eyebrow="Online Classes"
        title={
          <>
            Train with us{" "}
            <em className="font-serif font-medium italic text-red">anywhere</em>.
          </>
        }
        intro="Watch free instructional content from Gladiators NYC. The full schedule and in-person booking are on the training site."
      >
        <Button href={TRAINING_HREF} variant="red" arrow>
          In-person classes ↗
        </Button>
        <Button href={links.training} variant="ghost">
          See all classes
        </Button>
      </PageHero>

      <section className="bg-ink py-[clamp(84px,10vw,132px)] text-bone">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="font-display text-[clamp(82px,12vw,170px)] leading-[0.8] font-black tracking-[-0.05em] text-red">
            24/7
          </div>
          <div>
            <h2 className="font-display text-[clamp(38px,5vw,68px)] leading-[0.9] font-black tracking-[-0.03em] uppercase">
              Training content lives with Gladiators NYC.
            </h2>
            <p className="mt-7 max-w-[42rem] text-[18px] leading-[1.65] text-bone/75">
              Class videos, schedules, booking, and the full combat program are maintained on the
              dedicated training site so instructors can keep it current.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={TRAINING_HREF} variant="red" size="lg" arrow>
                Open Gladiators NYC ↗
              </Button>
              <Button href={links.training} variant="bone" size="lg">
                Browse classes here
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
