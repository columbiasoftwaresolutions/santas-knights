import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { InboxPanel, type MessageRow, type SubscriberRow } from "@/components/admin/InboxPanel";
import { contactReasons } from "@/content/site";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = Object.fromEntries(
  contactReasons.map((r) => [r.value, r.label]),
);

const DEFAULT_SUBSCRIBERS = [
  "ez2450@columbia.edu",
  "krv2121@columbia.edu",
  "pp2919@columbia.edu",
  "sr4370@columbia.edu",
];

export default async function AdminInboxPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const { error: seedError } = await gate.supabase
    .from("newsletter_subscribers")
    .upsert(
      DEFAULT_SUBSCRIBERS.map((email) => ({ email })),
      { onConflict: "email", ignoreDuplicates: true },
    );
  if (seedError) {
    console.error("Default newsletter subscriber seed failed:", seedError.message);
  }

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

  return (
    <AdminShell active="inbox" title="Inbox" email={gate.email}>
      <InboxPanel messages={messages} subscribers={subscribers} reasonLabels={REASON_LABEL} />
    </AdminShell>
  );
}
