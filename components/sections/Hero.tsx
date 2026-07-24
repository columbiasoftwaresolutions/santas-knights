import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { links } from "@/content/site";

type HeroPhoto = { src: string; alt: string; priority?: boolean };

// Left stack: Gladiators NYC. Right stack: Santa's Letters. The two accent
// portraits bleed to the viewport edge and flank the same split.
const STACK_LEFT: HeroPhoto[] = [
  {
    src: "/images/gallery/48390620_10161478129155422_4700377874773835776_o.jpg",
    alt: "A knight in armor with a boy at a Santa's Knights holiday party",
    priority: true,
  },
  {
    src: "/images/gallery/6b7494_da7cab87beee4becb1fa08dd5b8bb6b9_mv2.webp",
    alt: "Kids sparring with padded swords in a Gladiators NYC class",
    priority: true,
  },
];

const STACK_RIGHT: HeroPhoto[] = [
  {
    src: "/images/gallery/REVIEW-Dear-Santa-03.jpeg",
    alt: "A girl holding a wrapped gift beside Santa",
    priority: true,
  },
  {
    src: "/images/gallery/48362591_10161478136885422_5477524744964145152_o.jpg",
    alt: "A girl mid-gasp opening a wrapped present",
    priority: true,
  },
];

const ACCENT_LEFT: HeroPhoto = {
  src: "/images/gallery/23.jpg",
  alt: "A boy posing in sparring gear with a foam sword",
  priority: true,
};

const ACCENT_RIGHT: HeroPhoto = {
  src: "/images/gallery/349785250_590703779825640_7610052969464252994_n.jpg",
  alt: "A boy mailing a letter into a red Letters to Santa mailbox",
  priority: true,
};

const STACK_SIZES = "(min-width: 1280px) 27vw, (min-width: 768px) 30vw, 46vw";

// Photos fade in one at a time, left to right, rather than as grouped blocks.
const REVEAL_STEP_MS = 70;

/** Bordered, shadowed frame shared by every hero photo; fades in on its own delay. */
function HeroPhoto({
  photo,
  sizes,
  className,
  revealDelayMs,
}: {
  photo: HeroPhoto;
  sizes: string;
  className?: string;
  revealDelayMs: number;
}) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: `${revealDelayMs}ms` }}
      className={cn("reveal-zoom", className)}
    >
      <Photo
        src={photo.src}
        alt={photo.alt}
        priority={photo.priority}
        sizes={sizes}
        className="h-full border border-line bg-paper-raised shadow-card"
      />
    </div>
  );
}

/**
 * Structured editorial hero: a centered mission statement framed by a
 * symmetric photo grid — Gladiators NYC stacked on the left, Santa's Letters
 * stacked on the right, two accent portraits bleeding to the viewport edge.
 */
export function Hero() {
  return (
    <section className="border-b border-line bg-paper text-ink">
      <div className="grid grid-cols-[minmax(0,1328px)] items-stretch justify-center xl:grid-cols-[minmax(64px,1fr)_minmax(0,1328px)_minmax(64px,1fr)] xl:justify-normal">
        <HeroPhoto
          photo={ACCENT_LEFT}
          sizes="190px"
          revealDelayMs={0}
          className="my-[72px] ml-6 hidden h-[560px] w-[190px] justify-self-end xl:block"
        />

        <div className="grid grid-cols-1 items-center gap-7 px-6 py-12 md:grid-cols-[1fr_minmax(0,560px)_1fr] md:px-7 md:py-[72px]">
          <div className="grid h-[200px] grid-cols-2 gap-3 md:h-[560px] md:grid-cols-1 md:grid-rows-2 md:gap-5">
            {STACK_LEFT.map((photo, i) => (
              <HeroPhoto
                key={photo.src}
                photo={photo}
                sizes={STACK_SIZES}
                revealDelayMs={REVEAL_STEP_MS * (i + 1)}
                className="h-full"
              />
            ))}
          </div>

          <div className="text-center">
            <h1
              data-reveal
              className="font-serif text-[clamp(38px,3.6vw,58px)] font-bold leading-[1.05] tracking-[-0.02em]"
            >
              Strengthening kids and lifting{" "}
              <em className="font-bold italic text-red">communities</em>.
            </h1>
            <p
              data-reveal
              style={{ transitionDelay: "90ms" }}
              className="mx-auto mt-[22px] max-w-[420px] text-[18px] leading-relaxed text-muted"
            >
              A nonprofit that teaches armored combat and fitness at no cost, and helps answer local
              kids&apos; letters to Santa at the holidays.
            </p>
            <div
              data-reveal
              style={{ transitionDelay: "180ms" }}
              className="mt-[30px] flex flex-wrap items-center justify-center gap-3.5"
            >
              <Button href={links.adoptLetter} variant="red" size="lg" arrow>
                Adopt a letter
              </Button>
              <Button href={links.donate} variant="ghost" size="lg">
                Donate
              </Button>
            </div>
          </div>

          <div className="grid h-[200px] grid-cols-2 gap-3 md:h-[560px] md:grid-cols-1 md:grid-rows-2 md:gap-5">
            {STACK_RIGHT.map((photo, i) => (
              <HeroPhoto
                key={photo.src}
                photo={photo}
                sizes={STACK_SIZES}
                revealDelayMs={REVEAL_STEP_MS * (i + 3)}
                className="h-full"
              />
            ))}
          </div>
        </div>

        <HeroPhoto
          photo={ACCENT_RIGHT}
          sizes="190px"
          revealDelayMs={REVEAL_STEP_MS * 5}
          className="my-[72px] mr-6 hidden h-[560px] w-[190px] justify-self-start xl:block"
        />
      </div>
    </section>
  );
}
