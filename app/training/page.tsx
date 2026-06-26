import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { DonateBand } from "@/components/sections/DonateBand";
import { ClassBookingList } from "@/components/training/ClassBookingList";
import { getUpcomingClasses, getMyRegistrations } from "@/lib/training";
import { getCurrentUser } from "@/lib/auth";
import { classes, bootcampBlurb, appPromo, links } from "@/content/site";

export const metadata: Metadata = {
  title: "Classes · Santa's Knights",
  description:
    "All classes are free. Find six programs for adults, teens, women, veterans, and beginners in Harlem and Midtown.",
};

export const dynamic = "force-dynamic";

const BOOK_BANNER: Record<string, { tone: string; text: string }> = {
  "booked=1": { tone: "border-green/40 bg-green-soft text-green", text: "You're booked in — see you on the floor. Your reservation is in your account." },
  "booked=already": { tone: "border-green/40 bg-green-soft text-green", text: "You're already registered for that class." },
  "error=full": { tone: "border-red/40 bg-red/5 text-red", text: "Sorry — that class just filled up. Try another session." },
  "error=notfound": { tone: "border-red/40 bg-red/5 text-red", text: "That class is no longer available." },
  "error=missing": { tone: "border-red/40 bg-red/5 text-red", text: "Something went wrong with that reservation. Please try again." },
  "error=unconfigured": { tone: "border-red/40 bg-red/5 text-red", text: "Booking isn't available right now. Please try again later." },
};

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const bannerKey = sp.booked ? `booked=${sp.booked}` : sp.error ? `error=${sp.error}` : "";
  const banner = BOOK_BANNER[bannerKey];

  const [sessions, user] = await Promise.all([getUpcomingClasses(), getCurrentUser()]);
  const myRegs = user ? await getMyRegistrations(user.id) : [];
  const myActiveClassIds = new Set(
    myRegs.filter((r) => ["registered", "attended"].includes(r.status) && r.class).map((r) => r.class!.id),
  );

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
        <Button href={links.online} variant="ghost">
          Online classes
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
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-pill bg-paper-raised px-3 py-1 text-[12.5px] font-semibold text-muted">
                    {cls.audience}
                  </span>
                  {cls.duration && (
                    <span className="rounded-pill bg-paper-raised px-3 py-1 text-[12.5px] font-semibold text-muted">
                      {cls.duration}
                    </span>
                  )}
                </div>
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

      {/* Upcoming sessions — live booking */}
      <section id="book" className="scroll-mt-24 border-t border-line py-section">
        <Container>
          <SectionHeading
            eyebrow="Reserve a spot"
            title="Upcoming sessions"
            intro="Free to book. You'll sign a quick one-time waiver the first time, then reserve any class in seconds."
            introClassName="max-w-[54ch]"
          />
          {banner && (
            <div className={`mt-8 border px-5 py-4 text-[15px] font-semibold ${banner.tone}`}>
              {banner.text}
            </div>
          )}
          <div className="mt-8">
            <ClassBookingList
              sessions={sessions}
              signedIn={Boolean(user)}
              myActiveClassIds={Array.from(myActiveClassIds)}
            />
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

      <DonateBand />
    </>
  );
}
