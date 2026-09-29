"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./Process.module.css";

/**
 * Idea → Deployment. A line draws across the steps as the section scrolls
 * through the viewport, and each step lights up as the line reaches it.
 */
export function Process() {
  const { t, c } = useLocale();
  const processSteps = c.processSteps;
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const [reached, setReached] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setReached(Math.min(processSteps.length - 1, Math.floor(p * processSteps.length + 0.15)));
  });

  return (
    <div className={styles.wrap}>
      <span className={styles.track} aria-hidden="true">
        <motion.span className={styles.fill} style={{ "--p": scrollYProgress } as never} />
      </span>
      <ol ref={ref} className={styles.steps} style={{ "--n": processSteps.length } as React.CSSProperties}>
      {processSteps.map((s, i) => (
        <li key={s.name} className={styles.step} data-reached={i <= reached}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className={styles.name + " serif"}>
            {s.name}
            {i < processSteps.length - 1 && (
              <span className={styles.arrow} aria-hidden="true">
                {t.arrow}
              </span>
            )}
          </h3>
          <p className={styles.line}>{s.line}</p>
          <p className={styles.detail}>{s.detail}</p>
          <p className={styles.output}>
            <span className="mono">{t.process.output}</span> {s.output}
          </p>
        </li>
      ))}
      </ol>
    </div>
  );
}
