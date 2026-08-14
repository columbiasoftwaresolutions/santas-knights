"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { claimLetter } from "@/app/letters-to-santa/give/actions";
import { links } from "@/content/site";

export type SwipeLetter = {
  id: string;
  childFirstName: string;
  childAge: number;
  wishNote: string;
  amazonUrls: string[];
  amazonImageUrls: string[];
  /** A single Amazon wishlist link (guardian-owned). When set, the card shows a
   *  "see their wishlist" button instead of per-item Amazon links. */
  wishlistUrl: string | null;
  /** Short noun phrase for the gift, e.g. "LEGO Technic set". */
  giftSummary: string | null;
  giftValueUsd: number | null;
  imageUrl: string | null;
};

const SWIPE_THRESHOLD_PX = 100;
const TAP_TOLERANCE_PX = 8;
const FLING_MS = 280;

/**
 * The donor deck. One letter per card: the handwritten letter is the card
 * front, tapping flips to the wish + gift links. Right swipe (or "Gift this")
 * records the claim and advances; left swipe passes. Actually opening Amazon is
 * a separate, explicit tap on the wishlist / product link on the back.
 *
 * Reading the pile is public. CLAIMING is not: the claim ties the gift to a
 * donor so we can coordinate handoff, send an acknowledgment, and block a
 * guardian from gifting their own child. A signed-out visitor who presses
 * "Gift this" is sent to log in and returned here.
 *
 * Works with pointer, buttons, and keyboard (← pass · → gift · space/enter flip).
 */
