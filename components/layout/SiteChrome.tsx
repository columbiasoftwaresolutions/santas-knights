"use client";

import { usePathname } from "next/navigation";

const BARE_ROUTES = ["/login", "/signup"];

/** Hides the Navbar/Footer on standalone pages (currently /login, /signup). */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.includes(pathname)) return null;
  return <>{children}</>;
}
