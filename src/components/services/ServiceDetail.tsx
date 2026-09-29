import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { getContent } from "@/content";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { ServicePreview } from "./ServicePreview";
import styles from "./ServiceDetail.module.css";

/** Services page: each service as its own editorial spread. */
export function ServiceDetail({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const { services } = getContent(lang);
  return (
    <div className={styles.list}>
      {services.map((s, i) => (
        <article key={s.id} id={s.id} className={styles.service} data-flip={i % 2 === 1} aria-labelledby={s.id + "-name"}>
          <div className={styles.text}>
            <p className={styles.num + " serif it"}>{String(i + 1).padStart(2, "0")}</p>
            <Reveal>
              <h2 id={s.id + "-name"} className={styles.name + " serif"}>
                {s.name}
              </h2>
              <p className={styles.tagline + " mono accent"}>{s.tagline}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={styles.summary}>{s.summary}</p>
            </Reveal>
            <Reveal delay={0.2} className={styles.cols}>
              <div>
                <h3 className="mono muted">{t.services.includes}</h3>
                <ul className={styles.deliverables}>
                  {s.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mono muted">{t.services.builtWith}</h3>
                <ul className={styles.stack}>
                  {s.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            {s.proof && (
              <Link href={localePath(lang, s.proof.href)} className={styles.proof + " link-line"}>
                {s.proof.label} {t.arrow}
              </Link>
            )}
          </div>
          <Reveal className={styles.visual} y={40}>
            <ServicePreview preview={s.preview} lang={lang} />
          </Reveal>
        </article>
      ))}
    </div>
  );
}
