'use client';

import { useRef } from 'react';
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '@/lib/gsap';

// Custom round cursor for mouse users: a dot that tracks exactly + a ring that trails it.
// The native cursor is hidden only once this is running (html.custom-cursor), so if JS
// fails the normal pointer remains. Text fields keep the native text cursor.
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    const d = dot.current;
    const r = ring.current;
    if (!el || !d || !r || !isFinePointer()) return;

    const html = document.documentElement;
    html.classList.add('custom-cursor');
    const reduce = prefersReducedMotion();
    gsap.set([d, r], { xPercent: -50, yPercent: -50 });
    gsap.set(el, { autoAlpha: 0 });

    const dx = gsap.quickTo(d, 'x', { duration: reduce ? 0 : 0.08, ease: 'power3.out' });
    const dy = gsap.quickTo(d, 'y', { duration: reduce ? 0 : 0.08, ease: 'power3.out' });
    const rx = gsap.quickTo(r, 'x', { duration: reduce ? 0 : 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: reduce ? 0 : 0.45, ease: 'power3.out' });

    type Mode = 'default' | 'link' | 'text' | 'hidden';
    let mode: Mode = 'default';
    let visible = false;
    const setMode = (m: Mode) => {
      if (m === mode) return;
      mode = m;
      const dur = reduce ? 0 : 0.3;
      if (m === 'link') {
        gsap.to(r, { scale: 1.8, borderColor: 'transparent', backgroundColor: 'var(--accent-soft)', duration: dur, ease: 'power3.out' });
        gsap.to(d, { scale: 0.5, duration: dur });
      } else if (m === 'text' || m === 'hidden') {
        gsap.to([r, d], { scale: 0, duration: dur * 0.6 });
      } else {
        gsap.to(r, { scale: 1, borderColor: 'var(--accent)', backgroundColor: 'transparent', duration: dur, ease: 'power3.out' });
        gsap.to(d, { scale: 1, duration: dur });
      }
    };

    // Modal dialogs live in the browser's top layer, above everything; move the cursor
    // inside the open dialog so it stays visible there.
    const home = el.parentElement!;
    const syncLayer = () => {
      const dlg = document.querySelector<HTMLDialogElement>('dialog[open]');
      const parent = dlg ?? home;
      if (el.parentElement !== parent) parent.appendChild(el);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      syncLayer();
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      if (!visible) {
        visible = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.25 });
      }
      const t = e.target as HTMLElement;
      if (t.closest('input:not([type=range]):not([type=radio]):not([type=checkbox]), textarea, [contenteditable="true"]')) setMode('text');
      else if (t.closest('a, button, [role="button"], [role="radio"], label, summary, select, input[type=range], [data-cursor="link"]')) setMode('link');
      else setMode('default');
    };
    const down = () => !reduce && gsap.to(r, { scale: mode === 'link' ? 1.4 : 0.75, duration: 0.15 });
    const up = () => !reduce && gsap.to(r, { scale: mode === 'link' ? 1.8 : 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    const leave = () => {
      visible = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      html.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
      if (el.parentElement !== home) home.appendChild(el);
    };
  });

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]" style={{ visibility: 'hidden' }}>
      <div ref={ring} className="absolute top-0 left-0 h-8 w-8 rounded-full border-[1.5px] border-accent" />
      <div ref={dot} className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-accent" />
    </div>
  );
}
