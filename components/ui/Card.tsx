import Link from "next/link";
import { cn } from "@/lib/cn";

type Tone = "card" | "goldSoft";

const TONE: Record<Tone, string> = {
  card: "bg-card",
  goldSoft: "bg-gold-soft",
};

/**
 * Square paper panel used by the poster system.
 */
type CardProps = {
  tone?: Tone;
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Card({
  tone = "card",
  hover = false,
  className,
  children,
  ...rest
}: CardProps & ({ href?: undefined } | { href: string })) {
  const classes = cn(
    "border border-line",
    TONE[tone],
    hover &&
      "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card",
    className,
  );

  if ("href" in rest && rest.href) {
    const { href } = rest;
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return <div className={classes}>{children}</div>;
}
