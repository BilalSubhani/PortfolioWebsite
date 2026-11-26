'use client';

import { useRef, useState } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';

// Cycles through curated quotes with a GSAP cross-fade while the footer is on screen.
export default function QuoteRotator({ quotes }: { quotes: { text: string; author: string }[] }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLQuoteElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      let timer: ReturnType<typeof setInterval> | undefined;
      const next = () =>
        gsap.to(ref.current, {
          autoAlpha: 0,
          y: -10,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            setI((x) => (x + 1) % quotes.length);
            gsap.fromTo(ref.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 });
          },
        });
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          clearInterval(timer);
          if (self.isActive) timer = setInterval(next, 6000);
        },
      });
      return () => {
        clearInterval(timer);
        st.kill();
      };
    },
    { dependencies: [quotes.length] },
  );

  const q = quotes[i];
  return (
    <figure className="min-h-[9rem] max-w-4xl sm:min-h-[8rem]">
      <blockquote ref={ref}>
        <p className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight font-medium text-balance">“{q.text}”</p>
        <figcaption className="mt-4 font-mono text-xs text-muted">— {q.author}</figcaption>
      </blockquote>
    </figure>
  );
}
