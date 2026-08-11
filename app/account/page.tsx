import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HandArrow } from "@/components/redesign/HandArrow";
import { Mark } from "@/components/redesign/Mark";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { AccountLedger, type LedgerRow, type View } from "@/components/account/AccountLedger";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOutAction } from "@/app/account/actions";
import { formatSiteDate } from "@/lib/dates";
import { links, DASHBOARD_HREF } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members · Santa's Knights",
  description: "Sign in to submit and track letters and manage your Santa's Knights membership.",
};

type MyLetter = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[];
  status: string;
  created_at: string;
};

type MyGift = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[];
  wishlist_url: string | null;
  status: string;
  claimed_at: string | null;
  fulfilled_at: string | null;
};

async function getMyLetters(): Promise<MyLetter[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("my_letters")
    .select("id, child_first_name, child_age, wish_note, amazon_urls, status, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load my letters:", error.message);
    return [];
  }
  return (data ?? []) as MyLetter[];
}

async function getMyGifts(): Promise<MyGift[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("my_gifts")
    .select(
      "id, child_first_name, child_age, wish_note, amazon_urls, wishlist_url, status, claimed_at, fulfilled_at",
    )
    .order("claimed_at", { ascending: false });
  if (error) {
    console.error("Failed to load my gifts:", error.message);
    return [];
  }
  return (data ?? []) as MyGift[];
}

/** One wishlist per row. The schema allows several `amazon_urls`, but fanning
 *  them out into "Gift 1 / Gift 2" chips puts a variable number of links in a
 *  column that has to stay one width down a long list. */
function wishlistOf(row: { wishlist_url?: string | null; amazon_urls: string[] }): string | null {
  return row.wishlist_url ?? row.amazon_urls?.[0] ?? null;
}

/** Outstanding first, then done, then removed. At six rows it is a nicety; at
 *  forty it is the only reason the list is usable without touching a filter. */
const ORDER: Record<string, number> = { owed: 0, done: 1, gone: 2 };
const byState = (a: LedgerRow, b: LedgerRow) => ORDER[a.state] - ORDER[b.state];

function giftRow(g: MyGift): LedgerRow {
  const sent = g.status === "fulfilled";
  const stamp = sent ? g.fulfilled_at : g.claimed_at;
  return {
    id: g.id,
    name: `${g.child_first_name}, age ${g.child_age}`,
    wish: g.wish_note,
    // The date sentence and the presence of an action are what carry state in
    // a long list; the Status column names it. No badge on every row.
    meta: stamp ? `${sent ? "Sent" : "Adopted"} ${formatSiteDate(stamp)}` : sent ? "Sent" : "Adopted",
    state: sent ? "done" : "owed",
    stateLabel: sent ? "Sent" : "To send",
    wishlistUrl: wishlistOf(g),
    canAct: !sent,
  };
}

function letterRow(l: MyLetter): LedgerRow {
  const state = l.status === "fulfilled" ? "done" : l.status === "deleted" ? "gone" : "owed";
  return {
    id: l.id,
    name: `${l.child_first_name}, age ${l.child_age}`,
    wish: l.wish_note,
    meta: `Submitted ${formatSiteDate(l.created_at)}`,
    state,
    stateLabel: state === "done" ? "Gifted" : state === "gone" ? "Removed" : "Waiting",
    wishlistUrl: wishlistOf(l),
    canAct: false,
  };
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) redirect(links.accountLogin);

  const [letters, gifts] = await Promise.all([getMyLetters(), getMyGifts()]);

  const giftRows = gifts.map(giftRow).sort(byState);
  const letterRows = letters.map(letterRow).sort(byState);

  // Which side opens is a data question, not a design one: whichever has rows,
  // and Gifts when neither does. A guardian should never have to click to find
  // their own letters.
  const initialView: View = giftRows.length === 0 && letterRows.length > 0 ? "submit" : "adopt";

  // `name` is the full name; the greeting takes the first word only.
  const firstName = user.name?.split(" ")[0] ?? null;

  // Training lives on gladiators.nyc (shared login) — link participants out.
  const showTraining = user.role === "participant" || user.role === "instructor";

  return (
    <RedesignShell>
      <Wrap>
        {/* A bar, not a hero. This page is a tool: the list starts immediately,
            and identity plus the way out sit small and to the side. */}
        <div className="acct-pagebar">
          <h1>Hi{firstName ? `, ${firstName}` : ""}.</h1>
          <div className="acct-who">
            {showTraining && (
              <a className="tlink acct-tlink-quiet" href={DASHBOARD_HREF}>
                Training dashboard <span className="arw">&#8599;</span>
              </a>
            )}
            <b>{user.email ?? "Signed in"}</b>
            <form action={signOutAction}>
              <button className="tlink acct-tlink-quiet" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <AccountLedger gifts={giftRows} letters={letterRows} initialView={initialView} />

        {/* The one piece of the site's voice on this page, and it sits AFTER the
            work — nothing stands between a member and their ledger to reach it. */}
        <section className="closer acct-closer">
          <div className="in">
            <div>
              <h2>
                The classes and the gifts are free. Keeping them free{" "}
                <span className="acct-nb">
                  <Mark>isn&rsquo;t</Mark>.
                </span>
              </h2>
              <p>Every dollar is tax-deductible.</p>
            </div>
            <div className="cta-wrap">
              <HandArrow />
              {/* Raw `.btn` rather than <Button>: the shared component is the old
                  poster button (uppercase, wide tracking), which rule 3 reverses.
                  Every ported page uses these classes. */}
              <a className="btn btn--ink" href={links.donate}>
                Donate <span className="arw">&rarr;</span>
              </a>
            </div>
          </div>
        </section>
      </Wrap>
    </RedesignShell>
  );
}
