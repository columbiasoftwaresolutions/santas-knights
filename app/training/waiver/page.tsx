import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WaiverForm } from "@/components/training/WaiverForm";
import { getCurrentUser } from "@/lib/auth";
import { getWaiverStatus } from "@/lib/training";
import { LIABILITY_WAIVER_TEXT, LIABILITY_WAIVER_VERSION } from "@/content/consent";
import { links } from "@/content/site";

const INTRO =
  "Armored combat is full-contact. Read and accept the liability waiver below to reserve classes. It only takes a minute and you won't be asked again unless the waiver changes.";

export const metadata: Metadata = {
  title: "Training Waiver · Santa's Knights",
  description: "Sign the Gladiators NYC liability waiver and media release to start training.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/training";
}

export default async function WaiverPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);
  const user = await getCurrentUser();

  if (!user) {
    return (
      <section className="bg-paper pt-[clamp(48px,7vw,90px)] pb-section text-ink">
        <Container className="max-w-[760px]">
          <p className="text-[clamp(17px,1.7vw,21px)] leading-[1.55] text-ink">{INTRO}</p>
          <Card className="mt-8 p-[34px] text-center">
            <p className="text-muted">You need a free account to sign the training waiver.</p>
            <div className="mt-5">
              <Button
                href={`${links.accountLogin}?next=${encodeURIComponent("/training/waiver")}`}
                variant="red"
                arrow
              >
                Sign in to continue
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    );
  }

  const waiver = await getWaiverStatus(user.id);

  return (
    <section className="bg-paper pt-[clamp(48px,7vw,90px)] pb-section text-ink">
      <Container className="max-w-[760px]">
        {/* The lede sits full-width directly above the waiver box. */}
        <p className="text-[clamp(17px,1.7vw,21px)] leading-[1.55] text-ink">{INTRO}</p>

        <div className="mt-8">
          {waiver.currentVersion && (
            <Card className="mb-6 border-green/40 bg-green-soft p-5 text-[15px] text-green">
              You&apos;ve already signed the current waiver. You can re-submit it below if you like, or{" "}
              <a href={next} className="font-bold underline">continue to classes</a>.
            </Card>
          )}
          {error === "incomplete" && (
            <Card className="mb-6 border-red/40 bg-red/5 p-5 text-[15px] font-semibold text-red">
              Please type your legal name and check the agreement box to continue.
            </Card>
          )}
          {error === "guardian" && (
            <Card className="mb-6 border-red/40 bg-red/5 p-5 text-[15px] font-semibold text-red">
              A participant under 18 needs a parent or guardian name on the waiver. Please add it to
              continue.
            </Card>
          )}

          <Card className="p-[30px] md:p-[38px]">
            <h2 className="text-h3">Liability waiver &amp; assumption of risk</h2>
            <p className="mt-1 text-[13px] font-semibold text-muted">Version {LIABILITY_WAIVER_VERSION}</p>
            <div className="mt-4 max-h-[320px] overflow-y-auto whitespace-pre-line border border-line bg-paper-raised p-5 text-[14.5px] leading-relaxed text-ink/90">
              {LIABILITY_WAIVER_TEXT}
            </div>

            <WaiverForm next={next} />
          </Card>
        </div>
      </Container>
    </section>
  );
}
