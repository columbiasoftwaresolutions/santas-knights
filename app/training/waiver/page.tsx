import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { getCurrentUser } from "@/lib/auth";
import { getWaiverStatus } from "@/lib/training";
import { signWaiver } from "@/app/training/actions";
import {
  LIABILITY_WAIVER_TEXT,
  LIABILITY_WAIVER_VERSION,
  MEDIA_CONSENT_TEXT,
} from "@/content/consent";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Training Waiver · Santa's Knights",
  description: "Sign the Gladiators NYC liability waiver and media release to start training.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/training";
}

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper px-[16px] py-[12px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

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
      <>
        <PageHero eyebrow="Training" title="Sign in to continue" intro="You need a free account to sign the training waiver." />
        <section className="py-section">
          <Container className="max-w-[480px]">
            <Card className="p-[34px] text-center">
              <Button href={`${links.accountLogin}?next=${encodeURIComponent("/training/waiver")}`} variant="red" arrow>
                Sign in
              </Button>
            </Card>
          </Container>
        </section>
      </>
    );
  }

  const waiver = await getWaiverStatus(user.id);

  return (
    <>
      <PageHero
        eyebrow="Training waiver"
        title={
          <>
            Before your <em className="font-serif font-medium italic text-red">first class</em>.
          </>
        }
        intro="Armored combat is full-contact. Read and accept the liability waiver below to reserve classes. It only takes a minute and you won't be asked again unless the waiver changes."
      />

      <section className="py-section">
        <Container className="max-w-[760px]">
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

            <form action={signWaiver} className="mt-7 grid gap-5">
              <input type="hidden" name="next" value={next} />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="participant_name" className={labelBase}>Participant name</label>
                  <input id="participant_name" name="participant_name" required className={fieldBase} placeholder="Who is training" />
                </div>
                <div>
                  <label htmlFor="dob" className={labelBase}>Date of birth</label>
                  <input id="dob" name="dob" type="date" className={fieldBase} />
                </div>
              </div>

              <div>
                <label htmlFor="guardian_name" className={labelBase}>
                  Parent / guardian name <span className="font-normal normal-case">(if participant is under 18)</span>
                </label>
                <input id="guardian_name" name="guardian_name" className={fieldBase} placeholder="Required for minors" />
              </div>

              <label className="flex items-start gap-3 border border-line bg-paper-raised p-4">
                <input type="checkbox" name="media_consent" className="mt-1 h-4 w-4 flex-none accent-green" />
                <span className="text-[14px] text-muted">
                  <strong className="font-bold text-ink">Optional media release.</strong>{" "}
                  {MEDIA_CONSENT_TEXT.split("\n").slice(-1)[0]}
                </span>
              </label>

              <div>
                <label htmlFor="typed_name" className={labelBase}>Type your legal name to sign</label>
                <input id="typed_name" name="typed_name" required autoComplete="name" className={fieldBase} placeholder="Your full legal name" />
              </div>

              <label className="flex items-start gap-3">
                <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 flex-none accent-red" />
                <span className="text-[14.5px] text-ink">
                  I have read and agree to the liability waiver above, and I am the participant or
                  their parent/legal guardian.
                </span>
              </label>

              <Button type="submit" variant="red">Sign &amp; continue</Button>
            </form>
          </Card>
        </Container>
      </section>
    </>
  );
}
