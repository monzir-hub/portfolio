"use client";

import { MotionConfig } from "motion/react";

/**
 * One place for motion defaults. `reducedMotion="user"` makes every Motion
 * transform animation respect prefers-reduced-motion automatically.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
