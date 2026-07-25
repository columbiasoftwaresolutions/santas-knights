"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  formatSiteDate,
  formatSiteDateTime,
  formatSiteTime,
  siteDateKey,
} from "@/lib/dates";

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
  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id ?? null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredMessages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((message) =>
      [
        message.name,
        message.email,
        reasonLabels[message.reason ?? ""] ?? message.reason ?? "",
        message.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [messages, query, reasonLabels]);

  const filteredSubscribers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((subscriber) => subscriber.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  const selectedMessage =
    filteredMessages.find((message) => message.id === selectedId) ?? filteredMessages[0] ?? null;

  function changeView(nextView: "messages" | "subscribers") {
    setView(nextView);
    setQuery("");
    setShowMobileDetail(false);
  }

  function selectMessage(id: string) {
    setSelectedId(id);
    setShowMobileDetail(true);
  }

  function exportSubscribers() {
    const contents = `${subscribers.map((subscriber) => subscriber.email).join("\n")}\n`;
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `santas-knights-subscribers-${siteDateKey()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden border border-line bg-card">
      <div className="flex h-[54px] items-stretch justify-between border-b border-line">
        <div className="flex">
          <ViewButton active={view === "messages"} onClick={() => changeView("messages")}>
            Messages <span className="text-current/55">{messages.length}</span>
          </ViewButton>
          <ViewButton active={view === "subscribers"} onClick={() => changeView("subscribers")}>
            Subscribers <span className="text-current/55">{subscribers.length}</span>
          </ViewButton>
        </div>
        {view === "subscribers" && (
          <button
            type="button"
            onClick={exportSubscribers}
            disabled={subscribers.length === 0}
            className="cursor-pointer border-l border-line px-4 text-[12px] font-bold tracking-[0.04em] text-red transition-colors hover:bg-ink/[0.04] hover:text-ink disabled:cursor-not-allowed disabled:text-muted/50 sm:px-5"
          >
            Export .txt
          </button>
        )}
      </div>

      {view === "messages" ? (
        <div className="grid min-h-[620px] lg:grid-cols-[350px_minmax(0,1fr)]">
          <aside
            className={cn(
              "min-w-0 flex-col border-line lg:flex lg:border-r",
              showMobileDetail ? "hidden" : "flex",
            )}
          >
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search conversations"
            />
            <div className="max-h-[650px] flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <EmptyList>
                  {messages.length === 0
                    ? "No messages yet."
                    : "No conversations match that search."}
                </EmptyList>
              ) : (
                filteredMessages.map((message) => {
                  const selected = message.id === selectedMessage?.id;
                  const reason =
                    reasonLabels[message.reason ?? ""] ?? message.reason ?? "General inquiry";

                  return (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => selectMessage(message.id)}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "grid w-full cursor-pointer grid-cols-[42px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-[15px] text-left transition-colors",
                        selected
                          ? "bg-paper-raised shadow-[inset_3px_0_0_var(--color-red)]"
                          : "hover:bg-ink/[0.03]",
                      )}
                    >
                      <span
                        aria-hidden
                        className="grid h-[42px] w-[42px] place-items-center rounded-full bg-red/15 font-display text-[15px] font-black text-red uppercase"
                      >
                        {message.name.trim().charAt(0) || "?"}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[14px] font-bold text-ink">
                            {message.name}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted">
                            {formatListDate(message.createdAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] font-semibold text-red/85">
                          {reason}
                        </span>
                        <span className="mt-1 block truncate text-[12.5px] text-muted">
                          {message.message}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section
            className={cn(
              "min-w-0 flex-col bg-paper-raised lg:flex",
              showMobileDetail ? "flex" : "hidden",
            )}
          >
            {selectedMessage ? (
              <MessageDetail
                message={selectedMessage}
                reasonLabel={
                  reasonLabels[selectedMessage.reason ?? ""] ??
                  selectedMessage.reason ??
                  "General inquiry"
                }
                onBack={() => setShowMobileDetail(false)}
              />
            ) : (
              <div className="grid flex-1 place-items-center px-6 text-center text-[14px] text-muted">
                Select a conversation to read it.
              </div>
            )}
          </section>
        </div>
      ) : (
        <div>
          <SearchField value={query} onChange={setQuery} placeholder="Search subscribers" />
          {filteredSubscribers.length === 0 ? (
            <EmptyList>
              {subscribers.length === 0
                ? "No subscribers yet."
                : "No subscribers match that search."}
            </EmptyList>
          ) : (
            <div className="max-h-[620px] overflow-y-auto">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-line px-4 py-3 text-[11px] font-bold tracking-[0.08em] text-muted uppercase sm:px-5">
                <span>Email</span>
                <span>Subscribed</span>
              </div>
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line px-4 py-3.5 last:border-0 sm:px-5"
                >
                  <a
                    href={`mailto:${subscriber.email}`}
                    className="truncate text-[14px] font-semibold text-ink hover:text-red"
                  >
                    {subscriber.email}
                  </a>
                  <span className="whitespace-nowrap text-[12.5px] text-muted">
                    {formatSiteDate(subscriber.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MessageDetail({
  message,
  reasonLabel,
  onBack,
}: {
  message: MessageRow;
  reasonLabel: string;
  onBack: () => void;
}) {
  return (
    <>
      <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-line bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-[13px] font-bold text-red lg:hidden"
            aria-label="Back to conversations"
          >
            ←
          </button>
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red/15 font-display text-[14px] font-black text-red uppercase"
          >
            {message.name.trim().charAt(0) || "?"}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-bold text-ink">{message.name}</h2>
            <p className="truncate text-[12px] text-muted">{message.email}</p>
          </div>
        </div>
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${reasonLabel}`)}`}
          className="shrink-0 bg-red px-4 py-2 text-[11.5px] font-bold tracking-[0.04em] text-paper transition-colors hover:bg-red-deep"
        >
          Reply by email
        </a>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <dl className="grid border border-line bg-card sm:grid-cols-2">
          <DetailItem label="Subject" value={reasonLabel} />
          <DetailItem label="Received" value={formatSiteDateTime(message.createdAt)} />
          <DetailItem label="Email" value={message.email} href={`mailto:${message.email}`} />
          <DetailItem label="Reason" value={reasonLabel} />
        </dl>

        <div className="mt-8 max-w-[720px]">
          <p className="mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">
            Message
          </p>
          <div className="border border-line bg-card px-5 py-4 text-[15px] leading-7 text-ink/85">
            <p className="whitespace-pre-wrap">{message.message}</p>
            <p className="mt-4 text-right text-[11px] text-muted">
              {formatSiteTime(message.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="min-w-0 border-b border-line px-4 py-3.5 odd:sm:border-r">
      <dt className="text-[10.5px] font-bold tracking-[0.08em] text-muted uppercase">{label}</dt>
      <dd className="mt-1 truncate text-[13.5px] font-semibold text-ink/80">
        {href ? (
          <a href={href} className="hover:text-red">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="border-b border-line p-3">
      <label className="sr-only" htmlFor="inbox-search">
        {placeholder}
      </label>
      <input
        id="inbox-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-[1.5px] border-line bg-paper-raised px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-none"
      />
    </div>
  );
}

function ViewButton({
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
        "-mb-px cursor-pointer border-b-2 px-4 text-[12px] font-bold tracking-[0.05em] transition-colors sm:px-5",
        active
          ? "border-red text-ink"
          : "border-transparent text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function EmptyList({ children }: { children: React.ReactNode }) {
  return <p className="p-6 text-center text-[14px] text-muted">{children}</p>;
}

function formatListDate(value: string) {
  if (siteDateKey(value) === siteDateKey()) {
    return formatSiteTime(value);
  }
  return formatSiteDate(value);
}
