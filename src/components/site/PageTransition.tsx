"use client";

import { motion } from "motion/react";
import { useEffect } from "react";

/**
 * Plays only on client-side navigation. The first load renders the page as-is
 * (nothing hidden behind JavaScript), which keeps first paint and LCP fast.
 */
let navigated = false;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const animate = navigated;
  useEffect(() => {
    navigated = true;
  }, []);

  if (!animate) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "var(--wine-deep)",
          transformOrigin: "top",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
