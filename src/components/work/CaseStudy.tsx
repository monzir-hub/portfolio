"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import { Reveal, Words, ease } from "@/components/site/Reveal";
import type { CaseStudy as Project, Chapter } from "@/content/projects";
import { useLocale } from "@/i18n/LocaleProvider";
import { ProjectVisual } from "./ProjectVisual";
import styles from "./CaseStudy.module.css";

const isPhone = (src: string) => src.includes("-m-");

export function CaseStudy({ project, index, total }: { project: Project; index: number; total: number }) {
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const chapterRefs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStep(Number((e.target as HTMLElement).dataset.step))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    chapterRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const number = String(index + 1).padStart(2, "0");

  return (
    <article className={styles.study} aria-labelledby="case-title">
      <div className={styles.top + " wine"}>
      <header className={styles.head + " wrap"}>
        <p className="marker">
          <b>§ {t.work.project} {number}</b> {t.work.of} {String(total).padStart(2, "0")} · {project.category}
        </p>
        <Words as="h1" animateOnMount className={styles.title + " serif"} segments={[project.title]} />
        <span id="case-title" className="visually-hidden">
          {project.title}
        </span>
        <div className={styles.intro}>
          <Reveal className={styles.summary}>{project.summary}</Reveal>
          <Reveal className={styles.meta} delay={0.1}>
            <dl>
              <div>
                <dt className="mono muted">{t.work.role}</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt className="mono muted">{t.work.year}</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt className="mono muted">{t.work.services}</dt>
                <dd>{project.services.join(", ")}</dd>
              </div>
            </dl>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.live}>
                {t.work.visitLive} {t.arrow} <span className="visually-hidden">{t.newTab}</span>
              </a>
            )}
          </Reveal>
        </div>
        <ul className={styles.facts}>
          {project.facts.map((f, i) => (
            <Reveal key={f.label} delay={0.08 * i} className={styles.fact}>
              <span className={styles.factValue + " serif"}>{f.value}</span>
              <span className="mono muted">{f.label}</span>
            </Reveal>
          ))}
        </ul>
      </header>

      {project.cover && <Cover project={project} />}
      </div>

      <div className={styles.body + " wrap"}>
        <div className={styles.figureCol}>
          <div className={styles.figure}>
            <p className={styles.figBar + " mono"}>
              <span>
                {t.work.fig} {number}.{step + 1}
              </span>
              <span className={styles.figLabel}>{project.chapters[step].label}</span>
              <span className={styles.dots} aria-hidden="true">
                {project.chapters.map((_, i) => (
                  <i key={i} data-on={i === step} />
                ))}
              </span>
            </p>
            <div className={styles.canvas}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={step}
                  className={styles.canvasInner}
                  initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 12% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.7, ease }}
                >
                  <Figure project={project} chapter={project.chapters[step]} step={step} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <ol className={styles.chapters}>
          {project.chapters.map((c, i) => (
            <li
              key={c.label}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              data-step={i}
              data-active={i === step}
              className={styles.chapter}
            >
              <p className={styles.chapterLabel}>
                <span className="mono accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="mono">{c.label}</span>
              </p>
              <h2 className={styles.chapterHeading + " serif"}>{c.heading}</h2>
              <p className={styles.chapterBody}>{c.body}</p>
              {c.tags && (
                <ul className={styles.tags} aria-label={t.work.technologies}>
                  {c.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              {/* Narrow screens: each chapter carries its own figure. */}
              <div className={styles.inlineFigure}>
                <Figure project={project} chapter={c} step={i} />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <footer className={styles.foot + " wrap"}>
        <div>
          <p className="mono muted">{t.work.stack}</p>
          <ul className={styles.stack}>
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        {project.note && (
          <div>
            <p className="mono muted">{t.work.status}</p>
            <p className={styles.note}>{project.note}</p>
          </div>
        )}
      </footer>
    </article>
  );
}

/** The hero screen of a case study: it opens from an inset frame to full width as it scrolls in. */
function Cover({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.45], reduced ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(8% 10% 8% 10%)", "inset(0% 0% 0% 0%)"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.12, 1]);
  const cover = project.cover!;
  return (
    <div ref={ref} className={styles.cover + " wrap"}>
      <motion.div className={styles.coverClip} style={{ clipPath: clip }}>
        <BrowserFrame url={project.live?.replace("https://", "") ?? project.id}>
          <motion.img
            src={cover.src}
            srcSet={cover.small ? `${cover.small} 900w, ${cover.src} 1600w` : undefined}
            sizes="(max-width: 900px) 100vw, 90vw"
            alt={cover.alt}
            width={1600}
            height={1000}
            fetchPriority="high"
            style={{ scale: imgScale }}
          />
        </BrowserFrame>
      </motion.div>
    </div>
  );
}

function Figure({ project, chapter, step }: { project: Project; chapter: Chapter; step: number }) {
  if (chapter.shot) {
    if (isPhone(chapter.shot.src))
      return (
        <div className={styles.phoneStage}>
          <PhoneFrame className={styles.phone}>
            <img src={chapter.shot.src} alt={chapter.shot.alt} width={600} height={1298} loading="lazy" decoding="async" />
          </PhoneFrame>
        </div>
      );
    return (
      <BrowserFrame url={project.live?.replace("https://", "") ?? project.id}>
        <img
          src={chapter.shot.src}
          srcSet={chapter.shot.small ? `${chapter.shot.small} 900w, ${chapter.shot.src} 1600w` : undefined}
          sizes="(max-width: 900px) 100vw, 55vw"
          alt={chapter.shot.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      </BrowserFrame>
    );
  }
  if (project.visual)
    return (
      <div className={styles.svgStage + " ink"}>
        <ProjectVisual kind={project.visual} step={step} />
      </div>
    );
  return null;
}
