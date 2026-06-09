import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A cover-fit photo in a fixed-aspect box. Mirrors Placeholder's API
 * (label→alt, className for aspect/rounding) so the two swap cleanly.
 * Uses next/image for responsive sizing + optimization.
 */
export function Photo({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
