import { Capabilities } from "@/components/capabilities/Capabilities";
import { Approach } from "@/components/process/Approach";
import { FinalCta } from "@/components/site/FinalCta";
import { PageIntro } from "@/components/site/PageIntro";
import { Item, Stagger } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMeta } from "./meta";
import styles from "./About.module.css";

export const aboutMeta = (lang: Locale) => {
  const p = getDictionary(lang).pages.about;
  return pageMeta(lang, "/about", p.title, p.description);
};

export function AboutView({ lang }: { lang: Locale }) {
  const p = getDictionary(lang).pages.about;
  const { principles } = getContent(lang);
  return (
    <>
      <PageIntro index={p.marker} label={p.label} title={p.heading} lede={p.lede} />
      <section className="paper" style={{ paddingBlock: "clamp(40px, 6vh, 80px)" }} aria-label={p.label}>
        <div className="wrap">
          <Approach />
        </div>
      </section>
      <section className={styles.principles + " wine"} aria-label={p.rulesLabel}>
        <div className="wrap">
          <SectionHead index={p.rulesMarker} label={p.rulesLabel} title={p.rulesTitle} />
          <Stagger as="ol" className={styles.list}>
            {principles.map((pr, i) => (
              <Item as="li" key={pr.title} className={styles.item}>
                <span className={styles.num + " serif it"}>0{i + 1}</span>
                <h3 className="serif">{pr.title}</h3>
                <p className="muted">{pr.body}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="paper" style={{ paddingBlock: "clamp(96px, 14vh, 180px)" }} aria-label={p.stackLabel}>
        <div className="wrap">
          <SectionHead index={p.stackMarker} label={p.stackLabel} title={p.stackTitle} />
          <Capabilities />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
