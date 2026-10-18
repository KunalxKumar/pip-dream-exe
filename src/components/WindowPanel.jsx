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
              <Minus size={10} />
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
              <Square size={9} />
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
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <>
          <div className="pip-window-body">{children}</div>
          {statusText && (
            <div className="pip-status-bar">
              <span className="pip-status-field">{statusText}</span>
              <span className="font-pixel pip-status-system-tag">
                PipOS 1998
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
