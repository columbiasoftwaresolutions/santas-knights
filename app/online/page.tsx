import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { DonateBand } from "@/components/sections/DonateBand";
import { links } from "@/content/site";

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
        intro="Watch free instructional content from Gladiators NYC, then come train in person. The full class schedule and booking are right here on the site."
      >
        <Button href={links.training} variant="red" arrow>
          In-person classes
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
              Train on your own time.
            </h2>
            <p className="mt-7 max-w-[42rem] text-[18px] leading-[1.65] text-bone/75">
              Instructor-made conditioning and technique videos to train between sessions. The full
              video library lands with the training tracker, alongside on-site class booking.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={links.training} variant="red" size="lg" arrow>
                Browse in-person classes
              </Button>
              <Button href={links.membership} variant="bone" size="lg">
                Join free
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
