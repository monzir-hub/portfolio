"use client";

import {
  AnimatePresence,
  type MotionValue,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";
import styles from "./ProductStack.module.css";

export const stackLayers = [
  { id: "interface", name: "Interface", tech: "Next.js · React · TypeScript" },
  { id: "api", name: "API", tech: "NestJS · Node.js · REST" },
  { id: "data", name: "Data", tech: "PostgreSQL · Prisma · Redis" },
  { id: "cloud", name: "Cloud", tech: "AWS · Docker · Kubernetes" },
] as const;

export type LayerId = (typeof stackLayers)[number]["id"];

const screens = [
  { src: "/work/shifa-home-900.webp", alt: "Shifa", url: "shifa · patient web" },
  { src: "/work/tee-home-900.webp", alt: "TEE", url: "tee-black.vercel.app" },
];

type Props = {
  /** 0 → 1 as the hero scrolls away; spreads the layers further apart. */
  progress?: MotionValue<number>;
  /** Pointer position in -1…1, already smoothed by the parent. */
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
  active?: LayerId | null;
  compact?: boolean;
};

/**
 * An exploded view of a digital product: the interface people see, floating above
 * the API, the data and the cloud it runs on. Pure CSS 3D driven by Motion values.
 */
export function ProductStack({ progress, pointerX, pointerY, active = null, compact = false }: Props) {
  const reduced = useReducedMotion();
  const fallback = useMotionValue(0);
  const p = progress ?? fallback;
  const px = pointerX ?? fallback;
  const py = pointerY ?? fallback;

  // Entrance: layers start stacked flat and separate with a spring.
  const open = useMotionValue(reduced ? 1 : 0);
  useEffect(() => {
    if (reduced) return;
    const controls = animate(open, 1, { type: "spring", stiffness: 60, damping: 14, delay: 0.5 });
    return () => controls.stop();
  }, [open, reduced]);

  const base = compact ? 46 : 74;
  const gap = useTransform([open, p], ([o, s]: number[]) => o * (base + s * base * 0.9));
  const rotateX = useTransform([py, p], ([y, s]: number[]) => 57 - y * 7 - s * 6);
  const rotateZ = useTransform([px, p], ([x, s]: number[]) => -38 + x * 8 + s * 12);
  const lift = useTransform(p, (s) => s * -40);

  // Alternate between real product screens a few times, then rest (no endless autoplay).
  const [screen, setScreen] = useState(0);
  const [cycles, setCycles] = useState(0);
  useEffect(() => {
    if (reduced || cycles >= 5) return;
    const id = window.setTimeout(() => {
      setScreen((s) => (s + 1) % screens.length);
      setCycles((c) => c + 1);
    }, 4200);
    return () => window.clearTimeout(id);
  }, [reduced, cycles]);

  return (
    <div className={styles.stage} data-compact={compact} dir="ltr">
      <motion.div className={styles.rig} style={{ rotateX, rotateZ, y: lift }}>
        {[...stackLayers].reverse().map((layer, i) => (
          <Plane key={layer.id} index={i} gap={gap} lifted={active === layer.id} dimmed={active !== null && active !== layer.id}>
            {layer.id === "cloud" && <Cloud />}
            {layer.id === "data" && <Data />}
            {layer.id === "api" && <Api />}
            {layer.id === "interface" && (
              <div className={styles.ui}>
                <div className={styles.uiBar}>
                  <i />
                  <i />
                  <i />
                  <span>{screens[screen].url}</span>
                </div>
                <div className={styles.uiScreen}>
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={screens[screen].src}
                      src={screens[screen].src}
                      alt=""
                      width={900}
                      height={562}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9 }}
                      fetchPriority="high"
                    />
                  </AnimatePresence>
                </div>
              </div>
            )}
          </Plane>
        ))}
      </motion.div>
    </div>
  );
}

function Plane({ index, gap, lifted, dimmed, children }: { index: number; gap: MotionValue<number>; lifted: boolean; dimmed: boolean; children: React.ReactNode }) {
  const extra = useSpring(0, { stiffness: 200, damping: 22 });
  useEffect(() => extra.set(lifted ? 46 : 0), [lifted, extra]);
  const z = useTransform([gap, extra], ([g, e]: number[]) => index * g + e);
  return (
    <motion.div className={styles.plane} style={{ z }} data-lifted={lifted} data-dimmed={dimmed}>
      {children}
    </motion.div>
  );
}

function Cloud() {
  return (
    <div className={styles.cloud}>
      <span className={styles.tag}>k8s cluster · helm</span>
      <div className={styles.nodes}>
        {Array.from({ length: 6 }, (_, n) => (
          <div key={n} className={styles.node}>
            {Array.from({ length: n % 3 === 0 ? 4 : 3 }, (_, k) => (
              <i key={k} style={{ animationDelay: `${(n * 3 + k) * 0.35}s` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Data() {
  const rows = ["appointments", "prescriptions", "payments", "deliveries", "audit_logs"];
  return (
    <div className={styles.data}>
      <span className={styles.tag}>postgresql · prisma</span>
      <div className={styles.table}>
        {rows.map((r, i) => (
          <div key={r} className={styles.row}>
            <span>{r}</span>
            <b style={{ width: `${40 + ((i * 23) % 50)}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Api() {
  const lines = [
    ["GET", "/v1/doctors", "200"],
    ["POST", "/v1/appointments", "201"],
    ["PATCH", "/v1/deliveries/:id", "200"],
    ["GET", "/v1/products?q=serum", "200"],
    ["POST", "/v1/files/upload-url", "201"],
  ];
  return (
    <div className={styles.api}>
      <span className={styles.tag}>nestjs · rest</span>
      {lines.map(([m, path, code]) => (
        <div key={path} className={styles.line}>
          <b>{m}</b>
          <span>{path}</span>
          <i>{code}</i>
        </div>
      ))}
    </div>
  );
}
