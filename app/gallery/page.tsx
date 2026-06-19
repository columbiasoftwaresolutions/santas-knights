import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery · Santa's Knights",
  description:
    "Photos and videos from Santa's Knights events, classes, and community programs in Harlem.",
};

const photos = [
  {
    src: "/images/hero-community.jpg",
    alt: "Families and volunteers gathered at a Santa's Knights community event",
    caption: "The holiday gift event, all together.",
    meta: "Santa's Letters · Harlem",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/images/gladiators-sparring.jpg",
    alt: "Two fighters sparring in full armor",
    caption: "Full-contact, steel and armor.",
    meta: "Training · Gladiators NYC",
    className: "sm:row-span-2",
  },
  {
    src: "/images/combat-helmet.jpg",
    alt: "A steel combat helmet used in armored training",
    caption: "The tools of the training floor.",
    meta: "Equipment · Armored combat",
    className: "",
  },
  {
    src: "/images/headshot.png",
    alt: "Damion DiGrazia, founder of Santa's Knights",
    caption: "Damion DiGrazia, founder.",
    meta: "Community · Leadership",
    className: "",
  },
];

const placeholders = [
  ["Santa's Letters", "Kids at the holiday gift drive"],
  ["Events", "Letters being sorted before the giveaway"],
  ["Training", "Women's combat and fitness class"],
  ["Archive", "Armored tournament, 2024"],
] as const;

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            The community in{" "}
            <em className="font-serif font-medium italic text-red">motion</em>.
          </>
        }
        intro="Photos and videos from training sessions, the Letters to Santa event, and life at the Manhattanville Community Center."
      >
        <Button href={links.getInvolved} variant="red" arrow>
          Get involved
        </Button>
        <Button href={links.adoptLetter} variant="ghost">
          Adopt a letter
        </Button>
      </PageHero>

      <section className="border-b border-bone/10 bg-ink2 py-6">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            {["All", "Training", "Santa's Letters", "Events", "Community"].map((label, index) => (
              <span
                key={label}
                className={`border px-4 py-2 text-[11px] font-bold tracking-[0.1em] uppercase ${
                  index === 0 ? "border-red bg-red text-paper" : "border-bone/25 text-bone/70"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-12 md:py-20">
        <Container>
          <div className="grid auto-rows-[190px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {photos.map((photo) => (
              <figure key={photo.src} className={`group relative overflow-hidden bg-ink2 ${photo.className}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-transparent" />
                <figcaption className="absolute right-5 bottom-4 left-5">
                  <p className="font-serif text-[17px] italic text-paper">{photo.caption}</p>
                  <p className="mt-1 text-[10px] font-bold tracking-[0.13em] text-paper/60 uppercase">
                    {photo.meta}
                  </p>
                </figcaption>
              </figure>
            ))}
            {placeholders.map(([tag, label], index) => (
              <div
                key={label}
                className={`flex flex-col justify-between border p-5 ${
                  index % 2 === 0
                    ? "border-line bg-paper-raised text-ink"
                    : "border-bone/15 bg-ink2 text-bone"
                }`}
              >
                <span className="text-[10px] font-bold tracking-[0.18em] text-red uppercase">{tag}</span>
                <p className="font-serif text-[18px] italic">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-red-deep py-[clamp(72px,9vw,120px)] text-paper">
        <Container>
          <h2 className="max-w-[960px] font-display text-[clamp(48px,8vw,112px)] leading-[0.86] font-black tracking-[-0.04em] uppercase">
            Join us <em className="font-serif font-normal normal-case italic text-amber">in person.</em>
          </h2>
          <p className="mt-7 max-w-[38rem] text-[19px] text-paper/85">
            We are still organizing the full archive. Volunteer, train, or help with Santa&apos;s
            Letters to take part in the next event.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={links.getInvolved} variant="cream">Get involved</Button>
            <Button href="https://www.instagram.com/santasknights/" variant="clear">Instagram ↗</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
