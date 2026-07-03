import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { classes, bootcampBlurb, appPromo, BOOK_HREF, TRAIN_ONLINE_HREF } from "@/content/site";

export const metadata: Metadata = {
  title: "Classes · Santa's Knights",
  description:
    "All classes are free. Find six programs for adults, teens, women, veterans, and beginners in Harlem and Midtown.",
};

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Classes with Santa's Knights!"
        title={
          <>
            All classes are{" "}
            <em className="font-serif font-medium italic text-red">100% FREE</em>,{" "}
            100% of the time.
          </>
        }
        intro="Beginners are welcome. Gladiators NYC instructors teach six free programs in Harlem and Midtown."
      >
        <Button href="#classes" variant="red" arrow>
          Browse the classes
        </Button>
        <Button href="#train-online" variant="ghost">
          Train online
        </Button>
      </PageHero>

      {/* Class catalog */}
      <section id="classes" className="scroll-mt-24 py-section">
        <Container>
          <SectionHeading
            eyebrow="Classes with Santa's Knights!"
            title="Six classes. Zero cost."
            intro="All classes are 100% FREE, 100% of the time, no-questions-asked!"
            introClassName="max-w-[52ch] font-semibold text-ink"
          />

          <div className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.name} hover className="flex flex-col p-[30px]">
                <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-red" />
                <h2 className="text-[18px] font-extrabold leading-[1.25] tracking-[-0.02em]">
                  {cls.name}
                </h2>
                <p className="mt-3 text-[13px] font-semibold leading-[1.45] text-muted">
                  {cls.audience}
                  {cls.duration && (
                    <>
                      <span aria-hidden className="mx-2 text-muted/40">·</span>
                      {cls.duration}
                    </>
                  )}
                </p>
                {cls.tagline && (
                  <p className="mt-3 flex-1 text-[14.5px] italic leading-[1.5] text-muted">
                    {cls.tagline}
                  </p>
                )}
                <div className="mt-5">
                  <Button
                    href={cls.bookHref}
                    variant="red"
                    className="px-5 py-3 text-[14px]"
                  >
                    Class details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Booking — happens on gladiators.nyc (one login works on both sites) */}
      <section id="book" className="scroll-mt-24 border-t border-line py-section">
        <Container>
          <SectionHeading
            eyebrow="Reserve a spot"
            title="Book on gladiators.nyc"
            intro="Free to book. Reservations, the quick one-time waiver, and your training dashboard live on our training site — your Santa's Knights login works there too."
            introClassName="max-w-[54ch]"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={BOOK_HREF} variant="red" size="lg" arrow>
              See upcoming sessions
            </Button>
          </div>
        </Container>
      </section>

      {/* Train online — promo for the members video library on gladiators.nyc */}
      <section id="train-online" className="scroll-mt-24 bg-ink py-[clamp(72px,10vw,128px)] text-bone">
        <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="font-display text-[clamp(60px,10vw,140px)] leading-[0.8] font-black text-red">
              24/7
            </p>
            <h2 className="mt-4 font-display text-[clamp(32px,5vw,58px)] leading-[0.9] font-black tracking-[-0.03em] uppercase">
              Train on your own time.
            </h2>
            <p className="mt-6 max-w-[42rem] text-[18px] leading-[1.65] text-bone/75">
              Instructor-made conditioning and technique videos to train between sessions. Free for
              members — watch them on our training site, then come train in person.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#book" variant="steel" size="lg" arrow>
                Reserve a class
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full border border-bone/15 bg-ink2 p-[34px] text-center">
              <p className="text-[16px] text-bone/75">
                The video library is free for members and lives on gladiators.nyc. Your Santa&apos;s
                Knights login works there — one account, both sites.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button href={TRAIN_ONLINE_HREF} variant="steel" arrow>
                  Watch the training library
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured bootcamp blurb */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-[54px]">
          <SectionHeading
            eyebrow="Modern methods · Gladiatorial awakening · Undeniable results"
            title="What Gladiator Bootcamp actually is"
          />
          <p className="text-[16px] leading-[1.7] text-muted">{bootcampBlurb}</p>
        </Container>
      </section>

      {/* App promo */}
      <section className="py-section">
        <Container>
          <div className="flex flex-col items-center gap-5 rounded-card-lg border border-line bg-card p-[42px] text-center">
            <p className="max-w-[52ch] text-[18px] font-semibold leading-[1.4] text-ink">
              {appPromo.text}
            </p>
            <Button href={appPromo.href} variant="red" arrow>
              {appPromo.cta}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
