'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface Ctx {
  open: boolean;
  setOpen: (v: boolean) => void;
  launch: (command?: string) => void;
  pending: string | null;
  consumePending: () => void;
}

const TerminalCtx = createContext<Ctx | null>(null);

// While the buddy holds the cursor for ransom, the terminal stays shut.
const hostage = () => {
  if (!document.documentElement.classList.contains('cursor-stolen')) return false;
  window.dispatchEvent(new CustomEvent('buddy:say', { detail: 'Nope. No terminal until I get my meme.' }));
  return true;
};

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenRaw] = useState(false);
  const setOpen = useCallback((v: boolean | ((o: boolean) => boolean)) => {
    setOpenRaw((o) => {
      const next = typeof v === 'function' ? v(o) : v;
      return next && !o && hostage() ? o : next;
    });
  }, []);
  const [pending, setPending] = useState<string | null>(null);

  const launch = useCallback(
    (command?: string) => {
      setPending(command ?? null);
      setOpen(true);
    },
    [setOpen],
  );

  // Ctrl/⌘+K or the backtick key opens the terminal from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '`' && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, launch, pending, consumePending: () => setPending(null) }),
    [open, setOpen, launch, pending],
  );
  return <TerminalCtx.Provider value={value}>{children}</TerminalCtx.Provider>;
}

export function useTerminal() {
  const ctx = useContext(TerminalCtx);
  if (!ctx) throw new Error('useTerminal must be used inside TerminalProvider');
  return ctx;
}
