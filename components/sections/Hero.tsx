import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { links } from "@/content/site";

export function Hero() {
  return (
    <section className="pt-[60px] pb-[46px]">
      <Container className="grid items-center gap-[34px] md:grid-cols-[1.04fr_0.96fr] md:gap-[54px]">
        <div>
          <Eyebrow>Free martial arts &amp; fitness · Harlem, NYC</Eyebrow>
          <h1 className="mt-4 text-[clamp(44px,5.8vw,76px)] font-black tracking-[-0.035em]">
            Strength for{" "}
            <em className="font-serif font-medium italic text-red">everyone</em>, no matter where
            you start.
          </h1>
          <p className="mt-6 mb-[30px] max-w-[34ch] text-xl text-muted">
            We bring free martial arts, fitness, and community to all of Harlem, and beyond. No fees,
            no barriers. Just show up.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button href={links.findClass} variant="red" arrow>
              Find a free class
            </Button>
            <Button href={links.donate} variant="ghost">
              Donate
            </Button>
          </div>
          <p className="mt-[18px] flex items-center gap-2 text-[14.5px] text-muted">
            <span className="text-green" aria-hidden>
              ♥
            </span>
            A registered 501(c)(3), every class and program is free, all year long.
          </p>
        </div>

        <div className="relative">
          <Placeholder
            label="PHOTO: community class, all ages training together, warm & joyful"
            className="aspect-4/5 rounded-[20px]"
          />
          <div className="absolute bottom-[30px] left-3.5 max-w-[230px] rounded-[18px] border border-line bg-card p-[18px_22px] shadow-[0_24px_46px_-20px_rgba(34,29,23,0.4)] md:-left-6">
            <div className="text-[34px] font-black tracking-[-0.03em] text-red">100%</div>
            <div className="mt-0.5 text-[13.5px] font-semibold text-muted">
              Free for every participant, funded by donors like you.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
