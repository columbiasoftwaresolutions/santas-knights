"use client";

import { useMemo, useState } from "react";
import { markGifted, releaseClaim } from "@/app/letters-to-santa/give/actions";
import { links } from "@/content/site";

/** One row of either ledger, formatted on the server so dates never depend on
 *  the visitor's timezone (and so this component stays dumb). */
export type LedgerRow = {
  id: string;
  /** "Maya, age 7" */
  name: string;
  wish: string;
  /** "Adopted Dec 6, 2026" — carries the date and nothing else. */
  meta: string;
  state: RowState;
  stateLabel: string;
  wishlistUrl: string | null;
  /** Gifts only, and only while unsent: shows "I sent it" / "Release". */
  canAct: boolean;
};

export type RowState = "owed" | "done" | "gone";
export type View = "adopt" | "submit";

type FilterKey = "all" | RowState;

/** Four rows a page. Deliberately short: the point of paging here is that a
 *  member with forty gifts never scrolls a wall, not that the page holds as
 *  much as it can. */
const PAGE_SIZE = 4;

const FILTERS: Record<View, { key: FilterKey; label: string }[]> = {
  adopt: [
    { key: "all", label: "All" },
    { key: "owed", label: "To send" },
    { key: "done", label: "Sent" },
  ],
  // "Removed" gets a filter of its own rather than being quietly held out of
  // the totals, so All is always the sum of the rest and no number on the page
  // can disagree with another. The guardian still sees the row — a letter that
  // vanished without explanation would be worse.
  submit: [
    { key: "all", label: "All" },
    { key: "owed", label: "Waiting" },
    { key: "done", label: "Gifted" },
    { key: "gone", label: "Removed" },
  ],
};

function tally(rows: LedgerRow[]): Record<FilterKey, number> {
  return {
    all: rows.length,
    owed: rows.filter((r) => r.state === "owed").length,
    done: rows.filter((r) => r.state === "done").length,
    gone: rows.filter((r) => r.state === "gone").length,
  };
}

/**
 * The account ledger: gifts you're sending and letters you've submitted, behind
 * the Adopt / Submit switch.
 *
 * WHY A SWITCH. Almost nobody is both a donor and a guardian, so two stacked
 * sections meant every member scrolled past a heading and an empty state
 * belonging to a role they will never have. The control is the one from
 * /letters-to-santa, colours included — adopting is red and submitting is green
 * everywhere else on the site, and these two lists are those same two acts seen
 * afterwards. Which side opens is a data question (see `initialView`).
 *
 * WHY A TABLE. A gift or a letter is a record — a name, a wish, a state, an
 * action. Forty bordered cards in a grid is a wall; forty rows is a ledger. The
 * head and every row share one `--cols` custom property so they cannot drift.
 *
 * Filter, search and paging are client-side because both lists are already
 * fully loaded (they are a member's own rows, scoped by RLS — tens, not
 * thousands). If either ever needs to be paged server-side, this component's
 * props are the seam.
 */
