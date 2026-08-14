"use client";

import { useActionState, useState, type FormEvent } from "react";
import { SelectMenu, type SelectOption } from "@/components/ui/SelectMenu";
import { cn } from "@/lib/cn";
import {
  registerAccount,
  signInWithPasswordAction,
  type AuthState,
} from "@/app/members/actions";

const initial: AuthState = {};

const MONTHS: SelectOption[] = Array.from({ length: 12 }, (_, i) => {
  const value = String(i + 1).padStart(2, "0");
  return { value, label: value };
});

const CURRENT_YEAR = new Date().getFullYear();
const YEARS: SelectOption[] = Array.from({ length: 100 }, (_, i) => {
  const y = String(CURRENT_YEAR - i);
  return { value: y, label: y };
});

/** The 1st of the birth month + 18 years must fall on or before today.
 *  (e.g. born July 2002 → eligible from 2002-07-01 + 18y = 2020-07-01.) */
function isAdult(year: string, month: string): boolean {
  if (!year || !month) return false;
  const eligible = new Date(Number(year) + 18, Number(month) - 1, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eligible <= today;
}

/** Server-side failure: a red rule and a sentence, not a filled panel. */
function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="formerr">{message}</p>;
}

/**
 * Smoothly reveals/collapses a short inline note. The last message is cached so
 * the text stays put while the row animates closed instead of popping away.
 */
function InlineNote({ message }: { message?: string }) {
  // Remember the last real message so the text stays legible while the row
  // animates closed, instead of blanking the instant the error clears. This is
  // React's sanctioned "adjust state during render" pattern (no effect needed).
  const [cached, setCached] = useState(message ?? "");
  if (message && message !== cached) setCached(message);
  const show = !!message;
  return (
    <div
      aria-hidden={!show}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        <p role={show ? "alert" : undefined} className="pt-2 text-[13px] font-bold text-red">
          {message || cached}
        </p>
      </div>
    </div>
  );
}

/**
 * Email + password sign-in / registration. On success the action redirects.
 *
 * Written straight on the paper (`.form-paper`): no card, no filled boxes — a
 * field is a ruled line. There is no explanatory copy here, by design: somebody
 * who reached a login screen knows what one is, and the 18+ gate is enforced by
 * the DOB field and the server rather than by a sentence about it.
 */
export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const action = mode === "register" ? registerAccount : signInWithPasswordAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const isRegister = mode === "register";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [dobTouched, setDobTouched] = useState(false);

  const dobComplete = !!month && !!year;
  const adult = isAdult(year, month);
  const dob = dobComplete ? `${year}-${month}-01` : "";

  const dobError = !isRegister
    ? ""
    : dobComplete
      ? adult
        ? ""
        : "You must be 18 or older to create an account."
      : dobTouched
        ? "Please select your birth month and year."
        : "";
  const confirmError =
    isRegister && confirm.length > 0 && confirm !== password ? "Those passwords don't match." : "";

  // Block submit only while a visible, correctable error is on screen.
  const blocked = isRegister && (!!confirmError || (dobComplete && !adult));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!isRegister) return;
    let bad = false;
    if (!dobComplete) {
      setDobTouched(true);
      bad = true;
    } else if (!adult) {
      bad = true;
    }
    if (password !== confirm) bad = true;
    if (bad) e.preventDefault();
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="form-paper">
      <input type="hidden" name="next" value={next} />

      {isRegister ? (
        <>
          <div className="fieldrow">
            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input
                id="first_name"
                name="first_name"
                required
                autoComplete="given-name"
                placeholder="First name"
              />
            </div>
            <div className="field">
              <label htmlFor="last_name">Last name</label>
              <input
                id="last_name"
                name="last_name"
                required
                autoComplete="family-name"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="fieldrow">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="(555) 555-5555"
              />
            </div>
          </div>

          <div className="fieldrow">
            <div className="field">
              {/* Month + year only; the server stores day 1. */}
              <span className="lbl">Date of birth</span>
              <input type="hidden" name="dob" value={dob} />
              <div className="dob">
                <SelectMenu
                  ariaLabel="Birth month"
                  placeholder="MM"
                  variant="ruled"
                  options={MONTHS}
                  value={month}
                  onChange={(v) => {
                    setMonth(v);
                    setDobTouched(true);
                  }}
                  invalid={!!dobError}
                />
                <SelectMenu
                  ariaLabel="Birth year"
                  placeholder="YYYY"
                  variant="ruled"
                  options={YEARS}
                  value={year}
                  onChange={(v) => {
                    setYear(v);
                    setDobTouched(true);
                  }}
                  invalid={!!dobError}
                />
              </div>
              <InlineNote message={dobError} />
            </div>
            <div className="field">
              <label htmlFor="zipcode">Zip code</label>
              <input
                id="zipcode"
                name="zipcode"
                required
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="10027"
              />
            </div>
          </div>

          <div className="fieldrow">
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="confirm_password">Confirm password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <InlineNote message={confirmError} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
        </>
      )}

      <ErrorBox message={state.error} />

      <button
        type="submit"
        disabled={pending || blocked}
        className={cn("btn btn--wide", isRegister ? "btn--green" : "btn--red")}
        style={{ marginTop: 6 }}
      >
        {pending
          ? isRegister
            ? "Creating account…"
            : "Signing in…"
          : isRegister
            ? "Create account"
            : "Log in"}
        {!pending && <span className="arw">→</span>}
      </button>
    </form>
  );
}
