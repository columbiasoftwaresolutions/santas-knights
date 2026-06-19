import { Container } from "@/components/ui/Container";
import { sponsors } from "@/content/site";

/** Partner/sponsor wordmark tiles on paper. */
export function Partners() {
  return (
    <section className="bg-paper py-[84px] text-ink">
      <Container>
        <p className="mb-[34px] font-serif text-[clamp(26px,2.8vw,38px)] font-medium italic tracking-[-0.01em]">
          In good company.
        </p>
        <div className="flex flex-wrap">
          {sponsors.map((sponsor, i) => (
            <span
              key={sponsor.name}
              className="py-1.5 pr-7 font-display text-[clamp(22px,2.4vw,34px)] font-extrabold uppercase leading-tight tracking-[-0.01em]"
            >
              {sponsor.name}
              {i < sponsors.length - 1 && <span className="ml-7 font-black text-red">·</span>}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
