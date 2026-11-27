'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { LuArrowDown, LuArrowUpRight, LuTerminal } from 'react-icons/lu';
import { plainHighlights, profile, stats } from '@/content/profile';
import { unlock } from '@/lib/achievements';
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { scrollToId } from '@/lib/scroll';
import { useTerminal } from '../terminal/TerminalContext';
import Counter from '../ui/Counter';
import Lens from '../ui/Lens';
import Magnetic from '../ui/Magnetic';

const HeroBackground = dynamic(() => import('./HeroBackground'), { ssr: false });

// Letters push away from the pointer ("allergic" to it), then spring back.
function enableRepel(title: HTMLElement) {
  const chars = gsap.utils.toArray<HTMLElement>('[data-char]', title);
  // Base centres relative to the heading, measured with no displacement applied.
  let base: { x: number; y: number }[] = [];
  let radius = 120;
  const measure = () => {
    gsap.set(chars, { x: 0, y: 0, rotate: 0 });
    const t = title.getBoundingClientRect();
    base = chars.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left - t.left + r.width / 2, y: r.top - t.top + r.height / 2 };
    });
    radius = Math.max(90, parseFloat(getComputedStyle(title).fontSize) * 1.3);
  };
  measure();

  const setters = chars.map((c) => ({
    x: gsap.quickTo(c, 'x', { duration: 0.55, ease: 'power3.out' }),
    y: gsap.quickTo(c, 'y', { duration: 0.55, ease: 'power3.out' }),
    r: gsap.quickTo(c, 'rotate', { duration: 0.7, ease: 'power3.out' }),
  }));
  const displaced = new Array(chars.length).fill(false);
  const maxPush = radius * 0.55;

  let frame = 0;
  let mx = -9999;
  let my = -9999;
  const apply = () => {
    frame = 0;
    const t = title.getBoundingClientRect();
    const px = mx - t.left;
    const py = my - t.top;
    for (let i = 0; i < chars.length; i++) {
      const dx = base[i].x - px;
      const dy = base[i].y - py;
      const d = Math.hypot(dx, dy);
      if (d < radius) {
        const f = (1 - d / radius) ** 2 * maxPush;
        const nx = d ? dx / d : 0;
        const ny = d ? dy / d : -1;
        setters[i].x(nx * f);
        setters[i].y(ny * f);
        setters[i].r(nx * f * 0.35);
        if (!displaced[i]) unlock('allergic');
        displaced[i] = true;
      } else if (displaced[i]) {
        setters[i].x(0);
        setters[i].y(0);
        setters[i].r(0);
        displaced[i] = false;
      }
    }
  };
  const onMove = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
    if (!frame) frame = requestAnimationFrame(apply);
  };
  const onLeave = () => {
    mx = my = -9999;
    if (!frame) frame = requestAnimationFrame(apply);
  };

  const zone = title.closest('section')!;
  zone.addEventListener('pointermove', onMove, { passive: true });
  zone.addEventListener('pointerleave', onLeave);
  const ro = new ResizeObserver(() => measure());
  ro.observe(title);
  return () => {
    cancelAnimationFrame(frame);
    zone.removeEventListener('pointermove', onMove);
    zone.removeEventListener('pointerleave', onLeave);
    ro.disconnect();
  };
}

// Developer view: the intro as a small, highlighted TypeScript object.
function HeroCode() {
  const k = (t: string) => <span className="text-accent">{t}</span>;
  const s = (t: string) => <span className="text-[#b7c88f] light:text-[#4f6b33]">&apos;{t}&apos;</span>;
  const n = (t: string) => <span className="text-[#d6b46a] light:text-[#8f5527]">{t}</span>;
  return (
    <figure className="rounded-2xl border border-line bg-surface/80 font-mono text-[12.5px] leading-relaxed sm:text-[13.5px]">
      <figcaption className="flex items-center gap-2 border-b border-line px-4 py-2 text-[11px] text-muted">
        <span className="h-2 w-2 rounded-full bg-ok" /> bilal.ts
      </figcaption>
      <pre className="px-4 py-3 break-words whitespace-pre-wrap text-muted">
        <span className="text-[#d98b7a] light:text-[#a2432f]">const</span> <span className="text-fg">bilal</span> = {'{'}
        {'\n  '}
        {k('role')}: {s('Full-Stack Engineer · Team Lead')},{'\n  '}
        {k('stack')}: [{s('Go')}, {s('Python')}, {s('TypeScript')}, {s('Next.js')}],{'\n  '}
        {k('shipped')}: {'{'} {k('concurrentCalls')}: {n('250')}, {k('burstReqPerSec')}: {n('16_000')} {'}'},{'\n  '}
        {k('openTo')}: {s('remote')},{'\n'}
        {'}'};
      </pre>
    </figure>
  );
}

