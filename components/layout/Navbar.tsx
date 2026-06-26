"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { type NavItem, navLinks, links } from "@/content/site";

export type NavAuth = { signedIn: boolean; dashboardHref: string };

/** Dark poster nav with dropdown menus and a mobile slide-out. */
export function Navbar({ auth }: { auth: NavAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-bone/15 bg-ink">
      <Container className="flex h-[72px] items-center gap-[14px]">
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

        <div className="ml-auto flex items-center gap-3">
          {/* Donate hidden on mobile (wrapper avoids the hidden/inline-flex conflict). */}
          <div className="hidden items-center gap-3 sm:flex">
            <Button href={links.donate} variant="bone">
              Donate
            </Button>
          </div>

          {/* Primary auth button: Log In (signed out) / Dashboard (signed in). */}
          <Button
            href={auth.signedIn ? auth.dashboardHref : links.accountLogin}
            variant="red"
            className="shrink-0"
          >
            {auth.signedIn ? "Dashboard" : "Log In"}
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="ml-1 flex flex-col gap-[5px] p-2 xl:hidden"
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

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="border-t border-bone/12 bg-ink pb-6 xl:hidden">
          <Container>
            <MobileNav items={navLinks} onClose={() => setMobileOpen(false)} />
            {/* The auth button is always in the header; the menu keeps the CTAs. */}
            {/* Closing handled on the container so the Link buttons still navigate. */}
            <div className="mt-4 grid gap-2 px-2" onClick={() => setMobileOpen(false)}>
              <Button href={links.adoptLetter} variant="red">
                Adopt a letter
              </Button>
              <Button href={links.donate} variant="bone">
                Donate
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
          className={cn("text-[10px] transition-transform duration-200", open && "rotate-180")}
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

function MobileNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <ul className="mt-4 grid gap-1">
      {items.map((item) => (
        <li key={item.label}>
          {item.children ? (
            <div>
              <button
                onClick={() => setOpenSection((prev) => (prev === item.label ? null : item.label))}
                className="flex w-full items-center justify-between px-2 py-3 text-left text-[15px] font-semibold text-bone hover:text-amber"
              >
                {item.label}
                <span
                  className={cn(
                    "text-[11px] transition-transform duration-200",
                    openSection === item.label && "rotate-180",
                  )}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {openSection === item.label && (
                <ul className="ml-2 mt-1 grid gap-0.5 border-l border-bone/15 pl-4">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="block px-3 py-2.5 text-[14.5px] font-medium text-bone/70 hover:text-amber"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Link
              href={item.href!}
              onClick={onClose}
              className="block px-2 py-3 text-[15px] font-semibold text-bone hover:text-amber"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
