'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const listeners = new Set<() => void>();
const read = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export function setTheme(next: Theme | 'toggle') {
  void import('./achievements').then((m) => m.unlock('theme'));
  const value: Theme = next === 'toggle' ? (read() === 'dark' ? 'light' : 'dark') : next;
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem('theme', value);
  } catch {
    /* storage unavailable */
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#171613' : '#f4efe6');
  listeners.forEach((l) => l());
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => 'dark',
  );
}
