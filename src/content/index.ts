import type { Locale } from "@/i18n/config";
import { brandAr, layersAr, principlesAr, processAr, projectNamesAr, projectsAr, servicesAr, systemAr } from "./ar";
import { brand as brandEn, nav as navEn } from "./brand";
import { type CaseStudy, caseStudies as projectsEn } from "./projects";
import { type Layer, type Service, layers as layersEn, principles as principlesEn, processSteps as processEn, services as servicesEn } from "./services";
import { type Scenario, type SystemNode, nodes as nodesEn, scenarios as scenariosEn } from "./system";

export type Content = ReturnType<typeof build>;

function build(lang: Locale) {
  if (lang === "en") {
    return {
      brand: brandEn,
      nav: navEn,
      services: servicesEn,
      layers: layersEn,
      processSteps: processEn,
      principles: principlesEn,
      caseStudies: projectsEn,
      nodes: nodesEn,
      scenarios: scenariosEn,
    };
  }

  const services: Service[] = servicesEn.map((s) => {
    const t = servicesAr[s.id];
    return {
      ...s,
      name: t.name,
      tagline: t.tagline,
      summary: t.summary,
      deliverables: t.deliverables,
      stack: t.stack ?? s.stack,
      proof: s.proof && t.proof ? { ...s.proof, label: t.proof } : s.proof,
    };
  });

  const layers: Layer[] = layersEn.map((l) => ({
    ...l,
    ...layersAr[l.id],
    usedIn: l.usedIn.map((p) => projectNamesAr[p] ?? p),
  }));

  const caseStudies: CaseStudy[] = projectsEn.map((p) => {
    const t = projectsAr[p.id];
    return {
      ...p,
      title: t.title ?? p.title,
      category: t.category,
      role: t.role,
      tagline: t.tagline,
      summary: t.summary,
      note: t.note ?? p.note,
      services: t.services,
      cover: t.cover ?? p.cover,
      facts: p.facts.map((f, i) => ({ ...f, label: t.facts[i] ?? f.label })),
      chapters: p.chapters.map((c, i) => ({ ...c, ...t.chapters[i] })),
    };
  });

  const nodes: SystemNode[] = nodesEn.map((n) => ({ ...n, ...systemAr.nodes[n.id] }));
  const scenarios: Scenario[] = scenariosEn.map((s) => {
    const t = systemAr.scenarios[s.id];
    return { ...s, title: t.title, steps: s.steps.map((st, i) => (st.note ? { ...st, note: t.notes[i] ?? st.note } : st)) };
  });

  return {
    brand: { ...brandEn, ...brandAr },
    nav: navEn,
    services,
    layers,
    processSteps: processEn.map((s, i) => ({ ...s, ...processAr[i] })),
    principles: principlesAr,
    caseStudies,
    nodes,
    scenarios,
  };
}

const cache: Partial<Record<Locale, Content>> = {};
export const getContent = (lang: Locale): Content => (cache[lang] ??= build(lang));
