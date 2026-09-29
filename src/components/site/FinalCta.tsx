"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Magnetic } from "./Magnetic";
import { Reveal, Words } from "./Reveal";
import styles from "./FinalCta.module.css";

/** The closing statement on every page. */
export function FinalCta({ showButton = true }: { showButton?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t, c, href, lang } = useLocale();
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["18%", "-18%"]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.brand.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = "mailto:" + c.brand.email;
    }
  };

  return (
    <section ref={ref} className={styles.cta + " wine"} aria-label={t.cta.label}>
      <motion.span className={styles.mark + " it"} style={{ y: markY }} aria-hidden="true">
        {lang === "ar" ? "؟" : "?"}
      </motion.span>
      <div className={styles.inner + " wrap"}>
        <p className="marker">
          <b>§ {t.cta.marker}</b> {t.cta.label}
        </p>
        <Words as="h2" className={styles.title + " serif"} segments={t.cta.title} />
        <p className={styles.sign}>
          {t.cta.sign} <span className="it" lang="en">— {c.brand.name}</span>
        </p>
        <Reveal className={styles.row} delay={0.3}>
          {showButton && (
            <Magnetic strength={0.35}>
              <Link href={href("/contact")} className={styles.button}>
                {t.nav.cta} <span aria-hidden="true">{t.arrow}</span>
              </Link>
            </Magnetic>
          )}
          <div className={styles.contact}>
            <a href={"mailto:" + c.brand.email} className={styles.email + " link-line"} dir="ltr">
              {c.brand.email}
            </a>
            <button type="button" onClick={copy} className="mono" aria-live="polite">
              {copied ? t.cta.copied : t.cta.copy}
            </button>
          </div>
          <ul className={styles.links}>
            {c.brand.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} ↗<span className="visually-hidden"> {t.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
