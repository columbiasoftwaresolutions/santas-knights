/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  /**
   * Host canonicalisation: the naked apex 308s to `www`, which is the canonical
   * host (decided 2026-08-16 — see SITE_URL in content/site.ts). The two are
   * different hostnames to a crawler, so serving both would be a duplicate site
   * competing with itself.
   *
   * Permanent is right here even though the old→new *path* redirects are
   * deliberately temporary until cutover (SEO-PARITY.md §4/§6). Those must not
   * be cached while Wix is still authoritative; this one cannot fire at all
   * until the apex's DNS points at this deployment, and the moment it does,
   * permanent is the correct and expected answer for apex→www.
   *
   * Vercel can also do this at the edge if both domains are added with `www`
   * set as primary. Keeping it in code means it survives a platform change and
   * is reviewable in the repo; if the edge handles it first, this never fires.
   * The exact-host condition means preview deploys and localhost are untouched.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "santasknights.org" }],
        destination: "https://www.santasknights.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
