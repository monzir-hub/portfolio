"use client";

import { createContext, useContext } from "react";
import { getContent } from "@/content";
import { type Locale, dirOf, localePath } from "./config";
import { getDictionary } from "./dictionary";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
}

/** Everything a client component needs to render in the current language. */
export function useLocale() {
  const lang = useContext(LocaleContext);
  return {
    lang,
    dir: dirOf(lang),
    t: getDictionary(lang),
    c: getContent(lang),
    href: (path: string) => localePath(lang, path),
  };
}
