"use client";

import { useActionState, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SelectMenu, type SelectOption } from "@/components/ui/SelectMenu";
import { cn } from "@/lib/cn";
import {
  registerAccount,
  signInWithPasswordAction,
  type AuthState,
} from "@/app/account/actions";

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

const initial: AuthState = {};

const MONTHS: SelectOption[] = [
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "June"],
  ["07", "July"],
  ["08", "August"],
  ["09", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
].map(([value, label]) => ({ value, label }));

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

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="border border-red/30 bg-red/5 px-[18px] py-[12px] text-[14.5px] font-semibold text-red">
      {message}
    </p>
  );
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
        <p role={show ? "alert" : undefined} className="pt-1.5 text-[13px] font-semibold text-red">
          {message || cached}
        </p>
      </div>
    </div>
  );
}

/** Email + password sign-in / registration. On success the action redirects. */
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
    <form action={formAction} onSubmit={handleSubmit} className="grid gap-5">
      <input type="hidden" name="next" value={next} />

      {isRegister && (
        <div>
          <label htmlFor="name" className={labelBase}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={fieldBase}
          />
        </div>
      )}

      {/* Email — paired with date of birth on registration. */}
      {isRegister ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelBase}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className={fieldBase}
            />
          </div>
          <div>
            <span className={labelBase}>Date of birth</span>
            <input type="hidden" name="dob" value={dob} />
            <div className="grid grid-cols-2 gap-2.5">
              <SelectMenu
                ariaLabel="Birth month"
                placeholder="Month"
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
                placeholder="Year"
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
        </div>
      ) : (
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={fieldBase}
          />
        </div>
      )}

      {/* Password — paired with confirm on registration. */}
      {isRegister ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className={labelBase}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={fieldBase}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className={labelBase}>
              Confirm password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(fieldBase, confirmError && "border-red/70")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <InlineNote message={confirmError} />
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="password" className={labelBase}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={fieldBase}
          />
        </div>
      )}

      <ErrorBox message={state.error} />
      <Button type="submit" variant="green" disabled={pending || blocked}>
        {pending
          ? isRegister
            ? "Creating account…"
            : "Signing in…"
          : isRegister
            ? "Create account"
            : "Sign in"}
      </Button>
    </form>
  );
}