export function AccountLedger({
  gifts,
  letters,
  initialView,
}: {
  gifts: LedgerRow[];
  letters: LedgerRow[];
  initialView: View;
}) {
  const [view, setView] = useState<View>(initialView);
  const [filter, setFilter] = useState<Record<View, FilterKey>>({ adopt: "all", submit: "all" });
  const [page, setPage] = useState<Record<View, number>>({ adopt: 1, submit: 1 });
  const [query, setQuery] = useState<Record<View, string>>({ adopt: "", submit: "" });

  const rows = view === "adopt" ? gifts : letters;
  const counts = useMemo(() => ({ adopt: tally(gifts), submit: tally(letters) }), [gifts, letters]);

  const q = query[view].trim().toLowerCase();
  const matched = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter[view] === "all" || r.state === filter[view]) &&
          (!q || `${r.name} ${r.wish}`.toLowerCase().includes(q)),
      ),
    [rows, filter, view, q],
  );

  const pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const current = Math.min(page[view], pages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = matched.slice(start, start + PAGE_SIZE);

  /* Any change to what is selected sends you back to page one — landing on an
     empty page 3 because the filter shrank the list is the classic bug here. */
  const set = <T,>(setter: (v: Record<View, T>) => void, prev: Record<View, T>, value: T) =>
    setter({ ...prev, [view]: value });

  function pick(key: FilterKey) {
    set(setFilter, filter, key);
    setPage({ ...page, [view]: 1 });
  }
  function search(value: string) {
    set(setQuery, query, value);
    setPage({ ...page, [view]: 1 });
  }

  const isEmpty = rows.length === 0;

  return (
    <>
      <div className="acct-tabhead">
        <div className="tabs" data-view={view} role="tablist" aria-label="Gifts you're sending, or letters you've submitted">
          <span className="slide" aria-hidden />
          <button
            type="button"
            role="tab"
            id="tab-adopt"
            aria-selected={view === "adopt"}
            aria-controls="account-ledger"
            onClick={() => setView("adopt")}
          >
            Gifts I&rsquo;m sending <span className="acct-n">{gifts.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-submit"
            aria-selected={view === "submit"}
            aria-controls="account-ledger"
            onClick={() => setView("submit")}
          >
            My letters <span className="acct-n">{letters.length}</span>
          </button>
        </div>

        {!isEmpty && (
          <a className="tlink" href={view === "adopt" ? links.adoptLetter : links.submitLetter}>
            {view === "adopt" ? "Pick another letter" : "Submit a letter"} <span className="arw">&rarr;</span>
          </a>
        )}
      </div>

      <div id="account-ledger" data-side={view} role="tabpanel" aria-labelledby={`tab-${view}`}>
        {isEmpty ? (
          <EmptyState view={view} />
        ) : (
          <>
            <div className="acct-toolbar">
              <div className="acct-filters" role="group" aria-label={view === "adopt" ? "Filter gifts" : "Filter letters"}>
                {FILTERS[view].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={filter[view] === f.key}
                    onClick={() => pick(f.key)}
                  >
                    {f.label} <span className="acct-n">{counts[view][f.key]}</span>
                  </button>
                ))}
              </div>

              <div className="acct-search">
                <input
                  type="search"
                  value={query[view]}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Search name or wish"
                  aria-label={view === "adopt" ? "Search gifts" : "Search letters"}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="acct-ledger">
              <div className="acct-thead" aria-hidden>
                <span>Child</span>
                <span>Wish</span>
                <span>Status</span>
                <span />
              </div>

              {visible.map((row) => (
                <article className="acct-rec" key={row.id}>
                  <div>
                    <h3>{row.name}</h3>
                    <p className="acct-meta">{row.meta}</p>
                  </div>
                  <p className="acct-wish">{row.wish}</p>
                  <span className={`acct-state acct-state--${row.state}`}>{row.stateLabel}</span>
                  <div className="acct-acts">
                    {row.wishlistUrl && (
                      <a className="tlink acct-tlink-sm" href={row.wishlistUrl} target="_blank" rel="noopener noreferrer">
                        Wishlist <span className="arw">&#8599;</span>
                      </a>
                    )}
                    {row.canAct && (
                      <div className="acct-btns">
                        <form action={markGifted}>
                          <input type="hidden" name="letter_id" value={row.id} />
                          <button className="btn btn--green acct-btn-sm" type="submit">
                            I sent it
                          </button>
                        </form>
                        <form action={releaseClaim}>
                          <input type="hidden" name="letter_id" value={row.id} />
                          <button className="btn acct-btn-quiet acct-btn-sm" type="submit">
                            Release
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* The only number down here is the page range, and its denominator
                is always the list in front of you — never a total borrowed from
                another filter. The per-state counts live on the filter buttons,
                where each means exactly one thing. */}
            <div className="acct-tablefoot">
              <p className="acct-note">
                {matched.length === 0
                  ? "Nothing matches."
                  : view === "submit"
                    ? "Only you can see these."
                    : ""}
              </p>
              {pages > 1 && (
                <div className="acct-pager">
                  <span className="acct-range">
                    {start + 1}&ndash;{start + visible.length} of {matched.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={current <= 1}
                    onClick={() => setPage({ ...page, [view]: current - 1 })}
                  >
                    &larr;
                  </button>
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={current >= pages}
                    onClick={() => setPage({ ...page, [view]: current + 1 })}
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/** One hairline, the sentence, the way out of it. A bordered card drawn around
 *  nothing is a box announcing that it is empty. */
function EmptyState({ view }: { view: View }) {
  return (
    <div className="acct-empty">
      <p>
        {view === "adopt"
          ? "You haven't adopted a letter yet."
          : "You haven't submitted a letter yet."}
      </p>
      <div className="acct-empty-cta">
        {view === "adopt" ? (
          <a className="btn btn--red" href={links.adoptLetter}>
            Pick a letter to gift <span className="arw">&rarr;</span>
          </a>
        ) : (
          <a className="btn btn--green" href={links.submitLetter}>
            Submit a child&apos;s letter <span className="arw">&rarr;</span>
          </a>
        )}
      </div>
    </div>
  );
}
