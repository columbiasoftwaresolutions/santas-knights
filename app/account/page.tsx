import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOutAction } from "@/app/account/actions";
import { MyGifts, type MyGift } from "@/components/account/MyGifts";
import { links, BOOK_HREF, DASHBOARD_HREF } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members · Santa's Knights",
  description: "Sign in to submit and track letters and manage your Santa's Knights membership.",
};

type MyLetter = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[];
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; tone: string }> = {
  live: { label: "Live", tone: "bg-green-soft text-green" },
  fulfilled: { label: "Gift sent 🎁", tone: "bg-green-soft text-green" },
  deleted: { label: "Deleted", tone: "bg-red/10 text-red" },
};

async function getMyLetters(): Promise<MyLetter[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("my_letters")
    .select("id, child_first_name, child_age, wish_note, amazon_urls, status, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load my letters:", error.message);
    return [];
  }
  return (data ?? []) as MyLetter[];
}

async function getMyGifts(): Promise<MyGift[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("my_gifts")
    .select("id, child_first_name, child_age, wish_note, amazon_urls, status, claimed_at, fulfilled_at")
    .order("claimed_at", { ascending: false });
  if (error) {
    console.error("Failed to load my gifts:", error.message);
    return [];
  }
  return (data ?? []) as MyGift[];
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) return <SignedOut />;

  const [letters, gifts] = await Promise.all([getMyLetters(), getMyGifts()]);

  // Training lives on gladiators.nyc (shared login) — link participants out.
  const showTraining = user.role === "participant" || user.role === "instructor";

  return (
    <>
      <PageHero
        eyebrow="Members Area"
        title={
          <>
            Your{" "}
            <em className="font-serif font-medium italic text-red">account</em>.
          </>
        }
        intro={`Signed in as ${user.email ?? "your account"}.`}
      >
        <Button href={links.submitLetter} variant="green" arrow>
          Submit a letter
        </Button>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </PageHero>

      {/* What you can do — the three member actions */}
      <section className="border-b border-line py-section">
        <Container className="grid gap-[18px] md:grid-cols-3">
          <ActionCard
            accent="bg-red"
            title="Gift a kid"
            body="Read the letters one at a time and pick a wish to send. We keep the child's details private."
            cta="Adopt a letter"
            href={links.adoptLetter}
            variant="red"
          />
          <ActionCard
            accent="bg-green"
            title="Train with us"
            body="Reserve a free class on gladiators.nyc — this login works there too. First time, you'll sign a quick one-time waiver."
            cta="Find a class"
            href={BOOK_HREF}
            variant="green"
          />
          <ActionCard
            accent="bg-gold"
            title="Donate"
            body="Help keep classes free and the gifts coming. Every dollar is tax-deductible."
            cta="Donate"
            href={links.donate}
            variant="ghostInverse"
          />
        </Container>
      </section>

      {/* Training / classes — the dashboard lives on gladiators.nyc */}
      {showTraining && (
        <section className="border-b border-line py-section">
          <Container>
            <Card className="flex flex-col items-start gap-5 p-[34px] md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-h3 text-ink">Your training dashboard</h2>
                <p className="mt-2 max-w-[58ch] text-muted">
                  XP, rank, badges, attendance, and your upcoming reservations live on
                  gladiators.nyc — sign in there with this same account.
                </p>
              </div>
              <Button href={DASHBOARD_HREF} variant="red" arrow className="shrink-0">
                Open my dashboard
              </Button>
            </Card>
          </Container>
        </section>
      )}

      {/* Gifts I'm sending + My letters, side by side */}
      <section className="border-t border-line py-section">
        <Container>
          <div className="grid gap-x-[44px] gap-y-14 lg:grid-cols-2">
            {/* Gifts I'm sending */}
            <MyGifts gifts={gifts} />

            {/* My letters (Phase 3 / §C2) */}
            <div>
              <SectionHeading
                eyebrow="Santa's Letters"
                title="My letters"
                intro="Every letter you've submitted and where it stands. Only you can see this."
                introClassName="max-w-[52ch]"
              />

              {letters.length === 0 ? (
                <Card className="mt-8 p-[34px] text-center">
                  <p className="text-muted">You haven&apos;t submitted a letter yet.</p>
                  <div className="mt-5 flex justify-center">
                    <Button href={links.submitLetter} variant="green">
                      Submit a child&apos;s letter
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-1">
                  {letters.map((letter) => {
                    const badge = STATUS_LABELS[letter.status] ?? {
                      label: letter.status,
                      tone: "bg-paper-raised text-muted",
                    };
                    return (
                      <Card key={letter.id} className="flex flex-col p-[26px]">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-[17px] font-extrabold tracking-[-0.02em]">
                            {letter.child_first_name}, age {letter.child_age}
                          </h3>
                          <span
                            className={`rounded-pill px-3 py-1 text-[12px] font-bold ${badge.tone}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-3 flex-1 text-[14.5px] text-muted">
                          {letter.wish_note}
                        </p>
                        <p className="mt-3 text-[12.5px] font-semibold text-muted">
                          {letter.amazon_urls.length} gift
                          {letter.amazon_urls.length === 1 ? "" : "s"} ·{" "}
                          {new Date(letter.created_at).toLocaleDateString()}
                        </p>
                  </Card>
                );
              })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ActionCard({
  accent,
  title,
  body,
  cta,
  href,
  variant,
}: {
  accent: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  variant: "red" | "green" | "ghost" | "ghostInverse";
}) {
  return (
    <Card hover className="flex flex-col p-[30px]">
      <span aria-hidden className={`mb-4 block h-1 w-10 rounded-pill ${accent}`} />
      <h2 className="text-h3 text-ink">{title}</h2>
      <p className="mt-2.5 flex-1 text-muted">{body}</p>
      <div className="mt-5">
        <Button href={href} variant={variant} className="px-5 py-3 text-[14.5px]">
          {cta}
        </Button>
      </div>
    </Card>
  );
}

function SignedOut() {
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
        intro="Create a free account to submit a child's letter, adopt a wish to gift, and track everything in one place."
      >
        <Button href={links.accountRegister} variant="red" arrow>
          Create an account
        </Button>
        <Button href={links.accountLogin} variant="ghost">
          Sign in
        </Button>
      </PageHero>

      <section className="py-section">
        <Container className="grid gap-[22px] md:grid-cols-3">
          <Card hover className="flex flex-col p-[30px]">
            <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-green" />
            <h2 className="text-h3">Submit &amp; track letters</h2>
            <p className="mt-2.5 flex-1 text-muted">
              An account is required to submit a child&apos;s letter, so we can reach you and you can
              follow its status.
            </p>
            <div className="mt-5">
              <Button href={links.accountRegister} variant="green" className="px-5 py-3 text-[14.5px]">
                Get started
              </Button>
            </div>
          </Card>

          <Card hover className="flex flex-col p-[30px]">
            <span aria-hidden className="mb-4 block h-1 w-10 rounded-pill bg-red" />
            <h2 className="text-h3">Train with us</h2>
            <p className="mt-2.5 flex-1 text-muted">
              Classes are free and open to everyone. Browse the six Gladiators NYC programs here,
              then book on gladiators.nyc — one login works on both sites.
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
