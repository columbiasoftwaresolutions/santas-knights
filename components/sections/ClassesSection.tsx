import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { classes, bootcampBlurb, appPromo, links } from "@/content/site";

/**
 * Homepage classes section with 6 class cards and Book Now CTAs (Plan v2 §E2/E3).
 * "Book Now" links out to gladiators.nyc; booking is NOT on this site.
 */
export function ClassesSection() {
  return (
    <>
      {/* Class catalog */}
      <section className="py-section">
        <Container>
          <SectionHeading
            eyebrow="Classes with Santa's Knights!"
            title={
              <>
                All classes are <span className="text-red">100% FREE</span>, 100% of the time,
                no-questions-asked!
              </>
            }
            introClassName="max-w-[56ch]"
          />

          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.name} hover className="flex flex-col p-[28px]">
                <span aria-hidden className="mb-3 block h-1 w-10 rounded-pill bg-red" />
                <h2 className="text-[17px] font-extrabold leading-[1.25] tracking-[-0.02em]">
                  {cls.name}
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-pill bg-paper-raised px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                    {cls.audience}
                  </span>
                  {cls.duration && (
                    <span className="rounded-pill bg-paper-raised px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                      {cls.duration}
                    </span>
                  )}
                </div>
                {cls.tagline && (
                  <p className="mt-2.5 flex-1 text-[13.5px] italic leading-[1.5] text-muted">
                    {cls.tagline}
                  </p>
                )}
                <div className="mt-4">
                  <Button
                    href={cls.bookHref}
                    variant="red"
                    className="px-4 py-2.5 text-[13.5px]"
                  >
                    Book Now ↗
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href={links.training} variant="ghost">
              View all class details
            </Button>
          </div>
        </Container>
      </section>

      {/* Bootcamp blurb */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-[54px]">
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
            <span
              aria-hidden
              className="text-[38px]"
            >
              📱
            </span>
            <p className="max-w-[52ch] text-[19px] font-semibold leading-[1.4] text-ink">
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
