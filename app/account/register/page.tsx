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
  title: "Create Account · Santa's Knights",
  description: "Create a free Santa's Knights account to submit and track letters.",
};

function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default async function AccountRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(rawNext);

  if ((await getCurrentUser()) !== null) redirect(next);

  return (
    <>
      <PageHero
        eyebrow="Members Area"
        title="Create an account"
        intro="A free account lets you submit a child's letter and track its status from our team."
      />

      <section className="py-section">
        <Container className="max-w-[480px]">
          <Card className="p-[38px]">
            {isSupabaseConfigured() ? (
              <>
                <AuthForm mode="register" next={next} />
                <div className="mt-7 text-center text-[14px] text-muted">
                  Already have an account?{" "}
                  <a
                    href={`${links.accountLogin}?next=${encodeURIComponent(next)}`}
                    className="font-bold text-ink underline"
                  >
                    Sign in
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
