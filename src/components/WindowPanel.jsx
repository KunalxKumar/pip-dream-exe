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

    const margin = 16;
    const taskbarHeight = 48;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - taskbarHeight - 48);

    const clampedX = Math.max(margin, Math.min(newX, maxX));
    const clampedY = Math.max(margin, Math.min(newY, maxY));

    onPositionChange(appId, clampedX, clampedY);
  }, [appId, onPositionChange, width]);

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

  // Viewport clamping on render to prevent windows from rendering partially off-screen
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
  const margin = 16;
  const taskbarHeight = 48;

  const maxAllowedX = Math.max(margin, viewportWidth - width - margin);
  const safeX = Math.max(margin, Math.min(position.x, maxAllowedX));

  const maxAllowedY = Math.max(margin, viewportHeight - taskbarHeight - 64);
  const safeY = Math.max(margin, Math.min(position.y, maxAllowedY));

  const style = {
    position: 'absolute',
    left: `${safeX}px`,
    top: `${safeY}px`,
    width: `${width}px`,
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: 'calc(100vh - 80px)',
    boxSizing: 'border-box',
    overflow: 'hidden',
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
              className="pip-window-btn minimize"
              onClick={() => handleControlClick(onMinimize)}
              aria-label="Minimize window"
              title="Minimize"
            >
              <Minus size={11} strokeWidth={3} />
            </button>
          )}
          {onMaximize && (
            <button
              type="button"
              className="pip-window-btn maximize"
              onClick={() => handleControlClick(onMaximize)}
              aria-label="Maximize window"
              title="Maximize"
            >
              <Square size={10} strokeWidth={3} />
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
