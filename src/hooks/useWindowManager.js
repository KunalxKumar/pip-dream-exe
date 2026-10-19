import { useState, useCallback } from 'react';
import { appsData } from '../data/appsData';

export function useWindowManager(initialOpenIds = ['hero', 'projects']) {
  const [openWindowIds, setOpenWindowIds] = useState(initialOpenIds);
  const [minimizedIds, setMinimizedIds] = useState({});
  const [activeWindowId, setActiveWindowId] = useState(initialOpenIds[0] || 'hero');
  const [zIndices, setZIndices] = useState(() => {
    const map = {};
    appsData.forEach((app, idx) => {
      map[app.id] = 100 + idx;
    });
    return map;
  });
  const [_highestZ, setHighestZ] = useState(100 + appsData.length);
  const [windowPositions, setWindowPositions] = useState(() => {
    const map = {};
    appsData.forEach((app) => {
      map[app.id] = { x: app.x || 80, y: app.y || 80 };
    });
    return map;
  });

  const focusWindow = useCallback((appId) => {
    setActiveWindowId(appId);
    setHighestZ((prevZ) => {
      const nextZ = prevZ + 1;
      setZIndices((prevMap) => ({ ...prevMap, [appId]: nextZ }));
      return nextZ;
    });
  }, []);

  const openWindow = useCallback((appId) => {
    if (!openWindowIds.includes(appId)) {
      setOpenWindowIds((prev) => [...prev, appId]);
    }
    // If minimized, restore it
    setMinimizedIds((prev) => {
      if (!prev[appId]) return prev;
      const next = { ...prev };
      delete next[appId];
      return next;
    });
    focusWindow(appId);
  }, [openWindowIds, focusWindow]);

  const closeWindow = useCallback((appId) => {
    setOpenWindowIds((prev) => prev.filter((id) => id !== appId));
    setMinimizedIds((prev) => {
      if (!prev[appId]) return prev;
      const next = { ...prev };
      delete next[appId];
      return next;
    });
    if (activeWindowId === appId) {
      // Focus next available open window if any
      setOpenWindowIds((currentOpen) => {
        const remaining = currentOpen.filter((id) => id !== appId);
        if (remaining.length > 0) {
          const nextActive = remaining[remaining.length - 1];
          setActiveWindowId(nextActive);
        }
        return currentOpen;
      });
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((appId) => {
    setMinimizedIds((prev) => ({ ...prev, [appId]: true }));
    if (activeWindowId === appId) {
      // Switch focus to another non-minimized open window
      const available = openWindowIds.filter((id) => id !== appId && !minimizedIds[id]);
      if (available.length > 0) {
        setActiveWindowId(available[available.length - 1]);
      }
    }
  }, [activeWindowId, openWindowIds, minimizedIds]);

  const restoreWindow = useCallback((appId) => {
    setMinimizedIds((prev) => {
      if (!prev[appId]) return prev;
      const next = { ...prev };
      delete next[appId];
      return next;
    });
    focusWindow(appId);
  }, [focusWindow]);

  const toggleMinimize = useCallback((appId) => {
    if (minimizedIds[appId]) {
      restoreWindow(appId);
    } else if (activeWindowId === appId) {
      minimizeWindow(appId);
    } else {
      restoreWindow(appId);
    }
  }, [minimizedIds, activeWindowId, restoreWindow, minimizeWindow]);

  const updateWindowPosition = useCallback((appId, x, y) => {
    // Keep window title bar on screen (at least 48px visible from top and sides)
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 60;
    const clampedX = Math.max(-20, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));

    setWindowPositions((prev) => ({
      ...prev,
      [appId]: { x: clampedX, y: clampedY },
    }));
  }, []);

  return {
    openWindowIds,
    minimizedIds,
    activeWindowId,
    zIndices,
    windowPositions,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMinimize,
    focusWindow,
    updateWindowPosition,
  };
}
