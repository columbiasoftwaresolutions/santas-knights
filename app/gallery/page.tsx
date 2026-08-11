import type { Metadata } from "next";
import { HandArrow } from "@/components/redesign/HandArrow";
import { Mark } from "@/components/redesign/Mark";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
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
    <RedesignShell>
      <section className="phead">
        <Wrap>
          <div className="phead-grid">
            <div>
              <R as="h1">Gallery</R>
            </div>
            <R delay={120} className="mcenter" style={{ paddingBottom: 10 }}>
              <a
                className="tlink"
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                More on Instagram <span className="arw">↗</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>

      {/* Full width, not the 1240px column: the grid is the page. */}
      <section className="sec sec--tight" style={{ paddingBottom: "clamp(30px, 4vw, 52px)" }}>
        <MasonryGallery photos={galleryPhotos} />
      </section>

      <section className="closer">
        <Wrap>
          <div className="in">
            <R>
              <h2>
                Join us <Mark>in person</Mark>.
              </h2>
              <p>Volunteer, train, or adopt a letter.</p>
            </R>
            <R delay={100} className="cta-wrap">
              <HandArrow />
              <a className="btn btn--ink" href={links.contact}>
                Get involved <span className="arw">→</span>
              </a>
              <a className="btn btn--ghost" href={links.training}>
                Book a class
              </a>
            </R>
          </div>
        </Wrap>
      </section>
    </RedesignShell>
  );
}
