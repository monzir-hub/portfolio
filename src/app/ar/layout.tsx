import type { Viewport } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import { pageMeta } from "@/views/meta";
import { latinFonts } from "../fonts";
import "../globals.css";

// Arabic faces load only on Arabic pages.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// Amiri plays the role of the Latin italic accent: a classical naskh for single emphasised words.
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

export const metadata = { ...pageMeta("ar", "/"), title: { default: "Almonzir Ali · حلول رقمية", template: "%s · Almonzir Ali" } };
export const viewport: Viewport = { themeColor: "#5c0f21" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="ltr" className={`${latinFonts} ${plexArabic.variable} ${amiri.variable}`}>
      <body>
        <SiteShell lang="ar">{children}</SiteShell>
      </body>
    </html>
  );
}
