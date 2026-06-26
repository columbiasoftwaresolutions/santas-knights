import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { DonateBand } from "@/components/sections/DonateBand";
import { getTrainingVideos } from "@/lib/training";
import { getCurrentUser } from "@/lib/auth";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Online Classes · Santa's Knights",
  description:
    "Free virtual classes and instructional videos from Gladiators NYC.",
};

export const dynamic = "force-dynamic";

function isExternalEmbed(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

/** Convert a YouTube/Vimeo share URL into its embeddable form. */
function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default async function OnlinePage() {
  const [user, videos] = await Promise.all([getCurrentUser(), getTrainingVideos()]);

  return (
    <>
      <PageHero
        eyebrow="Online Classes"
        title={
          <>
            Train with us{" "}
            <em className="font-serif font-medium italic text-red">anywhere</em>.
          </>
        }
        intro="Watch free instructional content from Gladiators NYC, then come train in person. The full class schedule and booking are right here on the site."
      >
        <Button href={links.training} variant="red" arrow>
          In-person classes
        </Button>
        <Button href={links.training} variant="ghost">
          See all classes
        </Button>
      </PageHero>

      <section className="bg-ink py-[clamp(84px,10vw,132px)] text-bone">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="font-display text-[clamp(82px,12vw,170px)] leading-[0.8] font-black tracking-[-0.05em] text-red">
            24/7
          </div>
          <div>
            <h2 className="font-display text-[clamp(38px,5vw,68px)] leading-[0.9] font-black tracking-[-0.03em] uppercase">
              Train on your own time.
            </h2>
            <p className="mt-7 max-w-[42rem] text-[18px] leading-[1.65] text-bone/75">
              Instructor-made conditioning and technique videos to train between sessions. The full
              video library lands with the training tracker, alongside on-site class booking.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={links.training} variant="red" size="lg" arrow>
                Browse in-person classes
              </Button>
              <Button href={links.membership} variant="bone" size="lg">
                Join free
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Strength & Conditioning video library */}
      <section className="py-section">
        <Container>
          <SectionHeading
            eyebrow="Strength & Conditioning"
            title="Video library"
            intro="Instructor-made conditioning and technique videos. Free for members — sign in to watch."
            introClassName="max-w-[52ch]"
          />

          {!user ? (
            <Card className="mt-8 p-[34px] text-center">
              <p className="text-muted">
                The video library is free for members. Create a free account or sign in to watch.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button href={`${links.accountRegister}?next=${encodeURIComponent("/online")}`} variant="red" arrow>
                  Create a free account
                </Button>
                <Button href={`${links.accountLogin}?next=${encodeURIComponent("/online")}`} variant="ghost">
                  Sign in
                </Button>
              </div>
            </Card>
          ) : videos.length === 0 ? (
            <Card className="mt-8 p-[34px] text-center">
              <p className="text-muted">
                No videos have been posted yet. Instructors are putting the library together — check
                back soon.
              </p>
            </Card>
          ) : (
            <div className="mt-8 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <Card key={v.id} className="flex flex-col overflow-hidden p-0">
                  <div className="aspect-video bg-ink">
                    {v.url && isExternalEmbed(v.url) ? (
                      <iframe
                        src={toEmbedUrl(v.url)}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    ) : v.url ? (
                      <video src={v.url} controls preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-bone/50">Unavailable</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-[22px]">
                    {v.category && (
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-red">{v.category}</span>
                    )}
                    <h3 className="mt-1 text-[17px] font-extrabold tracking-[-0.02em]">{v.title}</h3>
                    {v.description && (
                      <p className="mt-2 flex-1 text-[14.5px] text-muted">{v.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
