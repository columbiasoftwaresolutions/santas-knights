import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/** Poster-system header for inner pages. */
export function PageHero({
  title,
  intro,
  media,
  children,
  variant = "default",
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Optional image/visual shown above the lede in the right column. */
  media?: React.ReactNode;
  /** Optional actions (buttons) below the lede. */
  children?: React.ReactNode;
  /** Keeps the default poster header available while allowing image-led pages to stay compact. */
  variant?: "default" | "feature";
}) {
  if (variant === "feature") {
    return (
      <section className="border-b border-line bg-paper py-[clamp(36px,5vw,64px)] text-ink">
        <Container>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(440px,1.18fr)] lg:items-end lg:gap-[clamp(42px,6vw,88px)]">
            <div className="lg:pb-2">
              <h1 className="font-display text-[clamp(42px,5.9vw,82px)] leading-[0.9] font-black tracking-[-0.04em] uppercase [&_em]:font-serif [&_em]:font-normal [&_em]:normal-case [&_em]:italic [&_em]:text-red">
                {title}
              </h1>
              {intro && (
                <div className="mt-5 max-w-[31rem] border-t border-line pt-4 text-[clamp(16px,1.35vw,19px)] leading-[1.55] text-muted lg:mt-6 lg:pt-5">
                  {intro}
                </div>
              )}
              {children && <div className="mt-6 flex flex-wrap items-center gap-3.5 lg:mt-7">{children}</div>}
            </div>
            {media && <div className="max-h-[460px] overflow-hidden [&>*]:h-full">{media}</div>}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-b border-line bg-paper py-[clamp(64px,8vw,108px)] text-ink">
      <Container>
        <div className={cn("grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start lg:gap-16")}>
          <h1 className="font-display text-[clamp(52px,8vw,118px)] leading-[0.86] font-black tracking-[-0.04em] uppercase [&_em]:font-serif [&_em]:font-normal [&_em]:normal-case [&_em]:italic [&_em]:text-red">
            {title}
          </h1>
          {(intro || media) && (
            <div>
              {media && <div className="mb-6">{media}</div>}
              {intro && (
                <div className="max-w-[34rem] text-[clamp(17px,1.6vw,20px)] leading-[1.6] text-muted">
                  {intro}
                </div>
              )}
            </div>
          )}
        </div>
        {children && <div className="mt-[30px] flex flex-wrap items-center gap-3.5">{children}</div>}
      </Container>
    </section>
  );
}
