import { notFound } from "next/navigation";
import { FinalCta } from "@/components/site/FinalCta";
import { PageIntro } from "@/components/site/PageIntro";
import { SystemTrace } from "@/components/SystemTrace/SystemTrace";
import { CaseStudy } from "@/components/work/CaseStudy";
import { NextProject } from "@/components/work/NextProject";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMeta } from "./meta";

export const projectsMeta = (lang: Locale) => {
  const p = getDictionary(lang).pages.projects;
  return pageMeta(lang, "/projects", p.title, p.description);
};

export function ProjectsView({ lang }: { lang: Locale }) {
  const p = getDictionary(lang).pages.projects;
  return (
    <>
      <PageIntro index={p.marker} label={p.label} title={p.heading} lede={p.lede} />
      <section className="paper" style={{ paddingBlock: "clamp(40px, 6vh, 72px) clamp(96px, 14vh, 180px)" }} aria-label={p.title}>
        <div className="wrap">
          <ProjectIndex />
        </div>
      </section>
      <FinalCta />
    </>
  );
}

export const projectSlugs = () => getContent("en").caseStudies.map((p) => ({ slug: p.id }));

export function projectMeta(lang: Locale, slug: string) {
  const p = getContent(lang).caseStudies.find((c) => c.id === slug);
  return p ? pageMeta(lang, "/projects/" + slug, p.title, p.summary) : {};
}

export function ProjectView({ lang, slug }: { lang: Locale; slug: string }) {
  const { caseStudies } = getContent(lang);
  const index = caseStudies.findIndex((p) => p.id === slug);
  if (index === -1) notFound();
  const project = caseStudies[index];
  return (
    <>
      <CaseStudy project={project} index={index} total={caseStudies.length} />
      {project.id === "shifa" && <SystemTrace />}
      <NextProject project={caseStudies[(index + 1) % caseStudies.length]} lang={lang} />
      <FinalCta />
    </>
  );
}
