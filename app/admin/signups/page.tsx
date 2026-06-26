import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { getUpcomingClasses, getClassRoster } from "@/lib/training";

export const metadata: Metadata = {
  title: "Signups · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminSignupsPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const classes = await getUpcomingClasses();
  const rosters = await Promise.all(classes.map((c) => getClassRoster(c.id)));

  const totalSeats = classes.reduce((s, c) => s + c.capacity, 0);
  const totalBooked = classes.reduce((s, c) => s + c.registered, 0);

  return (
    <AdminShell active="signups" title="Class signups" email={gate.email}>
      <p className="text-[14px] text-bone/55">
        Who&apos;s booked for each upcoming class. Use{" "}
        <Link href="/admin/check-in" className="font-semibold text-amber underline">
          Check-in
        </Link>{" "}
        on the day to mark attendance.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-[14px]">
        <Stat label="Upcoming classes" value={String(classes.length)} />
        <Stat label="Seats booked" value={String(totalBooked)} />
        <Stat label="Seats total" value={String(totalSeats)} />
      </div>

      {classes.length === 0 ? (
        <Card className="mt-7 border-bone/15 bg-ink2 p-6 text-bone/60">
          No upcoming classes scheduled. Add one under{" "}
          <Link href="/admin/classes" className="font-semibold text-amber underline">Classes</Link>.
        </Card>
      ) : (
        <div className="mt-7 grid gap-3">
          {classes.map((c, i) => {
            const roster = rosters[i];
            const attended = roster.filter((r) => r.checkedIn).length;
            return (
              <Card key={c.id} className="border-bone/15 bg-ink2 p-[22px]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[17px] font-extrabold text-bone">{c.title}</h2>
                    <p className="text-[12.5px] text-bone/50">
                      {new Date(c.starts_at).toLocaleString(undefined, {
                        weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                      })}
                      {c.location ? ` · ${c.location}` : ""}
                    </p>
                  </div>
                  <div className="text-right text-[12.5px] text-bone/60">
                    <p className="text-[15px] font-bold text-bone">
                      {c.registered}/{c.capacity} booked
                    </p>
                    <p>{attended} checked in</p>
                  </div>
                </div>

                {roster.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {roster.map((r) => (
                      <li
                        key={r.registrationId}
                        className={`rounded-pill border px-3 py-1 text-[12.5px] ${
                          r.checkedIn
                            ? "border-green/40 bg-green/10 text-green"
                            : "border-bone/20 text-bone/70"
                        }`}
                      >
                        {r.checkedIn ? "✓ " : ""}
                        {r.email ?? r.userId.slice(0, 8)}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-bone/15 bg-ink2 p-5">
      <p className="font-display text-[30px] font-black tracking-[-0.03em] text-amber">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-bone/55">{label}</p>
    </Card>
  );
}
