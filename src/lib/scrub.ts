/**
 * Scroll-scrub helper for pinned scenes.
 *
 * A scene = a tall section with a sticky 100vh stage inside. This maps the
 * section's traversal to a 0..1 progress each frame (cheap: only while the
 * section is near the viewport). Works natively with Lenis since Lenis drives
 * real window scrolling.
 */
export function scrub(section: HTMLElement, cb: (p: number) => void): () => void {
  let raf = 0;
  let lastP = -1;
  const loop = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom > -vh && rect.top < vh * 2) {
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      if (p !== lastP) {
        lastP = p;
        cb(p);
      }
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Progress remapped to a [a,b] window with smoothstep easing. */
export const window01 = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