export function SwipeDeck({
  letters,
  claimable = true,
  signedIn,
}: {
  letters: SwipeLetter[];
  /** False for the `?demo=1` sample letters — nothing is written. */
  claimable?: boolean;
  signedIn: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  /**
   * Which way this gesture turned out to go, decided once per press.
   *
   * The card is `touch-action: pan-y`, so a vertical drag on it scrolls the
   * page — the card sits mid-document and a 500px scroll trap is how a phone
   * visitor gets stuck. But the browser still reports those moves to us, and
   * without this the page scrolls AND the card slides sideways under the
   * thumb. `null` = undecided, `"x"` = ours, `"y"` = the page's.
   */
  const axis = useRef<"x" | "y" | null>(null);
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

  const goSignIn = useCallback(() => {
    window.location.href = `${links.accountLogin}?next=${encodeURIComponent("/letters-to-santa")}`;
  }, []);

  /** Record a claim for the current letter (no-op for demo letters). */
  const claimCurrent = useCallback(() => {
    if (!claimable || !current) return;
    void claimLetter(current.id).then((res) => {
      if (res.ok) return;
      if (res.reason === "self")
        setNotice("That was your own child's letter — not recorded as an adoption.");
      else if (res.reason === "taken")
        setNotice("That one was already claimed by someone else.");
      else if (res.reason === "auth") goSignIn();
    });
  }, [claimable, current, goSignIn]);

  const gift = useCallback(() => {
    if (!current || leaving) return;
    if (!signedIn) {
      goSignIn();
      return;
    }
    setNotice(null);
    // Swiping right records the claim ("I'm sending this"). Buying is a separate,
    // explicit tap on the wishlist/product link on the card back.
    claimCurrent();
    advance("right");
  }, [current, leaving, signedIn, goSignIn, advance, claimCurrent]);

  const pass = useCallback(() => {
    if (!current || leaving) return;
    advance("left");
  }, [current, leaving, advance]);

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
      <div className="state">
        <h3>You&apos;ve read the whole pile</h3>
        <p>
          That&apos;s every letter that&apos;s live right now. New ones go up as families submit
          them. You can start again if you want to reread one.
        </p>
        <div className="actions">
          <button type="button" className="btn btn--red" onClick={() => setIndex(0)}>
            Start over
          </button>
          <a className="btn btn--ghost" href={links.donate}>
            Donate instead
          </a>
        </div>
      </div>
    );
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (leaving) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    axis.current = null;
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointerStart.current || leaving) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (axis.current === null) {
      // Undecided until the gesture has actually travelled — a press that
      // hasn't moved yet is still a tap, and tap flips the card.
      if (Math.abs(dx) < TAP_TOLERANCE_PX && Math.abs(dy) < TAP_TOLERANCE_PX) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current === "y") return; // the page is scrolling; leave the card alone
    setDrag({ dx, dy });
  };
  const onPointerUp = () => {
    if (!pointerStart.current) return;
    const dx = drag?.dx ?? 0;
    pointerStart.current = null;
    const wasVertical = axis.current === "y";
    axis.current = null;
    if (wasVertical) {
      setDrag(null);
      return;
    }
    if (Math.abs(dx) < TAP_TOLERANCE_PX) {
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
  const giftItems = current.amazonUrls.map((url, i) => ({
    url,
    imageUrl: current.amazonImageUrls[i] || null,
  }));
  // "LEGO Technic set · about $50" — omits whichever half the letter lacks.
  const ask =
    [
      current.giftSummary,
      current.giftValueUsd ? `about $${Math.round(current.giftValueUsd)}` : null,
    ]
      .filter(Boolean)
      .join(" · ") || null;
  const topTransform = leaving
    ? `translate(${leaving === "right" ? 720 : -720}px, ${dy * 0.4 - 40}px) rotate(${leaving === "right" ? 24 : -24}deg)`
    : `translate(${dx}px, ${dy * 0.4}px) rotate(${dx * 0.055}deg)`;
  const verdictOpacity = Math.min(Math.abs(dx) / SWIPE_THRESHOLD_PX, 1);

  const openLink = (event: React.MouseEvent) => {
    // The anchor's href opens Amazon natively; also record the claim.
    event.stopPropagation();
    if (!signedIn) return; // The link still opens; the claim needs an account.
    setNotice(null);
    claimCurrent();
    advance("right");
  };

  return (
    <div className="deckwrap">
      <div
        ref={deckRef}
        tabIndex={0}
        role="group"
        aria-label={`Letter ${index + 1} of ${letters.length}: ${current.childFirstName}, age ${current.childAge}`}
        className="swipe"
        style={{ perspective: "1400px" }}
      >
        {/* The rest of the pile, stacked behind the top card. */}
        {letters
          .slice(index + 1, index + 3)
          .reverse()
          .map((letter, i, arr) => {
            const depth = arr.length - i;
            return (
              <div
                key={letter.id}
                aria-hidden
                className="sw-face sw-front"
                style={{
                  transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.04})`,
                  zIndex: 1,
                }}
              />
            );
          })}

        <div
          // touch-pan-y, not touch-none: the browser keeps vertical scrolling so
          // the page can still be read past the deck, and we take the sideways
          // gesture. See `axis` above for how the two are told apart.
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          style={{
            transform: topTransform,
            transition: drag && !leaving ? "none" : `transform ${FLING_MS}ms ease`,
            zIndex: 2,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            // Fired when the browser takes the gesture over to scroll the page.
            pointerStart.current = null;
            axis.current = null;
            setDrag(null);
          }}
        >
          <div
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Front: the handwritten letter itself — the point of the program. */}
            <div className="sw-face sw-front">
              {current.imageUrl ? (
                // The signed Supabase URL host isn't known at build time, so use img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.imageUrl}
                  alt={`${current.childFirstName}'s handwritten letter to Santa`}
                  className="min-h-0 flex-1 object-contain"
                  draggable={false}
                />
              ) : (
                <p className="sw-note">“{current.wishNote}”</p>
              )}
              <div className="sw-who">
                <div>
                  <strong>
                    {current.childFirstName}, {current.childAge}
                  </strong>
                  <span>Tap the card to see the wish</span>
                </div>
              </div>
            </div>

            {/* Back: the wish and where to buy it. */}
            <div className="sw-face sw-back">
              <p className="kicker">The wish</p>
              <h3>
                {current.childFirstName}, age {current.childAge}
              </h3>
              <p className="wish">“{current.wishNote}”</p>
              {ask && <p className="ask">{ask}</p>}

              <div className="mt-5 flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
                {current.wishlistUrl ? (
                  <a
                    href={current.wishlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={openLink}
                    onPointerDown={(event) => event.stopPropagation()}
                    className="sw-item"
                  >
                    <span className="thumb">List</span>
                    <span className="label">See their Amazon wishlist ↗</span>
                  </a>
                ) : (
                  giftItems.map((item, i) => (
                    <a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={openLink}
                      onPointerDown={(event) => event.stopPropagation()}
                      className="sw-item"
                    >
                      <span className="thumb">
                        {item.imageUrl ? (
                          // Amazon image hosts are remote and dynamic, so use img here.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-contain"
                            loading="lazy"
                            draggable={false}
                          />
                        ) : (
                          "Amazon"
                        )}
                      </span>
                      <span className="label">
                        {current.amazonUrls.length > 1
                          ? `Gift item ${i + 1} on Amazon ↗`
                          : "Gift this on Amazon ↗"}
                      </span>
                    </a>
                  ))
                )}
              </div>
              <p className="fine">
                {signedIn
                  ? "Opens Amazon in a new tab. We never handle the money."
                  : "Opens Amazon in a new tab. Log in first so we can mark this letter as taken."}
              </p>
            </div>
          </div>

          {/* Swipe verdict stamps */}
          <div
            aria-hidden
            className="sw-stamp"
            style={{
              left: 24,
              transform: "rotate(-12deg)",
              borderColor: "var(--color-green)",
              color: "var(--color-green)",
              opacity: dx > 0 || leaving === "right" ? verdictOpacity : 0,
            }}
          >
            Gift it
          </div>
          <div
            aria-hidden
            className="sw-stamp"
            style={{
              right: 24,
              transform: "rotate(12deg)",
              borderColor: "var(--color-muted)",
              color: "var(--color-muted)",
              opacity: dx < 0 || leaving === "left" ? verdictOpacity : 0,
            }}
          >
            Next
          </div>
        </div>
      </div>

      <div className="deckbar">
        <button type="button" className="btn btn--ghost" onClick={pass}>
          ← Next letter
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setFlipped((f) => !f)}>
          {flipped ? "See the letter" : "See the wish"}
        </button>
        <button type="button" className="btn btn--red" onClick={gift}>
          {signedIn ? "Gift this" : "Log in to gift"} <span className="arw">→</span>
        </button>
      </div>
      <p className="deckcount">
        Letter {index + 1} of {letters.length}
      </p>
      {notice && <p className="notice">{notice}</p>}
    </div>
  );
}
