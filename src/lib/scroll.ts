'use client';

import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

export function scrollToId(id: string) {
  const el = id === 'top' ? document.body : document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(id === 'top' ? 0 : el, { offset: -88, duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
  else el.scrollIntoView({ behavior: 'smooth' });
  return true;
}
