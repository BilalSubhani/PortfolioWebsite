'use client';

import { useSyncExternalStore } from 'react';

// Visitor "lens": developers get the technical version, everyone else gets plain English.
// The boot script in layout.tsx applies html[data-role] before first paint, and both
// versions of the copy are in the static HTML (see <Lens>), so switching never flashes.
export type Role = 'dev' | 'plain';

export const ROLES = {
  dev: {
    name: 'Merge Conflict Survivor',
    short: 'Dev mode',
    tagline: 'Show me the stack, the numbers and the receipts.',
  },
  plain: {
    name: 'Quest Merchant',
    short: 'Plain mode',
    tagline: 'Skip the jargon. What does he do, and why should I care?',
  },
} as const;

const KEY = 'bs-role';
const listeners = new Set<() => void>();

const read = (): Role =>
  typeof document !== 'undefined' && document.documentElement.dataset.role === 'plain' ? 'plain' : 'dev';

export const hasChosenRole = () => {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return true;
  }
};

export function setRole(role: Role) {
  const html = document.documentElement;
  html.dataset.role = role;
  html.classList.remove('needs-role');
  try {
    localStorage.setItem(KEY, role);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent('role', { detail: role }));
}

export function useRole(): Role {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => 'dev',
  );
}

// Lets the role picker be reopened from anywhere (nav button, terminal).
export const openRolePicker = () => window.dispatchEvent(new Event('role:open'));
