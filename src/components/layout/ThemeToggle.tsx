'use client';

import { useRef } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { setTheme, useTheme } from '@/lib/theme';
import { cn } from '@/lib/cn';

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const icon = useRef<HTMLSpanElement>(null);

  const toggle = () => {
    if (prefersReducedMotion() || !icon.current) return setTheme('toggle');
    gsap
      .timeline()
      .to(icon.current, { rotate: 90, scale: 0.4, autoAlpha: 0, duration: 0.18, ease: 'power2.in' })
      .add(() => setTheme('toggle'))
      .fromTo(icon.current, { rotate: -90, scale: 0.4, autoAlpha: 0 }, { rotate: 0, scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className={cn('grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent', className)}
    >
      <span ref={icon} className="grid place-items-center">
        {theme === 'dark' ? <LuSun className="h-4 w-4" /> : <LuMoon className="h-4 w-4" />}
      </span>
    </button>
  );
}
