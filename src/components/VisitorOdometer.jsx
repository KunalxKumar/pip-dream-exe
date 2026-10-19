import React from 'react';
import { useVisitorCounter } from '../hooks/useVisitorCounter';

/**
 * Format a number into zero-padded array of character digits (e.g. 42 -> ['0', '0', '4', '2']).
 */
function padDigits(num, minLength = 4) {
  const str = String(Math.max(0, num || 0));
  const padded = str.length < minLength ? str.padStart(minLength, '0') : str;
  return padded.split('');
}

/**
 * Single mechanical odometer digit reel.
 */
function OdometerReel({ prevDigit, currentDigit, isRolling, delay = 0 }) {
  const hasChanged = prevDigit !== currentDigit;

  if (!isRolling || !hasChanged) {
    return (
      <span className="pip-odometer-digit font-mono" aria-hidden="true">
        {currentDigit}
      </span>
    );
  }

  return (
    <span className="pip-odometer-digit-reel font-mono" aria-hidden="true">
      <span
        className="pip-odometer-reel-strip is-rolling"
        style={{ animationDelay: `${delay}ms` }}
      >
        <span className="pip-odometer-digit-frame">{prevDigit}</span>
        <span className="pip-odometer-digit-frame">{currentDigit}</span>
      </span>
    </span>
  );
}

/**
 * Retro Visitor Hit Counter Odometer Component
 */
export default function VisitorOdometer({
  variant = 'taskbar',
  showFooter = false,
  className = '',
}) {
  const { count, prevCount, isRolling, visitorId } = useVisitorCounter();

  const currentDigits = padDigits(count, 4);
  const prevDigits = padDigits(prevCount, 4);
  const formattedNumber = currentDigits.join('');

  if (variant === 'start-menu') {
    return (
      <div
        className={`pip-odometer-start-card font-mono ${className}`}
        title={`Assigned Session ID: ${visitorId || 'PIP-0042'}`}
      >
        <div className="odometer-header-row font-pixel">
          <span className="odometer-title">YOU ARE VISITOR</span>
          <span className="odometer-led-online">
            <span className="odometer-led-pulse" />
            COUNTER ONLINE
          </span>
        </div>
        <div className="pip-odometer-display-box" aria-label={`Visitor count ${formattedNumber}`}>
          <span className="pip-odometer-hash">#</span>
          <div className="pip-odometer-digits-cluster">
            {currentDigits.map((digit, idx) => (
              <OdometerReel
                key={idx}
                prevDigit={prevDigits[idx] || '0'}
                currentDigit={digit}
                isRolling={isRolling}
                delay={idx * 50}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default 'taskbar' tray variant
  return (
    <div
      className={`pip-odometer-tray-container ${className}`}
      title={`YOU ARE VISITOR #${formattedNumber} • COUNTER ONLINE`}
      aria-label={`Visitor number ${formattedNumber}`}
    >
      <span className="pip-odometer-label font-mono">VISITOR</span>
      <div className="pip-odometer-display-box">
        <span className="pip-odometer-hash font-mono">#</span>
        <div className="pip-odometer-digits-cluster font-mono">
          {currentDigits.map((digit, idx) => (
            <OdometerReel
              key={idx}
              prevDigit={prevDigits[idx] || '0'}
              currentDigit={digit}
              isRolling={isRolling}
              delay={idx * 50}
            />
          ))}
        </div>
      </div>
      {showFooter && (
        <span className="pip-odometer-status-footer font-pixel">
          <span className="odometer-led-pulse" />
          COUNTER ONLINE
        </span>
      )}
    </div>
  );
}
