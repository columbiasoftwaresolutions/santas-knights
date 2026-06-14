# End-to-end test — Letters to Santa

Drives a fresh headless Chromium (Playwright) through the full flow against a
**local dev server + the real Supabase project**: family submits a letter →
admin moderates → letter appears in the donor swipe deck → admin marks it
fulfilled. Screenshots land in `../e2e-screenshots/` (gitignored).

> Runs against real Supabase data. Use mock guardian emails ending in
> `@example.com` so the data can be cleaned up by that filter afterwards.

## Run

```bash
# 1. Start the dev server on a port that isn't already taken (3000 may be in use)
npm run dev -- -p 3100

# 2. In another shell, run the flow (admin creds are the test admin)
BASE_URL=http://localhost:3100 node e2e/run.mjs
```

- `run.mjs` — the full flow (3 submissions, login, approve ×2, request-edits ×1, deck, fulfill).
- `fix-sofia.mjs` — example of a targeted moderation step that waits for the
  card to leave the queue before continuing (the robust pattern; the server
  action revalidates with a slight client-render lag, so back-to-back clicks
  need a wait-for-removal between them).

## Clean up mock data

The screenshots capture the run; the rows in Supabase don't need to stick
around. Delete any letter whose guardian email ends in `@example.com` (the
`santa_letters` → `consent_records` FK cascades; remove the Storage images via
`storage.from('letters').remove([...])` first).
