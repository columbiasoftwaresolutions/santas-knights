"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/account/AuthForms";
import { Mark } from "@/components/redesign/Mark";
import { RedesignShell } from "@/components/redesign/RedesignShell";
import { org } from "@/content/site";

type Mode = "login" | "register";

function modeFromPathname(pathname: string): Mode {
  return pathname.startsWith("/signup") ? "register" : "login";
}

/** The accent slides for 340ms while the panel fades out, swaps, and fades back
 *  in. This is the second half of that: how long the fade-out runs. */
const SWAP_MS = 190;

/**
 * Full-bleed auth shell shared by /login and /signup. Rendered from the (auth)
 * route group's layout so it stays mounted across navigation between the two
 * routes — switching modes is a local state change; router.push just keeps the
 * URL in sync alongside it.
 *
 * Paper ground, per rule 1 of the redesign: the dark `.theme-steel` scene that
 * mirrored gladiators.nyc is retired (design-demos/redesign3.html). The photo
 * survives as a full-height panel down the left edge, and the Log in / Sign up
 * control is the Adopt/Submit switch from demo 1, unchanged.
 *
 * There is no explanatory copy on these two pages, deliberately — no "one
 * account, both sites", no 18+ paragraph under the button, no "back to
 * santasknights.org" (the wordmark on the panel is that link). Somebody who
 * reached a login screen knows what a login screen is.
 */
export function AuthScene() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawNext = searchParams.get("next") ?? "";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";
  const nextQuery = rawNext ? `?next=${encodeURIComponent(rawNext)}` : "";

  const [mode, setMode] = useState<Mode>(() => modeFromPathname(pathname));
  // The mode the switch has already moved to, while the panel is still fading
  // out the old one. Drives the control; `mode` drives the content.
  const [incoming, setIncoming] = useState<Mode | null>(null);

  // Keep `mode` in sync with the URL (e.g. browser back/forward) without an
  // effect — React's sanctioned "adjust state during render" pattern. During a
  // swap this is a no-op: the push happens after `mode` has already moved.
  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    setMode(modeFromPathname(pathname));
  }

  const timer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function switchMode(target: Mode) {
    if (target === mode || incoming) return;
    const href = `${target === "register" ? "/signup" : "/login"}${nextQuery}`;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMode(target);
      router.push(href, { scroll: false });
      return;
    }
    // Swap the content at the end of the fade-out, and only then push — so the
    // URL sync above never yanks the panel forward mid-transition.
    setIncoming(target);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setMode(target);
      setIncoming(null);
      router.push(href, { scroll: false });
    }, SWAP_MS);
  }

  const view = incoming ?? mode;
  const isRegister = mode === "register";

  return (
    <RedesignShell>
      <section className="auth">
        {/* The panel is the photograph and the wordmark, nothing else. */}
        <div className="auth-photo">
          <Link className="fbrand" href="/">
            {org.name.toUpperCase()}
          </Link>
          <Image
            src="/images/gallery/40725.png"
            alt="Santa's Knights armored fighters posing together"
            fill
            priority
            sizes="(min-width: 900px) 44vw, 100vw"
            style={{ objectPosition: "center 30%" }}
          />
          <div className="veil" />
        </div>

        <div className="auth-form">
          <div className="in">
            <div className="authhead">
              {isRegister ? (
                <h1>
                  Make an <Mark>account</Mark>.
                </h1>
              ) : (
                <h1>
                  Welcome <Mark alt>back</Mark>.
                </h1>
              )}
            </div>

            <div
              className="tabs"
              data-view={view === "register" ? "signup" : "login"}
              role="tablist"
              aria-label="Log in or sign up"
              style={{ marginTop: 38 }}
            >
              <span className="slide" aria-hidden />
              <button
                type="button"
                role="tab"
                id="tab-login"
                aria-selected={view === "login"}
                aria-controls="auth-panel"
                onClick={() => switchMode("login")}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                id="tab-signup"
                aria-selected={view === "register"}
                aria-controls="auth-panel"
                onClick={() => switchMode("register")}
              >
                Sign up
              </button>
            </div>

            <div
              className={`panel${incoming ? " is-out" : ""}`}
              id="auth-panel"
              role="tabpanel"
              aria-labelledby={isRegister ? "tab-signup" : "tab-login"}
              style={{ marginTop: 34 }}
            >
              {/* Keyed so the two forms are separate mounts: switching modes
                  starts a clean form rather than carrying the other one's
                  state (and its useActionState error) across. */}
              <AuthForm key={mode} mode={mode} next={next} />
            </div>
          </div>
        </div>
      </section>
    </RedesignShell>
  );
}
