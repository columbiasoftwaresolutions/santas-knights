import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Members · Santa's Knights",
  description:
    "Sign in to track submitted letters and manage your Santa's Knights membership.",
};

/**
 * Member account home from Plan v2 §A1.
 * Auth (email + password via Supabase Auth) and family letter-tracking (§C2) coming next.
 * This scaffold routes to login/register once auth is wired up.
 */
export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Members Area"
        title={
          <>
            Your Santa&apos;s Knights{" "}
            <em className="font-serif font-medium italic text-red">account</em>.
          </>
        }
        intro="Track submitted letters and manage your membership."
      >
        <Button href={links.accountLogin} variant="red" arrow>
          Sign in
        </Button>
        <Button href={links.accountRegister} variant="ghost">
          Create an account
        </Button>
      </PageHero>

      <section className="py-section">
        <Container className="grid gap-[22px] md:grid-cols-3">
          <Card hover className="flex flex-col p-[30px]">
            <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-green" />
            <h2 className="text-h3">Track your letters</h2>
            <p className="mt-2.5 flex-1 text-muted">
              See whether each submitted letter is pending, approved, or fulfilled.
            </p>
            <div className="mt-5">
              <Button href={links.accountLogin} variant="green" className="px-5 py-3 text-[14.5px]">
                Sign in to see your letters
              </Button>
            </div>
          </Card>

          <Card hover className="flex flex-col p-[30px]">
            <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-red" />
            <h2 className="text-h3">Train with us</h2>
            <p className="mt-2.5 flex-1 text-muted">
              Classes are free and open to everyone. Browse the six Gladiators NYC programs and
              reserve a spot right here.
            </p>
            <div className="mt-5">
              <Button href={links.training} variant="red" arrow className="px-5 py-3 text-[14.5px]">
                Browse classes
              </Button>
            </div>
          </Card>

          <Card hover className="flex flex-col p-[30px]">
            <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-gold" />
            <h2 className="text-h3">Membership</h2>
            <p className="mt-2.5 flex-1 text-muted">
              Membership ranges from free class registration to a $500 monthly corporate tier.
            </p>
            <div className="mt-5">
              <Button href={links.membership} variant="ghost" className="px-5 py-3 text-[14.5px]">
                View tiers
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
