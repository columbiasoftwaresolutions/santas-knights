import { cn } from "@/lib/cn";

/** Centered page column for the poster system: max-width 1440px, 24/56px gutters. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-6 md:px-14", className)}>{children}</div>
  );
}
