import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { pressLogos } from "@/content/site";

export function Press() {
  return (
    <section className="border-y border-bone/12 bg-ink2 py-[54px]">
      <Container className="flex flex-col items-start gap-7 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 font-serif text-[19px] font-semibold italic text-bone/70">Seen in</p>
        <ul data-reveal className="flex flex-wrap items-center gap-3 md:gap-3.5">
          {pressLogos.map((logo) => (
            <li key={logo.name}>
              {/* White chip + multiply blend so each logo's own (white) background
                  disappears into the chip — works for opaque JPEGs and PNGs alike.
                  At rest the marks sit greyscale so the row reads as one calm press
                  wall; on hover the outlet blooms to full colour only (no lift —
                  movement here read as distracting). Reduced-motion makes it instant. */}
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${logo.name} — read the story`}
                aria-label={`${logo.name}: read the article (opens in a new tab)`}
                className="group flex h-[56px] items-center justify-center bg-white px-5"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width ?? 160}
                  height={logo.height ?? 44}
                  className="h-[26px] w-auto object-contain opacity-90 mix-blend-multiply grayscale transition-[filter,opacity] duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0"
                  style={{
                    height: logo.displayHeight ? `${logo.displayHeight}px` : undefined,
                    maxWidth: logo.maxWidth ? `${logo.maxWidth}px` : undefined,
                  }}
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
