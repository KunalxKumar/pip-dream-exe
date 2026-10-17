import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
  const { theme, isMidnight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`pip-button ${isMidnight ? 'pip-button-primary' : ''} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isMidnight ? 'Day' : 'Night'} Mode`}
      title={`Current: ${isMidnight ? '☾ NIGHT' : '☀ DAY'}`}
      style={{ padding: '6px 12px', fontSize: '0.68rem' }}
    >
      {!isMidnight ? (
        <>
          <Sun size={13} color="#D97706" />
          <span className="font-retro">☀ DAY</span>
        </>
      ) : (
        <>
          <Moon size={13} color="#FCE7A2" />
          <span className="font-retro">☾ NIGHT</span>
        </>
      )}
    </button>
  );
}
