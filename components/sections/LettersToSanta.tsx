import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { letters, links } from "@/content/site";

/**
 * The Santa's Letters program as a centered flood-red feature: headline, intro,
 * and the two calls to action. The full origin + privacy detail live on /letters.
 */
export function LettersToSanta() {
  return (
    <section id="letters" className="scroll-mt-20 bg-red-deep py-26 text-paper">
      <Container>
        <div data-reveal className="mx-auto max-w-[980px] text-center">
          <h2 className="font-display text-[clamp(48px,6.4vw,96px)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
            Every kid deserves an{" "}
            <em className="font-serif text-gold-soft italic [text-transform:none] [font-weight:700]">
              answer.
            </em>
          </h2>
          <p className="mx-auto mt-[30px] max-w-[680px] text-[20px] font-medium leading-snug text-paper/90">
            {letters.intro}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Button href={links.adoptLetter} variant="onRed" size="lg">
              Adopt a letter
            </Button>
            <Button href={links.submitLetter} variant="clear" size="lg">
              Write a letter
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
