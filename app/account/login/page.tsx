import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { AuthForm } from "@/components/account/AuthForms";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Sign In · Santa's Knights",
  description: "Sign in to your Santa's Knights account.",
};

function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(rawNext);

  // Already signed in → go straight where they were headed.
  if ((await getCurrentUser()) !== null) redirect(next);

  return (
    <>
      <PageHero
        eyebrow="Members Area"
        title="Sign in"
        intro="Access your account to track submitted letters and manage your membership."
      />

      <section className="py-section">
        <Container className="max-w-[480px]">
          <Card className="p-[38px]">
            {isSupabaseConfigured() ? (
              <>
                <AuthForm mode="login" next={next} />
                <div className="mt-7 text-center text-[14px] text-muted">
                  Don&apos;t have an account?{" "}
                  <a
                    href={`${links.accountRegister}?next=${encodeURIComponent(next)}`}
                    className="font-bold text-ink underline"
                  >
                    Create one
                  </a>
                </div>
              </>
            ) : (
              <p className="text-center text-[15px] text-muted">
                Accounts aren&apos;t available yet. Please check back soon.
              </p>
            )}
          </Card>
        </Container>
      </section>
    </>
  );
}
