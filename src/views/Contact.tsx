import { BriefBuilder } from "@/components/contact/BriefBuilder";
import { LocalTime } from "@/components/LocalTime/LocalTime";
import { PageIntro } from "@/components/site/PageIntro";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMeta } from "./meta";
import styles from "./Contact.module.css";

export const contactMeta = (lang: Locale) => {
  const p = getDictionary(lang).pages.contact;
  return pageMeta(lang, "/contact", p.title, p.description);
};

export function ContactView({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const p = t.pages.contact;
  const { brand } = getContent(lang);
  return (
    <>
      <PageIntro index={p.marker} label={p.label} title={p.heading} lede={p.lede} />
      <section className={styles.section + " paper"} aria-label={p.title}>
        <div className={styles.grid + " wrap"}>
          <dl className={styles.methods}>
            <div>
              <dt className="mono muted">{t.contact.email}</dt>
              <dd>
                <a href={"mailto:" + brand.email} className="serif" dir="ltr">
                  {brand.email}
                </a>
              </dd>
            </div>
            {brand.links.map((l) => (
              <div key={l.label}>
                <dt className="mono muted">{l.label}</dt>
                <dd>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="serif">
                    <bdi>{l.handle}</bdi> ↗<span className="visually-hidden"> {t.newTab}</span>
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="mono muted">{t.contact.basedIn}</dt>
              <dd className="serif">
                {brand.location} · <LocalTime />
              </dd>
            </div>
          </dl>
          <div className={styles.builder}>
            <BriefBuilder />
          </div>
        </div>
      </section>
    </>
  );
}
