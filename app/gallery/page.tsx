import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryGrid, type GalleryTile } from "@/components/gallery/GalleryGrid";
import { getGalleryItems } from "@/lib/content";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery · Santa's Knights",
  description:
    "Photos and videos from Santa's Knights events, classes, and community programs in Harlem.",
};

export const dynamic = "force-dynamic";

/** Static fallback shown until the gallery_media table has published rows. */
const fallbackTiles: GalleryTile[] = [
  {
    id: "f1",
    url: "/images/hero-community.jpg",
    type: "image",
    alt: "Families and volunteers gathered at a Santa's Knights community event",
    caption: "The holiday gift event, all together.",
    meta: "Santa's Letters",
  },
  {
    id: "f2",
    url: "/images/gladiators-sparring.jpg",
    type: "image",
    alt: "Two fighters sparring in full armor",
    caption: "Full-contact, steel and armor.",
    meta: "Training",
  },
  {
    id: "f3",
    url: "/images/combat-helmet.jpg",
    type: "image",
    alt: "A steel combat helmet used in armored training",
    caption: "The tools of the training floor.",
    meta: "Training",
  },
  {
    id: "f4",
    url: "/images/headshot.png",
    type: "image",
    alt: "Damion DiGrazia, founder of Santa's Knights",
    caption: "Damion DiGrazia, founder.",
    meta: "Community",
  },
];

export default async function GalleryPage() {
  const dbItems = await getGalleryItems();
  const tiles: GalleryTile[] =
    dbItems.length > 0
      ? dbItems.map((i) => ({
          id: i.id,
          url: i.url,
          type: i.media_type,
          alt: i.alt_text ?? i.title ?? "Santa's Knights gallery image",
          caption: i.caption ?? i.title,
          meta: i.category,
        }))
      : fallbackTiles;

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

      <section className="bg-ink py-12 md:py-20">
        <Container>
          <GalleryGrid items={tiles} />
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
