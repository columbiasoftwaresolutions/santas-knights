# seo-baseline

Both sides of the cutover diff, in one place: what the **live Wix site** exposes to search today, and what the **new site** currently exposes. See [SEO-PARITY.md](../SEO-PARITY.md) for the analysis.

## Live Wix site (pulled 2026-08-13/14 from `www.santasknights.org`)

Frozen so we can prove at cutover that nothing was dropped.

| File | Contents |
| --- | --- |
| `sitemap.xml` | the Wix sitemap index — four children |
| `pages-sitemap.xml` | 13 hand-built pages |
| `booking-services-sitemap.xml` | 6 per-class `/service-page/*` booking pages |
| `group-lists-sitemap.xml` | 2 group discussion indexes |
| `group-posts-sitemap.xml` | **10,000** individual letter posts (Wix's per-sitemap cap — the real total may be higher) |
| `robots.txt` | the live robots.txt |
| `live-page-metadata.json` | title / description / canonical / og:image / h1 scraped from each of the 13 pages |

## New site

| File | Contents |
| --- | --- |
| `new-site-sitemap.xml` | output of `app/sitemap.ts`, captured from a production build |

**7 URLs vs the old site's ~10,021.** That gap is expected, not a bug — the 10k are Wix Groups forum posts and the rest are pages we either haven't built or have deliberately folded into others. What the sitemap must never do is list a URL that redirects, so these are all canonical 200s.

Deliberately excluded from the new sitemap: every redirect (`/letters`, `/account`, `/about`, `/sponsors`, `/get-involved`, `/training`), the auth-gated `/members`, and `/login` / `/signup` / `/admin/*`.

> ⚠️ `new-site-sitemap.xml` resolves against `SITE_URL`, currently the **apex** (`santasknights.org`) while the live canonical host is **www**. Settle that before cutover — SEO-PARITY.md §4.

## Refreshing

Wix side:

```sh
cd seo-baseline
for s in sitemap pages-sitemap booking-services-sitemap group-lists-sitemap group-posts-sitemap; do
  curl -sSL --max-time 180 --compressed -A "Mozilla/5.0" -o "$s.xml" "https://www.santasknights.org/$s.xml"
done
curl -sSL --compressed -A "Mozilla/5.0" -o robots.txt "https://www.santasknights.org/robots.txt"
```

`group-posts-sitemap.xml` is ~1.8 MB and slow to serve — give it a generous timeout.

New side:

```sh
npx next build && npx next start -p 3111 &
curl -sS http://localhost:3111/sitemap.xml -o seo-baseline/new-site-sitemap.xml
```
