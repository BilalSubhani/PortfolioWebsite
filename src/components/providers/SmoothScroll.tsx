'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/scroll';

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: -88 } });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
