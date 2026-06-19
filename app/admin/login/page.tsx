import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin Sign In · Santa's Knights",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="bg-ink py-section text-bone">
      <Container className="max-w-[440px]">
        <div className="text-center">
          <h1 className="font-display text-h2 font-black uppercase">Admin sign in</h1>
          <p className="mt-3 text-bone/65">
            For Santa&apos;s Knights moderators. Accounts are created by an administrator.
          </p>
        </div>
        <Card className="mt-8 bg-paper p-[34px] text-ink">
          {isSupabaseConfigured() ? (
            <AdminLoginForm />
          ) : (
            <p className="text-center text-[15px] text-muted">
              Supabase is not configured. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to enable admin sign-in.
            </p>
          )}
        </Card>
      </Container>
    </section>
  );
}
