import type { CSSProperties } from "react";
import { Scene, Text, VIEW, Wire } from "./primitives";
import s from "./visuals.module.css";

/**
 * Deterministic pseudo-random widths (integer LCG, rounded) so the server and
 * every browser produce bit-identical attributes and hydration never mismatches.
 */
const widths = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    let x = Math.imul(i + 1, 374761393) ^ Math.imul(seed + 7, 668265263);
    x = Math.imul(x ^ (x >>> 13), 1274126177);
    const r = ((x ^ (x >>> 16)) >>> 0) / 4294967296;
    return Math.round((0.55 + r * 0.45) * 1000) / 1000;
  });

function TextLines({ x, y, w, n, gap = 9, seed = 1, h = 3, d = 0 }: { x: number; y: number; w: number; n: number; gap?: number; seed?: number; h?: number; d?: number }) {
  return (
    <g className={s.item} style={{ "--d": d } as CSSProperties}>
      {widths(n, seed).map((f, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w * f} height={h} fill="var(--line-strong)" />
      ))}
    </g>
  );
}

function Page({ x, y, w, h, d = 0, children, rtl = false }: { x: number; y: number; w: number; h: number; d?: number; children?: React.ReactNode; rtl?: boolean }) {
  return (
    <g className={s.item} style={{ "--d": d } as CSSProperties} transform={rtl ? `translate(${2 * x + w} 0) scale(-1 1)` : undefined}>
      <rect x={x} y={y} width={w} height={h} fill="var(--paper)" />
      {children}
    </g>
  );
}

const ink = "var(--ink)";
const inkSoft = "rgba(11,11,10,0.18)";

/** A miniature designed page used across several scenes. */
function Layout({ x, y, w, variant, mirrored = false }: { x: number; y: number; w: number; variant: "split" | "stacked" | "spotlight"; mirrored?: boolean }) {
  const lines = (lx: number, ly: number, lw: number, n: number, seed: number) =>
    widths(n, seed).map((f, i) => <rect key={`${seed}-${i}`} x={lx} y={ly + i * 7} width={lw * f} height={2.5} fill={inkSoft} />);
  const p = 14;
  if (variant === "split")
    return (
      <g>
        <rect x={x + p} y={y + p} width={w / 2 - p} height={90} fill={ink} />
        <rect x={x + w / 2 + 8} y={y + p + 10} width={w / 2 - p - 8} height={10} fill={ink} />
        {lines(x + w / 2 + 8, y + p + 32, w / 2 - p - 8, 6, 3)}
        <rect x={x + p} y={y + 120} width={w - 2 * p} height={26} fill="var(--accent)" />
        {[0, 1, 2].map((c) => (
          <g key={c}>
            <rect x={x + p + c * ((w - 2 * p) / 3)} y={y + 162} width={(w - 2 * p) / 3 - 8} height={6} fill={ink} />
            {lines(x + p + c * ((w - 2 * p) / 3), y + 176, (w - 2 * p) / 3 - 8, 8, c + 5)}
          </g>
        ))}
      </g>
    );
  if (variant === "stacked")
    return (
      <g>
        <rect x={x + p} y={y + p + 6} width={w * 0.6} height={14} fill={ink} />
        <rect x={x + p} y={y + p + 26} width={w * 0.4} height={14} fill={ink} />
        {lines(x + p, y + p + 54, w - 2 * p, 4, 9)}
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {mirrored ? (
              <rect x={x + p} y={y + 108 + r * 48} width={14} height={10} fill="var(--accent)" />
            ) : (
              <text x={x + p} y={y + 118 + r * 48} fill="var(--accent)" style={{ font: "600 11px var(--font-mono)" }}>{`0${r + 1}`}</text>
            )}
            <rect x={x + p + 28} y={y + 110 + r * 48} width={w * 0.4} height={6} fill={ink} />
            {lines(x + p + 28, y + 122 + r * 48, w - 2 * p - 28, 3, r + 11)}
          </g>
        ))}
      </g>
    );
  return (
    <g>
      <rect x={x} y={y} width={w} height={110} fill={ink} />
      <rect x={x + w / 2 - w * 0.3} y={y + 44} width={w * 0.6} height={14} fill="var(--paper)" />
      <rect x={x + w / 2 - w * 0.18} y={y + 66} width={w * 0.36} height={5} fill="var(--accent)" />
      {[0, 1].map((c) => (
        <g key={c}>
          <rect x={x + p + c * (w / 2 - 4)} y={y + 128} width={w / 2 - p - 8} height={70} fill="none" stroke={inkSoft} />
          {lines(x + p + 8 + c * (w / 2 - 4), y + 140, w / 2 - p - 24, 7, c + 20)}
        </g>
      ))}
      {lines(x + p, y + 216, w - 2 * p, 5, 31)}
    </g>
  );
}

