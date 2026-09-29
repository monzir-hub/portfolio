import { Process } from "@/components/process/Process";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { FinalCta } from "@/components/site/FinalCta";
import { PageIntro } from "@/components/site/PageIntro";
import { SectionHead } from "@/components/site/SectionHead";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMeta } from "./meta";

export const servicesMeta = (lang: Locale) => {
  const p = getDictionary(lang).pages.services;
  return pageMeta(lang, "/services", p.title, p.description);
};

export function ServicesView({ lang }: { lang: Locale }) {
  const p = getDictionary(lang).pages.services;
  return (
    <>
      <PageIntro index={p.marker} label={p.label} title={p.heading} lede={p.lede} />
      <section className="paper" aria-label={p.title}>
        <div className="wrap">
          <ServiceDetail lang={lang} />
        </div>
      </section>
      <section className="paper" style={{ paddingBlock: "clamp(96px, 14vh, 180px)" }} aria-label={p.howLabel}>
        <div className="wrap">
          <SectionHead index={p.howMarker} label={p.howLabel} title={p.howTitle} />
          <Process />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
