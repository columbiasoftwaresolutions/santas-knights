import { cn } from "@/lib/cn";

type Tone = "default" | "onDark" | "onColor";
type Size = "display" | "displaySteel" | "h2" | "band" | "h3";

/** Heading font-size + weight per size token (sizes come from @theme). */
const TITLE_SIZE: Record<Size, string> = {
  display: "text-display font-black tracking-[-0.035em]",
  displaySteel: "text-display-steel font-black uppercase leading-[0.98]",
  h2: "text-h2",
  band: "text-h2-band",
  h3: "text-h3",
};

/** Tone shifts eyebrow, title, and intro colors together (warm vs steel vs colored band). */
const TITLE_TONE: Record<Tone, string> = {
  default: "text-ink",
  onDark: "text-bone",
  onColor: "text-paper",
};
const INTRO_TONE: Record<Tone, string> = {
  default: "text-muted",
  onDark: "text-[#b7b1a4]",
  onColor: "opacity-90",
};

/**
 * Poster heading block with one consistent vertical rhythm. Eyebrow props are
 * accepted during the port but deliberately omitted from rendering.
 * Owns the spacing and type scale so sections stop re-deciding them.
 *
 * `size` and `intro` width genuinely vary per section and stay as props;
 * the rhythm and tone are what's concentrated here.
 */
export function SectionHeading({
  eyebrow: _eyebrow,
  title,
  intro,
  as: Heading = "h2",
  size = "h2",
  tone = "default",
  eyebrowClassName: _eyebrowClassName,
  introClassName,
  className,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  tone?: Tone;
  eyebrowClassName?: string;
  introClassName?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Heading
        className={cn(
          "font-display leading-[0.92] font-black tracking-[-0.03em] uppercase [&_em]:font-serif [&_em]:font-normal [&_em]:normal-case [&_em]:italic",
          TITLE_SIZE[size],
          TITLE_TONE[tone],
        )}
      >
        {title}
      </Heading>
      {intro && <p className={cn("mt-4", INTRO_TONE[tone], introClassName)}>{intro}</p>}
    </div>
  );
}
