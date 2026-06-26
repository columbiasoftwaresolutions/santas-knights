import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { registerForClass } from "@/app/training/actions";
import { links } from "@/content/site";
import type { ClassSession } from "@/lib/training";

function formatWhen(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt);
  const date = start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (!endsAt) return `${date} · ${time}`;
  const end = new Date(endsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}–${end}`;
}

/**
 * Server-rendered list of bookable class sessions. Each card posts to the
 * `registerForClass` action; the action handles auth + waiver + capacity, so
 * the button just expresses intent. `myActiveClassIds` flags classes the
 * signed-in user already holds a spot in.
 */
export function ClassBookingList({
  sessions,
  signedIn,
  myActiveClassIds,
}: {
  sessions: ClassSession[];
  signedIn: boolean;
  myActiveClassIds: string[];
}) {
  if (sessions.length === 0) {
    return (
      <Card className="p-[34px] text-center">
        <p className="text-muted">
          No sessions are on the calendar right now. Browse the class catalog above, or{" "}
          <a href={links.contact} className="font-semibold text-ink underline">message us</a> and we&apos;ll
          get you into the next one.
        </p>
      </Card>
    );
  }

  const mine = new Set(myActiveClassIds);

  return (
    <div className="grid gap-[18px] md:grid-cols-2">
      {sessions.map((s) => {
        const booked = mine.has(s.id);
        return (
          <Card key={s.id} className="flex flex-col p-[26px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-1 text-[14px] font-semibold text-muted">
                  {formatWhen(s.starts_at, s.ends_at)}
                </p>
                {s.location && <p className="text-[13.5px] text-muted">{s.location}</p>}
              </div>
              <span
                className={`flex-none rounded-pill px-3 py-1 text-[12px] font-bold ${
                  s.isFull ? "bg-red/10 text-red" : "bg-green-soft text-green"
                }`}
              >
                {s.isFull ? "Full" : `${s.spotsLeft} left`}
              </span>
            </div>

            {s.description && (
              <p className="mt-3 line-clamp-2 flex-1 text-[14.5px] text-muted">{s.description}</p>
            )}

            <div className="mt-5">
              {booked ? (
                <span className="inline-flex items-center gap-2 rounded-pill bg-green-soft px-4 py-2.5 text-[14px] font-bold text-green">
                  ✓ You&apos;re booked
                </span>
              ) : s.isFull ? (
                <Button variant="ghost" disabled className="px-5 py-3 text-[14px]">
                  Class full
                </Button>
              ) : (
                <form action={registerForClass}>
                  <input type="hidden" name="class_id" value={s.id} />
                  <Button type="submit" variant="red" className="px-5 py-3 text-[14px]">
                    {signedIn ? "Reserve a spot" : "Sign in to reserve"}
                  </Button>
                </form>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
