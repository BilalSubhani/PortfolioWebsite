'use client';

import { usePathname } from 'next/navigation';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';

// Scroll-linked border beams: as each [data-glow] card travels through the viewport,
// its highlight sweeps around the edge and brightens near the middle of the screen.
export default function GlowController() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('[data-glow]');
      if (prefersReducedMotion()) {
        gsap.set(els, { '--glow': 0.6, '--glow-angle': '135deg' });
        return;
      }
      els.forEach((el, i) => {
        const offset = (i % 4) * 90; // neighbouring cards start at different angles
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
          .fromTo(el, { '--glow-angle': `${offset}deg` }, { '--glow-angle': `${offset + 360}deg`, ease: 'none', duration: 1 }, 0)
          .fromTo(el, { '--glow': 0 }, { '--glow': 1, ease: 'power2.out', duration: 0.4 }, 0)
          .to(el, { '--glow': 0, ease: 'power2.in', duration: 0.35 }, 0.65);
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
