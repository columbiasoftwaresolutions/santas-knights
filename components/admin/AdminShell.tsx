import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { signOut } from "@/app/admin/actions";

/** Admin navigation tabs. `key` matches the `active` prop on each page. */
const TABS: { key: string; label: string; href: string }[] = [
  { key: "letters", label: "Letters", href: "/admin" },
  { key: "gifts", label: "Gifts", href: "/admin/gifts" },
  { key: "classes", label: "Classes", href: "/admin/classes" },
  { key: "signups", label: "Signups", href: "/admin/signups" },
  { key: "checkin", label: "Check-in", href: "/admin/check-in" },
  { key: "videos", label: "Videos", href: "/admin/videos" },
  { key: "donations", label: "Donations", href: "/admin/donations" },
  { key: "grants", label: "Grant export", href: "/admin/grants" },
  { key: "users", label: "Users", href: "/admin/users" },
];

/**
 * Dark admin chrome shared by every /admin/* page: title, identity, tab nav,
 * sign-out. Pages pass their `active` tab key, a `title`, and their content.
 */
export function AdminShell({
  active,
  title,
  email,
  children,
}: {
  active: string;
  title: string;
  email: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-ink py-[46px] text-bone">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.1em] text-amber uppercase">
              Signed in as {email ?? "admin"}
            </p>
            <h1 className="mt-2 font-display text-h2 font-black uppercase">{title}</h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="cursor-pointer border-[1.5px] border-red bg-transparent px-5 py-[10px] text-[14px] font-bold tracking-[0.04em] text-red uppercase transition-colors hover:bg-red hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Editorial underline tab bar — square geometry, color + rule for
            hierarchy (no pills). Scrolls horizontally only (never vertically). */}
        <nav className="mt-8 flex gap-7 overflow-x-auto overflow-y-hidden border-b border-bone/15">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "-mb-px shrink-0 border-b-2 pt-1 pb-3 text-[12.5px] font-bold tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
                tab.key === active
                  ? "border-red text-bone"
                  : "border-transparent text-bone/45 hover:text-bone",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}

/* Shared admin form field styles (dark theme). */
export const adminField =
  "w-full border border-bone/20 bg-[#0f0c0a] px-3.5 py-2.5 text-[14px] text-bone placeholder:text-bone/35 focus:border-amber focus:outline-none";
export const adminLabel = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.1em] text-bone/55";
