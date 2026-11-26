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
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: true,
          }),
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
