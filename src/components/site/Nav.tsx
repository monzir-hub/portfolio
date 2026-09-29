"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { LanguageSwitch } from "./LanguageSwitch";
import { Magnetic } from "./Magnetic";
import { ease } from "./Reveal";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();
  const { t, c, href } = useLocale();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  const links = [
    { href: href("/projects"), label: t.nav.projects },
    { href: href("/services"), label: t.nav.services },
    { href: href("/about"), label: t.nav.about },
    { href: href("/contact"), label: t.nav.contact },
  ];
  const [first, ...rest] = c.brand.name.split(" ");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCondensed(y > 24);
    if (Math.abs(y - prev) > 4) setHidden(y > prev && y > 400);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const button = toggle.current;
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const active = (h: string) => pathname === h || pathname.startsWith(h + "/");
  const indicator = hovered ?? links.find((l) => active(l.href))?.href ?? null;

  return (
    <>
      <motion.header
        className={styles.bar}
        data-condensed={condensed && !open}
        data-open={open}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <Link href={href("/")} className={styles.brand} aria-label={c.brand.name + ", " + t.nav.home}>
          <span className={styles.name + " serif"} lang="en">
            {first} <span className="it">{rest.join(" ")}</span>
          </span>
          <span className={styles.desc}>/ {c.brand.descriptor}</span>
        </Link>

        <div className={styles.right}>
          <nav aria-label={t.nav.primary} className={styles.links} onPointerLeave={() => setHovered(null)}>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={styles.link}
                    aria-current={active(l.href) ? "page" : undefined}
                    onPointerEnter={() => setHovered(l.href)}
                    onFocus={() => setHovered(l.href)}
                    onBlur={() => setHovered(null)}
                  >
                    {indicator === l.href && (
                      <motion.span layoutId="nav-indicator" className={styles.indicator} transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                    )}
                    <span className={styles.linkText}>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitch id="lang-bar" />
          <span className={styles.ctaWrap}>
            <Magnetic strength={0.25}>
              <Link href={href("/contact")} className={styles.cta}>
                {t.nav.cta} <span aria-hidden="true">{t.arrow}</span>
              </Link>
            </Magnetic>
          </span>
          <button
            ref={toggle}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.menuLabel}>{open ? t.nav.close : t.nav.menu}</span>
            <span className={styles.burger} data-open={open} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className={styles.sheet + " wine"}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label={t.nav.primary}>
              <motion.ol initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}>
                {[{ href: href("/"), label: t.nav.home }, ...links].map((l, i) => (
                  <motion.li key={l.href} variants={{ hide: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}>
                    <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                      <span className="mono">0{i + 1}</span>
                      <span className="serif">{l.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ol>
            </nav>
            <div className={styles.sheetFoot}>
              <LanguageSwitch id="lang-sheet" />
              <Link href={href("/contact")} className={styles.sheetCta}>
                {t.nav.cta} {t.arrow}
              </Link>
              <a href={"mailto:" + c.brand.email} className="muted" dir="ltr">
                {c.brand.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
