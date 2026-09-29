import type { Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { Footer } from "./Footer";
import { MotionProvider } from "./MotionProvider";
import { Nav } from "./Nav";

/** The shared body of every page, in either language. */
export function SiteShell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    <>
      <noscript>
        <style>{`[style*="opacity"],[style*="transform"],[style*="clip-path"]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
      </noscript>
      <a className="skip-link" href="#main">
        {lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <LocaleProvider lang={lang}>
        <MotionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer lang={lang} />
        </MotionProvider>
      </LocaleProvider>
    </>
  );
}
