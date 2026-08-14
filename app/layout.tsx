import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Cormorant, Archivo } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { getCurrentUser } from "@/lib/auth";
import { organizationSchema } from "@/content/site";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Archivo is the uppercase display face for the poster system.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Santa's Knights · A Harlem nonprofit & the Santa's Letters program",
  description:
    "Santa's Knights is a Harlem 501(c)(3) nonprofit. We answer kids' letters to Santa every December and teach free martial arts and fitness all year. Founded by Damion DiGrazia.",
  // Beta stays out of search until the coordinated public cutover (ROLLOUT.md).
  // Flip to index/follow only as part of the cutover checklist.
  robots: { index: false, follow: false },
};

/**
 * Stated rather than inherited from the framework default, so the two things
 * that matter on a phone are visible here: the page scales to the device, and
 * pinch-zoom is never capped (`maximumScale` is deliberately absent — capping
 * it locks out anyone who needs to zoom to read).
 *
 * `themeColor` is the nav's ink, so a phone browser's chrome matches the top of
 * the page instead of flashing white above it.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16120f",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve auth once for the header: signed-out shows "Log In", signed-in shows
  // "Dashboard" pointing at the right place for the user's role.
  const user = await getCurrentUser();
  const auth = {
    signedIn: user !== null,
    dashboardHref: user?.role === "admin" ? "/admin" : "/members",
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      // The pre-paint reveal script adds `reveal-on` to <html> before hydration,
      // so its className intentionally differs from the server render.
      suppressHydrationWarning
      className={`${hanken.variable} ${cormorant.variable} ${archivo.variable}`}
    >
      <body>
        {/* Arm scroll-reveal before first paint, so [data-reveal] elements start
            hidden only when we can actually animate them in. Skipped for
            reduced-motion; never runs without JS → content stays visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('reveal-on');}}catch(e){}})();",
          }}
        />
        <JsonLd data={organizationSchema} />
        <SiteChrome>
          <Navbar auth={auth} />
        </SiteChrome>
        <main>{children}</main>
        <SiteChrome>
          <Footer />
        </SiteChrome>
        <Reveal />
      </body>
    </html>
  );
}
