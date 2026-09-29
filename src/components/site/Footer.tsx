import Link from "next/link";
import { LocalTime } from "@/components/LocalTime/LocalTime";
import { getContent } from "@/content";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import styles from "./Footer.module.css";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const { brand } = getContent(lang);
  const [first, ...rest] = brand.name.split(" ");
  const links = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className={styles.footer + " ink"}>
      <div className="wrap">
        <div className={styles.top}>
          <p className={styles.mark + " serif"}>
            <span lang="en">
              {first} <span className="it accent">{rest.join(" ")}</span>
            </span>
            <span className={styles.desc}>{brand.descriptor}</span>
          </p>
          <nav aria-label={t.footer.site} className={styles.col}>
            <p className="mono muted">{t.footer.site}</p>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={localePath(lang, l.href)}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.col}>
            <p className="mono muted">{t.footer.connect}</p>
            <ul>
              <li>
                <a href={"mailto:" + brand.email}>{t.footer.email}</a>
              </li>
              {brand.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <span aria-hidden="true">↗</span>
                    <span className="visually-hidden"> {t.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.bottom + " mono"}>
          <span>
            © 2026 {brand.name}
          </span>
          <span dir="ltr">{t.footer.colophon}</span>
          <span>
            {brand.location} · <LocalTime />
          </span>
        </div>
      </div>
    </footer>
  );
}
