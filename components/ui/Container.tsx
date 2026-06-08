import { cn } from "@/lib/cn";

/** Centered page column: max-width 1220px, 32px gutters (matches DESIGN.md layout). */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-[1220px] px-8", className)}>{children}</div>;
}
