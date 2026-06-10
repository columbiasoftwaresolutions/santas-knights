import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { letters, links } from "@/content/site";

/**
 * The Santa's Letters program — the giving work this site is built around.
 * Header band (green/giving tone) → how it works in three steps → the
 * Operation Santa origin.
 */
export function LettersToSanta() {
  return (
    <section id="letters" className="scroll-mt-20 py-section">
      <Container>
        {/* Header band. Single-use brand gradient kept inline (see DESIGN.md). */}
        <div className="relative grid items-center gap-8 overflow-hidden rounded-card-lg bg-green bg-[linear-gradient(160deg,var(--color-green),#22483540)] p-[34px] text-[#eef4ef] md:grid-cols-[1.1fr_0.9fr] md:gap-[46px] md:p-[50px]">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[30px] -right-5 text-[200px] leading-none text-white/[0.06]"
          >
            ✶
          </span>
          <div className="relative">
            <SectionHeading
              tone="onColor"
              size="band"
              eyebrow={letters.eyebrow}
              title={letters.title}
              intro={letters.intro}
              introClassName="max-w-[42ch]"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={links.adoptLetter} variant="cream">
                Adopt a letter
              </Button>
              <Button href={links.volunteer} variant="clear">
                Help out
              </Button>
            </div>
          </div>
          <Photo
            src="/images/hero-community.jpg"
            alt="Kids and volunteers together at a Santa's Knights holiday event"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/3] rounded-2xl"
          />
        </div>

        {/* How it works */}
        <div className="mt-12">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-green">How it works</p>
          <div className="mt-6 grid gap-[18px] md:grid-cols-3">
            {letters.steps.map((step, i) => (
              <Card key={step.title} className="p-[28px]">
                <span className="font-serif text-[28px] font-medium italic leading-none text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3.5 text-[20px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 text-[15.5px] text-muted">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="mt-7 rounded-card border border-line bg-paper-raised p-[30px] md:p-[38px]">
          <div className="flex items-start gap-5">
            <span aria-hidden className="font-serif text-[40px] leading-none text-gold">
              ✶
            </span>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-muted">
                Where it comes from
              </p>
              <p className="mt-2 max-w-[78ch] text-[17px] leading-relaxed text-ink">
                {letters.origin}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
