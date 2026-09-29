import type { Metadata } from "next";
import { getContent } from "@/content";
import { type Locale, localePath } from "@/i18n/config";

/** Localised title/description plus hreflang alternates between the two versions of a page. */
export function pageMeta(lang: Locale, path: string, title?: string, description?: string): Metadata {
  const { brand } = getContent(lang);
  return {
    title: title ?? { absolute: `${brand.name} · ${brand.descriptor}` },
    description: description ?? brand.promise,
    alternates: {
      languages: { en: localePath("en", path), ar: localePath("ar", path), "x-default": localePath("en", path) },
    },
    openGraph: {
      title: title ? `${title} · ${brand.name}` : `${brand.name} · ${brand.descriptor}`,
      description: description ?? brand.promise,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}
