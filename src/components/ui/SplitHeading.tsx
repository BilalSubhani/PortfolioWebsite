'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

type Tag = 'h1' | 'h2' | 'h3';

// Word-by-word masked reveal, triggered on scroll (or straight away with `immediate`).
export default function SplitHeading({
  text,
  as: As = 'h2',
  className,
  immediate = false,
  delay = 0,
  id,
}: {
  text: string;
  as?: Tag;
  className?: string;
  immediate?: boolean;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = gsap.utils.toArray<HTMLElement>('.split-word', ref.current);
      gsap.set(words, { yPercent: 115 });
      gsap.to(words, {
        yPercent: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'power4.out',
        delay,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: 'top 90%', once: true },
      });
    },
    { scope: ref },
  );

  const words = text.split(' ');
  return (
    <As ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <span className="split-word inline-block">
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
    </As>
  );
}
