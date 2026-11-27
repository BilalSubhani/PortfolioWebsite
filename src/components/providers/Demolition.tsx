'use client';

import { useEffect, useRef, useState } from 'react';
import { unlock } from '@/lib/achievements';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const PIECES = '#main h1, #main h2, #main h3, #main p, #main .card, #main [data-glow], #main [data-perch], #main li, #main dl, #main canvas, #main figure, #main .chip';

// `rm -rf` in the terminal: the buddy "goes rogue", everything on screen falls apart,
// then it all flies back exactly where it was. Nothing is actually removed: GSAP records
// the original state and reverses to it.
export default function Demolition() {
  const [status, setStatus] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  useEffect(() => {
    const onRm = async () => {
      if (running.current) return;
      running.current = true;
      const reduce = prefersReducedMotion();
      const vh = window.innerHeight;
      const main = document.getElementById('main');
      if (!main) return void (running.current = false);

      // Only what's on screen, and only the outermost matches (children fall with their parent).
      const all = Array.from(main.querySelectorAll<HTMLElement>(PIECES)).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < vh && r.width > 0 && getComputedStyle(el).visibility !== 'hidden';
      });
      const pieces = all.filter((el) => !all.some((o) => o !== el && o.contains(el)));

      const say = (t: string) => window.dispatchEvent(new CustomEvent('buddy:say', { detail: t }));
      // One punchline per demolition, picked at random.
      const punchline = Math.random() < 0.5 ? 'All handled, Mr President.' : '“It’s done, bro.” ~ probably Salman Khan';
      window.dispatchEvent(new Event('buddy:rogue'));
      setStatus('rm: descending into ‘/portfolio’…');
      const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

      if (reduce) {
        // No flying debris for reduced motion: a quick fade out and back.
        await gsap.to(main, { autoAlpha: 0.1, duration: 0.2 });
        say(punchline);
        await sleep(1.6);
        await gsap.to(main, { autoAlpha: 1, duration: 0.2 });
      } else {
        await sleep(0.9); // the buddy gets into position
        // Shake, then gravity.
        await gsap.to(main, { keyframes: { x: [-9, 8, -7, 6, -4, 3, 0] }, duration: 0.5, ease: 'none', clearProps: 'x' });
        const tl = gsap.timeline({ paused: true });
        pieces.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          tl.to(
            el,
            {
              y: vh - r.top + rand(80, 400),
              x: rand(-120, 120),
              rotation: rand(-70, 70),
              ease: 'power2.in',
              duration: rand(0.7, 1.2),
            },
            i * 0.025 + rand(0, 0.15),
          );
        });
        let removed = 0;
        const counter = setInterval(() => setStatus(`rm: removed ${(removed += Math.floor(rand(37, 211)))} files`), 90);
        await tl.play();
        clearInterval(counter);
        setStatus('rm: ‘/portfolio’: gone. Like it never existed.');
        await sleep(0.5);
        say(punchline);
        await sleep(3);
        setStatus('Restoring from backup…');
        say('Relax. We have backups.');
        await tl.timeScale(1.6).reverse();
        tl.kill();
        gsap.set(pieces, { clearProps: 'x,y,rotation' });
      }
      unlock('rogue');
      setStatus('Restored. Nothing to see here.');
      await sleep(1.4);
      setStatus(null);
      running.current = false;
    };
    window.addEventListener('site:rm', onRm);
    return () => window.removeEventListener('site:rm', onRm);
  }, []);

  useEffect(() => {
    if (status && bar.current) gsap.fromTo(bar.current, { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, overwrite: true });
  }, [status === null]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!status) return null;
  return (
    <div
      ref={bar}
      role="status"
      className="fixed top-20 left-1/2 z-[65] max-w-[calc(100vw-2rem)] -translate-x-1/2 truncate rounded-full border border-err/50 bg-surface px-4 py-2 font-mono text-xs text-err shadow-xl shadow-black/30"
    >
      {status}
    </div>
  );
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}
