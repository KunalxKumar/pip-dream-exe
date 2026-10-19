import React from 'react';
import { playClickSound } from '../utils/audio';

export default function StarTrailToggle({
  enabled = true,
  onToggle,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`pip-button ${enabled ? 'pip-button-primary' : 'pip-button-soft'} ${className}`}
      onClick={() => {
        playClickSound();
        if (onToggle) onToggle();
      }}
      title={
        enabled
          ? 'Star Trail: ON (Click to turn OFF)'
          : 'Star Trail: OFF (Click to turn ON)'
      }
      aria-label={
        enabled
          ? 'Disable Sparkle Cursor Trail'
          : 'Enable Sparkle Cursor Trail'
      }
      style={{ padding: '6px 10px', fontSize: '0.68rem', whiteSpace: 'nowrap' }}
    >
      <span className="font-retro">{enabled ? '✦ STAR TRAIL: ON' : '✧ STAR TRAIL: OFF'}</span>
    </button>
  );
}
