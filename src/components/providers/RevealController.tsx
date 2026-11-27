'use client';

import { usePathname } from 'next/navigation';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';

const FROM: Record<string, gsap.TweenVars> = {
  up: { y: 40 },
  fade: {},
  left: { x: -40 },
  right: { x: 40 },
  scale: { scale: 0.94, y: 20 },
};

const SHOW: gsap.TweenVars = { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true };

// One controller animates every [data-reveal] element on the page with ScrollTrigger.batch,
// so server components can opt into motion with a single attribute.
export default function RevealController() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (prefersReducedMotion()) {
        gsap.set(els, { autoAlpha: 1 });
        return;
      }
      els.forEach((el) => gsap.set(el, { autoAlpha: 0, ...FROM[el.dataset.reveal || 'up'] }));
      const pending = new Set(els);
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((el) => pending.delete(el as HTMLElement));
          gsap.to(batch, SHOW);
        },
      });

      // Content above can change height after the triggers were measured (role copy, the
      // Stack Map, fonts…). Re-measure when the page height settles.
      let t: ReturnType<typeof setTimeout> | undefined;
      let lastH = document.documentElement.scrollHeight;
      const ro = new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => {
          const h = document.documentElement.scrollHeight;
          if (Math.abs(h - lastH) > 2) {
            lastH = h;
            ScrollTrigger.refresh();
          }
        }, 150);
      });
      ro.observe(document.body);

      // Safety net: whenever scrolling stops, reveal anything on screen that is still hidden.
      const sweep = () => {
        const vh = window.innerHeight;
        const late = [...pending].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top < vh * 0.92 && r.bottom > 0;
        });
        if (!late.length) return;
        late.forEach((el) => pending.delete(el));
        gsap.to(late, SHOW);
      };
      ScrollTrigger.addEventListener('scrollEnd', sweep);
      const first = setTimeout(sweep, 1200);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        ro.disconnect();
        clearTimeout(t);
        clearTimeout(first);
        ScrollTrigger.removeEventListener('scrollEnd', sweep);
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
