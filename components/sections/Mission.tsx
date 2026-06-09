import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Mission() {
  return (
    <section id="about" className="py-section">
      <Container className="max-w-[1000px]">
        <Eyebrow className="mb-6">Our mission</Eyebrow>
        <q className="block font-serif text-quote font-medium leading-[1.3] tracking-[-0.01em] [quotes:none]">
          We create{" "}
          <b className="font-semibold italic text-red">positive outcomes</b> in people&apos;s lives
          through uplifting training and purpose, transcending background, income, and zip code, and
          we serve our communities through real social impact.
        </q>
        <div className="mt-[22px] flex items-center gap-3 text-[15px] font-semibold text-muted before:h-0.5 before:w-[34px] before:bg-gold before:content-['']">
          Santa&apos;s Knights, Inc. · 501(c)(3) nonprofit
        </div>
      </Container>
    </section>
  );
}
