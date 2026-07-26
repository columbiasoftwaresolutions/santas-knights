import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { letters, links } from "@/content/site";

/**
 * The Santa's Letters program as a flood-red feature: headline, intro, and the
 * three-step how-it-works. The full origin + privacy detail live on /letters.
 */
export function LettersToSanta() {
  return (
    <section id="letters" className="scroll-mt-20 bg-red-deep py-26 text-paper">
      <Container>
        <div data-reveal className="max-w-[980px]">
          <h2 className="font-display text-[clamp(48px,6.4vw,96px)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
            Every kid deserves an{" "}
            <em className="font-serif text-gold-soft italic [text-transform:none] [font-weight:700]">
              answer.
            </em>
          </h2>
          <p className="mt-[30px] max-w-[680px] text-[20px] font-medium leading-snug text-paper/90">
            {letters.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button href={links.adoptLetter} variant="onRed" size="lg">
              Adopt a letter
            </Button>
            <Button href={links.submitLetter} variant="clear" size="lg">
              Write a letter
            </Button>
          </div>
        </div>

        <div className="mt-16 grid border-t-2 border-paper/30 md:grid-cols-3">
          {letters.steps.map((step, i) => (
            <div
              key={step.title}
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              className="border-paper/[0.18] py-11 md:border-r md:pr-9 md:[&:not(:first-child)]:pl-9 md:[&:last-child]:border-r-0"
            >
              <div className="font-display text-[clamp(56px,6vw,84px)] font-black leading-[0.8] tracking-[-0.04em] text-gold-soft">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 font-display text-[23px] font-extrabold uppercase tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-paper/85">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
