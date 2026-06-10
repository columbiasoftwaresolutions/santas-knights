import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { links } from "@/content/site";

export function Hero() {
  return (
    <section className="pt-[60px] pb-[46px]">
      <Container className="grid items-center gap-[34px] md:grid-cols-[1.04fr_0.96fr] md:gap-[54px]">
        <div>
          <SectionHeading
            as="h1"
            size="display"
            eyebrow={<>A Harlem 501(c)(3) nonprofit</>}
            title={
              <>
                A Harlem nonprofit,{" "}
                <em className="font-serif font-medium italic text-red">free</em> to everyone who
                walks in.
              </>
            }
            intro="We teach martial arts and fitness in Harlem at no cost. And every December, we make sure local kids get an answer to their letter to Santa."
            introClassName="text-xl max-w-[36ch]"
          />
          <div className="mt-[30px] flex flex-wrap items-center gap-3.5">
            <Button href={links.adoptLetter} variant="red" arrow>
              See Santa&apos;s Letters
            </Button>
            <Button href={links.about} variant="ghost">
              What we do
            </Button>
          </div>
          <p className="mt-[18px] flex items-center gap-2 text-[14.5px] text-muted">
            <span className="text-green" aria-hidden>
              ♥
            </span>
            Registered 501(c)(3). Everything we run is paid for by people who chip in.
          </p>
        </div>

        <div className="relative">
          <Photo
            src="/images/hero-community.jpg"
            alt="Santa's Knights members and families of all ages together"
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-4/5 rounded-[20px]"
          />
          <div className="absolute bottom-[30px] left-3.5 max-w-[235px] rounded-[18px] border border-line bg-card p-[18px_22px] shadow-card md:-left-6">
            <div className="text-[34px] font-black tracking-[-0.03em] text-red">100%</div>
            <div className="mt-0.5 text-[13.5px] font-semibold text-muted">
              Free for the people we serve, every day of the year.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
