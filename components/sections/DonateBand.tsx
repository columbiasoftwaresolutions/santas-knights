import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { links } from "@/content/site";

/** Oversized poster closing CTA. */
export function DonateBand() {
  return (
    <section id="donate" className="bg-ink py-[110px] text-bone">
      <Container>
        <h2
          data-reveal
          className="font-display text-[clamp(72px,11vw,168px)] font-black uppercase leading-[0.82] tracking-[-0.04em]"
        >
          Adopt a letter
          <br />
          <span className="text-red">&amp;</span>{" "}
          <em className="font-serif text-amber italic [text-transform:none] [font-weight:500]">
            give.
          </em>
        </h2>
        <div
          data-reveal
          style={{ transitionDelay: "120ms" }}
          className="mt-12 flex flex-wrap items-center gap-[18px]"
        >
          <Button href={links.adoptLetter} variant="red" size="lg">
            Adopt a letter
          </Button>
          <Button href={links.donate} variant="bone" size="lg">
            Donate
          </Button>
        </div>
        <p
          data-reveal
          style={{ transitionDelay: "200ms" }}
          className="mt-[30px] font-serif text-[17px] italic text-bone/70"
        >
          Donations pay for gifts, classes, equipment, and community events.
        </p>
      </Container>
    </section>
  );
}
