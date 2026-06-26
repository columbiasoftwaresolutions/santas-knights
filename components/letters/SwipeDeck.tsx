"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { claimLetter } from "@/app/letters/give/actions";
import { links } from "@/content/site";

export type SwipeLetter = {
  id: string;
  childFirstName: string;
  childAge: number;
  wishNote: string;
  amazonUrls: string[];
  imageUrl: string | null;
};

const SWIPE_THRESHOLD_PX = 100;
const TAP_TOLERANCE_PX = 8;
const FLING_MS = 280;

/**
 * The swipe/card donor UI. One letter per card: the handwritten letter is the
 * card front, tapping flips to the wish + Amazon CTA. Right swipe (or the
 * "Gift this" button) = purchase intent → opens the Amazon link in a new tab
 * and advances; left swipe passes. Works with pointer, buttons, and keyboard.
 */
export function SwipeDeck({
  letters,
  claimable = true,
}: {
  letters: SwipeLetter[];
  /** When true, gifting records a claim in Supabase (off for demo letters). */
  claimable?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  const current = letters[index];
  const done = index >= letters.length;

  const advance = useCallback((direction: "left" | "right") => {
    setLeaving(direction);
    window.setTimeout(() => {
      setIndex((i) => i + 1);
      setFlipped(false);
      setDrag(null);
      setLeaving(null);
    }, FLING_MS);
  }, []);

  /** Record a claim for the current letter (no-op for demo letters). The Amazon
   *  tab is opened by the caller synchronously so popup blockers don't fire. */
  const claimCurrent = useCallback(() => {
    if (!claimable || !current) return;
    void claimLetter(current.id).then((res) => {
      if (res.ok) return;
      if (res.reason === "self")
        setNotice("That was your own child's letter — not recorded as an adoption.");
      else if (res.reason === "taken")
        setNotice("That one was already claimed by someone else.");
      else if (res.reason === "auth")
        window.location.href = `/account/login?next=${encodeURIComponent("/letters/give")}`;
    });
  }, [claimable, current]);

  const gift = useCallback(() => {
    if (!current || leaving) return;
    setNotice(null);
    // Open Amazon synchronously (preserve the user gesture), then record the claim.
    if (current.amazonUrls[0]) window.open(current.amazonUrls[0], "_blank", "noopener,noreferrer");
    claimCurrent();
    advance("right");
  }, [current, leaving, advance, claimCurrent]);

  const pass = useCallback(() => {
    if (!current || leaving) return;
    advance("left");
  }, [current, leaving, advance]);

  // Keyboard: ← pass · → gift · space/enter flip
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") pass();
      else if (event.key === "ArrowRight") gift();
      else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((f) => !f);
      }
    };
    deck.addEventListener("keydown", onKey);
    return () => deck.removeEventListener("keydown", onKey);
  }, [pass, gift]);

  if (done) {
    return (
      <div className="border border-line bg-paper-raised p-[42px] text-center">
        <div aria-hidden className="text-[40px] text-red">
          ♔
        </div>
        <h2 className="mt-3 text-h3">You&apos;ve read the whole pile</h2>
        <p className="mx-auto mt-2.5 max-w-[44ch] text-muted">
          That&apos;s every letter that&apos;s live right now. New ones go up as families submit
          them. You can start again if you want to reread one.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button variant="red" onClick={() => setIndex(0)}>
            Start over
          </Button>
          <Button href={links.donate} variant="ghost">
            Donate instead
          </Button>
        </div>
      </div>
    );
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (leaving) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointerStart.current || leaving) return;
    setDrag({
      dx: event.clientX - pointerStart.current.x,
      dy: event.clientY - pointerStart.current.y,
    });
  };
  const onPointerUp = () => {
    if (!pointerStart.current) return;
    const dx = drag?.dx ?? 0;
    pointerStart.current = null;
    if (Math.abs(dx) < TAP_TOLERANCE_PX) {
      // A tap flips the card.
      setDrag(null);
      setFlipped((f) => !f);
      return;
    }
    if (dx > SWIPE_THRESHOLD_PX) gift();
    else if (dx < -SWIPE_THRESHOLD_PX) pass();
    else setDrag(null);
  };

  const dx = drag?.dx ?? 0;
  const dy = drag?.dy ?? 0;
  const topTransform = leaving
    ? `translate(${leaving === "right" ? 720 : -720}px, ${dy * 0.4 - 40}px) rotate(${leaving === "right" ? 24 : -24}deg)`
    : `translate(${dx}px, ${dy * 0.4}px) rotate(${dx * 0.055}deg)`;
  const verdictOpacity = Math.min(Math.abs(dx) / SWIPE_THRESHOLD_PX, 1);

  return (
    <div>
      <div
        ref={deckRef}
        tabIndex={0}
        role="group"
        aria-label={`Letter ${index + 1} of ${letters.length}: ${current.childFirstName}, age ${current.childAge}`}
        className="relative mx-auto h-[540px] max-w-[420px] outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-red"
        style={{ perspective: "1400px" }}
      >
        {/* Cards behind the top one */}
        {letters
          .slice(index + 1, index + 3)
          .reverse()
          .map((letter, i, arr) => {
            const depth = arr.length - i; // 1 = next card, 2 = the one after
            return (
              <div
                key={letter.id}
                aria-hidden
                className="absolute inset-0 border border-line bg-paper-raised shadow-card"
                style={{
                  transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.04})`,
                  zIndex: 1,
                }}
              />
            );
          })}

        {/* Top card */}
        <div
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
          style={{
            transform: topTransform,
            transition: drag && !leaving ? "none" : `transform ${FLING_MS}ms ease`,
            zIndex: 2,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
            setDrag(null);
          }}
        >
          <div
            className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front: the handwritten letter */}
            <div className="absolute inset-0 flex flex-col overflow-hidden border border-line bg-paper-raised shadow-card [backface-visibility:hidden]">
              {current.imageUrl ? (
                // The signed Supabase URL domain is not known at build time, so use img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.imageUrl}
                  alt={`${current.childFirstName}'s handwritten letter to Santa`}
                  className="min-h-0 flex-1 bg-paper-raised object-contain"
                  draggable={false}
                />
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center bg-paper-raised p-8">
                  <p className="max-w-[30ch] text-center font-serif text-[22px] italic leading-relaxed text-ink">
                    “{current.wishNote}”
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-line px-6 py-4">
                <div>
                  <p className="text-[17px] font-extrabold tracking-[-0.01em]">
                    {current.childFirstName}, {current.childAge}
                  </p>
                  <p className="text-[13px] font-semibold text-muted">Tap the card to see the wish</p>
                </div>
                <span aria-hidden className="text-[22px] text-red">
                  ✦
                </span>
              </div>
            </div>

            {/* Back: the wish and Amazon CTA */}
            <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col overflow-hidden border border-line bg-red-deep p-7 text-paper shadow-card [backface-visibility:hidden]">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-gold-soft">
                The wish
              </p>
              <p className="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-white">
                {current.childFirstName}, age {current.childAge}
              </p>
              <p className="mt-4 flex-1 overflow-y-auto font-serif text-[19px] italic leading-relaxed">
                “{current.wishNote}”
              </p>
              <div className="mt-5 space-y-2">
                {current.amazonUrls.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                      // The anchor's href opens this specific item natively; record the claim too.
                      event.stopPropagation();
                      setNotice(null);
                      claimCurrent();
                      advance("right");
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    className="block bg-paper px-[26px] py-[13px] text-center text-base font-bold text-red-deep transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    {current.amazonUrls.length > 1 ? `Gift item ${i + 1} on Amazon ↗` : "Gift this on Amazon ↗"}
                  </a>
                ))}
                <p className="text-center text-[12.5px] opacity-80">
                  {current.amazonUrls.length > 1
                    ? "Each link opens Amazon in a new tab. Gift one item or all of them. We never handle payment."
                    : "This opens Amazon in a new tab. We never handle payment."}
                </p>
              </div>
            </div>
          </div>

          {/* Swipe verdict stamps */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-7 left-6 rotate-[-12deg] border-[3px] border-green bg-white/85 px-4 py-1.5 text-[20px] font-black tracking-wide text-green uppercase"
            style={{ opacity: dx > 0 || leaving === "right" ? verdictOpacity : 0, zIndex: 3 }}
          >
            Gift it
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute top-7 right-6 rotate-[12deg] border-[3px] border-muted bg-white/85 px-4 py-1.5 text-[20px] font-black tracking-wide text-muted uppercase"
            style={{ opacity: dx < 0 || leaving === "left" ? verdictOpacity : 0, zIndex: 3 }}
          >
            Next
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button variant="ghost" onClick={pass} className="px-5 py-3 text-[15px]">
          ← Next letter
        </Button>
        <Button
          variant="ghost"
          onClick={() => setFlipped((f) => !f)}
          className="px-5 py-3 text-[15px]"
        >
          {flipped ? "See the letter" : "See the wish"}
        </Button>
        <Button variant="red" onClick={gift} className="px-5 py-3 text-[15px]">
          Gift this ↗
        </Button>
      </div>
      <p className="mt-4 text-center text-[13.5px] font-semibold text-muted">
        Letter {index + 1} of {letters.length}
      </p>
      {notice && (
        <p className="mx-auto mt-3 max-w-[44ch] border border-gold bg-gold-soft/60 px-4 py-2.5 text-center text-[13.5px] font-semibold text-[#6c5418]">
          {notice}
        </p>
      )}
    </div>
  );
}
