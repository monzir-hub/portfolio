"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal, Words } from "@/components/site/Reveal";
import { type NodeId, edges, layouts } from "@/content/system";
import { useLocale } from "@/i18n/LocaleProvider";
import { subscribeFrame } from "@/lib/frameLoop";
import { useInView, useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { easeInOutCubic } from "@/lib/motion";
import { edgeKey, edgePoints, pointAt, polylineLength, route, routePoints, toPath } from "./graph";
import styles from "./SystemTrace.module.css";

const SPEED = 520; // viewBox units per second
const DWELL = 0.75; // seconds a packet pauses at each hop

type Segment = { pts: ReturnType<typeof routePoints>; travel: number; hops: NodeId[] };

export function SystemTrace() {
  const { t: dict, c } = useLocale();
  const t = dict.trace;
  const { nodes, scenarios } = c;
  const tall = useMediaQuery("(max-width: 800px)");
  const reduced = useReducedMotion();
  const layout = layouts[tall ? "tall" : "wide"];
  const pos = layout.pos;
  const nodeW = tall ? 138 : 150;
  const nodeH = tall ? 52 : 58;

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { rootMargin: "0px 0px -35% 0px" });
  const packetRef = useRef<SVGGElement>(null);

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [runToken, setRunToken] = useState(0);
  const [inspect, setInspect] = useState<NodeId | null>(null);
  const [running, setRunning] = useState(false);

  const scenario = scenarios[scenarioIndex];

  const segments: Segment[] = useMemo(
    () =>
      scenario.steps.map((s, i) => {
        const hops = i === 0 ? [s.at] : route(scenario.steps[i - 1].at, s.at);
        const pts = routePoints(hops, pos);
        return { pts, travel: Math.max(0.3, polylineLength(pts) / SPEED), hops };
      }),
    [scenario, pos],
  );

  // Edges the trace has already travelled light up and stay lit.
  const hotEdges = useMemo(() => {
    const set = new Set<string>();
    segments.slice(0, stepIdx + 1).forEach(({ hops }) => {
      for (let i = 1; i < hops.length; i++) set.add(edgeKey(hops[i - 1], hops[i]));
    });
    return set;
  }, [segments, stepIdx]);

  const visited = useMemo(() => new Set(segments.slice(0, stepIdx + 1).flatMap((s) => s.hops)), [segments, stepIdx]);
  const current = stepIdx >= 0 ? scenario.steps[stepIdx].at : null;

  // Playback engine: one rAF subscription per run, React state only changes at hop boundaries.
  useEffect(() => {
    if (!inView || runToken === 0) return;
    const packet = packetRef.current;
    if (reduced || !packet) {
      setStepIdx(scenario.steps.length - 1);
      setRunning(false);
      return;
    }
    setStepIdx(-1);
    setRunning(true);
    const bounds: number[] = [];
    let acc = 0;
    segments.forEach((s, i) => {
      acc += (i === 0 ? 0 : s.travel) + DWELL;
      bounds.push(acc);
    });

    let t = 0;
    let lastIdx = -1;
    const unsubscribe = subscribeFrame((dt) => {
      t += dt;
      let i = bounds.findIndex((b) => t < b);
      if (i === -1) i = segments.length;
      if (i >= segments.length) {
        packet.style.opacity = "0";
        setStepIdx(segments.length - 1);
        setRunning(false);
        unsubscribe();
        return;
      }
      const seg = segments[i];
      const start = i === 0 ? 0 : bounds[i - 1];
      const travel = i === 0 ? 0 : seg.travel;
      const local = t - start;
      const len = polylineLength(seg.pts);
      const p = travel > 0 && local < travel ? pointAt(seg.pts, len * easeInOutCubic(local / travel)) : seg.pts[seg.pts.length - 1];
      packet.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      packet.style.opacity = "1";
      const arrived = local >= travel;
      const idx = arrived ? i : i - 1;
      if (idx !== lastIdx) {
        lastIdx = idx;
        setStepIdx(idx);
      }
    });
    return () => {
      unsubscribe();
      packet.style.opacity = "0";
    };
    // segments already depends on the scenario and layout.
  }, [runToken, inView, segments, reduced, scenario.steps.length]);

  // Start the first scenario automatically the first time the section is seen.
  useEffect(() => {
    if (inView && runToken === 0) setRunToken(1);
  }, [inView, runToken]);

  const play = useCallback((i: number) => {
    setScenarioIndex(i);
    setInspect(null);
    setRunToken((n) => n + 1);
  }, []);

  const focusNode = inspect ?? current;
  const focus = nodes.find((n) => n.id === focusNode);

  return (
    <section ref={sectionRef} id="system" className={styles.section + " ink"} aria-labelledby="system-title">
      <div className="wrap">
      <div className={styles.head}>
        <p className="marker">
          <b>§ {t.marker}</b> {t.label}
        </p>
        <Words as="h2" className={styles.title + " serif"} segments={t.title} />
        <span id="system-title" className="visually-hidden">{t.title.map((s) => (typeof s === "string" ? s : s.text)).join(" ")}</span>
        <Reveal className={styles.lede} delay={0.2}>
          {t.lede}
        </Reveal>
      </div>

      <div className={styles.stage}>
        <div className={styles.diagramWrap} dir="ltr">
          <svg
            viewBox={`0 0 ${layout.w} ${layout.h}`}
            className={styles.diagram}
            role="group"
            aria-label={t.diagram}
          >
            {!tall && (
              <g aria-hidden="true">
                <line x1={0} x2={layout.w} y1={440} y2={440} className={styles.divider} />
                <text x={0} y={30} className={styles.band}>
                  {t.requestPath}
                </text>
                <text x={0} y={466} className={styles.band}>
                  {t.delivery}
                </text>
              </g>
            )}

            <g aria-hidden="true">
              {edges.map(([a, b]) => {
                const hot = hotEdges.has(edgeKey(a, b));
                return (
                  <path
                    key={edgeKey(a, b)}
                    d={toPath(edgePoints(pos[a], pos[b]))}
                    className={`${styles.edge} ${hot ? styles.edgeHot : ""}`}
                  />
                );
              })}
            </g>

            <g ref={packetRef} className={styles.packet} style={{ opacity: 0 }} aria-hidden="true">
              <circle r={14} className={styles.packetHalo} />
              <circle r={5} className={styles.packetCore} />
            </g>

            {nodes.map((n) => {
              const p = pos[n.id];
              const state = n.id === current ? "current" : visited.has(n.id) ? "visited" : "idle";
              return (
                <g
                  key={n.id}
                  className={styles.node}
                  data-state={state}
                  data-inspect={inspect === n.id}
                  transform={`translate(${p.x - nodeW / 2} ${p.y - nodeH / 2})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label}: ${n.tech}`}
                  aria-pressed={inspect === n.id}
                  onPointerEnter={() => setInspect(n.id)}
                  onPointerLeave={() => setInspect(null)}
                  onFocus={() => setInspect(n.id)}
                  onBlur={() => setInspect(null)}
                  onClick={() => setInspect(n.id)}
                >
                  <rect width={nodeW} height={nodeH} className={styles.nodeRect} />
                  <text x={12} y={nodeH / 2 - 4} className={styles.nodeLabel}>
                    {n.label}
                  </text>
                  <text x={12} y={nodeH / 2 + 13} className={styles.nodeTech}>
                    {n.tech}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className={styles.panel} aria-label={t.console}>
          <div className={styles.scenarios} role="group" aria-label={t.scenarios}>
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                className={styles.scenario}
                aria-pressed={i === scenarioIndex}
                onClick={() => play(i)}
              >
                <span className="mono">0{i + 1}</span>
                {s.title}
                {i === scenarioIndex && (
                  <span className={`${styles.replay} mono`} aria-hidden="true">
                    {running ? t.running : t.replay}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className={styles.console} dir="ltr">
            <p className={`${styles.verb} mono`}>
              <span className={styles.prompt}>$</span> trace {scenario.verb}
            </p>
            <ol className={styles.log} aria-live="polite">
              {scenario.steps.slice(0, stepIdx + 1).map((s, i) => {
                const node = nodes.find((n) => n.id === s.at)!;
                return (
                  <li key={`${runToken}-${i}`} className={styles.logLine} data-current={i === stepIdx && running}>
                    <span className={styles.logNode}>{node.label.toLowerCase()}</span>
                    <span>{s.log}</span>
                    {s.note && <em className={styles.logNote}>{s.note}</em>}
                  </li>
                );
              })}
              {running && <li className={styles.cursor} aria-hidden="true" />}
            </ol>
          </div>

          <div className={styles.inspector} aria-live="polite">
            {focus ? (
              <>
                <p className="mono">
                  <span className={styles.prompt}>●</span> {focus.label} · {focus.tech}
                </p>
                <p className={styles.role}>{focus.role}</p>
              </>
            ) : (
              <p className="mono mute">{t.hint}</p>
            )}
          </div>
        </aside>
      </div>
      </div>
    </section>
  );
}
