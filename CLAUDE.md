# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

The Armored League platform — a Next.js + Supabase rebuild replacing a legacy Wix site, plus a training tracker (XP gamification) and the Santa's Knights / Santa's Letters gifting portal. Built by Columbia Software Solutions.

Read these before substantial work:
- **[README.md](./README.md)** — scope, tech stack, phases, data model, setup, admin tasks.
- **[ROLLOUT.md](./docs/ROLLOUT.md)** — build-≠-cutover strategy, two-track rollout, public cutover checklist.
- **[CHANGELOG.md](./docs/CHANGELOG.md)** — impact-focused log of every change, maintained for Nicolas (SEO/ads/marketing).
- **[REQUIREMENTS.md](./docs/REQUIREMENTS.md)** — full feature scope by stage; site architecture & brand split.

## ⭐ Required: update the CHANGELOG at commit/push time

**Update [CHANGELOG.md](./docs/CHANGELOG.md) only as part of a commit/push — never preemptively.** The workflow is:

1. When the user asks to commit or push, first run `git diff` (and `git diff --staged`) to see what *actually* changed.
2. Add a row to CHANGELOG.md describing those real changes.
3. Stage the CHANGELOG edit and create the commit together.

Do not edit CHANGELOG.md at any other time. If you're just creating or editing files without committing, leave the CHANGELOG alone — it gets written from the diff at commit time.

Add the row under the current month's heading (create a new `## YYYY-MM` section if the month doesn't exist yet). Fill every column based on what the diff shows:

| Column | What to put |
| --- | --- |
| **Date** | Commit date, `YYYY-MM-DD`. |
| **Change** | One-line summary of the real diff (not the intent — what changed). |
| **Where** | `Wix` · `Beta` · `New` · `Both` — where the change is visible. Internal/repo-only work is `Beta`. |
| **Type** | `Content` · `Layout/UX` · `SEO` · `Ads` · `Analytics` · `Feature` · `Infra`. |
| **Impact** | Expected effect on **SEO / Ads / Analytics / UX**. Write `None — internal, no public exposure` for beta-only/repo work. |
| **Owner** | Who made the change (e.g. `CSS`, or the author's name). |
| **Notes** | Links: PR, affected Wix page, screenshot, metric snapshot. |

Then write the git commit. Keep the CHANGELOG entry and the commit message consistent.

**The rule from ROLLOUT.md still governs:** no *public-facing* change (Wix or new site) ships without a CHANGELOG entry **and** a heads-up to Nicolas. Purely internal/beta changes still get a CHANGELOG row, marked impact `None`.

## Commit conventions

- Commit messages: short imperative subject, optional body explaining *why*.
- End commit messages with the `Co-Authored-By` trailer for Claude.
- Work on a branch and open a PR rather than committing to `main` directly when the change is non-trivial.
- Only commit/push when the user asks.

## Tech stack & conventions

- **Next.js (App Router)** on Vercel; **Supabase** (Postgres + RLS, Auth, Storage).
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — never import it into client components.
- Mobile-first responsive design (audience is heavily social-media-driven).
- XP values, level names, thresholds, and rewards are **admin-editable data, not hardcoded**.
- XP can make a participant *eligible to request* a privilege but must **never auto-grant** safety-sensitive access (armor, sparring) — those require instructor/admin certification.
- Santa's Letters: never expose a child's identifying details publicly; gifts must be age-appropriate, legal, and safe.

## Environments

- New stack stays **`noindex`** on `beta.*` subdomains until a coordinated public cutover — never let beta compete with the live Wix site in search. See ROLLOUT.md.
- The Armored League and Santa's Knights are on **separate domains** with separate cutovers.
