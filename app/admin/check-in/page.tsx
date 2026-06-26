import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { requireStaff } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { getClassRoster, getClassesForCheckin } from "@/lib/training";
import { checkInParticipant } from "@/app/admin/training-actions";

export const metadata: Metadata = {
  title: "Check-in · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const gate = await requireStaff();
  if (!gate.ok) return gate.node;
  const { class: classId } = await searchParams;

  const classes = await getClassesForCheckin();
  const selected = classes.find((c) => c.id === classId) ?? null;
  const roster = selected ? await getClassRoster(selected.id) : [];

  return (
    <AdminShell active="checkin" title="Class check-in" email={gate.email}>
      <p className="text-[14px] text-bone/55">
        Check in participants as they arrive. Each check-in is timestamped, awards XP, and is stored
        for grant reporting. Instructor-initiated only — no self check-in.
      </p>

      <Card className="mt-6 border-bone/15 bg-ink2 p-[22px]">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-bone/55">Pick a class</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {classes.length === 0 ? (
            <p className="text-bone/50">No classes scheduled in this window.</p>
          ) : (
            classes.map((c) => (
              <Link
                key={c.id}
                href={`/admin/check-in?class=${c.id}`}
                className={`rounded-pill border px-4 py-2 text-[13px] font-bold ${
                  c.id === selected?.id ? "border-transparent bg-paper text-ink" : "border-bone/20 text-bone/70 hover:text-bone"
                }`}
              >
                {c.title} · {new Date(c.starts_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </Link>
            ))
          )}
        </div>
      </Card>

      {selected && (
        <Card className="mt-6 border-bone/15 bg-ink2 p-[22px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold text-bone">{selected.title}</h2>
            <span className="text-[13px] text-bone/50">{roster.length} registered</span>
          </div>

          {roster.length === 0 ? (
            <p className="mt-4 text-bone/55">No one has reserved this class yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-bone/10">
              {roster.map((r) => (
                <li key={r.registrationId} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[14.5px] font-semibold text-bone">{r.email ?? r.userId}</p>
                    <p className="text-[12px] text-bone/45">{r.status}</p>
                  </div>
                  {r.checkedIn ? (
                    <span className="rounded-pill bg-green/15 px-3 py-1.5 text-[12.5px] font-bold text-green">✓ Checked in</span>
                  ) : (
                    <form action={checkInParticipant}>
                      <input type="hidden" name="class_id" value={selected.id} />
                      <input type="hidden" name="user_id" value={r.userId} />
                      <input type="hidden" name="registration_id" value={r.registrationId} />
                      <input type="hidden" name="class_type" value={selected.class_type} />
                      <button type="submit" className="cursor-pointer rounded-pill bg-green px-4 py-1.5 text-[12.5px] font-bold text-white">
                        Check in
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </AdminShell>
  );
}
