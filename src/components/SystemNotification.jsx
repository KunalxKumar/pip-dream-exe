import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Bell } from 'lucide-react';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function SystemNotification({ isOpen, onClose, onHelpPip }) {
  if (!isOpen) return null;

  const handleHelp = () => {
    playChimeSound();
    onHelpPip();
    onClose();
  };

  const handleClose = () => {
    playClickSound();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.aside
        className="pip-system-notification"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        role="alert"
        aria-live="polite"
        aria-label="PipOS System Message"
      >
        <div className="pip-window notification-window">
          {/* Notification Window Header */}
          <div className="pip-window-header notification-header">
            <div className="pip-window-title">
              <Bell size={12} color="var(--pip-yellow)" />
              <span className="font-pixel">✦ PIPOS SYSTEM MESSAGE</span>
            </div>
            <div className="pip-window-controls">
              <button
                type="button"
                className="pip-window-btn close"
                onClick={handleClose}
                aria-label="Dismiss system notification"
                title="Dismiss"
              >
                <X size={10} />
              </button>
            </div>
          </div>

          {/* Notification Body */}
          <div className="pip-window-body notification-body">
            <div className="notification-status font-mono">
              <span className="queue-badge">● PRIORITY PACKET</span>
              <span className="queue-time">23:47</span>
            </div>

            <h4 className="notification-title font-retro">1 DREAM IS WAITING.</h4>
            <p className="notification-text font-body">
              Someone forgot how to sleep under the starlight.
            </p>

            <div className="notification-actions">
              <button
                type="button"
                className="pip-button pip-button-primary notification-cta-btn"
                onClick={handleHelp}
                autoFocus
              >
                <Sparkles size={13} />
                <span className="font-retro">[ HELP PIP ]</span>
              </button>
              <button
                type="button"
                className="pip-button notification-dismiss-btn"
                onClick={handleClose}
              >
                <span className="font-retro">[ LATER ]</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
