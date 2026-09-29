import Link from "next/link";
import type { CaseStudy } from "@/content/projects";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import styles from "./NextProject.module.css";

export function NextProject({ project, lang }: { project: CaseStudy; lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section className={styles.next + " paper"} aria-label={t.work.next}>
      <Link href={localePath(lang, "/projects/" + project.id)} className={styles.link + " wrap"}>
        <span className="marker">
          <b>§ {t.work.next}</b> {t.work.project}
        </span>
        <span className={styles.title + " serif"}>
          {project.title} <span className={styles.arrow} aria-hidden="true">{t.arrow}</span>
        </span>
        <span className={styles.tagline}>{project.tagline}</span>
      </Link>
    </section>
  );
}
