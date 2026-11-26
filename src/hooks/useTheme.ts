import { useCallback, useState } from 'react';

const STORAGE_KEY = 'theme';

// The initial class is applied by an inline script in index.html before first paint;
// this hook reads it back and keeps <html>, localStorage and React state in sync.
export function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark-theme'),
  );

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark-theme', next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      } catch {
        // storage unavailable (private mode etc.) — theme still applies for this visit
      }
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
}
