import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { cancelRegistration } from "@/app/training/actions";
import { GLADIATORS_HREF } from "@/content/site";
import type { Dashboard, MyRegistration } from "@/lib/training";

const REG_TONE: Record<string, string> = {
  registered: "bg-green-soft text-green",
  attended: "bg-green-soft text-green",
  cancelled: "bg-paper-raised text-muted",
  waitlisted: "bg-gold-soft text-[#6c5418]",
  no_show: "bg-red/10 text-red",
};

/** Participant training panel for /account: XP, level, attendance, badges,
 *  armor-rental eligibility, and the participant's reserved classes. */
export function TrainingDashboard({
  dashboard,
  registrations,
}: {
  dashboard: Dashboard;
  registrations: MyRegistration[];
}) {
  const { level } = dashboard;
  const upcoming = registrations.filter(
    (r) => r.class && ["registered", "attended", "waitlisted"].includes(r.status) && new Date(r.class.starts_at) >= new Date(),
  );

  return (
    <section className="border-t border-line py-section">
      <Container>
        <SectionHeading
          eyebrow="Gladiators NYC"
          title="Your training"
          intro="Your progress on the Fighter Path. XP rewards showing up, helping out, and leveling your skills."
          introClassName="max-w-[52ch]"
        />

        {/* XP + level */}
        <Card className="mt-8 p-[30px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Current rank</p>
              <p className="mt-1 font-display text-[40px] font-black leading-none tracking-[-0.03em] text-red">
                {level.current.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-[34px] font-black leading-none text-ink">{dashboard.totalXp}</p>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Total XP</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-2.5 w-full overflow-hidden rounded-pill bg-paper-raised">
              <div className="h-full rounded-pill bg-green" style={{ width: `${level.percent}%` }} />
            </div>
            <p className="mt-2 text-[13.5px] text-muted">
              {level.next
                ? `${level.next.threshold - dashboard.totalXp} XP to ${level.next.name}`
                : "Top rank reached — Legend."}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <MiniStat label="Classes attended" value={String(dashboard.attendance)} />
            <MiniStat label="Badges" value={String(dashboard.badges.length)} />
            <MiniStat
              label="Waiver"
              value={dashboard.waiver.currentVersion ? "Signed" : dashboard.waiver.signed ? "Update needed" : "Not signed"}
            />
          </div>
        </Card>

        {/* Badges */}
        {dashboard.badges.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {dashboard.badges.map((b) => (
              <span key={b.code} className="inline-flex items-center gap-2 rounded-pill border border-line bg-paper-raised px-4 py-2 text-[14px] font-bold text-ink">
                <span aria-hidden>{b.icon ?? "🏅"}</span> {b.name}
              </span>
            ))}
          </div>
        )}

        {/* Armor eligibility (computed here; rental happens on gladiators.nyc) */}
        <Card className="mt-5 p-[26px]">
          <h3 className="text-[17px] font-extrabold tracking-[-0.02em]">Armor rental eligibility</h3>
          {dashboard.armorEligible ? (
            <p className="mt-2 text-[15px] text-muted">
              You&apos;re eligible to <strong className="text-ink">request</strong> armor rental. A rental
              still needs an instructor&apos;s sign-off for safety, and the rental itself is handled on the
              Gladiators NYC Armory.
            </p>
          ) : (
            <p className="mt-2 text-[15px] text-muted">
              {dashboard.waiver.signed
                ? `Attend ${dashboard.armorClassesNeeded} more class${dashboard.armorClassesNeeded === 1 ? "" : "es"} to become eligible to request armor rental.`
                : "Sign your waiver and start attending classes to work toward armor-rental eligibility."}
            </p>
          )}
          <p className="mt-2 text-[12.5px] text-muted/70">
            XP can make you eligible to request a privilege, but never auto-grants safety-sensitive
            access — armor and sparring always require instructor certification.
          </p>
        </Card>

        {/* My reserved classes */}
        <div className="mt-8">
          <h3 className="text-h3">My classes</h3>
          {upcoming.length === 0 ? (
            <Card className="mt-4 p-[26px] text-center">
              <p className="text-muted">You have no upcoming reservations.</p>
              <div className="mt-4 flex justify-center">
                <Button href={`${GLADIATORS_HREF}#book`} variant="red">Browse sessions</Button>
              </div>
            </Card>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {upcoming.map((r) => (
                <Card key={r.id} className="flex items-center justify-between gap-4 p-[22px]">
                  <div>
                    <p className="text-[16px] font-extrabold tracking-[-0.02em]">{r.class!.title}</p>
                    <p className="mt-0.5 text-[13.5px] text-muted">
                      {new Date(r.class!.starts_at).toLocaleString(undefined, {
                        weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                      })}
                      {r.class!.location ? ` · ${r.class!.location}` : ""}
                    </p>
                    <span className={`mt-2 inline-block rounded-pill px-2.5 py-0.5 text-[11.5px] font-bold ${REG_TONE[r.status] ?? ""}`}>
                      {r.status}
                    </span>
                  </div>
                  <form action={cancelRegistration}>
                    <input type="hidden" name="registration_id" value={r.id} />
                    <button type="submit" className="cursor-pointer rounded-pill border border-line px-3.5 py-2 text-[13px] font-bold text-muted hover:border-red hover:text-red">
                      Cancel
                    </button>
                  </form>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-paper-raised p-4">
      <p className="text-[20px] font-extrabold tracking-[-0.02em] text-ink">{value}</p>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
    </div>
  );
}
