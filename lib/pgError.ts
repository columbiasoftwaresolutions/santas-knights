/**
 * True for the Postgres "column does not exist" error (42703), and for
 * PostgREST's schema-cache equivalent ("Could not find the 'x' column of 'y'").
 *
 * A Supabase project that hasn't had the newest migration applied reports a
 * column the app already reads or writes this way. Callers use it to fall back
 * to the pre-migration column set so the feature degrades instead of erroring —
 * the same pattern the codebase already uses for the legacy `amazon_url` shape.
 */
export function isMissingColumnError(message: string | null | undefined): boolean {
  if (!message) return false;
  return /column .* does not exist|could not find the .* column/i.test(message);
}
