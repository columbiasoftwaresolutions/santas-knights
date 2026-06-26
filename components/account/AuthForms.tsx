"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  registerAccount,
  signInWithPasswordAction,
  type AuthState,
} from "@/app/account/actions";

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

const initial: AuthState = {};

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="border border-red/30 bg-red/5 px-[18px] py-[12px] text-[14.5px] font-semibold text-red">
      {message}
    </p>
  );
}

/** Email + password sign-in / registration. On success the action redirects. */
export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const action = mode === "register" ? registerAccount : signInWithPasswordAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="next" value={next} />
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
        <label htmlFor="password" className={labelBase}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : undefined}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          placeholder="••••••••"
          className={fieldBase}
        />
        {mode === "register" && (
          <p className="mt-1.5 text-[13px] text-muted">At least 8 characters.</p>
        )}
      </div>
      <ErrorBox message={state.error} />
      <Button type="submit" variant="green" disabled={pending}>
        {pending
          ? mode === "register"
            ? "Creating account…"
            : "Signing in…"
          : mode === "register"
            ? "Create account"
            : "Sign in"}
      </Button>
    </form>
  );
}
