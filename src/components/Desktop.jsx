import React from 'react';
import { playClickSound } from '../utils/audio';

export default function Desktop({
  activeId = 'hero',
  onIconClick,
  onEasterEggClick,
  onItemHover,
  onItemLeave,
}) {
  const desktopIcons = [
    { id: 'hero', emoji: '👶', label: 'PIP', desc: 'Meet Pip', gazeTarget: 'sidebar' },
    { id: 'projects', emoji: '📁', label: 'PROJECTS', desc: '3 Inventions', gazeTarget: 'sidebar' },
    { id: 'story', emoji: '🌙', label: 'DREAM LOG', desc: 'Origin Chronicle', gazeTarget: 'sidebar' },
    { id: 'lullaby-lab', emoji: '🎵', label: 'LULLABY', desc: '432 Hz Synthesizer', gazeTarget: 'sidebar' },
    { id: 'nightlight-lab', emoji: '🏮', label: 'LIGHTS', desc: 'Lantern Daemon', gazeTarget: 'sidebar' },
    { id: 'dream-route', emoji: '🗺️', label: 'ROUTES', desc: 'Cloud Delivery', gazeTarget: 'sidebar' },
  ];

  return (
    <aside className="pip-desktop-icons" aria-label="Desktop icons">
      {desktopIcons.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`desktop-icon-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => {
              playClickSound();
              if (onIconClick) onIconClick(item.id);
            }}
            onMouseEnter={() => {
              if (onItemHover) onItemHover(item.gazeTarget);
            }}
            onMouseLeave={() => {
              if (onItemLeave) onItemLeave();
            }}
            aria-label={`Open ${item.label}: ${item.desc}`}
            aria-current={isActive ? 'page' : undefined}
            title={`${item.label} — ${item.desc}`}
          >
            <div className="icon-graphic">
              <span className="icon-emoji" role="img" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="icon-sparkle-hover" aria-hidden="true">✦</span>
            </div>
            <span className="font-pixel icon-label">{item.label}</span>
          </button>
        );
      })}

      {/* Understated Mystery Charm Easter Egg */}
      <button
        type="button"
        className="desktop-icon-btn secret-moon-btn mystery-star-btn"
        onClick={() => {
          playClickSound();
          if (onEasterEggClick) onEasterEggClick();
        }}
        onMouseEnter={() => {
          if (onItemHover) onItemHover('sidebar');
        }}
        onMouseLeave={() => {
          if (onItemLeave) onItemLeave();
        }}
        title="Pip's Star Charm"
        aria-label="Pip's Star Charm"
      >
        <div className="icon-graphic moon-glow">
          <span className="icon-emoji" role="img" aria-hidden="true">
            ★
          </span>
          <span className="icon-sparkle-hover" aria-hidden="true">✨</span>
        </div>
        <span className="font-pixel icon-label">★</span>
      </button>
    </aside>
  );
}
