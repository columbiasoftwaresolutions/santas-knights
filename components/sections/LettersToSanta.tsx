import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { links } from "@/content/site";

export function LettersToSanta() {
  return (
    <section id="letters" className="py-[74px]">
      <Container>
        <div className="relative grid items-center gap-8 overflow-hidden rounded-card-lg bg-green bg-[linear-gradient(160deg,var(--color-green),#22483540)] p-[34px] text-[#eef4ef] md:grid-cols-[1.1fr_0.9fr] md:gap-[46px] md:p-[50px]">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[30px] -right-5 text-[200px] leading-none text-white/[0.06]"
          >
            ✶
          </span>
          <div className="relative">
            <Eyebrow className="text-gold-soft">Letters to Santa</Eyebrow>
            <h2 className="mt-3 mb-3 text-[clamp(28px,3.6vw,44px)] text-white">
              A little magic for Harlem&apos;s kids.
            </h2>
            <p className="mb-6 max-w-[40ch] opacity-90">
              Each year, children write to Santa, and our community helps make their holiday
              brighter. Adopt a letter, give a gift, or volunteer at the celebration.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={links.lettersLearnMore} variant="cream">
                Learn how it works
              </Button>
              <Button href={links.volunteer} variant="clear">
                Volunteer
              </Button>
            </div>
          </div>
          <Placeholder
            label="PHOTO: holiday event, kids & volunteers, joyful"
            className="aspect-[4/3] rounded-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
