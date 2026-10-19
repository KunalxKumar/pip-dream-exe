import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pipos_star_trail';

export function useStarTrail() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // localStorage fallback
    }

    // Default: ON on desktop with fine mouse, OFF on touch devices
    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isCoarseTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    return isDesktopPointer && !isCoarseTouch;
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const toggleStarTrail = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // storage quota fallback
      }
      return next;
    });
  }, []);

  // Effect is only active if user enabled it AND reduced motion is NOT active
  const isEffectiveActive = enabled && !reducedMotion;

  return {
    enabled,
    isEffectiveActive,
    reducedMotion,
    toggleStarTrail,
  };
}
