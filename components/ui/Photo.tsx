import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A cover-fit photo in a fixed-aspect box. Mirrors Placeholder's API
 * (label→alt, className for aspect/rounding) so the two swap cleanly.
 * Uses next/image for responsive sizing + optimization.
 *
 * `duotone` applies the poster system's ink+accent treatment: the photo is
 * desaturated and luminosity-blended over a warm gradient, with a bottom shade
 * so light text reads on top. "cool" = ink→red, "warm" = ink→amber.
 */
export function Photo({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  duotone,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  duotone?: "cool" | "warm";
}) {
  if (duotone) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 z-[1]",
            duotone === "warm"
              ? "bg-[linear-gradient(135deg,#1a1207_0%,#5a3a1d_60%,#c98a3a_135%)]"
              : "bg-[linear-gradient(135deg,#16120f_0%,#4a1d15_55%,#c2331f_125%)]",
          )}
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="relative z-[2] object-cover mix-blend-luminosity [filter:grayscale(1)_contrast(1.18)_brightness(0.86)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(22,18,15,0)_40%,rgba(22,18,15,0.55)_100%)]"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
