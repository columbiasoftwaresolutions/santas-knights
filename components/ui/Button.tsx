import Link from "next/link";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";

export type ButtonVariant =
  | "red"
  | "ink"
  | "ghost"
  | "green"
  | "cream"
  | "clear"
  | "onRed"
  | "steel" // Gladiators
  | "bone"; // Gladiators

const VARIANTS: Record<ButtonVariant, string> = {
  red: "bg-red text-white shadow-cta hover:bg-red-deep",
  ink: "bg-ink text-paper hover:bg-black",
  ghost: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  green: "bg-green text-white hover:bg-[#244c38]",
  cream: "bg-paper text-ink hover:bg-white",
  clear: "bg-white/10 text-white border-white/45 hover:bg-white/20",
  onRed: "bg-white text-red-deep hover:bg-gold-soft",
  steel: "bg-glad-red text-white hover:bg-[#a82a18]",
  bone: "bg-transparent text-bone border-[rgba(232,226,212,0.4)] hover:bg-bone hover:text-steel",
};

const BASE =
  "group inline-flex cursor-pointer items-center gap-[9px] whitespace-nowrap rounded-pill border-[1.5px] border-transparent px-[26px] py-[15px] text-base font-bold transition-transform duration-150 hover:-translate-y-0.5";

type CommonProps = {
  variant?: ButtonVariant;
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
  const { variant = "red", arrow, className, children } = props;
  const classes = cn(BASE, VARIANTS[variant], className);

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

  const { variant: _v, arrow: _a, className: _c, children: _ch, ...buttonProps } = props as AsButton;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
