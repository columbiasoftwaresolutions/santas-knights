import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HorizontalScrollGallery } from "@/components/gallery/HorizontalScrollGallery";
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
      <HorizontalScrollGallery photos={galleryPhotos} />

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
