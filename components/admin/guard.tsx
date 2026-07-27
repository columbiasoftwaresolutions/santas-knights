import "server-only";

import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { checkAdmin, getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { signOut } from "@/app/admin/actions";

type AdminOk = { ok: true; supabase: SupabaseClient; email: string | null; userId: string };
type AdminBlocked = { ok: false; node: React.ReactNode };

/**
 * Shared admin gate for every /admin/* page. On success returns the secret-key
 * Supabase client (RLS-bypassing) plus the admin's identity; otherwise returns
 * a ready-to-render notice node so pages can `if (!gate.ok) return gate.node`.
 */
export async function requireAdmin(): Promise<AdminOk | AdminBlocked> {
  const admin = await checkAdmin();

  if (admin.status === "unconfigured") {
    return {
      ok: false,
      node: (
        <Notice title="Supabase isn't configured">
          Set the Supabase environment variables and apply the schema (see <code>CLAUDE.md</code>).
        </Notice>
      ),
    };
  }
  if (admin.status === "signed-out") {
    return {
      ok: false,
      node: (
        <Notice title="Signed out">
          <Link href="/login?next=%2Fadmin" className="font-semibold text-red underline">
            Sign in
          </Link>{" "}
          to use the admin tools.
        </Notice>
      ),
    };
  }
  if (admin.status === "not-admin") {
    return {
      ok: false,
      node: (
        <Notice title="Not authorized">
          You&apos;re signed in as {admin.email ?? "an account"} without the admin role.
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="ghost" className="px-5 py-3 text-[15px]">
              Sign out
            </Button>
          </form>
        </Notice>
      ),
    };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      node: (
        <Notice title="Missing secret key">
          Set <code>SUPABASE_SECRET_KEY</code> so the dashboard can read and write data.
        </Notice>
      ),
    };
  }

  return { ok: true, supabase, email: admin.email, userId: admin.userId };
}

type StaffOk = { ok: true; supabase: SupabaseClient; email: string | null; userId: string; role: "instructor" | "admin" };

/**
 * Like requireAdmin but also admits instructors — for tools coaches use
 * (e.g. class check-in). Admins pass too.
 */
export async function requireStaff(): Promise<StaffOk | AdminBlocked> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      node: (
        <Notice title="Signed out">
          <Link href="/login?next=%2Fadmin" className="font-semibold text-red underline">Sign in</Link>{" "}
          to use the staff tools.
        </Notice>
      ),
    };
  }
  if (user.role !== "instructor" && user.role !== "admin") {
    return {
      ok: false,
      node: (
        <Notice title="Not authorized">
          This area is for instructors and admins. You&apos;re signed in as {user.email ?? "an account"}.
        </Notice>
      ),
    };
  }
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      node: <Notice title="Missing secret key">Set <code>SUPABASE_SECRET_KEY</code> to use the staff tools.</Notice>,
    };
  }
  return { ok: true, supabase, email: user.email, userId: user.id, role: user.role };
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-section">
      <Container className="max-w-[560px]">
        <Card className="p-[34px] text-center">
          <h1 className="text-h3">{title}</h1>
          <div className="mt-3 text-[15.5px] text-muted">{children}</div>
        </Card>
      </Container>
    </section>
  );
}
