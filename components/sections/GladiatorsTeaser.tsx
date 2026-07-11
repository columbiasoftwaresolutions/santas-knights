import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { founder } from "@/content/site";

/** Steel band: the founder's pull-quote about the two programs. */
export function GladiatorsTeaser() {
  return (
    <section id="training" className="bg-ink py-26 text-bone">
      <Container>
        <div className="grid items-start gap-14 md:grid-cols-[0.6fr_1.4fr]">
          <Photo
            src="/images/headshot.png"
            alt={`${founder.name}, ${founder.role}`}
            duotone="cool"
            sizes="(min-width: 768px) 24vw, 100vw"
            className="aspect-[4/5]"
          />
          <div>
            <blockquote className="font-serif text-[clamp(28px,3.4vw,46px)] font-normal leading-[1.12] tracking-[-0.02em]">
              <span className="font-semibold text-red">&ldquo;</span>One program brings a special type
              of holiday joy to individuals in need, while the other can help members{" "}
              <em className="italic text-amber mr-[0.12em]">change their lives entirely</em> by focusing on their
              health and mental well-being.&rdquo;
            </blockquote>
            <div className="mt-7 text-[14px] font-semibold uppercase tracking-[0.1em] text-amber">
              {founder.name}, {founder.role}
              <span className="mt-1 block font-medium tracking-[0.06em] text-bone/55">
                On Santa&apos;s Knights
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
