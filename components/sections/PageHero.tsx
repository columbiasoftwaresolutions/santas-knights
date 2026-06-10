import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Warm page header used at the top of inner pages (About, Contact, Get Involved).
 * Mirrors the home Hero's rhythm so inner pages feel part of the same site:
 * uppercase eyebrow → display heading with optional serif-italic emphasis →
 * muted lede. Sits on the `paper` canvas above a hairline divider.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Optional actions (buttons) below the lede. */
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line pt-[58px] pb-[46px]">
      <Container className="max-w-[820px]">
        <SectionHeading
          as="h1"
          size="display"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          introClassName="text-xl max-w-[56ch]"
        />
        {children && <div className="mt-[30px] flex flex-wrap items-center gap-3.5">{children}</div>}
      </Container>
    </section>
  );
}
