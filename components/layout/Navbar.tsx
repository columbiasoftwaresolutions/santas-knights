"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { type NavItem, navLinks, links } from "@/content/site";

export type NavAuth = { signedIn: boolean; dashboardHref: string };

/**
 * Pages that open on a full-bleed dark hero photo (a <PhotoBand hero>). There
 * the nav floats straight on the image — no ground of its own — and only fills
 * in with ink once you've scrolled past it. Every other page starts on paper,
 * where bone text on cream is unreadable, so the nav stays solid from the top.
 */
const OVERLAY_ROUTES = ["/", "/letters-to-santa"];

/** Scrolled far enough that the nav has left the top of the hero (its own height). */
const FILL_AFTER = 72;

/** Dark poster nav with dropdown menus and a mobile slide-out. */
export function Navbar({ auth }: { auth: NavAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const overlay = OVERLAY_ROUTES.includes(pathname);

  // Only overlay routes care about scroll position; everywhere else the nav is
  // solid regardless, so don't pay for the listener.
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > FILL_AFTER);
    onScroll(); // reload mid-page / bfcache restore starts already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // While the panel is open the page behind it must not scroll: on a phone the
  // panel is most of the screen, and a scroll that lands on the document reads
  // as the menu refusing to move.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // The open mobile panel needs a ground under it even at the top of the hero.
  const filled = !overlay || scrolled || mobileOpen;

  return (
    <header
      className={cn(
        "top-0 z-50 border-b transition-colors duration-300",
        // Fixed (not sticky) on overlay routes so the hero runs up under it;
        // it stays fixed once filled, or it would snap back up the document.
        overlay ? "fixed inset-x-0" : "sticky",
        filled ? "border-bone/15 bg-ink" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-[72px] items-center gap-2 xl:gap-[14px]">
        <Brand tagline={false} />

        {/* Desktop nav */}
        <nav className="ml-2 hidden shrink-0 items-center gap-[18px] text-[13px] font-semibold whitespace-nowrap text-bone/75 xl:flex">
          {navLinks.map((item) =>
            item.children ? (
              <DropdownItem
                key={item.label}
                item={item}
                open={openDropdown === item.label}
                onOpen={() => setOpenDropdown(item.label)}
                onClose={() => setOpenDropdown(null)}
              />
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="border-b-2 border-transparent py-1.5 transition-colors hover:border-red hover:text-bone"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Primary auth button: Log In (signed out) / Dashboard (signed in).
              Below 360px the wordmark and the hamburger already fill the bar, so
              it steps out and the menu carries it instead. */}
          <Button
            href={auth.signedIn ? auth.dashboardHref : links.accountLogin}
            variant="red"
            // `max-[360px]:hidden`, not `hidden min-[360px]:inline-flex`: `cn`
            // is a plain joiner, so an unprefixed `hidden` just races Button's
            // own `inline-flex` in the stylesheet and loses. A variant always
            // sorts after the base utility it overrides.
            className="shrink-0 max-sm:px-4 max-sm:py-2.5 max-sm:text-[12px] max-[360px]:hidden"
          >
            {auth.signedIn ? "Dashboard" : "Log In"}
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex flex-col gap-[5px] p-2 xl:hidden"
          >
            <span
              className={cn(
                "block h-[2px] w-[22px] bg-bone transition-all duration-200",
                mobileOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-[2px] w-[22px] bg-bone transition-all duration-200",
                mobileOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-[2px] w-[22px] bg-bone transition-all duration-200",
                mobileOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </div>
      </Container>

      {/* Mobile slide-down menu. Capped at the space left under the header and
          scrollable inside it, so a short phone in landscape can still reach the
          last link and the CTA. */}
      {mobileOpen && (
        <div className="max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-bone/12 bg-ink pb-8 xl:hidden">
          <Container>
            <MobileNav items={navLinks} onClose={() => setMobileOpen(false)} />
            {/* The primary CTA, plus the account link — which the header drops
                on the narrowest phones, so the menu has to carry it. */}
            {/* Closing handled on the container so the Link buttons still navigate. */}
            <div className="mt-5 grid gap-2" onClick={() => setMobileOpen(false)}>
              <Button href={links.adoptLetter} variant="red" className="justify-center">
                Adopt a letter
              </Button>
              <Button
                href={auth.signedIn ? auth.dashboardHref : links.accountLogin}
                variant="bone"
                className="justify-center min-[360px]:hidden"
                // Only shown on the phones too narrow to keep it in the header.
              >
                {auth.signedIn ? "Dashboard" : "Log In"}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * Desktop dropdown
 * ------------------------------------------------------------------ */

function DropdownItem({
  item,
  open,
  onOpen,
  onClose,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        className={cn(
          "flex items-center gap-[5px] border-b-2 border-transparent py-1.5 transition-colors hover:border-red hover:text-bone",
          open && "border-red text-bone",
        )}
      >
        {item.label}
        <span
          className={cn("text-[10px] transition-colors duration-200", open && "rotate-180")}
          aria-hidden
        >
          ▾
        </span>
      </button>

      <div
        className={cn(
          "absolute top-full left-0 z-50 min-w-[200px] border border-bone/15 bg-ink2 transition-all duration-150",
          open ? "visible translate-y-[6px] opacity-100" : "invisible translate-y-2 opacity-0",
        )}
      >
        <ul className="py-2">
          {item.children!.map((child) => (
            <li key={child.label}>
              <Link
                href={child.href}
                className="block px-4 py-[10px] text-[13.5px] font-semibold text-bone/75 transition-colors hover:bg-ink hover:text-amber"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile nav
 * ------------------------------------------------------------------ */

/**
 * Flattens the desktop nav for the phone.
 *
 * On a pointer device a dropdown costs nothing — it opens on hover. On a phone
 * it costs a tap, a state, and a second decision, and the two menus here hold
 * two links each. So a parent with children contributes its children directly
 * and disappears: nine rows, one tap each, nothing to open first.
 */
function flatten(items: NavItem[]): { label: string; href: string }[] {
  return items.flatMap((item) =>
    item.children ? item.children : [{ label: item.label, href: item.href! }],
  );
}

function MobileNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  return (
    <ul className="mt-2 grid">
      {flatten(items).map((item) => (
        <li key={item.label} className="border-b border-bone/10 last:border-b-0">
          <Link
            href={item.href}
            onClick={onClose}
            className="block py-3.5 text-[16px] font-semibold text-bone transition-colors hover:text-amber"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
