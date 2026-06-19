import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Sign In · Santa's Knights",
  description: "Sign in to your Santa's Knights account.",
};

/**
 * Account login from Plan v2 §A1.
 * Supabase Auth email + password login coming next.
 */
export default function AccountLoginPage() {
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
            <div className="rounded-[12px] border border-gold/40 bg-gold-soft/40 px-5 py-4 text-[14px] text-[#6c5418]">
              <strong>Account system coming soon.</strong> Email + password login via Supabase
              Auth is planned but not available yet.{" "}
              <a href={`mailto:contact@santasknights.org`} className="font-bold underline">
                contact us
              </a>{" "}
              if you need help tracking a letter.
            </div>

            <div className="mt-6 text-center text-[14px] text-muted">
              Don&apos;t have an account?{" "}
              <a href={links.accountRegister} className="font-bold text-ink underline">
                Create one
              </a>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
