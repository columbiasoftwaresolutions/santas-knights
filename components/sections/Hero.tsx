import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { links } from "@/content/site";

/** Warm-paper opening hero: serif headline + community photo with caption. */
export function Hero() {
  return (
    <section className="border-b border-line bg-paper text-ink">
      <Container className="grid items-center gap-9 py-[86px] md:grid-cols-[1fr_1.05fr] md:gap-16">
        <div>
          <h1 className="font-serif text-[clamp(40px,5vw,70px)] font-medium leading-[1.04] tracking-[-0.02em]">
            Strengthening kids and lifting{" "}
            <em className="font-medium italic text-red">communities</em>.
          </h1>
          <p className="mt-[26px] max-w-[520px] text-[19px] leading-relaxed text-muted">
            A nonprofit that teaches armored combat and fitness at no cost, and helps answer local
            kids&apos; letters to Santa at the holidays.
          </p>
          <div className="mt-[34px] flex flex-wrap items-center gap-3.5">
            <Button href={links.adoptLetter} variant="red" size="lg" arrow>
              Adopt a letter
            </Button>
            <Button href={links.donate} variant="ghost" size="lg">
              Donate
            </Button>
          </div>
        </div>

        <figure className="relative">
          <Photo
            src="/images/santa-gift.png"
            alt="A child holding a wrapped gift next to Santa at a Santa's Knights holiday event"
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-[420px] md:h-[540px]"
          />
          <figcaption className="absolute right-6 bottom-6 left-6 bg-ink/[0.74] p-[18px_22px] text-paper backdrop-blur-[2px]">
            <p className="font-serif text-[19px] italic leading-tight">
              &ldquo;It&apos;s the reason the nonprofit exists.&rdquo;
            </p>
            <p className="mt-2 text-[12px] uppercase tracking-[0.06em] text-paper/70">
              Santa&apos;s Letters
            </p>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
