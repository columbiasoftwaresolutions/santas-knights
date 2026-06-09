import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { pressLogos } from "@/content/site";

export function Press() {
  return (
    <section className="border-t border-line py-[46px]">
      <Container>
        <p className="mb-7 text-center text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {pressLogos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={150}
              height={42}
              className="h-[34px] w-auto object-contain opacity-60 mix-blend-multiply grayscale transition hover:opacity-100"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
