"use client";

import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import { Fragment, type ReactNode } from "react";

export const ease = [0.16, 1, 0.3, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades and rises into place the first time it scrolls into view. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type Segment = string | { text: string; className?: string };

/**
 * Splits a line into words that rise out of a mask one after another.
 * Screen readers get the plain sentence once; the animated words are hidden from them.
 */
export function Words({
  segments,
  className,
  delay = 0,
  stagger = 0.06,
  as = "span",
  animateOnMount = false,
  lang,
}: {
  segments: Segment[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "p";
  animateOnMount?: boolean;
  lang?: string;
}) {
  const reduced = useReducedMotion();
  const words = segments.flatMap((seg) => {
    const text = typeof seg === "string" ? seg : seg.text;
    const cls = typeof seg === "string" ? undefined : seg.className;
    return text.split(" ").filter(Boolean).map((w) => ({ w, cls }));
  });
  const label = words.map((x) => x.w).join(" ");
  // Each word is an inline-block, which bidi treats as a neutral object, so an Arabic
  // heading can't infer its own direction. Set it explicitly; alignment is inherited.
  const dir = /[؀-ۿ]/.test(label) ? "rtl" : undefined;

  // On mount (above the fold): pure CSS, so the text paints immediately without waiting for hydration.
  if (animateOnMount) {
    const Plain = as;
    return (
      <Plain className={className} lang={lang} dir={dir} aria-label={label} style={{ "--d": `${delay}s`, "--s": `${stagger}s` } as React.CSSProperties}>
        {words.map(({ w, cls }, i) => (
          <Fragment key={i}>
            <span aria-hidden="true" className="word-mask">
              <span className={"word-in" + (cls ? " " + cls : "")} style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </Plain>
    );
  }

  const Tag = motion[as];
  const trigger = { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <Tag className={className} dir={dir} aria-label={label} initial={reduced ? "show" : "hide"} {...trigger}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {words.map(({ w, cls }, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" style={{ display: "inline-block", overflow: "clip", overflowClipMargin: "0.2em", verticalAlign: "top", paddingBottom: "0.06em" }}>
            <motion.span
              className={cls}
              style={{ display: "inline-block" }}
              variants={{ hide: { y: "110%" }, show: { y: 0, transition: { duration: 1, ease } } }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

/** A staggered group: children marked with <Item> rise in sequence. */
export function Stagger({ children, className, stagger = 0.08, as = "div" }: { children: ReactNode; className?: string; stagger?: number; as?: "div" | "ul" | "ol" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

export function Item({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={{ hide: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}>
      {children}
    </Tag>
  );
}
