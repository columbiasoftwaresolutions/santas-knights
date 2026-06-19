import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * Poster-system header for inner pages. `eyebrow` remains in the API while the
 * route migration lands, but is intentionally not rendered: the approved
 * system has no kickers or eyebrows.
 */
export function PageHero({
  eyebrow: _eyebrow,
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
    <section className="border-b border-line bg-paper py-[clamp(64px,8vw,108px)] text-ink">
      <Container>
        <div className={cn("grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16")}>
          <h1 className="font-display text-[clamp(52px,8vw,118px)] leading-[0.86] font-black tracking-[-0.04em] uppercase [&_em]:font-serif [&_em]:font-normal [&_em]:normal-case [&_em]:italic [&_em]:text-red">
            {title}
          </h1>
          {intro && (
            <p className="max-w-[34rem] text-[clamp(17px,1.6vw,20px)] leading-[1.6] text-muted">
              {intro}
            </p>
          )}
        </div>
        {children && <div className="mt-[30px] flex flex-wrap items-center gap-3.5">{children}</div>}
      </Container>
    </section>
  );
}
