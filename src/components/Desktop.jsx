import React, { useState } from 'react';
import { playClickSound } from '../utils/audio';
import { appsData } from '../data/appsData';

export default function Desktop({
  activeId = 'hero',
  onIconClick,
  onEasterEggClick,
  onItemHover,
  onItemLeave,
}) {
  const [selectedId, setSelectedId] = useState(activeId);

  const desktopIcons = appsData.filter((app) => app.id !== 'secret');

  const handleIconClick = (appId) => {
    playClickSound();
    setSelectedId(appId);
    if (onIconClick) {
      onIconClick(appId, 'open');
    }
  };

  const handleIconDoubleClick = (appId) => {
    playClickSound();
    setSelectedId(appId);
    if (onIconClick) {
      onIconClick(appId, 'open');
    }
  };

  const handleKeyDown = (e, appId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleIconDoubleClick(appId);
    }
  };

  return (
    <aside className="pip-desktop-icons" aria-label="Desktop icons">
      {desktopIcons.map((item) => {
        const isSelected = selectedId === item.id;
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`desktop-icon-btn ${isSelected ? 'is-selected' : ''} ${isActive ? 'is-active' : ''}`}
            onClick={() => handleIconClick(item.id)}
            onDoubleClick={() => handleIconDoubleClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            onMouseEnter={() => {
              if (onItemHover) onItemHover('sidebar');
            }}
            onMouseLeave={() => {
              if (onItemLeave) onItemLeave();
            }}
            aria-label={`Open ${item.shortLabel}: ${item.desc}`}
            aria-current={isActive ? 'page' : undefined}
            title={`${item.title} — Double-click or Enter to open`}
          >
            <div className="icon-graphic">
              <span className="icon-emoji" role="img" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="icon-sparkle-hover" aria-hidden="true">✦</span>
            </div>
            <span className="font-pixel icon-label">{item.shortLabel}</span>
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
        title="Pip's Star Charm — Secret Easter Egg"
        aria-label="Pip's Star Charm"
      >
        <div className="icon-graphic moon-glow">
          <span className="icon-emoji" role="img" aria-hidden="true">
            ★
          </span>
          <span className="icon-sparkle-hover" aria-hidden="true">✨</span>
        </div>
        <span className="font-pixel icon-label">SECRET</span>
      </button>
    </aside>
  );
}
