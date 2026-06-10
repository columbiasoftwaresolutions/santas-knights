import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Mission() {
  return (
    <section id="about" className="py-section">
      <Container className="max-w-[1000px]">
        <Eyebrow className="mb-6">Our mission</Eyebrow>
        <q className="block font-serif text-quote font-medium leading-[1.3] tracking-[-0.01em] [quotes:none]">
          Santa&apos;s Knights brings{" "}
          <b className="font-semibold italic text-red">free</b> martial arts, fitness, and
          activities to everyone, equitably, transcending socioeconomic, racial, and location
          boundaries, positively changing children&apos;s and adults&apos; lives through exposure and
          lifestyle enhancement.
        </q>
        <div className="mt-[22px] flex items-center gap-3 text-[15px] font-semibold text-muted before:h-0.5 before:w-[34px] before:bg-gold before:content-['']">
          Santa&apos;s Knights, Inc. · 501(c)(3) nonprofit
        </div>
      </Container>
    </section>
  );
}