// Plain view: a friendly intro and three highlights in everyday words.
function HeroPlain() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted sm:text-lg">
        <strong className="font-medium text-fg">{profile.name}</strong> — {profile.introPlain}
      </p>
      <ul className="mt-5 space-y-2">
        {plainHighlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-sm text-fg sm:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {h}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { launch } = useTerminal();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      let cleanupRepel: (() => void) | undefined;
      const startRepel = () => {
        if (!reduce && isFinePointer() && title.current) {
          // Words were masked for the reveal; let letters escape the mask now.
          gsap.set('[data-hero-mask]', { overflow: 'visible' });
          cleanupRepel = enableRepel(title.current);
        }
      };
      if (reduce) {
        startRepel();
        return;
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' }, onComplete: startRepel });
      tl.from('[data-hero-pill]', { autoAlpha: 0, y: 16, duration: 0.7 })
        .from('[data-hero-word]', { yPercent: 115, duration: 1.1, stagger: 0.05 }, '-=0.4')
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.1 }, '-=0.7')
        .from('[data-hero-stat]', { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.08 }, '-=0.6');

      gsap.to('[data-hero-dot]', { scale: 2.4, autoAlpha: 0, duration: 1.6, repeat: -1, ease: 'power2.out' });

      // Wait for the preloader and (on a first visit) the role picker before the intro plays.
      const html = document.documentElement;
      const ready = () => !html.classList.contains('preload') && !html.classList.contains('needs-role');
      const tryPlay = () => ready() && tl.progress() === 0 && !tl.isActive() && tl.play();
      window.addEventListener('preloader:done', tryPlay);
      window.addEventListener('role', tryPlay);
      const safety = setTimeout(() => !html.classList.contains('needs-role') && tl.play(), 4000);
      tryPlay();

      return () => {
        cleanupRepel?.();
        clearTimeout(safety);
        window.removeEventListener('preloader:done', tryPlay);
        window.removeEventListener('role', tryPlay);
      };
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16" aria-labelledby="hero-title">
      {/* Static fallback lighting (visible until/unless the animated scene loads) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(60% 50% at 75% 25%, var(--accent-soft), transparent 70%), radial-gradient(40% 40% at 10% 90%, var(--accent-soft), transparent 70%)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <HeroBackground />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-bg" />

      <div className="container-x">
        <p data-hero-pill className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            <span data-hero-dot className="absolute inset-0 rounded-full bg-ok" />
            <span className="relative h-2 w-2 rounded-full bg-ok" />
          </span>
          {profile.availability} · {profile.location}
        </p>

        <h1
          id="hero-title"
          ref={title}
          className="mt-7 cursor-default font-display text-[clamp(2.6rem,8.2vw,6.75rem)] leading-[0.98] font-semibold tracking-[-0.035em] select-none"
        >
          <span className="sr-only">
            {profile.name}, {profile.role}. {profile.heroLines.join(' ')}
          </span>
          <span aria-hidden="true">
            {profile.heroLines.map((line, li) => (
              <span key={line} className="block">
                {line.split(' ').map((w, wi, arr) => (
                  <span key={wi} data-hero-mask className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <span data-hero-word className={`inline-block whitespace-nowrap ${li === 2 ? 'text-accent' : ''}`}>
                      {w.split('').map((ch, ci) => (
                        <span key={ci} data-char className="inline-block">
                          {ch}
                        </span>
                      ))}
                      {wi < arr.length - 1 ? ' ' : ''}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div data-hero-fade className="max-w-xl">
            <Lens block dev={<HeroCode />} plain={<HeroPlain />} />
          </div>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <Magnetic>
              <a href="#work" onClick={(e) => (e.preventDefault(), scrollToId('work'))} className="btn-primary">
                Explore the work <LuArrowDown className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => launch('help')} className="btn-ghost">
                <LuTerminal className="h-4 w-4" /> Open terminal
              </button>
            </Magnetic>
            <Magnetic>
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Resume <LuArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
          </div>
        </div>

        <dl data-perch className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:mt-16 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-hero-stat className="flex flex-col-reverse bg-bg p-4 sm:p-6">
              <dt className="mt-1 text-xs leading-snug text-muted sm:text-sm">
                <Lens dev={<span className="font-mono text-[11px] sm:text-xs">{s.label}</span>} plain={s.labelPlain} />
              </dt>
              <dd className="font-display text-[clamp(1.6rem,4vw,2.5rem)] font-semibold text-fg">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
