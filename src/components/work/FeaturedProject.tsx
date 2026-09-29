"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import { ease } from "@/components/site/Reveal";
import type { CaseStudy } from "@/content/projects";
import { useLocale } from "@/i18n/LocaleProvider";
import { useMediaQuery } from "@/lib/hooks";
import styles from "./FeaturedProject.module.css";

const FRAME_RATIO = 10.1 / 16; // visible page height / width inside the frame (frame is 16:10.8 minus its bar)

/**
 * A pinned chapter for one project. While it is pinned, scrolling drives the real
 * site scrolling inside the browser frame, and the phone drifts at its own pace.
 */
export function FeaturedProject({ project, index }: { project: CaseStudy; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t, href } = useLocale();
  // Pinned on wide screens; on narrow screens the frame scrolls as the section passes through.
  const pinned = useMediaQuery("(min-width: 1001px)", true);
  const { scrollYProgress } = useScroll({ target: ref, offset: pinned ? ["start start", "end end"] : ["start end", "end start"] });

  const scroll = project.scroll!;
  const travel = Math.max(0, 1 - FRAME_RATIO / ((scroll.height ?? 3000) / (scroll.width ?? 1100)));
  // Pinned: travel the whole page. Unpinned (narrow screens): a gentler pass through the top of the site.
  const pageY = useTransform(
    scrollYProgress,
    pinned ? [0.08, 0.92] : [0.35, 0.95],
    ["0%", `${-(pinned ? travel : travel * 0.3) * 100}%`],
  );
  const phoneY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -80]);
  const frameScale = useTransform(scrollYProgress, [0, 0.12], reduced ? [1, 1] : [0.94, 1]);
  const number = String(index + 1).padStart(2, "0");
  const url = project.live ? project.live.replace("https://", "") : `${project.id} · ${t.work.localBuild}`;

  return (
    <section ref={ref} className={styles.chapter} aria-labelledby={project.id + "-feature"}>
      <div className={styles.sticky + " wrap"}>
        <motion.div
          className={styles.text}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1, ease }}
        >
          <p className={styles.meta}>
            <span className={styles.num}>{number}</span>
            <span>{project.category}</span>
            <span>{project.year}</span>
          </p>
          <h3 id={project.id + "-feature"} className={styles.title + " serif"}>
            {project.title}
          </h3>
          <p className={styles.tagline}>{project.tagline}</p>
          <p className={styles.built}>
            <span className="mono accent">{t.work.whatIBuilt}</span>
            {project.chapters[1]?.body}
          </p>
          <ul className={styles.stack} aria-label={t.work.builtWith}>
            {project.stack.slice(0, 7).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className={styles.links}>
            <Link href={href("/projects/" + project.id)} className={styles.case}>
              {t.work.readCase} <span aria-hidden="true">{t.arrow}</span>
            </Link>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.live + " link-line"}>
                {t.work.visitLive} {t.arrow}
                <span className="visually-hidden"> {t.newTab}</span>
              </a>
            )}
          </div>
        </motion.div>

        <motion.div className={styles.visual} style={{ scale: frameScale }}>
          <BrowserFrame url={url} className={styles.browser}>
            <motion.img
              src={scroll.src}
              alt={scroll.alt}
              width={scroll.width}
              height={scroll.height}
              loading="lazy"
              decoding="async"
              style={{ y: pageY }}
            />
          </BrowserFrame>
          {project.phone && (
            <motion.div className={styles.phone} style={{ y: phoneY }}>
              <PhoneFrame>
                <img src={project.phone.src} alt={project.phone.alt} width={600} height={1298} loading="lazy" decoding="async" />
              </PhoneFrame>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
