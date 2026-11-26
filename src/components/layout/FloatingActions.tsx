'use client';

import { useCallback, useRef, useState } from 'react';
import { LuArrowUp, LuSparkles, LuTerminal } from 'react-icons/lu';
import { ACHIEVEMENTS, useAchievements } from '@/lib/achievements';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { scrollToId } from '@/lib/scroll';
import { useTerminal } from '../terminal/TerminalContext';
import Discoveries from './Discoveries';

// Discoveries, back-to-top and terminal launcher, shown once the visitor scrolls past the first screen.
export default function FloatingActions() {
  const ref = useRef<HTMLDivElement>(null);
  const { setOpen } = useTerminal();
  const got = useAchievements();
  const [panel, setPanel] = useState(false);
  const closePanel = useCallback(() => setPanel(false), []);

  useGSAP(
    () => {
      const btns = gsap.utils.toArray<HTMLElement>('button', ref.current);
      gsap.set(btns, { autoAlpha: 0, scale: 0.6, y: 20 });
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.8,
        end: 'max',
        onToggle: (self) =>
          gsap.to(btns, {
            autoAlpha: self.isActive ? 1 : 0,
            scale: self.isActive ? 1 : 0.6,
            y: self.isActive ? 0 : 20,
            stagger: 0.06,
            duration: 0.4,
            ease: self.isActive ? 'back.out(2)' : 'power2.in',
            overwrite: true,
          }),
      });
    },
    { scope: ref },
  );

  // Wiggle the discoveries button whenever something new is found.
  useGSAP(
    () => {
      if (!got.length) return;
      gsap.fromTo('[data-disc]', { rotate: -18 }, { rotate: 0, duration: 0.9, ease: 'elastic.out(1.2, 0.3)' });
    },
    { scope: ref, dependencies: [got.length] },
  );

  const cls =
    'relative grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-fg shadow-lg shadow-black/20 transition-colors hover:border-accent hover:text-accent';

  return (
    <>
      <div ref={ref} className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
        <button
          type="button"
          data-disc
          onClick={() => setPanel((p) => !p)}
          className={cls}
          aria-label={`Discoveries: ${got.length} of ${ACHIEVEMENTS.length} found`}
          aria-expanded={panel}
        >
          <LuSparkles className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-accent-fg">
            {got.length}
          </span>
        </button>
        <button type="button" onClick={() => scrollToId('top')} className={cls} aria-label="Back to top">
          <LuArrowUp className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => setOpen(true)} className={`${cls} border-accent! bg-accent! text-accent-fg!`} aria-label="Open terminal">
          <LuTerminal className="h-5 w-5" />
        </button>
      </div>
      <Discoveries open={panel} onClose={closePanel} />
    </>
  );
}
