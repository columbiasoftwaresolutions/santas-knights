import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { DonateBand } from "@/components/sections/DonateBand";
import {
  classes,
  bootcampBlurb,
  courseSchema,
  links,
  type ClassCard,
} from "@/content/site";

/** Pre-render a page per class at build time. */
export function generateStaticParams() {
  return classes.map((cls) => ({ slug: cls.slug }));
}

function findClass(slug: string): ClassCard | undefined {
  return classes.find((cls) => cls.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cls = findClass(slug);
  if (!cls) return { title: "Class not found · Santa's Knights" };
  const description = cls.details ?? cls.tagline ?? bootcampBlurb;
  return {
    title: `${cls.name} · Santa's Knights`,
    description,
  };
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cls = findClass(slug);
  if (!cls) notFound();

  const description = cls.details ?? cls.tagline ?? bootcampBlurb;

  return (
    <>
      <JsonLd data={courseSchema(cls)} />

      <PageHero
        eyebrow="Gladiators NYC"
        title={
          <>
            {cls.name.split("(")[0].trim()}{" "}
            <em className="font-serif font-medium italic text-red">free</em>.
          </>
        }
        intro={cls.tagline ?? "A free Gladiators NYC class, taught in Harlem. Beginners welcome."}
      >
        <Button href="#booking" variant="red" arrow>
          Reserve a spot
        </Button>
        <Button href={links.training} variant="ghost">
          All classes
        </Button>
      </PageHero>

      <section className="py-section">
        <Container className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-[54px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-pill bg-paper-raised px-3 py-1 text-[12.5px] font-semibold text-muted">
                {cls.audience}
              </span>
              {cls.duration && (
                <span className="rounded-pill bg-paper-raised px-3 py-1 text-[12.5px] font-semibold text-muted">
                  {cls.duration}
                </span>
              )}
              <span className="rounded-pill bg-green/15 px-3 py-1 text-[12.5px] font-semibold text-green">
                100% free
              </span>
            </div>
            <p className="text-[18px] leading-[1.7] text-muted">{description}</p>
          </div>

          {/* Booking — live on-site via the training tracker. */}
          <div id="booking" className="scroll-mt-24">
            <Card className="flex flex-col p-[30px]">
              <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-red" />
              <h2 className="text-[20px] font-extrabold leading-[1.2] tracking-[-0.02em]">
                Reserve a spot
              </h2>
              <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-muted">
                Booking is free. Pick an upcoming session, sign a quick one-time waiver, and you&apos;re
                in. Classes are first-come, first-served up to capacity.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button href={`${links.training}#book`} variant="red" className="px-5 py-3 text-[14.5px]">
                  See upcoming sessions
                </Button>
                <Button href={links.contact} variant="ghost" className="px-5 py-3 text-[14.5px]">
                  Ask about this class
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
