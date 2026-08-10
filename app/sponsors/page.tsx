import { redirect } from "next/navigation";

/**
 * Sponsors was folded into /santas-knights: the sponsor wall, the ways a
 * business can help, and the press strip are now sections of the About page,
 * anchored at #sponsors. This route stays for old links and bookmarks.
 *
 * Not `permanentRedirect`: the beta is still `noindex` and the public Wix site
 * has a live /sponsors page, so nothing should cache a 308 before cutover
 * (ROLLOUT.md).
 */
export default function SponsorsPage() {
  redirect("/santas-knights#sponsors");
}
