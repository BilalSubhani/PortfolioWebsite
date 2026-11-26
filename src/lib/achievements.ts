'use client';

import { useSyncExternalStore } from 'react';

// Small, quiet "discoveries" for visitors who poke around. Stored in localStorage only.
export const ACHIEVEMENTS = [
  { id: 'allergic', title: 'Personal space', hint: 'Get close to the headline.' },
  { id: 'terminal', title: 'Hacker voice: “I’m in”', hint: 'Open the terminal.' },
  { id: 'curious', title: 'Curious mind', hint: 'Ask the terminal a question in plain English.' },
  { id: 'sudo', title: 'Nice try', hint: 'Ask for more permissions than you should.' },
  { id: 'broke-it', title: 'Chaos engineer', hint: 'Take the server down in the Load Lab.' },
  { id: 'fixed-it', title: 'Queue enjoyer', hint: 'Survive a burst without dropping a request.' },
  { id: 'theme', title: 'Night shift', hint: 'Switch the theme.' },
  { id: 'receipts', title: 'Checked the receipts', hint: 'Inspect three skills in the IDE.' },
  { id: 'coffee', title: 'Caffeinated', hint: 'The terminal knows a hidden command or two.' },
  { id: 'buddy', title: 'Made a friend', hint: 'Catch the little character wandering around.' },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]['id'];

const KEY = 'bs-discoveries';
const listeners = new Set<() => void>();
let cache: string | null = null;

const read = (): AchievementId[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export function unlock(id: AchievementId) {
  if (typeof window === 'undefined') return;
  const got = read();
  if (got.includes(id)) return;
  const next = [...got, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  cache = null;
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent('achievement', { detail: id }));
}

export function useAchievements(): AchievementId[] {
  const raw = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => (cache ??= JSON.stringify(read())),
    () => '[]',
  );
  return JSON.parse(raw);
}
