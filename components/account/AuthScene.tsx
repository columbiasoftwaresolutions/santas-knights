"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/account/AuthForms";
import { cn } from "@/lib/cn";

type Mode = "login" | "register";

function modeFromPathname(pathname: string): Mode {
  return pathname.startsWith("/signup") ? "register" : "login";
}

/**
 * Full-bleed auth shell shared by /login and /signup. Rendered from the
 * (auth) route group's layout so it stays mounted across navigation between
 * the two routes — switching modes is a local state change (crossfade +
 * height morph); router.push just keeps the URL in sync alongside it.
 *
 * Only the active pane sits in normal flow (so the panel is correctly sized
 * on first paint, no JS needed); the inactive one is absolutely stacked
 * underneath, invisible. On a mode switch, the current height is frozen,
 * the pane swap commits, then the new pane's measured height is set so the
 * `height` transition animates between the two — settling back to `auto`
 * once it completes so a later viewport resize (e.g. the register form's
 * own field rows restacking on mobile) isn't stuck at a stale pixel value.
 *
 * Panes crossfade rather than slide sideways: a sideways slide needs
 * `overflow: hidden` on the shared container, which would clip the register
 * form's month/year dropdowns whenever they're open.
 */
export function AuthScene() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawNext = searchParams.get("next") ?? "";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";
  const nextQuery = rawNext ? `?next=${encodeURIComponent(rawNext)}` : "";

  const [mode, setMode] = useState<Mode>(() => modeFromPathname(pathname));

  // Keep `mode` in sync with the URL (e.g. browser back/forward) without an
  // effect — React's sanctioned "adjust state during render" pattern.
  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    setMode(modeFromPathname(pathname));
  }

  const viewportRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  function paneEl(m: Mode) {
    return (m === "register" ? registerRef : loginRef).current;
  }

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const viewport = viewportRef.current;
    const target = paneEl(mode);
    if (!viewport || !target) return;

    const raf = requestAnimationFrame(() => {
      viewport.style.height = `${target.getBoundingClientRect().height}px`;
    });

    function settle(e: TransitionEvent) {
      if (e.target === viewport && e.propertyName === "height") {
        viewport!.style.height = "";
      }
    }
    viewport.addEventListener("transitionend", settle);
    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("transitionend", settle);
    };
  }, [mode]);

  function switchMode(target: Mode) {
    if (target === mode) return;
    const viewport = viewportRef.current;
    const current = paneEl(mode);
    if (viewport && current) {
      viewport.style.height = `${current.getBoundingClientRect().height}px`;
      viewport.getBoundingClientRect();
    }
    setMode(target);
    router.push(`${target === "register" ? "/signup" : "/login"}${nextQuery}`, { scroll: false });
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src="/images/gallery/40725.png"
        alt="Santa's Knights armored fighters posing together"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%] opacity-[0.55] grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-steel via-steel/80 to-steel/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-steel/45 via-steel/10 to-steel/45" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div className="theme-steel w-full max-w-[480px] border border-bone/20 bg-steel2/95">
          <div className="p-8 sm:p-[34px]">
            {/* No brand logo yet — heading text only until one is provided. */}
            <h1 className="mb-6 text-center font-display text-[27px] leading-none font-black uppercase">
              {mode === "register" ? "Create account" : "Sign in"}
            </h1>

            <div className="mb-6 flex border border-bone/25">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={cn(
                  "flex-1 py-[11px] text-[12px] font-bold tracking-[0.08em] uppercase transition-colors duration-200",
                  mode === "login" ? "bg-red text-white" : "text-bone/55 hover:text-bone",
                )}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={cn(
                  "flex-1 py-[11px] text-[12px] font-bold tracking-[0.08em] uppercase transition-colors duration-200",
                  mode === "register" ? "bg-red text-white" : "text-bone/55 hover:text-bone",
                )}
              >
                Sign up
              </button>
            </div>

            <div
              ref={viewportRef}
              className="relative transition-[height] duration-[340ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              <div
                ref={loginRef}
                className={cn(
                  "transition-opacity duration-[220ms] ease-out",
                  mode === "login"
                    ? "opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0",
                )}
              >
                <AuthForm mode="login" next={next} />
              </div>
              <div
                ref={registerRef}
                className={cn(
                  "transition-opacity duration-[220ms] ease-out",
                  mode === "register"
                    ? "opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0",
                )}
              >
                <AuthForm mode="register" next={next} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
