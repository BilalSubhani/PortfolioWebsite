'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LuCheck, LuCodeXml, LuScroll, LuX } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import { hasChosenRole, type Role, ROLES, setRole, useRole } from '@/lib/role';

const ICON = { dev: LuCodeXml, plain: LuScroll };

// Applies a role with a quick GSAP cross-fade of the page so the copy swap feels intentional.
export function switchRole(role: Role) {
  const main = document.getElementById('main');
  if (!main || prefersReducedMotion() || document.documentElement.dataset.role === role) {
    setRole(role);
    ScrollTrigger.refresh();
    return;
  }
  gsap
    .timeline()
    .to(main, { autoAlpha: 0.15, y: 8, duration: 0.22, ease: 'power2.in' })
    .add(() => {
      setRole(role);
      ScrollTrigger.refresh();
    })
    .to(main, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', clearProps: 'transform' });
}

export default function RolePicker() {
  const current = useRole();
  const [open, setOpen] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // First visit: ask before anything else is shown (right after the preloader, if it runs).
  // Later visits: only open on request.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (document.documentElement.classList.contains('needs-role') && !hasChosenRole()) {
      setFirstVisit(true);
      const ask = () => setOpen(true);
      if (document.documentElement.classList.contains('preload')) window.addEventListener('preloader:done', ask, { once: true });
      else ask();
    }
    const onOpen = () => setOpen(true);
    window.addEventListener('role:open', onOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('role:open', onOpen);
    };
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      if (!prefersReducedMotion()) {
        if (!firstVisit) gsap.fromTo(d, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
        gsap.fromTo(panel.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo('[data-role-card]', { autoAlpha: 0, y: 40, rotateX: -12 }, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.12, delay: 0.15, ease: 'power3.out' });
      }
    } else if (!open && d.open) {
      if (prefersReducedMotion()) d.close();
      else gsap.to(panel.current, { autoAlpha: 0, y: 20, duration: 0.25, ease: 'power2.in', onComplete: () => d.close() });
    }
  }, [open, firstVisit]);

  const close = useCallback(() => {
    if (!hasChosenRole()) setRole('dev'); // dismissing keeps the default, and we don't ask again
    setOpen(false);
  }, []);

  const choose = (role: Role, el: HTMLElement) => {
    if (prefersReducedMotion()) {
      switchRole(role);
      setOpen(false);
      return;
    }
    gsap
      .timeline({ onComplete: () => setOpen(false) })
      .to('[data-role-card]', { autoAlpha: (_i, t) => (t === el ? 1 : 0.3), scale: (_i, t) => (t === el ? 1.03 : 0.97), duration: 0.3 })
      .add(() => switchRole(role), '+=0.15');
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="role-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      className={cn(
        'fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto p-4 backdrop:bg-transparent sm:p-8',
        'bg-bg',
      )}
    >
      <div ref={panel} className="relative mx-auto flex min-h-full max-w-4xl flex-col justify-center py-8" style={{ perspective: 1000 }}>
        {!firstVisit && (
          <button type="button" onClick={close} className="absolute top-2 right-0 rounded-lg p-2 text-muted hover:text-fg" aria-label="Close">
            <LuX className="h-5 w-5" />
          </button>
        )}
        <p className="eyebrow">{firstVisit ? 'Before you look around' : 'Switch your path'}</p>
        <h2 id="role-title" className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold">
          Who’s visiting today?
        </h2>
        <p className="mt-3 max-w-xl text-muted">Pick a path and the site will talk your language. You can switch any time from the menu bar.</p>
        {firstVisit && (
          <button type="button" onClick={close} className="mt-3 w-fit text-sm text-muted underline decoration-dotted underline-offset-4 hover:text-accent">
            Just let me in
          </button>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {(Object.keys(ROLES) as Role[]).map((key) => {
            const r = ROLES[key];
            const Icon = ICON[key];
            const active = current === key && !firstVisit;
            return (
              <button
                key={key}
                type="button"
                data-role-card
                data-glow
                onClick={(e) => choose(key, e.currentTarget)}
                className={cn(
                  'group card flex flex-col p-6 text-left transition-colors hover:border-accent sm:p-8',
                  active && 'border-accent bg-accent-soft',
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-accent-fg">
                    <Icon className="h-6 w-6" />
                  </span>
                  {active && (
                    <span className="flex items-center gap-1 font-mono text-xs text-accent">
                      <LuCheck className="h-3.5 w-3.5" /> current
                    </span>
                  )}
                </span>
                <span className="mt-8 font-display text-2xl font-semibold sm:text-3xl">{r.name}</span>
                <span className="mt-2 text-muted">{r.tagline}</span>
              </button>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
