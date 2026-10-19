import React from 'react';
import { Minus, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function WindowPanel({
  appId,
  title = 'PipOS Window',
  icon,
  children,
  className = '',
  onClose,
  onMinimize,
  onFocus,
  statusText,
  headerActions,
  isMinimized = false,
  isActive = true,
  width = 640,
}) {
  const handleControlClick = (callback) => {
    playClickSound();
    if (callback) callback();
  };

  const style = {
    width: `${width}px`,
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    margin: '0 auto',
  };

  return (
    <div
      className={`pip-window ${isActive ? 'is-active' : ''} ${className}`}
      style={style}
      onClick={() => {
        if (onFocus && appId) onFocus(appId);
      }}
    >
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
              className="pip-window-btn minimize"
              onClick={() => handleControlClick(onMinimize)}
              aria-label="Minimize window"
              title="Minimize"
            >
              <Minus size={11} strokeWidth={3} />
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
              <X size={11} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <>
          <div className="pip-window-body">{children}</div>
          <div className="pip-status-bar font-pixel">
            <span className="pip-status-field">
              {statusText || (isActive ? 'SYS_ACTIVE' : 'SYS_READY')}
            </span>
            <span className="pip-status-system-tag">
              SYS_READY | 432Hz | MEM: 64KB
            </span>
          </div>
        </>
      )}
    </div>
  );
}
