import { type NodeId, edges } from "@/content/system";

export type Point = { x: number; y: number };
export type Positions = Record<NodeId, Point>;

export const edgeKey = (a: NodeId, b: NodeId) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/** Orthogonal connector between two node centres; the long axis goes first. */
export function edgePoints(a: Point, b: Point): Point[] {
  if (a.x === b.x || a.y === b.y) return [a, b];
  if (Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)) {
    const mx = (a.x + b.x) / 2;
    return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
  }
  const my = (a.y + b.y) / 2;
  return [a, { x: a.x, y: my }, { x: b.x, y: my }, b];
}

export const toPath = (pts: Point[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

const adjacency = new Map<NodeId, NodeId[]>();
for (const [a, b] of edges) {
  adjacency.set(a, [...(adjacency.get(a) ?? []), b]);
  adjacency.set(b, [...(adjacency.get(b) ?? []), a]);
}

/** Shortest hop route between two nodes (BFS over the undirected graph). */
export function route(from: NodeId, to: NodeId): NodeId[] {
  if (from === to) return [from];
  const prev = new Map<NodeId, NodeId>();
  const queue: NodeId[] = [from];
  const seen = new Set<NodeId>([from]);
  while (queue.length) {
    const n = queue.shift()!;
    for (const m of adjacency.get(n) ?? []) {
      if (seen.has(m)) continue;
      seen.add(m);
      prev.set(m, n);
      if (m === to) {
        const path: NodeId[] = [to];
        let c = to;
        while (prev.has(c)) path.unshift((c = prev.get(c)!));
        return path;
      }
      queue.push(m);
    }
  }
  return [from, to];
}

/** Geometry for travelling a node route, following the drawn connectors exactly. */
export function routePoints(nodesOnRoute: NodeId[], pos: Positions): Point[] {
  const pts: Point[] = [pos[nodesOnRoute[0]]];
  for (let i = 1; i < nodesOnRoute.length; i++) {
    const a = nodesOnRoute[i - 1];
    const b = nodesOnRoute[i];
    // Connectors are defined in canonical order; reverse when travelling backwards.
    const canonical = edges.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
    const forward = !canonical || canonical[0] === a;
    const seg = forward ? edgePoints(pos[a], pos[b]) : edgePoints(pos[b], pos[a]).reverse();
    pts.push(...seg.slice(1));
  }
  return pts;
}

export function polylineLength(pts: Point[]) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return len;
}

export function pointAt(pts: Point[], dist: number): Point {
  let remaining = dist;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (remaining <= seg) {
      const t = seg ? remaining / seg : 0;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    remaining -= seg;
  }
  return pts[pts.length - 1];
}
