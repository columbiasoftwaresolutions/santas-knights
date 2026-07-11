import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { galleryPhotos } from "@/content/galleryPhotos";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery · Santa's Knights",
  description:
    "Photos from Santa's Knights events, classes, and community programs in Harlem.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title={
          <>
            The community in{" "}
            <em className="font-serif font-medium italic text-red">motion</em>.
          </>
        }
        intro="Photos from training sessions, the Letters to Santa event, and life at the Manhattanville Community Center."
      >
        <Button href={links.getInvolved} variant="red" arrow>
          Get involved
        </Button>
        <Button href={links.adoptLetter} variant="ghost">
          Adopt a letter
        </Button>
      </PageHero>

      {/* Full-bleed photo wall: every gallery photo, whole and unedited, packed
          edge-to-edge with no gaps, captions, or categories. The red ground
          matches the CTA band below so the page flows into one red field. */}
      <section className="bg-red-deep">
        <div className="columns-2 gap-0 sm:columns-3 lg:columns-4">
          {galleryPhotos.map((photo, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.file}
              src={`/images/gallery/${encodeURIComponent(photo.file)}`}
              alt={`Santa's Knights community photo ${index + 1}`}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="block w-full break-inside-avoid align-top"
            />
          ))}
        </div>
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
