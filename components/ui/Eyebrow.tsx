import { cn } from "@/lib/cn";

/** Uppercase section label. Defaults to brand red; pass a color class to override. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[13px] font-bold uppercase tracking-[0.16em] text-red", className)}>
      {children}
    </p>
  );
}
