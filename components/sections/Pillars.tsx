import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { pillars } from "@/content/site";

const TAG_STYLES = {
  train: "bg-[#efe1de] text-red-deep",
  give: "bg-green-soft text-green",
} as const;

const GO_STYLES = {
  train: "text-red",
  give: "text-green",
} as const;

export function Pillars() {
  return (
    <section className="pt-2.5 pb-[30px]">
      <Container>
        <div className="mb-[34px]">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-3 text-[clamp(30px,3.6vw,46px)]">One mission, two ways to take part.</h2>
          <p className="mt-3 max-w-[48ch] text-muted">
            Train for free with our flagship combat program, or help power the work through giving
            and the holiday gift drive.
          </p>
        </div>

        <div className="grid gap-[22px] md:grid-cols-2">
          {pillars.map((pillar) => (
            <a
              key={pillar.title}
              href={pillar.href}
              className="group flex flex-col overflow-hidden rounded-card border border-line bg-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgba(34,29,23,0.45)]"
            >
              <Placeholder label={pillar.photo} className="aspect-[16/10]" />
              <div className="px-[30px] pt-[30px] pb-8">
                <span
                  className={cn(
                    "mb-3.5 inline-flex self-start rounded-pill px-3 py-[5px] text-xs font-bold uppercase tracking-[0.06em]",
                    TAG_STYLES[pillar.variant],
                  )}
                >
                  {pillar.tag}
                </span>
                <h3 className="mb-2 text-[25px]">{pillar.title}</h3>
                <p className="mb-[18px] text-base text-muted">{pillar.body}</p>
                <span
                  className={cn(
                    "flex items-center gap-[7px] text-[15.5px] font-bold",
                    GO_STYLES[pillar.variant],
                  )}
                >
                  {pillar.cta}
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-[3px]"
                  >
                    →
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
