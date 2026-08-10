import { cn } from "@/lib/cn";

type Tag = "div" | "p" | "section" | "ul" | "figure" | "h1" | "h2" | "h3" | "span";

/**
 * Rise-in-on-scroll for the redesign layer. Thin wrapper over the app's single
 * IntersectionObserver (components/ui/Reveal) so pages can stagger a group
 * without hand-writing `data-reveal` + inline delays everywhere.
 *
 * Content stays visible when the observer isn't armed (no JS / reduced motion /
 * crawlers) — that behaviour lives in globals.css, not here.
 */
export function R({
  children,
  delay = 0,
  as: Element = "div",
  className,
  style,
}: {
  children: React.ReactNode;
  /** Stagger, in ms. Keep groups under ~250ms total so nothing feels slow. */
  delay?: number;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Element
      data-reveal
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      className={cn(className)}
    >
      {children}
    </Element>
  );
}
