"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type LayerId, ProductStack } from "@/components/hero/ProductStack";
import { Reveal, ease } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./Capabilities.module.css";

/** Which plane of the stack figure each capability layer lights up. */
const planeFor: Record<string, LayerId> = {
  interface: "interface",
  application: "api",
  data: "data",
  cloud: "cloud",
  delivery: "cloud",
};

const languages = ["TypeScript", "JavaScript", "Python", "Java", "C++", "SQL"];

export function Capabilities() {
  const { t, c } = useLocale();
  const layers = c.layers;
  const [open, setOpen] = useState(layers[0].id);

  return (
    <div className={styles.wrap}>
      <div className={styles.figure}>
        <Reveal className={styles.figureInner}>
          <ProductStack active={planeFor[open]} compact />
        </Reveal>
      </div>

      <div className={styles.list}>
        {layers.map((l, i) => {
          const isOpen = open === l.id;
          return (
            <div key={l.id} className={styles.layer} data-open={isOpen}>
              <button
                type="button"
                className={styles.head}
                aria-expanded={isOpen}
                aria-controls={"layer-" + l.id}
                onClick={() => setOpen(l.id)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(l.id)}
              >
                <span className={styles.num}>L{i + 1}</span>
                <span className={styles.name + " serif"}>{l.name}</span>
                <span className={styles.role}>{l.role}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={"layer-" + l.id}
                    className={styles.body}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <div className={styles.bodyInner}>
                      <ul className={styles.tech} aria-label={l.name + " · " + t.capabilities.tech}>
                        {l.tech.map((tech, k) => (
                          <motion.li
                            key={tech}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease, delay: 0.1 + k * 0.04 }}
                          >
                            {tech}
                          </motion.li>
                        ))}
                      </ul>
                      <p className={styles.used}>
                        <span className="mono muted">{t.capabilities.inCode}</span> {l.usedIn.join(" · ")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        <p className={styles.langs}>
          <span className="mono muted">{t.capabilities.languages}</span>
          {languages.join(" · ")}
        </p>
      </div>
    </div>
  );
}
