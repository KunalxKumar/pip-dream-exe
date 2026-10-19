import React, { useEffect, useRef } from 'react';

const POOL_SIZE = 16;
const PARTICLES = ['✦', '·', '★', '✧'];
const COLORS = ['#FCE7A2', '#F7D6E0', '#E8D7F1', '#FFFDF7'];
const SIZES = ['11px', '13px', '15px'];

export default function SparkleTrail({ isActive = true }) {
  const containerRef = useRef(null);
  const poolRef = useRef([]);
  const poolIdxRef = useRef(0);
  const lastPosRef = useRef({ x: -100, y: -100, time: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';
    const pool = [];

    // Pre-allocate bounded pool of 16 lightweight DOM elements
    for (let i = 0; i < POOL_SIZE; i++) {
      const span = document.createElement('span');
      span.className = 'sparkle-particle';
      span.style.position = 'fixed';
      span.style.pointerEvents = 'none';
      span.style.userSelect = 'none';
      span.style.zIndex = '999999';
      span.style.display = 'none';
      span.style.transform = 'translate(-50%, -50%)';
      span.style.textShadow = '0 0 4px rgba(252, 231, 162, 0.4)';
      span.setAttribute('aria-hidden', 'true');
      container.appendChild(span);
      pool.push({
        el: span,
        timer: null,
      });
    }
    poolRef.current = pool;

    if (!isActive) return;

    const handleMouseMove = (e) => {
      const now = performance.now();
      const last = lastPosRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dist = Math.hypot(dx, dy);

      // Throttle: require at least 14px movement or 45ms time elapsed
      if (dist < 14 && now - last.time < 45) {
        return;
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      // Spawn 1 to 2 subtle particles
      const count = Math.random() > 0.65 ? 2 : 1;

      for (let c = 0; c < count; c++) {
        const item = pool[poolIdxRef.current];
        poolIdxRef.current = (poolIdxRef.current + 1) % POOL_SIZE;

        if (item.timer) {
          clearTimeout(item.timer);
        }

        const glyph = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = SIZES[Math.floor(Math.random() * SIZES.length)];
        const offsetX = (Math.random() - 0.5) * 16;
        const offsetY = (Math.random() - 0.5) * 16;
        const lifetime = 400 + Math.random() * 250; // ~400ms to 650ms

        const el = item.el;
        el.textContent = glyph;
        el.style.color = color;
        el.style.fontSize = size;
        el.style.left = `${e.clientX + offsetX}px`;
        el.style.top = `${e.clientY + offsetY}px`;
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.transition = `transform ${lifetime}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${lifetime}ms ease-out`;
        el.style.transform = 'translate(-50%, -50%) scale(1)';

        // Animate drifting down & fading in requestAnimationFrame
        requestAnimationFrame(() => {
          const driftY = 12 + Math.random() * 16;
          const driftX = (Math.random() - 0.5) * 14;
          el.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.4)`;
          el.style.opacity = '0';
        });

        item.timer = setTimeout(() => {
          el.style.display = 'none';
          el.style.transition = 'none';
          item.timer = null;
        }, lifetime);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      pool.forEach((item) => {
        if (item.timer) clearTimeout(item.timer);
      });
      container.innerHTML = '';
    };
  }, [isActive]);

  return <div ref={containerRef} className="pip-sparkle-trail-container" aria-hidden="true" />;
}
