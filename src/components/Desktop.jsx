import React from 'react';
import { playClickSound } from '../utils/audio';

export default function Desktop({ onIconClick, onEasterEggClick }) {
  const desktopIcons = [
    { id: 'hero', emoji: '👶', label: 'PIP', desc: 'Meet Pip' },
    { id: 'projects', emoji: '📁', label: 'PROJECTS', desc: '3 Inventions' },
    { id: 'story', emoji: '🌙', label: 'DREAM LOG', desc: 'Origin Chronicle' },
    { id: 'lullaby-lab', emoji: '🎵', label: 'LULLABY LAB', desc: '432 Hz Synthesizer' },
    { id: 'nightlight-lab', emoji: '🏮', label: 'NIGHTLIGHTS', desc: 'Lantern Daemon' },
    { id: 'dream-route', emoji: '🗺️', label: 'DREAM ROUTES', desc: 'Cloud Delivery' },
  ];

  return (
    <aside className="pip-desktop-icons" aria-label="Desktop icons">
      {desktopIcons.map((item) => (
        <button
          key={item.id}
          type="button"
          className="desktop-icon-btn"
          onClick={() => {
            playClickSound();
            if (onIconClick) onIconClick(item.id);
          }}
          aria-label={`Open ${item.label}: ${item.desc}`}
          title={`${item.label} — ${item.desc}`}
        >
          <div className="icon-graphic">
            <span className="icon-emoji" role="img" aria-hidden="true">
              {item.emoji}
            </span>
          </div>
          <span className="font-pixel icon-label">{item.label}</span>
        </button>
      ))}

      {/* Secret Moon Charm Easter Egg icon */}
      <button
        type="button"
        className="desktop-icon-btn secret-moon-btn"
        onClick={() => {
          playClickSound();
          if (onEasterEggClick) onEasterEggClick();
        }}
        title="Pip's Secret Moon Charm"
        aria-label="Pip's Secret Moon Charm"
      >
        <div className="icon-graphic moon-glow">
          <span className="icon-emoji" role="img" aria-hidden="true">
            ⭐
          </span>
        </div>
        <span className="font-pixel icon-label">SECRET.KEY</span>
      </button>
    </aside>
  );
}
