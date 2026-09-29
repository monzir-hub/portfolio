/**
 * A single shared requestAnimationFrame loop.
 * Subscribers receive the frame delta in seconds. The loop only runs while
 * someone is subscribed, so an idle page costs nothing.
 */
type Tick = (dt: number, now: number) => void;

const subscribers = new Set<Tick>();
let frame = 0;
let last = 0;

function loop(now: number) {
  const dt = Math.min((now - last) / 1000, 1 / 20);
  last = now;
  subscribers.forEach((fn) => fn(dt, now));
  frame = subscribers.size ? requestAnimationFrame(loop) : 0;
}

export function subscribeFrame(fn: Tick) {
  subscribers.add(fn);
  if (!frame) {
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(fn);
  };
}
