import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { checkAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LETTERS_BUCKET } from "@/lib/supabase/config";
import { moderateLetter, signOut, type ModerationAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Letter Moderation · Santa's Knights Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUSES = [
  "pending",
  "flagged",
  "needs_edits",
  "approved",
  "fulfilled",
  "hidden",
  "rejected",
] as const;
type LetterStatus = (typeof STATUSES)[number];

const STATUS_LABEL: Record<LetterStatus, string> = {
  pending: "Pending",
  flagged: "Flagged",
  needs_edits: "Needs edits",
  approved: "Approved (live)",
  fulfilled: "Fulfilled",
  hidden: "Hidden",
  rejected: "Rejected",
};

/** Which moderation verbs make sense from each status. */
const ACTIONS_FOR_STATUS: Record<LetterStatus, { action: ModerationAction; label: string; primary?: boolean }[]> = {
  pending: [
    { action: "approve", label: "Approve", primary: true },
    { action: "request_edits", label: "Request edits" },
    { action: "flag", label: "Flag" },
    { action: "reject", label: "Reject" },
  ],
  flagged: [
    { action: "approve", label: "Approve", primary: true },
    { action: "request_edits", label: "Request edits" },
    { action: "reject", label: "Reject" },
  ],
  needs_edits: [
    { action: "approve", label: "Approve", primary: true },
    { action: "flag", label: "Flag" },
    { action: "reject", label: "Reject" },
  ],
  approved: [
    { action: "fulfill", label: "Mark fulfilled", primary: true },
    { action: "hide", label: "Hide" },
    { action: "flag", label: "Flag" },
  ],
  fulfilled: [{ action: "approve", label: "Return to pool" }],
  hidden: [
    { action: "approve", label: "Re-approve", primary: true },
    { action: "reject", label: "Reject" },
  ],
  rejected: [{ action: "reopen", label: "Reopen as pending" }],
};

type AdminLetter = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[];
  letter_image_path: string | null;
  status: LetterStatus;
  guardian_name: string;
  guardian_email: string;
  moderation_note: string | null;
  created_at: string;
  imageUrl?: string | null;
};

