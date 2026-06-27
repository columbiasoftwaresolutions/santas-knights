import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { markGifted, releaseClaim } from "@/app/letters/give/actions";
import { links } from "@/content/site";

export type MyGift = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[];
  status: string;
  claimed_at: string | null;
  fulfilled_at: string | null;
};

/** Letters this member has claimed to gift. 'claimed' = still to buy/send,
 *  'fulfilled' = gift sent. Members confirm or release their own claims.
 *  Renders as a panel (no section wrapper) so it can sit beside "My letters". */
export function MyGifts({ gifts }: { gifts: MyGift[] }) {
  if (gifts.length === 0) {
    return (
      <div>
        <SectionHeading
          eyebrow="Santa's Letters"
          title="Gifts I'm sending"
          intro="Letters you've picked to gift will show up here so you can keep track."
          introClassName="max-w-[52ch]"
        />
        <Card className="mt-8 p-[34px] text-center">
          <p className="text-muted">You haven&apos;t adopted a letter yet.</p>
          <div className="mt-5 flex justify-center">
            <Button href={links.adoptLetter} variant="red" arrow>
              Pick a letter to gift
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Santa's Letters"
        title="Gifts I'm sending"
        intro="The letters you've adopted. Mark one as sent once you've bought and shipped the gift."
        introClassName="max-w-[52ch]"
      />
      <div className="mt-8 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-1">
        {gifts.map((g) => {
            const gifted = g.status === "fulfilled";
            return (
              <Card key={g.id} className="flex flex-col p-[26px]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[17px] font-extrabold tracking-[-0.02em]">
                    {g.child_first_name}, age {g.child_age}
                  </h3>
                  <span
                    className={`rounded-pill px-3 py-1 text-[12px] font-bold ${
                      gifted ? "bg-green-soft text-green" : "bg-gold-soft text-[#6c5418]"
                    }`}
                  >
                    {gifted ? "Gift sent 🎁" : "To send"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 flex-1 text-[14.5px] text-muted">{g.wish_note}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {g.amazon_urls.map((url, i) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-pill border border-line px-3 py-1.5 text-[12.5px] font-bold text-red underline"
                    >
                      {g.amazon_urls.length > 1 ? `Gift ${i + 1} ↗` : "Open Amazon ↗"}
                    </a>
                  ))}
                </div>

                {!gifted && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={markGifted}>
                      <input type="hidden" name="letter_id" value={g.id} />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-pill bg-green px-4 py-2 text-[13px] font-bold text-white"
                      >
                        I sent it
                      </button>
                    </form>
                    <form action={releaseClaim}>
                      <input type="hidden" name="letter_id" value={g.id} />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-pill border border-line px-4 py-2 text-[13px] font-bold text-muted hover:border-red hover:text-red"
                      >
                        Release
                      </button>
                    </form>
                  </div>
                )}
              </Card>
            );
          })}
      </div>
    </div>
  );
}
