import type { Viewport } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { pageMeta } from "@/views/meta";
import { latinFonts } from "../fonts";
import "../globals.css";

export const metadata = { ...pageMeta("en", "/"), title: { default: "Almonzir Ali · Digital Solutions", template: "%s · Almonzir Ali" } };
export const viewport: Viewport = { themeColor: "#5c0f21" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={latinFonts}>
      <body>
        <SiteShell lang="en">{children}</SiteShell>
      </body>
    </html>
  );
}
