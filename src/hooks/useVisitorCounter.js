import { useState, useEffect } from 'react';

const STORAGE_KEY_COUNT = 'pipos_hit_counter';
const STORAGE_KEY_VISITOR_ID = 'pipos_visitor_id';
const SESSION_KEY_VISITED = 'pipos_session_counted';
const BASE_INITIAL_COUNT = 41; // Rolls to #0042 on initial visit!

function getInitialVisitorData() {
  let initialCount = 42;
  let initialPrev = 42;
  let initialRolling = false;
  let initialId = 'PIP-0042';

  try {
    // 1. Visitor ID
    let storedId = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
    if (!storedId) {
      storedId = `PIP-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem(STORAGE_KEY_VISITOR_ID, storedId);
    }
    initialId = storedId;

    // 2. Count
    const sessionCounted = sessionStorage.getItem(SESSION_KEY_VISITED);
    const storedCountRaw = localStorage.getItem(STORAGE_KEY_COUNT);
    const parsedStored = storedCountRaw !== null ? parseInt(storedCountRaw, 10) : null;
    const currentStored = parsedStored !== null && !Number.isNaN(parsedStored) ? parsedStored : BASE_INITIAL_COUNT;

    if (!sessionCounted) {
      sessionStorage.setItem(SESSION_KEY_VISITED, 'true');
      const prior = currentStored;
      const next = prior + 1;
      localStorage.setItem(STORAGE_KEY_COUNT, String(next));

      initialPrev = prior;
      initialCount = next;

      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      initialRolling = !prefersReducedMotion;
    } else {
      initialPrev = currentStored;
      initialCount = currentStored;
      initialRolling = false;
    }
  } catch (e) {
    console.warn('[PipOS Counter] Storage access fallback:', e);
  }

  return { initialCount, initialPrev, initialRolling, initialId };
}

/**
 * Hook to manage a retro early-web session-aware visitor odometer counter.
 * - Increments exactly once per browser session.
 * - Safe against React StrictMode and multiple re-renders.
 * - Persists count across page reloads in localStorage.
 * - Triggers an odometer roll animation when incremented.
 * - Respects prefers-reduced-motion.
 */
export function useVisitorCounter() {
  const [data] = useState(() => getInitialVisitorData());
  const [isRolling, setIsRolling] = useState(data.initialRolling);

  useEffect(() => {
    if (!isRolling) return;
    const timer = setTimeout(() => {
      setIsRolling(false);
    }, 950);
    return () => clearTimeout(timer);
  }, [isRolling]);

  return {
    count: data.initialCount,
    prevCount: data.initialPrev,
    isRolling,
    visitorId: data.initialId,
  };
}
