'use client';

import { useRef } from 'react';
import { profile } from '@/content/profile';
import { gsap, useGSAP } from '@/lib/gsap';

// First visit per session only (decided by the inline head script), skippable,
// and never shown with reduced motion or without JavaScript.
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains('preload')) return;
      const done = () => {
        html.classList.remove('preload');
        try {
          sessionStorage.setItem('bs-preloaded', '1');
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event('preloader:done'));
      };

      const counter = { v: 0 };
      const num = root.current!.querySelector<HTMLElement>('[data-count]')!;
      const tl = gsap.timeline({ onComplete: done });
      tl.from('[data-initial]', { yPercent: 120, stagger: 0.08, duration: 0.7, ease: 'power4.out' })
        .from('[data-phrase]', { autoAlpha: 0, y: 12, duration: 0.5 }, '-=0.3')
        .to('[data-bar]', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, '<')
        .to(counter, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => void (num.textContent = String(Math.round(counter.v)).padStart(3, '0')) }, '<')
        .to('[data-initial], [data-phrase], [data-meta]', { yPercent: -120, autoAlpha: 0, stagger: 0.04, duration: 0.45, ease: 'power3.in' }, '+=0.15')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' }, '-=0.15');

      const skip = () => tl.progress(1);
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && skip();
      root.current!.addEventListener('click', skip);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] cursor-pointer flex-col items-center justify-center bg-bg"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      role="status"
      aria-label="Loading portfolio — click or press Escape to skip"
    >
      <div className="flex overflow-hidden font-display text-[clamp(4rem,14vw,9rem)] leading-none font-semibold" aria-hidden="true">
        {profile.initials.split('').map((c, i) => (
          <span key={i} data-initial className="inline-block">
            {c}
          </span>
        ))}
        <span data-initial className="inline-block text-accent">
          .
        </span>
      </div>
      <p data-phrase className="mt-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">
        Building digital experiences
      </p>
      <div data-meta className="mt-10 flex w-[min(280px,70vw)] items-center gap-4">
        <div className="h-px flex-1 bg-line">
          <div data-bar className="h-px origin-left scale-x-0 bg-accent" />
        </div>
        <span data-count className="font-mono text-xs text-muted tabular-nums">
          000
        </span>
      </div>
      <p data-meta className="absolute bottom-8 font-mono text-[11px] text-muted/70">
        click or press Esc to skip
      </p>
    </div>
  );
}
