"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Item, Stagger, ease } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePreview } from "./ServicePreview";
import styles from "./ServiceIndex.module.css";

/**
 * An editorial index of services. Hovering or focusing a row makes it the
 * active one: its name turns italic and the preview panel wipes to its artefact.
 */
export function ServiceIndex() {
  const [active, setActive] = useState(0);
  const { t, c, href, lang } = useLocale();
  const services = c.services;
  const current = services[active];

  return (
    <div className={styles.index}>
      <Stagger as="ol" className={styles.list} stagger={0.06}>
        {services.map((s, i) => (
          <Item as="li" key={s.id} className={styles.item}>
            <button
              type="button"
              className={styles.row}
              data-active={i === active}
              aria-expanded={i === active}
              aria-controls={"service-detail-" + s.id}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{s.name}</span>
              <span className={styles.tag}>{s.tagline}</span>
              <motion.span className={styles.bar} initial={false} animate={{ scaleX: i === active ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
            </button>

            {/* Narrow screens: the detail opens under its own row. */}
            <AnimatePresence initial={false}>
              {i === active && (
                <motion.div
                  id={"service-detail-" + s.id}
                  className={styles.inline}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <div className={styles.inlineInner}>
                    <p>{s.summary}</p>
                    <ServicePreview preview={s.preview} lang={lang} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Item>
        ))}
      </Stagger>

      <div className={styles.panel} aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            className={styles.panelInner}
            initial={{ clipPath: "inset(0 0 100% 0)", y: 20 }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, ease }}
          >
            <ServicePreview preview={current.preview} lang={lang} />
            <p className={styles.summary}>{current.summary}</p>
            <ul className={styles.deliverables}>
              {current.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <Link href={href("/services") + "#" + current.id} className={styles.more + " link-line"}>
              {t.services.moreOn} {current.name}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
