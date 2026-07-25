import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { InboxPanel, type MessageRow, type SubscriberRow } from "@/components/admin/InboxPanel";
import { contactReasons } from "@/content/site";

export const metadata: Metadata = {
  title: "Inbox · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = Object.fromEntries(
  contactReasons.map((r) => [r.value, r.label]),
);

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function countLastWeek(rows: { createdAt: string }[]): number {
  const since = Date.now() - ONE_WEEK_MS;
  return rows.filter((r) => new Date(r.createdAt).getTime() >= since).length;
}

export default async function AdminInboxPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const [messagesRes, subscribersRes] = await Promise.all([
    gate.supabase
      .from("contact_messages")
      .select("id, name, email, reason, message, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
    gate.supabase
      .from("newsletter_subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false })
      .limit(2000),
  ]);

  const messages: MessageRow[] = (messagesRes.data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    reason: m.reason,
    message: m.message,
    createdAt: m.created_at,
  }));
  const subscribers: SubscriberRow[] = (subscribersRes.data ?? []).map((s) => ({
    id: s.id,
    email: s.email,
    createdAt: s.created_at,
  }));

  const messagesThisWeek = countLastWeek(messages);
  const subscribersThisWeek = countLastWeek(subscribers);

  return (
    <AdminShell active="inbox" title="Inbox" email={gate.email}>
      <p className="max-w-[70ch] text-[14px] text-bone/55">
        Everyone who has written in through the contact form or signed up for the newsletter.
        Switch between the two below, or search across name, email, and message.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-[14px] sm:grid-cols-4">
        <Stat label="Messages" value={String(messages.length)} />
        <Stat label="Messages this week" value={String(messagesThisWeek)} />
        <Stat label="Subscribers" value={String(subscribers.length)} />
        <Stat label="Subscribers this week" value={String(subscribersThisWeek)} />
      </div>

      <div className="mt-7">
        <InboxPanel messages={messages} subscribers={subscribers} reasonLabels={REASON_LABEL} />
      </div>
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
