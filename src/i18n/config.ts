export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const dirOf = (lang: Locale) => (lang === "ar" ? "rtl" : "ltr");

/** English lives at the root; Arabic under /ar. */
export function localePath(lang: Locale, path: string) {
  const clean = path.startsWith("/") ? path : "/" + path;
  if (lang === "en") return clean;
  return clean === "/" ? "/ar" : "/ar" + clean;
}

/** The same page in the other language, preserving path and hash. */
export function switchPath(pathname: string, to: Locale) {
  const bare = pathname === "/ar" ? "/" : pathname.startsWith("/ar/") ? pathname.slice(3) : pathname;
  return localePath(to, bare);
}

export const localeFromPath = (pathname: string): Locale => (pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en");
