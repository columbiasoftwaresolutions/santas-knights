import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { pressLogos } from "@/content/site";

export function Press() {
  return (
    <section className="border-y border-bone/12 bg-ink2 py-[54px]">
      <Container className="flex flex-wrap items-center gap-x-12 gap-y-6">
        <p className="font-serif text-[19px] italic text-bone/70">Seen in</p>
        <div className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-6">
          {pressLogos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={150}
              height={42}
              className="h-[26px] w-auto object-contain opacity-70 transition hover:opacity-100 [filter:grayscale(1)_brightness(0)_invert(0.82)]"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
