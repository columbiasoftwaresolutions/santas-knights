"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type EngagementState } from "@/app/actions/engagement";

const initialState: EngagementState = { ok: false };

/**
 * Newsletter capture — one line on the paper, no card. Signups are stored in
 * Supabase; export to the newsletter provider once one is chosen (Phase 1
 * blocker).
 */
export function NewsletterForm({ defaultEmail }: { defaultEmail?: string | null }) {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  if (state.ok) {
    return (
      <div className="sent">
        <h3>You&apos;re on the list.</h3>
      </div>
    );
  }

  return (
    <div>
      <form action={formAction} className="news">
        <label htmlFor="n-email" className="sr-only">
          Email
        </label>
        <input
          id="n-email"
          type="email"
          name="email"
          required
          defaultValue={defaultEmail ?? undefined}
          placeholder="you@email.com"
        />
        <button type="submit" disabled={pending}>
          {pending ? "Signing up…" : "Subscribe"}
        </button>
      </form>
      {state.message && !state.ok && <p className="formerr mt-3">{state.message}</p>}
    </div>
  );
}
