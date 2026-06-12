"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { subscribeNewsletter, type EngagementState } from "@/app/actions/engagement";

const initialState: EngagementState = { ok: false };

/**
 * Newsletter capture. Signups are stored in Supabase; export to the
 * newsletter provider once one is chosen (Phase 1 blocker).
 */
export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  if (state.ok) {
    return (
      <p className="rounded-pill border border-green/30 bg-green-soft px-[22px] py-[14px] text-[15px] font-bold text-green">
        You&apos;re on the list — thanks for caring about this.
      </p>
    );
  }

  return (
    <div>
      <form action={formAction} className="flex flex-wrap gap-2.5">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          aria-label="Email address"
          className="min-w-[160px] flex-1 rounded-pill border-[1.5px] border-gold bg-white px-[18px] py-[13px] text-[15px] focus:outline-2 focus:outline-offset-1 focus:outline-red"
        />
        <Button type="submit" variant="red" disabled={pending}>
          {pending ? "Signing up…" : "Sign up"}
        </Button>
      </form>
      {state.message && !state.ok && (
        <p className="mt-2.5 text-[13.5px] font-semibold text-red">{state.message}</p>
      )}
    </div>
  );
}
