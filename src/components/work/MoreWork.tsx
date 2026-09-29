"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Item, Stagger, ease } from "@/components/site/Reveal";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import type { CaseStudy } from "@/content/projects";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./MoreWork.module.css";

/** Engineering projects without public screens, each with its system figure on hover. */
export function MoreWork({ projects, startIndex }: { projects: CaseStudy[]; startIndex: number }) {
  const [active, setActive] = useState<string | null>(null);
  const { t, href } = useLocale();
  const current = projects.find((p) => p.id === active);

  return (
    <div className={styles.more} onPointerLeave={() => setActive(null)}>
      <Stagger as="ol" className={styles.list}>
        {projects.map((p, i) => (
          <Item as="li" key={p.id}>
            <Link
              href={href("/projects/" + p.id)}
              className={styles.row}
              data-active={active === p.id}
              data-dim={active !== null && active !== p.id}
              onPointerEnter={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
            >
              <span className={styles.num}>{String(startIndex + i + 1).padStart(2, "0")}</span>
              <span className={styles.title + " serif"}>{p.title}</span>
              <span className={styles.tagline}>{p.tagline}</span>
              <span className={styles.cat}>{p.category}</span>
              <span className={styles.arrow} aria-hidden="true">
                {t.arrow}
              </span>
            </Link>
          </Item>
        ))}
      </Stagger>

      <div className={styles.figure + " ink"} aria-hidden="true">
        <AnimatePresence mode="popLayout">
          {current?.visual && (
            <motion.div
              key={current.id}
              className={styles.figureInner}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, ease }}
            >
              <ProjectVisual kind={current.visual} step={1} />
            </motion.div>
          )}
        </AnimatePresence>
        {!current && <p className={styles.hint + " mono"}>{t.work.hoverHint}</p>}
      </div>
    </div>
  );
}
