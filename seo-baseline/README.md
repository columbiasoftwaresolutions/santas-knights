# seo-baseline

A frozen snapshot of the **live Wix site's** search surface, pulled 2026-08-13/14 from `www.santasknights.org`. Kept so we can diff against it at cutover and prove nothing was dropped. See [SEO-PARITY.md](../SEO-PARITY.md) for the analysis.

| File | Contents |
| --- | --- |
| `sitemap.xml` | the Wix sitemap index — four children |
| `pages-sitemap.xml` | 13 hand-built pages |
| `booking-services-sitemap.xml` | 6 per-class `/service-page/*` booking pages |
| `group-lists-sitemap.xml` | 2 group discussion indexes |
| `group-posts-sitemap.xml` | **10,000** individual letter posts (Wix's per-sitemap cap — the real total may be higher) |
| `robots.txt` | the live robots.txt |
| `live-page-metadata.json` | title / description / canonical / og:image / h1 scraped from each of the 13 pages |

Refresh with:

```sh
cd seo-baseline
for s in sitemap pages-sitemap booking-services-sitemap group-lists-sitemap group-posts-sitemap; do
  curl -sSL --max-time 180 --compressed -A "Mozilla/5.0" -o "$s.xml" "https://www.santasknights.org/$s.xml"
done
curl -sSL --compressed -A "Mozilla/5.0" -o robots.txt "https://www.santasknights.org/robots.txt"
```

`group-posts-sitemap.xml` is ~1.8 MB and slow to serve — give it a generous timeout.
