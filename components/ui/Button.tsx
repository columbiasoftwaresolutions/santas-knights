import Link from "next/link";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";

export type ButtonVariant =
  | "red"
  | "ink"
  | "ghost"
  | "ghostInverse" // filled ink by default, outline on hover (ghost, swapped)
  | "green"
  | "cream"
  | "clear"
  | "onRed"
  | "steel" // Gladiators
  | "bone"; // Gladiators

const VARIANTS: Record<ButtonVariant, string> = {
  red: "bg-red text-white hover:bg-red-deep hover:shadow-cta",
  ink: "bg-ink text-paper hover:bg-black",
  ghost: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  ghostInverse: "bg-ink text-paper border-ink hover:bg-transparent hover:text-ink",
  green: "bg-green text-white hover:bg-[#244c38]",
  cream: "bg-paper text-ink hover:bg-white",
  clear: "bg-white/10 text-white border-white/45 hover:bg-white/20",
  onRed: "bg-white text-red-deep hover:bg-gold-soft",
  steel: "bg-glad-red text-white hover:bg-[#a82a18]",
  bone: "bg-transparent text-bone border-[rgba(232,226,212,0.4)] hover:bg-bone hover:text-steel",
};

// Hover = lift (DESIGN.md): the button rises 2px and settles on press. Colors,
// transform, and the red CTA glow all share one 150ms ease.
const BASE =
  "group inline-flex cursor-pointer items-center gap-[10px] whitespace-nowrap border-[1.5px] border-transparent font-bold uppercase tracking-[0.04em] transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0";

const SIZES = {
  md: "px-[22px] py-[11px] text-[13px]",
  lg: "px-[34px] py-[17px] text-[15px]",
} as const;

type CommonProps = {
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
  /** Appends an animated arrow that nudges on hover. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & { href: string };
type AsButton = CommonProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function Button(props: AsLink | AsButton) {
  const { variant = "red", size = "md", arrow, className, children } = props;
  const classes = cn(BASE, SIZES[size], VARIANTS[variant], className);

  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href } = props;
    if (isInternal(href)) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    arrow: _a,
    className: _c,
    children: _ch,
    ...buttonProps
  } = props as AsButton & { size?: keyof typeof SIZES };
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
