'use client';

import { useRef } from 'react';
import { LuPlus } from 'react-icons/lu';
import { faq } from '@/content/misc';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

// Visible Q&A that mirrors the FAQPage JSON-LD (answer-engine friendly).
// Native <details> keeps it working without JS; GSAP animates the open/close.
export default function Faq() {
  const list = useRef<HTMLDivElement>(null);

  const toggle = (e: React.MouseEvent<HTMLElement>) => {
    const details = e.currentTarget.parentElement as HTMLDetailsElement;
    const body = details.querySelector<HTMLElement>('[data-answer]')!;
    const icon = details.querySelector<HTMLElement>('[data-icon]')!;
    if (prefersReducedMotion()) return;
    e.preventDefault();
    if (details.open) {
      gsap.to(icon, { rotate: 0, duration: 0.3 });
      gsap.to(body, { height: 0, autoAlpha: 0, duration: 0.35, ease: 'power2.in', onComplete: () => void (details.open = false) });
    } else {
      details.open = true;
      gsap.to(icon, { rotate: 45, duration: 0.3 });
      gsap.fromTo(body, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
    }
  };

  return (
    <div ref={list} className="divide-y divide-line border-y border-line">
      {faq.map((f) => (
        <details key={f.q} data-perch className="group" data-reveal="fade">
          <summary
            onClick={toggle}
            className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-lg font-medium sm:text-xl [&::-webkit-details-marker]:hidden"
          >
            {f.q}
            <span data-icon className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent">
              <LuPlus className="h-4 w-4" aria-hidden="true" />
            </span>
          </summary>
          <div data-answer className="overflow-hidden">
            <p className="max-w-3xl pb-6 leading-relaxed text-muted">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
