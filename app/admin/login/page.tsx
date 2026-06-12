import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin Sign In · Santa's Knights",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="py-section">
      <Container className="max-w-[440px]">
        <div className="text-center">
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-3 text-h2">Sign in</h1>
          <p className="mt-3 text-muted">
            For Santa&apos;s Knights moderators. Accounts are created by an administrator.
          </p>
        </div>
        <Card className="mt-8 p-[34px]">
          {isSupabaseConfigured() ? (
            <AdminLoginForm />
          ) : (
            <p className="text-center text-[15px] text-muted">
              Supabase isn&apos;t configured yet — set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to enable admin sign-in.
            </p>
          )}
        </Card>
      </Container>
    </section>
  );
}
