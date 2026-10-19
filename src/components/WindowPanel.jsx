import React, { useRef, useCallback, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function WindowPanel({
  appId,
  title = 'PipOS Window',
  icon,
  children,
  className = '',
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  statusText,
  headerActions,
  isMinimized = false,
  isActive = false,
  position = { x: 80, y: 80 },
  width = 720,
  zIndex = 100,
  onPositionChange,
}) {
  const windowRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleControlClick = (callback) => {
    playClickSound();
    if (callback) callback();
  };

  const handleMouseDown = (e) => {
    if (onFocus && appId) {
      onFocus(appId);
    }

    // Disable dragging on mobile (<= 768px)
    if (window.innerWidth <= 768) return;

    // Only drag from title bar
    if (e.target.closest('.pip-window-controls')) return;

    isDraggingRef.current = true;
    const rect = windowRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !onPositionChange || !appId) return;

    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;

    onPositionChange(appId, newX, newY);
  }, [appId, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${width}px`,
    maxWidth: 'calc(100vw - 160px)',
    zIndex: zIndex,
  };

  return (
    <div
      ref={windowRef}
      className={`pip-window ${isActive ? 'is-active' : ''} ${className}`}
      style={style}
      onClick={() => {
        if (onFocus && appId) onFocus(appId);
      }}
    >
      {/* 90s Retro Window Header (Draggable) */}
      <div
        className="pip-window-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: window.innerWidth > 768 ? 'grab' : 'default' }}
      >
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
