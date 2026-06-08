"use client";

import { Button } from "@/components/ui/Button";

/**
 * Newsletter capture. Submission is a no-op for now — wire to the newsletter
 * provider (Phase 1 blocker) when credentials are available.
 */
export function NewsletterForm() {
  return (
    <form
      className="flex flex-wrap gap-2.5"
      onSubmit={(event) => {
        event.preventDefault();
        // TODO: POST to newsletter provider.
      }}
    >
      <input
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        className="min-w-[160px] flex-1 rounded-pill border-[1.5px] border-gold bg-white px-[18px] py-[13px] text-[15px] focus:outline-2 focus:outline-offset-1 focus:outline-red"
      />
      <Button type="submit" variant="red">
        Sign up
      </Button>
    </form>
  );
}