export function DocuVisual({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className={s.svg} role="img" aria-label="DocuAI Studio figure">
      {/* 0 — wall of text */}
      <Scene on={step === 0} label="Raw model output as an unstructured wall of text">
        <Text x={24} y={40}>raw model output</Text>
        <rect x={200} y={70} width={400} height={520} className={`${s.box_default} ${s.item}`} />
        <TextLines x={228} y={100} w={344} n={52} gap={9.2} seed={2} d={1} />
      </Scene>

      {/* 1 — template families */}
      <Scene on={step === 1} label="The same content in three template families">
        <Text x={24} y={40}>same content · three template families</Text>
        {(["split", "stacked", "spotlight"] as const).map((v, i) => (
          <g key={v}>
            <Page x={24 + i * 256} y={80} w={240} h={320} d={i * 1.5}>
              <Layout x={24 + i * 256} y={80} w={240} variant={v} />
            </Page>
            <Text x={24 + i * 256} y={430} kind="signal" d={i * 1.5 + 1}>{`heroLayout: "${v}"`}</Text>
          </g>
        ))}
        <Text x={24} y={500} kind="sub" d={6}>rhythm · ornament · bullets · labels · footer are all template properties</Text>
      </Scene>

      {/* 2 — pagination */}
      <Scene on={step === 2} label="Blocks paginate between pages rather than splitting">
        <Text x={24} y={40}>export.pdf · 12 mm margins</Text>
        {[0, 1, 2].map((pg) => {
          const x = 24 + pg * 256;
          return (
            <Page key={pg} x={x} y={80} w={240} h={330} d={pg}>
              {[0, 1, 2].map((b) => {
                const h = [70, 96, 60][(b + pg) % 3];
                const y = 100 + [0, 84, 196][b];
                return b === 2 && pg === 0 ? null : (
                  <g key={b}>
                    <rect x={x + 18} y={y} width={204} height={h} fill="none" stroke={b === 1 && pg === 1 ? "var(--accent)" : inkSoft} strokeWidth={b === 1 && pg === 1 ? 1.5 : 1} />
                    <rect x={x + 30} y={y + 12} width={90} height={6} fill={ink} />
                  </g>
                );
              })}
            </Page>
          );
        })}
        <Wire d="M150 380 C150 470, 380 470, 380 200" tone="signal" delay={4} pulse dur={2.6} />
        <Text x={24} y={500} kind="signal" d={5}>block would split → moved whole to the next page</Text>
        <Text x={24} y={524} kind="sub" d={6}>data-pdf-block marks the boundaries the exporter respects</Text>
      </Scene>

      {/* 3 — platforms and languages */}
      <Scene on={step === 3} label="The same app on web, Android and iOS in English and Arabic">
        <g className={s.item} style={{ "--d": 0 } as CSSProperties}>
          <rect x={24} y={80} width={480} height={330} className={s.box_default} />
          <rect x={24} y={80} width={480} height={26} fill="var(--ink-2)" stroke="var(--line-strong)" />
          <text x={40} y={98} className={s.sub}>web · EN · LTR</text>
        </g>
        <Page x={120} y={120} w={288} h={290} d={1}>
          <Layout x={120} y={120} w={288} variant="split" />
        </Page>
        {[0, 1].map((i) => {
          const x = 540 + i * 124;
          return (
            <g key={i}>
              <g className={s.item} style={{ "--d": 2 + i } as CSSProperties}>
                <rect x={x} y={120} width={112} height={230} rx={14} className={s.box_default} />
              </g>
              <Page x={x + 8} y={140} w={96} h={190} d={2 + i} rtl={i === 1}>
                <Layout x={x + 8} y={140} w={96} variant="stacked" mirrored={i === 1} />
              </Page>
              <Text x={x + 56} y={380} kind={i ? "signal" : "sub"} anchor="middle" d={3 + i}>
                {i ? "iOS · AR · RTL" : "Android · EN"}
              </Text>
            </g>
          );
        })}
        <Text x={24} y={470} kind="sub" d={5}>one React codebase · Capacitor native shells · mirrored for Arabic</Text>
      </Scene>
    </svg>
  );
}
