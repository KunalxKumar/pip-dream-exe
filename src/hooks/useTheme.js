import { useState, useEffect, useCallback } from 'react';
import { playClickSound } from '../utils/audio';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pip-dream-theme') || 'daylight';
    }
    return 'daylight';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pip-dream-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    playClickSound();
    setTheme((prev) => (prev === 'daylight' ? 'midnight' : 'daylight'));
  }, []);

  return {
    theme,
    isMidnight: theme === 'midnight',
    toggleTheme,
  };
}
