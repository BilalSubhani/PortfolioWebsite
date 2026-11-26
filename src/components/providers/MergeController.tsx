'use client';

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';

// Scroll-driven "sheet" transitions between homepage sections. As the next section
// rises into view it slides over the current one, which sinks back (lags, scales
// down and dims). Transform/opacity only, scrubbed to scroll — no pinning, so it
// works at every viewport size. Each section is stacked above the previous one.
export default function MergeController({ selector = '[data-merge-stack] > section' }: { selector?: string }) {
  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(selector);
    sections.forEach((s, i) => (s.style.zIndex = String(i + 1)));
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add({ isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' }, (ctx) => {
      const { isMobile } = ctx.conditions as { isMobile: boolean };
      const shades: HTMLElement[] = [];

      sections.forEach((section, i) => {
        const next = sections[i + 1];
        if (!next) return;

        // Dimming overlay, injected once per section.
        const shade = document.createElement('div');
        shade.dataset.mergeShade = '';
        shade.setAttribute('aria-hidden', 'true');
        section.appendChild(shade);
        shades.push(shade);

        gsap
          .timeline({
            // Ease-in: the section stays put (and undimmed) while it's being read, and only
            // sinks once the next sheet has covered most of the screen.
            defaults: { ease: 'power3.in' },
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true },
          })
          .fromTo(
            section,
            { y: 0 },
            {
              // Lag behind the scroll so the next section visibly covers this one.
              y: () => Math.min(section.offsetHeight, window.innerHeight) * (isMobile ? 0.25 : 0.4),
              force3D: true,
            },
            0,
          )
          .fromTo(shade, { opacity: 0 }, { opacity: 0.65 }, 0);
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => shades.forEach((s) => s.remove());
    });
    return () => mm.revert();
  });

  return null;
}
