"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/site/Magnetic";
import { Words, ease } from "@/components/site/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { type LayerId, ProductStack, stackLayers } from "./ProductStack";
import styles from "./Hero.module.css";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<LayerId | null>(null);
  const { t, c, href, lang } = useLocale();
  const [first, ...rest] = c.brand.name.split(" ");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  return (
    <section ref={ref} className={styles.hero + " wine"} onPointerMove={onMove} aria-label={`${c.brand.name}, ${c.brand.descriptor}`}>
      <div className={styles.inner + " wrap"}>
        <div className={styles.meta + " enter-soft"}>
          <span>
            {t.hero.portfolio}
          </span>
          <span className={styles.metaRule} aria-hidden="true" />
          <span>
            {c.brand.location} · {t.hero.available}
          </span>
        </div>

        <motion.div className={styles.copy} style={{ y: copyY, opacity: copyOpacity }}>
          <Words
            as="h1"
            animateOnMount
            delay={0.05}
            stagger={0.08}
            className={styles.name}
            lang="en"
            segments={[{ text: first, className: "it" }, { text: rest.join(" "), className: "it ali" }]}
          />
          <p className={styles.descriptor + " enter-soft"} style={{ "--delay": "0.3s" } as React.CSSProperties}>
            <span>{c.brand.descriptor}</span>
          </p>

          <Words
            as="p"
            animateOnMount
            delay={0.4}
            stagger={0.04}
            className={styles.message}
            segments={t.hero.message}
          />

          <p className={styles.lede + " enter-soft"} style={{ "--delay": "0.55s" } as React.CSSProperties}>
            {t.hero.lede}
          </p>

          <div className={styles.actions + " enter"} style={{ "--delay": "0.7s" } as React.CSSProperties}>
            <Magnetic>
              <Link href={href("/contact")} className={styles.primary}>
                {t.nav.cta} <span aria-hidden="true">{t.arrow}</span>
              </Link>
            </Magnetic>
            <Link href={href("/projects")} className={styles.secondary + " link-line"}>
              {t.hero.work}
            </Link>
          </div>
        </motion.div>

        <div className={styles.visual}>
          <ProductStack progress={scrollYProgress} pointerX={px} pointerY={py} active={active} />
          <motion.ol
            className={styles.legend}
            aria-label={t.hero.legend}
            initial="hide"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.9 } } }}
          >
            {stackLayers.map((l, i) => (
              <motion.li key={l.id} variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}>
                <button
                  type="button"
                  className={styles.legendItem}
                  data-active={active === l.id}
                  aria-pressed={active === l.id}
                  onClick={() => setActive((a) => (a === l.id ? null : l.id))}
                  onPointerEnter={() => setActive(l.id)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(l.id)}
                  onBlur={() => setActive(null)}
                  aria-label={`${t.hero.layers[l.id]} ${t.hero.layer}: ${l.tech}`}
                >
                  <span className="mono">0{i + 1}</span>
                  <span className={styles.legendName}>{t.hero.layers[l.id]}</span>
                  <span className={styles.legendTech}>{l.tech}</span>
                </button>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        <ul className={styles.services + " enter"} aria-label={t.nav.services} style={{ "--delay": "0.9s" } as React.CSSProperties}>
          {c.services.map((s, i) => (
            <li key={s.id}>
              <Link href={href("/services") + "#" + s.id}>
                <span className="mono">0{i + 1}</span> {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
