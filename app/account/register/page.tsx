import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Create Account · Santa's Knights",
  description:
    "Create a free Santa's Knights account to track submitted letters.",
};

/**
 * Account registration from Plan v2 §A1.
 * Supabase Auth email + password registration coming next.
 */
export default function AccountRegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Members Area"
        title="Create an account"
        intro="A free account will let you track submitted letters and read status updates from our team."
      />

      <section className="py-section">
        <Container className="max-w-[480px]">
          <Card className="p-[38px]">
            <div className="rounded-[12px] border border-gold/40 bg-gold-soft/40 px-5 py-4 text-[14px] text-[#6c5418]">
              <strong>Account registration coming soon.</strong> We&apos;re building a full member
              account system with letter tracking. You can still{" "}
              <a href={links.submitLetter} className="font-bold underline">
                submit a letter
              </a>{" "}
              without an account.
            </div>

            <div className="mt-6 text-center text-[14px] text-muted">
              Already have an account?{" "}
              <a href={links.accountLogin} className="font-bold text-ink underline">
                Sign in
              </a>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
