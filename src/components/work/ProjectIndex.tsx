"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Item, Stagger, ease } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { ProjectVisual } from "./ProjectVisual";
import styles from "./ProjectIndex.module.css";

/**
 * Every project as a large editorial row. On pointer devices a preview window
 * follows the cursor with a spring, leaning into the direction of travel.
 */
export function ProjectIndex() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { t, c, href } = useLocale();
  const caseStudies = c.caseStudies;
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });
  const velocity = useTransform(sx, (v) => v);
  const rotate = useSpring(useTransform(velocity, (v) => (reduced ? 0 : Math.max(-6, Math.min(6, (x.get() - v) * 0.04)))), { stiffness: 120, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    x.set(e.clientX);
    y.set(e.clientY);
  };

  const current = hovered !== null ? caseStudies[hovered] : null;

  return (
    <div className={styles.index} onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
      <Stagger as="ol" className={styles.list} stagger={0.07}>
        {caseStudies.map((p, i) => (
          <Item as="li" key={p.id}>
            <Link
              href={href("/projects/" + p.id)}
              className={styles.row}
              data-dim={hovered !== null && hovered !== i}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.title + " serif"}>{p.title}</span>
              <span className={styles.tagline}>{p.tagline}</span>
              <span className={styles.meta}>
                <span>{p.category}</span>
                <span>{p.year}</span>
                {p.live && <span className={styles.liveTag}>● {t.work.live}</span>}
              </span>
              <span className={styles.arrow} aria-hidden="true">
                {t.arrow}
              </span>
            </Link>
          </Item>
        ))}
      </Stagger>

      <motion.div className={styles.floater} style={{ x: sx, y: sy, rotate }} aria-hidden="true">
        <AnimatePresence>
          {current && (
            <motion.div
              key={current.id}
              className={styles.preview}
              initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(50% 50% 50% 50%)", transition: { duration: 0.3 } }}
              transition={{ duration: 0.55, ease }}
            >
              {current.cover ? (
                <img src={current.cover.small ?? current.cover.src} alt="" width={900} height={562} />
              ) : (
                current.visual && (
                  <div className={styles.svg + " ink"}>
                    <ProjectVisual kind={current.visual} step={1} />
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
