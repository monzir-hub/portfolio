import { type CSSProperties, type ReactNode, createContext, useContext } from "react";
import s from "./visuals.module.css";

/** Figures share one coordinate space so every scene lines up in the same frame. */
export const VIEW = { w: 800, h: 620 };

type SceneProps = { on: boolean; children: ReactNode; label: string };

/** Whether the enclosing scene is the active one; inactive scenes don't run pulse animations. */
const SceneActive = createContext(true);

/** One state of a figure. Only the active scene is visible and exposed to assistive tech. */
export function Scene({ on, children, label }: SceneProps) {
  return (
    <SceneActive.Provider value={on}>
      <g className={s.scene} data-on={on} aria-hidden={!on}>
        <title>{label}</title>
        {children}
      </g>
    </SceneActive.Provider>
  );
}

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  tone?: "default" | "signal" | "ghost" | "solid";
  d?: number;
  rotate?: number;
  align?: "start" | "middle";
};

export function Box({ x, y, w, h, label, sub, tone = "default", d = 0, rotate = 0, align = "start" }: BoxProps) {
  const tx = align === "middle" ? x + w / 2 : x + 14;
  const style = { "--d": d, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, rotate: `${rotate}deg` } as CSSProperties;
  return (
    <g className={s.item} style={style}>
      <rect x={x} y={y} width={w} height={h} className={s[`box_${tone}`]} />
      {label && (
        <text x={tx} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} className={s.label} textAnchor={align}>
          {label}
        </text>
      )}
      {sub && (
        <text x={tx} y={y + h / 2 + 15} className={s.sub} textAnchor={align}>
          {sub}
        </text>
      )}
    </g>
  );
}

type WireProps = { d: string; delay?: number; tone?: "default" | "signal" | "dashed"; pulse?: boolean; dur?: number };

/** A connection that draws itself when its scene becomes active, optionally carrying a travelling pulse. */
export function Wire({ d, delay = 0, tone = "default", pulse = false, dur = 2.4 }: WireProps) {
  const active = useContext(SceneActive);
  return (
    <g>
      <path d={d} pathLength={1} className={`${s.wire} ${s[`wire_${tone}`]}`} style={{ "--d": delay } as CSSProperties} />
      {pulse && active && (
        <circle r={3.5} className={s.pulse}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} begin={`${delay * 0.08}s`} />
        </circle>
      )}
    </g>
  );
}

export function Text({
  x,
  y,
  children,
  kind = "sub",
  anchor = "start",
  d = 0,
}: {
  x: number;
  y: number;
  children: ReactNode;
  kind?: "label" | "sub" | "big" | "code" | "signal";
  anchor?: "start" | "middle" | "end";
  d?: number;
}) {
  return (
    <text x={x} y={y} className={`${s[kind]} ${s.item}`} textAnchor={anchor} style={{ "--d": d } as CSSProperties}>
      {children}
    </text>
  );
}

/** Elbow connector between two points: horizontal, vertical, horizontal. */
export const elbow = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} H${mx} V${y2} H${x2}`;
};

/** Elbow connector going vertical first. */
export const elbowV = (x1: number, y1: number, x2: number, y2: number) => {
  const my = (y1 + y2) / 2;
  return `M${x1} ${y1} V${my} H${x2} V${y2}`;
};
