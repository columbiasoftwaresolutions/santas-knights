"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { adminField } from "@/components/admin/AdminShell";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  reason: string | null;
  message: string;
  createdAt: string;
};

export type SubscriberRow = {
  id: string;
  email: string;
  createdAt: string;
};

const MSG_ROW_GRID = "grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_auto_1.75rem]";

/**
 * Combined view of contact messages and newsletter subscribers, with a
 * segmented toggle (like the poster system's editorial tabs, scoped to this
 * card) and a local search — both datasets are small enough to filter
 * client-side rather than round-tripping to the server.
 */
export function InboxPanel({
  messages,
  subscribers,
  reasonLabels,
}: {
  messages: MessageRow[];
  subscribers: SubscriberRow[];
  reasonLabels: Record<string, string>;
}) {
  const [view, setView] = useState<"messages" | "subscribers">("messages");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) =>
      [m.name, m.email, reasonLabels[m.reason ?? ""] ?? m.reason ?? "", m.message]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [messages, query, reasonLabels]);

  const filteredSubscribers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  return (
    <div className="overflow-hidden border border-bone/15 bg-ink2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/15 p-4">
        <div className="inline-flex border border-bone/20">
          <ToggleButton active={view === "messages"} onClick={() => setView("messages")}>
            Messages ({messages.length})
          </ToggleButton>
          <ToggleButton active={view === "subscribers"} onClick={() => setView("subscribers")}>
            Subscribers ({subscribers.length})
          </ToggleButton>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={view === "messages" ? "Search name, email, message…" : "Search email…"}
          aria-label="Search"
          className={cn(adminField, "max-w-[280px]")}
        />
      </div>

      {view === "messages" ? (
        filteredMessages.length === 0 ? (
          <p className="p-6 text-bone/60">
            {messages.length === 0 ? "No messages yet." : "No messages match that search."}
          </p>
        ) : (
          <div>
            <div
              className={`hidden gap-3 border-b border-bone/15 px-4 py-3 text-[11px] font-bold tracking-[0.1em] text-bone/45 uppercase sm:grid ${MSG_ROW_GRID}`}
            >
              <span>Name</span>
              <span>Email</span>
              <span>Reason</span>
              <span>Date</span>
              <span className="sr-only">Expand</span>
            </div>
            {filteredMessages.map((m) => {
              const open = openId === m.id;
              return (
                <div key={m.id} className="border-b border-bone/10 last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : m.id)}
                    aria-expanded={open}
                    className={`grid w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bone/[0.03] ${MSG_ROW_GRID}`}
                  >
                    <span className="truncate font-semibold text-bone">{m.name}</span>
                    <span className="truncate text-bone/70">{m.email}</span>
                    <span className="truncate text-[12.5px] font-bold tracking-wide text-amber uppercase">
                      {reasonLabels[m.reason ?? ""] ?? m.reason ?? "—"}
                    </span>
                    <span className="whitespace-nowrap text-bone/55">
                      {new Date(m.createdAt).toLocaleDateString("en-US")}
                    </span>
                    <span
                      aria-hidden
                      className={`justify-self-end text-bone/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-bone/10 bg-[#0f0c0a] px-4 py-5">
                      <p className="mb-1 text-[11px] font-bold tracking-[0.1em] text-bone/40 uppercase">
                        {new Date(m.createdAt).toLocaleString("en-US")}
                      </p>
                      <p className="max-w-[70ch] whitespace-pre-wrap text-bone/85">{m.message}</p>
                      <a
                        href={`mailto:${m.email}`}
                        className="mt-4 inline-block cursor-pointer bg-amber px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-ink uppercase transition-colors hover:bg-[#e0b040]"
                      >
                        Reply by email
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : filteredSubscribers.length === 0 ? (
        <p className="p-6 text-bone/60">
          {subscribers.length === 0 ? "No subscribers yet." : "No subscribers match that search."}
        </p>
      ) : (
        <table className="w-full text-left text-[13.5px]">
          <thead className="border-b border-bone/15 text-[11px] uppercase tracking-[0.1em] text-bone/45">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed</th>
            </tr>
          </thead>
          <tbody className="text-bone/80">
            {filteredSubscribers.map((s) => (
              <tr key={s.id} className="border-b border-bone/10 last:border-0">
                <td className="px-4 py-2.5 font-semibold text-bone">{s.email}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  {new Date(s.createdAt).toLocaleDateString("en-US")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer px-4 py-2 text-[12px] font-bold tracking-[0.08em] uppercase transition-colors",
        active ? "bg-amber text-ink" : "text-bone/55 hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}
