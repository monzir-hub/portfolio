"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { type Locale, switchPath } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./LanguageSwitch.module.css";

const options: { lang: Locale; label: string; name: string }[] = [
  { lang: "en", label: "EN", name: "English" },
  { lang: "ar", label: "عربي", name: "العربية" },
];

/**
 * EN | عربي. Each option links to the same page in that language; the indicator
 * slides to the active one. Switching languages is a full navigation because
 * each language has its own document (lang and dir on <html>).
 */
export function LanguageSwitch({ id = "lang" }: { id?: string }) {
  const pathname = usePathname();
  const { lang, t } = useLocale();

  return (
    <nav aria-label={t.nav.language} className={styles.switch} dir="ltr">
      {options.map((o) => {
        const active = o.lang === lang;
        return (
          <a
            key={o.lang}
            href={switchPath(pathname, o.lang)}
            hrefLang={o.lang}
            lang={o.lang}
            aria-current={active ? "true" : undefined}
            aria-label={o.name}
            className={styles.option}
            data-active={active}
          >
            {active && <motion.span layoutId={id + "-indicator"} className={styles.indicator} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className={styles.label}>{o.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
