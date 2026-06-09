import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
        <SectionHeading
          className="mb-[34px]"
          eyebrow="What we do"
          title="One mission, two ways to take part."
          intro="Train for free with our flagship combat program, or help power the work through giving and the holiday gift drive."
          introClassName="max-w-[48ch]"
        />

        <div className="grid gap-[22px] md:grid-cols-2">
          {pillars.map((pillar) => (
            <Card key={pillar.title} href={pillar.href} hover className="group flex flex-col overflow-hidden">
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
                <h3 className="mb-2 text-h3">{pillar.title}</h3>
                <p className="mb-[18px] text-base text-muted">{pillar.body}</p>
                <span className={cn("flex items-center gap-[7px] text-[15.5px] font-bold", GO_STYLES[pillar.variant])}>
                  {pillar.cta}
                  <Arrow />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
