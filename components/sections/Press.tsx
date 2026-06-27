import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { pressLogos } from "@/content/site";

export function Press() {
  return (
    <section className="border-y border-bone/12 bg-ink2 py-[54px]">
      <Container className="flex flex-col items-start gap-7 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 font-serif text-[19px] italic text-bone/70">Seen in</p>
        <ul className="flex flex-wrap items-center gap-3 md:gap-3.5">
          {pressLogos.map((logo) => (
            <li key={logo.name}>
              {/* White chip + multiply blend so each logo's own (white) background
                  disappears into the chip — works for opaque JPEGs and PNGs alike. */}
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${logo.name} — read the story`}
                aria-label={`${logo.name}: read the article (opens in a new tab)`}
                className="flex h-[54px] items-center justify-center rounded-[10px] bg-white px-5 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-10px_rgba(0,0,0,0.6)]"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={160}
                  height={44}
                  className="h-[26px] w-auto object-contain mix-blend-multiply"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
