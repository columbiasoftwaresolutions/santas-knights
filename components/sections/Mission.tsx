import { Container } from "@/components/ui/Container";

/** Giant numeral + serif mission standfirst on paper. */
export function Mission() {
  return (
    <section id="about" className="bg-paper py-24 text-ink">
      <Container className="grid items-start gap-14 md:grid-cols-[0.9fr_1.6fr]">
        <div
          data-reveal
          className="font-display text-[clamp(80px,10vw,150px)] font-black leading-[0.82] tracking-[-0.04em]"
        >
          01
        </div>
        <p
          data-reveal
          style={{ transitionDelay: "120ms" }}
          className="font-serif text-[clamp(28px,3vw,42px)] font-normal leading-[1.18] tracking-[-0.02em]"
        >
          Santa&apos;s Knights&apos; mission is to bring <em className="italic text-red">free</em>{" "}
          martial arts, fitness, and activities to everyone, equitably, transcending socioeconomic,
          racial, and location boundaries, positively changing children&apos;s and adults&apos; lives
          through exposure and lifestyle enhancement.
        </p>
      </Container>
    </section>
  );
}
