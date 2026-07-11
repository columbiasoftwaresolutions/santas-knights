import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { links } from "@/content/site";
import { sponsors } from "@/content/site";

/** Partner/sponsor wordmark tiles on paper. Homepage shows the featured subset;
 *  the full roster lives on /sponsors. */
export function Partners() {
  const featured = sponsors.filter((s) => s.featured);

  return (
    <section className="bg-paper py-[84px] text-ink">
      <Container>
        <div
          data-reveal
          className="mb-[34px] flex flex-wrap items-center justify-between gap-x-6 gap-y-4"
        >
          <p className="font-serif text-[clamp(26px,2.8vw,38px)] font-medium italic tracking-[-0.01em]">
            In good company.
          </p>
          <Button href={links.sponsors} variant="ghost" arrow>
            See all sponsors
          </Button>
        </div>
        <div data-reveal style={{ transitionDelay: "100ms" }} className="flex flex-wrap">
          {featured.map((sponsor, i) => (
            <span
              key={sponsor.name}
              className="py-1.5 pr-7 font-display text-[clamp(22px,2.4vw,34px)] font-extrabold uppercase leading-tight tracking-[-0.01em]"
            >
              {sponsor.name}
              {i < featured.length - 1 && <span className="ml-7 font-black text-red">·</span>}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
