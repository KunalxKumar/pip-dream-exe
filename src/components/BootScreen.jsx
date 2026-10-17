import React, { useState, useEffect } from 'react';
import { Sparkles, Moon } from 'lucide-react';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function BootScreen({ onBootComplete }) {
  const [percent, setPercent] = useState(0);
  const [statusItems, setStatusItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Progress Bar animation over ~1.3 seconds
    const start = performance.now();
    const duration = 1300;

    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setPercent(progress);

      if (progress >= 100) {
        clearInterval(timer);
        setIsReady(true);
        playChimeSound();
      }
    }, 40);

    // 2. Status items appearing in sync
    const timeouts = [
      setTimeout(() => {
        setStatusItems((prev) => [...prev, 'DREAM ENGINE ........ ONLINE']);
      }, 350),
      setTimeout(() => {
        setStatusItems((prev) => [...prev, 'LULLABY ENGINE ...... ONLINE']);
      }, 700),
      setTimeout(() => {
        setStatusItems((prev) => [...prev, 'NIGHTLIGHTS ......... ONLINE']);
      }, 1000),
      setTimeout(() => {
        setStatusItems((prev) => [...prev, 'DREAM ROUTER ........ ONLINE']);
      }, 1300),
    ];

    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Keyboard support: Enter key enters OS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        playClickSound();
        playChimeSound();
        onBootComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBootComplete]);

  const handleEnter = () => {
    playClickSound();
    playChimeSound();
    onBootComplete();
  };

  // Render ASCII progress blocks
  const totalBlocks = 16;
  const filledBlocks = Math.round((percent / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBarAscii = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div
      className="pip-boot-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="PIP.DREAM.EXE Startup Screen"
    >
      <div className="pip-boot-terminal">
        {/* Terminal Header */}
        <div className="pip-boot-header">
          <div className="boot-title">
            <Moon size={15} color="var(--pip-yellow)" />
            <span className="font-retro">PIP.DREAM.EXE</span>
          </div>
          <span className="font-mono boot-version">v1.9.8 NURSERY-OS</span>
        </div>

        {/* Terminal Body */}
        <div className="pip-boot-logs font-mono">
          <div className="boot-brand">
            <p className="boot-headline font-retro">PIP.DREAM.EXE</p>
            <p className="boot-subhead">MIDNIGHT NURSERY</p>
            <p className="boot-caption">DREAM ENGINEERING OS</p>
          </div>

          <div className="boot-divider">────────────────────────────────────</div>

          <div className="boot-init-row">
            <span className="font-pixel boot-init-label">INITIALIZING DREAM SYSTEM...</span>
            <div className="boot-progress-bar font-mono">
              <span className="progress-blocks">{progressBarAscii}</span>
              <span className="progress-num font-pixel">{percent}%</span>
            </div>
          </div>

          <div className="boot-status-section">
            <span className="status-header font-pixel">SYSTEM STATUS:</span>
            <div className="status-list">
              {statusItems.map((item, idx) => (
                <div key={idx} className="status-line">
                  <span className="status-dot">✔</span>
                  <span>{item}</span>
                </div>
              ))}
              {!isReady && <span className="boot-blinking-cursor">_</span>}
            </div>
          </div>
        </div>

        {/* Terminal Action Footer */}
        <div className="pip-boot-footer">
          <button
            type="button"
            className="pip-button pip-button-primary boot-enter-btn"
            onClick={handleEnter}
            autoFocus
          >
            <Sparkles size={14} />
            <span className="font-retro">[ PRESS ENTER ]</span>
          </button>
          <span className="boot-hint font-pixel text-center">
            {isReady ? 'System ready. Press Enter or click to enter Pip’s desktop.' : 'Warming up star lanterns...'}
          </span>
        </div>
      </div>
    </div>
  );
}
