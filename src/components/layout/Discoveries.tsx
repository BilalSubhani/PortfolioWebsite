'use client';

import { useEffect, useRef, useState } from 'react';
import { LuLock, LuSparkles, LuX } from 'react-icons/lu';
import { ACHIEVEMENTS, type AchievementId, useAchievements } from '@/lib/achievements';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

// Toast on unlock + a small panel listing what's been found (opened from FloatingActions).
export default function Discoveries({ open, onClose }: { open: boolean; onClose: () => void }) {
  const got = useAchievements();
  const [toast, setToast] = useState<AchievementId | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = (e: Event) => setToast((e as CustomEvent<AchievementId>).detail);
    window.addEventListener('achievement', on);
    return () => window.removeEventListener('achievement', on);
  }, []);

  useEffect(() => {
    const el = toastRef.current;
    if (!toast || !el) return;
    const reduce = prefersReducedMotion();
    const tl = gsap.timeline({ onComplete: () => setToast(null) });
    tl.fromTo(el, { y: 40, autoAlpha: 0, scale: 0.9 }, { y: 0, autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.5, ease: 'back.out(1.8)' })
      .fromTo(el.querySelector('[data-spark]'), { rotate: -30, scale: 0.4 }, { rotate: 0, scale: 1, duration: reduce ? 0 : 0.6, ease: 'elastic.out(1, 0.4)' }, '<0.1')
      .to(el, { y: 20, autoAlpha: 0, duration: reduce ? 0 : 0.35, ease: 'power2.in' }, '+=3');
    return () => void tl.kill();
  }, [toast]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) {
      gsap.set(el, { display: 'block' });
      gsap.fromTo(el, { autoAlpha: 0, y: 16, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: prefersReducedMotion() ? 0 : 0.35, ease: 'power3.out' });
      gsap.fromTo(el.querySelectorAll('li'), { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, stagger: 0.04, duration: 0.3, delay: 0.1 });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    gsap.to(el, { autoAlpha: 0, y: 10, duration: 0.2, onComplete: () => void gsap.set(el, { display: 'none' }) });
  }, [open, onClose]);

  const current = ACHIEVEMENTS.find((a) => a.id === toast);

  return (
    <>
      <div
        ref={toastRef}
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 left-4 z-[65] flex max-w-[calc(100vw-6rem)] items-center gap-3 rounded-2xl border border-accent/40 bg-surface px-4 py-3 shadow-2xl shadow-black/30 sm:bottom-6 sm:left-6"
        style={{ visibility: 'hidden' }}
      >
        <span data-spark className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
          <LuSparkles className="h-4 w-4" />
        </span>
        {current && (
          <span className="min-w-0">
            <span className="block font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
              Discovery {got.length}/{ACHIEVEMENTS.length}
            </span>
            <span className="block truncate text-sm font-medium">{current.title}</span>
          </span>
        )}
      </div>

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Discoveries"
        className="fixed right-4 bottom-24 z-[45] hidden w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-5 shadow-2xl shadow-black/30 sm:right-6 sm:bottom-28"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Discoveries</p>
            <p className="mt-1 font-display text-xl font-semibold">
              {got.length} of {ACHIEVEMENTS.length} found
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted hover:text-fg" aria-label="Close discoveries">
            <LuX className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(got.length / ACHIEVEMENTS.length) * 100}%` }} />
        </div>
        <ul className="mt-4 space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const done = got.includes(a.id);
            return (
              <li key={a.id} className={cn('flex items-start gap-3 rounded-xl border px-3 py-2.5', done ? 'border-accent/40 bg-accent-soft' : 'border-line')}>
                <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full', done ? 'bg-accent text-accent-fg' : 'bg-surface-2 text-muted')}>
                  {done ? <LuSparkles className="h-3 w-3" /> : <LuLock className="h-3 w-3" />}
                </span>
                <span className="min-w-0">
                  <span className={cn('block text-sm font-medium', !done && 'text-muted')}>{done ? a.title : '???'}</span>
                  <span className="block text-xs text-muted">{a.hint}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
