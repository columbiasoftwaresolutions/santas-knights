import type { Metadata } from "next";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Santa's Knights · Free martial arts, fitness & community in Harlem",
  description:
    "Santa's Knights is a 501(c)(3) nonprofit bringing free martial arts, fitness, and community to Harlem and beyond. Home of Gladiators NYC and the Letters to Santa gift drive.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${fraunces.variable}`}>
      <body>
        <UtilityBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
