'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// Counts up when scrolled into view. The final value is server-rendered,
// so the number is correct with JavaScript off and for crawlers.
export default function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { n: 0 };
    el.textContent = fmt(0) + suffix;
    gsap.to(obj, {
      n: value,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = fmt(obj.n) + suffix;
      },
    });
  });

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(value) + suffix}
    </span>
  );
}
