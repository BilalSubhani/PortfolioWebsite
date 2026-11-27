'use client';

import { useEffect } from 'react';
import { unlock } from '@/lib/achievements';

// "Nosy neighbour": noticed when DevTools is opened by keyboard shortcut, or when a docked
// DevTools panel appears (the window's inner size suddenly shrinks against its outer size).
// Undocked DevTools can't be detected reliably, so those visitors get away with it.
export default function DevtoolsWatch() {
  useEffect(() => {
    console.log(
      '%cHey, nosy neighbour 👀%c\nLike what you see? The source is at github.com/BilalSubhani/PortfolioWebsite, or say hi at bilalsubhanii@outlook.com',
      'font: 600 16px system-ui; color: #c18b60',
      'font: 13px system-ui; color: inherit',
    );

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.metaKey && e.altKey && ['i', 'j', 'c'].includes(k)))
        unlock('nosy');
    };

    const diff = () => ({ w: window.outerWidth - window.innerWidth, h: window.outerHeight - window.innerHeight });
    const base = diff();
    const check = () => {
      const d = diff();
      if (d.w - base.w > 160 || d.h - base.h > 160) unlock('nosy');
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', check);
    };
  }, []);

  return null;
}
