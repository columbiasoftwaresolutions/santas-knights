"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const fieldBase =
  "w-full rounded-[14px] border-[1.5px] border-line bg-white px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (signInError) {
      setError("That email and password didn't work.");
      setPending(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
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
          placeholder="you@santasknights.org"
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
          autoComplete="current-password"
          placeholder="••••••••"
          className={fieldBase}
        />
      </div>
      {error && (
        <p className="rounded-[14px] border border-red/30 bg-red/5 px-[18px] py-[12px] text-[14.5px] font-semibold text-red">
          {error}
        </p>
      )}
      <Button type="submit" variant="red" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
