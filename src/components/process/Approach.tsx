"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ease } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./Approach.module.css";

/**
 * About page: the five stages as long-form chapters. A giant sticky numeral
 * and stage name change as each chapter reaches the middle of the screen.
 */
export function Approach() {
  const { t, c } = useLocale();
  const processSteps = c.processSteps;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.approach}>
      <div className={styles.aside} aria-hidden="true">
        <div className={styles.sticky}>
          <div className={styles.numeral}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={active}
                className="serif it"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                0{active + 1}
              </motion.span>
            </AnimatePresence>
          </div>
          <ol className={styles.rail}>
            {processSteps.map((s, i) => (
              <li key={s.name} data-on={i === active} data-done={i < active}>
                {s.name}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={styles.chapters}>
        {processSteps.map((s, i) => (
          <section
            key={s.name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className={styles.chapter}
            data-active={i === active}
            aria-labelledby={"stage-" + i}
          >
            <p className="mono accent">
              {t.process.stage} {i + 1} {t.process.of} {processSteps.length}
            </p>
            <h2 id={"stage-" + i} className={styles.name + " serif"}>
              {s.name}
            </h2>
            <p className={styles.line}>{s.line}</p>
            <p className={styles.detail}>{s.detail}</p>
            <p className={styles.output}>
              <span className="mono muted">{t.process.leaveWith}</span>
              <span className="serif it">{s.output}</span>
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
