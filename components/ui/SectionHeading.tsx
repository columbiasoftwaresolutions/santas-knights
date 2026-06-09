import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
const EYEBROW_TONE: Record<Tone, string> = {
  default: "",
  onDark: "text-glad-amber",
  onColor: "text-gold-soft",
};
const TITLE_TONE: Record<Tone, string> = {
  default: "",
  onDark: "text-white",
  onColor: "text-white",
};
const INTRO_TONE: Record<Tone, string> = {
  default: "text-muted",
  onDark: "text-[#b7b1a4]",
  onColor: "opacity-90",
};

/**
 * The eyebrow → heading → intro block, with one consistent vertical rhythm.
 * Owns the spacing and type scale so sections stop re-deciding them.
 *
 * `size` and `intro` width genuinely vary per section and stay as props;
 * the rhythm and tone are what's concentrated here.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  size = "h2",
  tone = "default",
  eyebrowClassName,
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
      <Eyebrow className={cn(EYEBROW_TONE[tone], eyebrowClassName)}>{eyebrow}</Eyebrow>
      <Heading className={cn("mt-3", TITLE_SIZE[size], TITLE_TONE[tone])}>{title}</Heading>
      {intro && <p className={cn("mt-4", INTRO_TONE[tone], introClassName)}>{intro}</p>}
    </div>
  );
}
