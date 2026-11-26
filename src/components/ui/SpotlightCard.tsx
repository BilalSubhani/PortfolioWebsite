'use client';

import { useRef } from 'react';
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';

type Props = { children: React.ReactNode; className?: string; tilt?: boolean } & React.HTMLAttributes<HTMLDivElement>;

// Card with a warm spotlight that follows the pointer and a subtle 3D tilt.
export default function SpotlightCard({ children, className, tilt = true, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const g = glow.current;
      if (!el || !g || !isFinePointer() || prefersReducedMotion()) return;
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5 });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5 });
      const gx = gsap.quickTo(g, 'x', { duration: 0.35 });
      const gy = gsap.quickTo(g, 'y', { duration: 0.35 });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        gx(px);
        gy(py);
        if (tilt) {
          rx((py / r.height - 0.5) * -5);
          ry((px / r.width - 0.5) * 5);
        }
      };
      const enter = () => gsap.to(g, { autoAlpha: 1, duration: 0.3 });
      const leave = () => {
        gsap.to(g, { autoAlpha: 0, duration: 0.4 });
        rx(0);
        ry(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-glow className={cn('card relative overflow-hidden', className)} {...rest}>
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 65%)', visibility: 'hidden', opacity: 0 }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