type LegacyAdminLetter = Omit<AdminLetter, "amazon_urls"> & { amazon_url: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await checkAdmin();

  if (admin.status === "unconfigured") {
    return (
      <Notice title="Supabase isn't configured">
        Set the Supabase environment variables and apply the database schema
        (see <code>CLAUDE.md</code>) to use the moderation dashboard.
      </Notice>
    );
  }
  if (admin.status === "signed-out") {
    return (
      <Notice title="Signed out">
        <Link href="/admin/login" className="font-semibold text-red underline">
          Sign in
        </Link>{" "}
        to moderate letters.
      </Notice>
    );
  }
  if (admin.status === "not-admin") {
    return (
      <Notice title="Not authorized">
        You&apos;re signed in as {admin.email ?? "an account"} without the admin role. An existing
        admin can grant it by setting your <code>profiles.role</code> to <code>admin</code>.
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="ghost" className="px-5 py-3 text-[15px]">
            Sign out
          </Button>
        </form>
      </Notice>
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return (
      <Notice title="Missing secret key">
        Set <code>SUPABASE_SECRET_KEY</code> (server-side env) so the dashboard can read and
        moderate letters.
      </Notice>
    );
  }

  const params = await searchParams;
  const activeStatus: LetterStatus = STATUSES.includes(params.status as LetterStatus)
    ? (params.status as LetterStatus)
    : "pending";

  // A single status scan is sufficient for the expected seasonal volume.
  const { data: statusRows } = await supabase.from("santa_letters").select("status");
  const counts = new Map<string, number>();
  statusRows?.forEach((row) => counts.set(row.status, (counts.get(row.status) ?? 0) + 1));
  const total = statusRows?.length ?? 0;

  let { data: letterRows, error: letterError } = await supabase
    .from("santa_letters")
    .select(
      "id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, status, guardian_name, guardian_email, moderation_note, created_at",
    )
    .eq("status", activeStatus)
    .order("created_at", { ascending: true })
    .limit(200);

  let legacy = false;
  if (letterError?.message.includes("amazon_urls")) {
    const legacyQuery = await supabase
      .from("santa_letters")
      .select(
        "id, child_first_name, child_age, wish_note, amazon_url, letter_image_path, status, guardian_name, guardian_email, moderation_note, created_at",
      )
      .eq("status", activeStatus)
      .order("created_at", { ascending: true })
      .limit(200);
    letterRows = legacyQuery.data as typeof letterRows;
    letterError = legacyQuery.error;
    legacy = true;
  }

  if (letterError) console.error("Failed to load moderation queue:", letterError.message);
  const letters = legacy
    ? ((letterRows ?? []) as unknown as LegacyAdminLetter[]).map(({ amazon_url, ...letter }) => ({
        ...letter,
        amazon_urls: amazon_url ? [amazon_url] : [],
      }))
    : ((letterRows ?? []) as AdminLetter[]);

  const paths = letters.map((l) => l.letter_image_path).filter(Boolean) as string[];
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(LETTERS_BUCKET)
      .createSignedUrls(paths, 60 * 60);
    const byPath = new Map(signed?.map((s) => [s.path, s.signedUrl]) ?? []);
    letters.forEach((letter) => {
      letter.imageUrl = letter.letter_image_path
        ? (byPath.get(letter.letter_image_path) ?? null)
        : null;
    });
  }

  return (
    <section className="min-h-screen bg-ink py-[46px] text-bone">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.1em] text-amber uppercase">
              Signed in as {admin.email}
            </p>
            <h1 className="mt-2 font-display text-h2 font-black uppercase">Letter moderation</h1>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="px-5 py-[11px] text-[15px]">
              Sign out
            </Button>
          </form>
        </div>

        {/* Season totals */}
        <div className="mt-8 grid grid-cols-2 gap-[14px] sm:grid-cols-4">
          <Stat label="Submitted (all)" value={total} />
          <Stat label="Awaiting review" value={(counts.get("pending") ?? 0) + (counts.get("flagged") ?? 0)} />
          <Stat label="Live in the pool" value={counts.get("approved") ?? 0} />
          <Stat label="Fulfilled" value={counts.get("fulfilled") ?? 0} />
        </div>

        {/* Status tabs */}
        <nav className="mt-9 flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <Link
              key={status}
              href={`/admin?status=${status}`}
              className={cn(
                "rounded-pill border px-4 py-2 text-[14px] font-bold transition-colors",
                status === activeStatus
                  ? "border-transparent bg-ink text-paper"
                  : "border-bone/20 bg-ink2 text-bone/65 hover:text-bone",
              )}
            >
              {STATUS_LABEL[status]} · {counts.get(status) ?? 0}
            </Link>
          ))}
        </nav>

        {/* Queue */}
        <div className="mt-7 grid gap-[18px]">
          {letters.length === 0 ? (
            <Card className="border-bone/15 bg-ink2 p-[34px] text-center text-bone/60">
              Nothing with status “{STATUS_LABEL[activeStatus]}”.
            </Card>
          ) : (
            letters.map((letter) => (
              <Card key={letter.id} className="grid gap-6 border-bone/15 bg-ink2 p-[26px] lg:grid-cols-[220px_1fr]">
                {letter.imageUrl ? (
                  <a href={letter.imageUrl} target="_blank" rel="noopener noreferrer">
                    {/* Signed URL from Supabase Storage. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={letter.imageUrl}
                      alt={`${letter.child_first_name}'s letter`}
                      className="max-h-[260px] w-full rounded-[14px] border border-line bg-paper-raised object-contain"
                    />
                  </a>
                ) : (
                  <div className="flex h-[160px] items-center justify-center rounded-[14px] border border-dashed border-line text-[13px] font-bold text-muted uppercase">
                    No image
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-[20px] font-extrabold tracking-[-0.01em]">
                      {letter.child_first_name}, {letter.child_age}
                    </h2>
                    <span className="text-[13px] font-semibold text-muted">
                      submitted {new Date(letter.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 font-serif text-[15.5px] italic text-bone">“{letter.wish_note}”</p>
                  <p className="mt-2 text-[14px] text-bone/60">
                    {letter.amazon_urls.map((url, i) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-2 font-semibold text-red underline"
                      >
                        Amazon link{letter.amazon_urls.length > 1 ? ` ${i + 1}` : ""} ↗
                      </a>
                    ))}
                    · Guardian: {letter.guardian_name} &lt;{letter.guardian_email}&gt;
                  </p>
                  {letter.moderation_note && (
                    <p className="mt-2 rounded-[10px] bg-gold-soft/60 px-3 py-2 text-[13.5px] text-[#6c5418]">
                      <strong className="font-bold">Note:</strong> {letter.moderation_note}
                    </p>
                  )}

                  <form action={moderateLetter} className="mt-4 grid gap-3">
                    <input type="hidden" name="letter_id" value={letter.id} />
                    <textarea
                      name="moderation_note"
                      rows={2}
                      placeholder="Moderation note (kept internal; included if you request edits)…"
                      className="w-full border border-bone/20 bg-[#0f0c0a] px-3.5 py-2.5 text-[14px] text-bone placeholder:text-bone/35 focus:border-amber focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-2">
                      {ACTIONS_FOR_STATUS[letter.status].map(({ action, label, primary }) => (
                        <button
                          key={action}
                          type="submit"
                          name="action"
                          value={action}
                          className={cn(
                            "cursor-pointer rounded-pill border px-4 py-2 text-[13.5px] font-bold transition-transform hover:-translate-y-0.5",
                            primary
                              ? "border-transparent bg-green text-white"
                              : action === "reject"
                                ? "border-red/60 bg-transparent text-[#e7705e]"
                                : "border-bone/25 bg-transparent text-bone",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </form>
                </div>
              </Card>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-bone/15 bg-ink2 p-5">
      <p className="font-display text-[34px] font-black tracking-[-0.03em] text-amber">{value}</p>
      <p className="text-[11px] font-bold text-bone/55 uppercase tracking-[0.12em]">{label}</p>
    </Card>
  );
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
