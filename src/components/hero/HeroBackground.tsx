'use client';

import { useEffect, useRef } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  z: number; // depth 0.3–1, drives parallax and size
}

const rgb = (hex: string) => {
  const h = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',');
};

const LINK = 100;

// Quiet ambient scene: two soft warm lights (GPU-composited divs moved by GSAP)
// + drifting particles on a low-DPR canvas. Runs on GSAP's ticker, pauses off-screen,
// and draws one still frame for reduced motion.
export default function HeroBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lightA = useRef<HTMLDivElement>(null);
  const lightB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d', { alpha: true });
    if (!c || !ctx) return;

    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let accent = '193,139,96';
    let fg = '232,224,210';
    const pointer = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      accent = rgb(s.getPropertyValue('--accent'));
      fg = rgb(s.getPropertyValue('--fg'));
    };

    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(60, Math.round((w * h) / 22000));
      parts = Array.from({ length: count }, () => {
        const z = 0.3 + Math.random() * 0.7;
        return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.14 * z, vy: (Math.random() - 0.5) * 0.14 * z, r: 0.6 + z * 1.4, z };
      });
    };

    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      const ox = (pointer.x - 0.5) * 30;
      const oy = (pointer.y - 0.5) * 30;

      for (const p of parts) {
        if (reduce) break;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }

      // Links: one batched path per alpha bucket instead of one stroke per pair.
      ctx.lineWidth = 0.6;
      const buckets: number[][] = [[], [], []];
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        const ax = a.x + ox * a.z;
        const ay = a.y + oy * a.z;
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const bx = b.x + ox * b.z;
          const by = b.y + oy * b.z;
          const dx = ax - bx;
          const dy = ay - by;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) buckets[Math.min(2, Math.floor((Math.sqrt(d2) / LINK) * 3))].push(ax, ay, bx, by);
        }
      }
      buckets.forEach((seg, k) => {
        if (!seg.length) return;
        ctx.strokeStyle = `rgba(${fg},${[0.08, 0.05, 0.025][k]})`;
        ctx.beginPath();
        for (let i = 0; i < seg.length; i += 4) {
          ctx.moveTo(seg[i], seg[i + 1]);
          ctx.lineTo(seg[i + 2], seg[i + 3]);
        }
        ctx.stroke();
      });

      for (const a of parts) {
        ctx.fillStyle = `rgba(${a.z > 0.8 ? accent : fg},${0.25 + a.z * 0.35})`;
        ctx.beginPath();
        ctx.arc(a.x + ox * a.z, a.y + oy * a.z, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    readColors();
    resize();
    draw();

    const themeObs = new MutationObserver(() => {
      readColors();
      if (reduce) draw();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onResize = () => {
      resize();
      if (reduce) draw();
    };
    window.addEventListener('resize', onResize);
    if (reduce) {
      gsap.set([c, lightA.current, lightB.current], { autoAlpha: 1 });
      return () => {
        themeObs.disconnect();
        window.removeEventListener('resize', onResize);
      };
    }

    gsap.fromTo([c, lightA.current, lightB.current], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' });
    // Lights drift slowly on their own…
    const drift = gsap.to(lightA.current, { xPercent: 6, yPercent: 8, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    const driftB = gsap.to(lightB.current, { xPercent: -8, yPercent: -6, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // …and lean toward the pointer (transform-only, so the compositor does the work).
    const ax = gsap.quickTo(lightA.current, 'x', { duration: 2, ease: 'power3.out' });
    const ay = gsap.quickTo(lightA.current, 'y', { duration: 2, ease: 'power3.out' });
    const bx = gsap.quickTo(lightB.current, 'x', { duration: 2.5, ease: 'power3.out' });
    const by = gsap.quickTo(lightB.current, 'y', { duration: 2.5, ease: 'power3.out' });

    let running = false;
    const start = () => {
      if (running) return;
      gsap.ticker.add(draw);
      drift.play();
      driftB.play();
      running = true;
    };
    const stop = () => {
      if (!running) return;
      gsap.ticker.remove(draw);
      drift.pause();
      driftB.pause();
      running = false;
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(c);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
      const mx = (pointer.tx - 0.5) * 120;
      const my = (pointer.ty - 0.5) * 120;
      ax(mx);
      ay(my);
      bx(-mx * 0.6);
      by(-my * 0.6);
    };
    if (isFinePointer()) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      stop();
      drift.kill();
      driftB.kill();
      io.disconnect();
      themeObs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div
        ref={lightA}
        className="absolute top-[-20%] right-[-15%] h-[90vmax] w-[90vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 62%)', visibility: 'hidden' }}
      />
      <div
        ref={lightB}
        className="absolute bottom-[-35%] left-[-25%] h-[70vmax] w-[70vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 62%)', visibility: 'hidden', opacity: 0.7 }}
      />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" style={{ visibility: 'hidden' }} />
    </>
  );
}
