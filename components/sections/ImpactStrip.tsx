import { Container } from "@/components/ui/Container";
import { stats } from "@/content/site";

export function ImpactStrip() {
  return (
    <section className="border-y border-line bg-paper-raised">
      <Container className="grid grid-cols-2 gap-[26px] py-[34px] md:grid-cols-4 md:gap-5">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-[clamp(30px,3.4vw,42px)] font-black tracking-[-0.03em]">
              {stat.value}
              {stat.unit && (
                <small className="font-serif text-[0.55em] font-medium italic text-red">
                  {stat.unit}
                </small>
              )}
            </div>
            <div className="mt-0.5 text-[14.5px] font-semibold text-muted">{stat.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}
