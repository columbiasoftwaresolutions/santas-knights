import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
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
      <section className="bg-ink pt-[clamp(28px,6vw,64px)] pb-[clamp(20px,3vw,32px)] text-paper">
        <Container>
          <h1 className="font-display text-[clamp(56px,12vw,150px)] leading-[0.85] font-black tracking-[-0.04em] uppercase text-paper">
            Gallery
          </h1>
        </Container>
      </section>

      <MasonryGallery photos={galleryPhotos} />

      <section className="text-paper">
        <a
          href={links.getInvolved}
          aria-label="Join us in person — get involved"
          className="group block bg-red-deep py-[clamp(72px,9vw,120px)] outline-none transition-colors duration-200 ease-out hover:bg-[#8e2130] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-paper"
        >
          <Container>
            <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[900px]">
                <h2 className="font-display text-[clamp(48px,8vw,112px)] leading-[0.86] font-black tracking-[-0.04em] uppercase">
                  Join us <em className="font-serif font-normal normal-case italic text-amber">in person.</em>
                </h2>
                <p className="mt-7 max-w-[38rem] text-[19px] text-paper/85">
                  Volunteer, train, or help with Santa&apos;s Letters to take part in the next event.
                </p>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="hidden h-[clamp(64px,8vw,140px)] w-[clamp(64px,8vw,140px)] shrink-0 text-paper transition-transform duration-200 ease-out group-hover:translate-x-3 sm:block"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Container>
        </a>
      </section>
    </>
  );
}
