import Link from "next/link";
import { Capabilities } from "@/components/capabilities/Capabilities";
import { Hero } from "@/components/hero/Hero";
import { Process } from "@/components/process/Process";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { FinalCta } from "@/components/site/FinalCta";
import { SectionHead } from "@/components/site/SectionHead";
import { FeaturedProject } from "@/components/work/FeaturedProject";
import { MoreWork } from "@/components/work/MoreWork";
import { getContent } from "@/content";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import styles from "./Home.module.css";

export function HomeView({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const h = t.home;
  const { caseStudies } = getContent(lang);
  const featured = caseStudies.filter((p) => p.featured && p.scroll);
  const more = caseStudies.filter((p) => !p.featured);

  return (
    <>
      <Hero />

      <section className={styles.section + " paper"} aria-label={h.services.label}>
        <div className="wrap">
          <SectionHead index="01" label={h.services.label} title={h.services.title} aside={<p>{h.services.aside}</p>} />
          <ServiceIndex />
        </div>
      </section>

      <section className={styles.projects + " wine"} aria-label={h.projects.label}>
        <div className="wrap">
          <SectionHead index="02" label={h.projects.label} title={h.projects.title} aside={<p>{h.projects.aside}</p>} />
        </div>
        {featured.map((p, i) => (
          <FeaturedProject key={p.id} project={p} index={i} />
        ))}
        <div className={styles.more + " wrap"}>
          <p className="marker">
            <b>§ 02.b</b> {h.systems}
          </p>
          <MoreWork projects={more} startIndex={featured.length} />
          <Link href={localePath(lang, "/projects")} className={styles.all + " link-line"}>
            {h.all} {t.arrow}
          </Link>
        </div>
      </section>

      <section className={styles.section + " paper " + styles.rule} aria-label={h.capabilities.label}>
        <div className="wrap">
          <SectionHead index="03" label={h.capabilities.label} title={h.capabilities.title} aside={<p>{h.capabilities.aside}</p>} />
          <Capabilities />
        </div>
      </section>

      <section className={styles.section + " paper " + styles.rule} aria-label={h.process.label}>
        <div className="wrap">
          <SectionHead index="04" label={h.process.label} title={h.process.title} />
          <Process />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
