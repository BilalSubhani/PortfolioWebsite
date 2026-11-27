'use client';

import { useEffect, useRef } from 'react';
import { LuX } from 'react-icons/lu';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import Terminal from './Terminal';
import { useTerminal } from './TerminalContext';

// Global pop-up terminal (Ctrl/⌘+K, the ` key, or the floating launcher).
export default function TerminalDialog() {
  const { open, setOpen, pending, consumePending } = useTerminal();
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
      const focusInput = () => d.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
      requestAnimationFrame(focusInput);
      setTimeout(focusInput, 60);
      if (!prefersReducedMotion()) {
        gsap.fromTo(d, { backgroundColor: 'rgba(10,9,8,0)' }, { backgroundColor: 'rgba(10,9,8,0.6)', duration: 0.3 });
        // Opacity, not autoAlpha: a visibility-hidden input can't take focus.
        gsap.fromTo(panel.current, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
      }
    } else if (!open && d.open) {
      const finish = () => {
        d.close();
        document.documentElement.style.overflow = '';
      };
      if (prefersReducedMotion()) finish();
      else gsap.to(panel.current, { opacity: 0, y: 20, scale: 0.98, duration: 0.25, ease: 'power2.in', onComplete: finish });
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Portfolio terminal"
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
      onClick={(e) => e.target === ref.current && setOpen(false)}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black/60 p-3 backdrop:bg-transparent sm:p-8"
    >
      <div ref={panel} className="relative mx-auto flex h-full max-h-[640px] w-full max-w-3xl flex-col sm:mt-[8vh] sm:h-[70vh]">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 z-10 rounded-lg p-2 text-muted hover:text-fg"
          aria-label="Close terminal"
        >
          <LuX className="h-4 w-4" />
        </button>
        {open && (
          <Terminal
            className="h-full"
            autoFocus
            onNavigate={() => setOpen(false)}
            onClose={() => setOpen(false)}
            initialCommand={pending}
            onInitialCommandRun={consumePending}
          />
        )}
      </div>
    </dialog>
  );
}
