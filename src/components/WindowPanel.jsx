import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function WindowPanel({
  title = 'PipOS Window',
  icon,
  children,
  className = '',
  onClose,
  onMinimize,
  onMaximize,
  statusText,
  headerActions,
  isMinimized = false,
}) {
  const handleControlClick = (callback) => {
    playClickSound();
    if (callback) callback();
  };

  return (
    <div className={`pip-window ${className}`}>
      {/* 90s Retro Window Header */}
      <div className="pip-window-header">
        <div className="pip-window-title">
          <span className="pip-title-grip" aria-hidden="true">≡ ≡ ≡</span>
          {icon && <span className="window-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="pip-window-controls">
          {headerActions}
          {onMinimize && (
            <button
              type="button"
              className="pip-window-btn"
              onClick={() => handleControlClick(onMinimize)}
              aria-label="Minimize window"
              title="Minimize"
            >
              <Minus size={10} strokeWidth={3} />
            </button>
          )}
          {onMaximize && (
            <button
              type="button"
              className="pip-window-btn"
              onClick={() => handleControlClick(onMaximize)}
              aria-label="Maximize window"
              title="Maximize"
            >
              <Square size={9} strokeWidth={3} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="pip-window-btn close"
              onClick={() => handleControlClick(onClose)}
              aria-label="Close window"
              title="Close"
            >
              <X size={10} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <>
          <div className="pip-window-body">{children}</div>
          {statusText ? (
            <div className="pip-status-bar font-pixel">
              <span className="pip-status-field">{statusText}</span>
              <span className="pip-status-system-tag">
                SYS_READY | 432Hz | MEM: 64KB
              </span>
            </div>
          ) : (
            <div className="pip-status-bar font-pixel">
              <span className="pip-status-field">SYS_READY</span>
              <span className="pip-status-system-tag">
                SYS_READY | 432Hz | MEM: 64KB
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
