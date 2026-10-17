import { useState, useEffect } from 'react';

export function useMousePosition(elementRef) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isIdle: true,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Check if on touch/mobile device
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    if (prefersReducedMotion || isMobile) {
      // Gentle idle sinusoidal breathing for mobile / reduced motion
      let angle = 0;
      const interval = setInterval(() => {
        angle += 0.05;
        setPosition({
          x: Math.sin(angle) * 2,
          y: Math.cos(angle * 0.7) * 2,
          normalizedX: Math.sin(angle) * 0.3,
          normalizedY: Math.cos(angle * 0.7) * 0.3,
          isIdle: true,
        });
      }, 50);
      return () => clearInterval(interval);
    }

    const handleMouseMove = (e) => {
      if (elementRef && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
        const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

        // Subtle clamped pupil range
        const maxOffset = 4.5;
        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * maxOffset));
        const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * maxOffset));

        setPosition({
          x: clampedX,
          y: clampedY,
          normalizedX: deltaX,
          normalizedY: deltaY,
          isIdle: false,
        });
      } else {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        setPosition({
          x: normX * 4,
          y: normY * 4,
          normalizedX: normX,
          normalizedY: normY,
          isIdle: false,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [elementRef]);

  return position;
}
