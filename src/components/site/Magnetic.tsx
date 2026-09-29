"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

/**
 * Pulls its child toward the pointer on hover and springs back on leave.
 * The label inside travels a little further, which gives it a sense of depth.
 */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const ix = useTransform(sx, (v) => v * 0.45);
  const iy = useTransform(sy, (v) => v * 0.45);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} className={className} style={{ display: "inline-block", x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.span style={{ display: "inline-block", x: ix, y: iy }}>{children}</motion.span>
    </motion.span>
  );
}
