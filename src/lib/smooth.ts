/**
 * Smooth scroll (Lenis), shared as a singleton.
 *
 * Everything animated on the site reads scroll from Lenis so motion stays
 * on a single easing curve - that is what makes scrolling feel like one
 * continuous animation instead of a page moving.
 */
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId = 0;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Idempotent. Returns null when the user prefers reduced motion. */
export function ensureSmooth(): Lenis | null {
  if (prefersReducedMotion()) return null;
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.95,
    // Touch keeps native scrolling; the scenes still read positions each frame.
  });

  const raf = (time: number) => {
    lenis!.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function getSmooth(): Lenis | null {
  return lenis;
}

export function destroySmooth(): void {
  if (rafId) cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
  rafId = 0;
}
