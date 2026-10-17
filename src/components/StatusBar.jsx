import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, Wifi } from 'lucide-react';
import SoundToggle from './SoundToggle';
import ThemeToggle from './ThemeToggle';
import { playClickSound } from '../utils/audio';

export default function StatusBar({ onStartClick, activeSection, onNavClick }) {
  const [currentTime, setCurrentTime] = useState('23:47');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="pip-taskbar" role="contentinfo" aria-label="PipOS System Taskbar">
      <div className="taskbar-left">
        <button
          type="button"
          className="pip-button pip-button-primary taskbar-start-btn"
          onClick={() => {
            playClickSound();
            if (onStartClick) onStartClick();
          }}
          aria-label="PipOS Start Menu"
        >
          <Heart size={14} fill="#FFF8F1" />
          <span>PipOS</span>
        </button>

        <nav className="taskbar-quick-links" aria-label="Desktop navigation">
          {[
            { id: 'hero', label: 'Meet Pip' },
            { id: 'projects', label: 'Projects (3)' },
            { id: 'story', label: 'Origin Story' },
            { id: 'dream-lab', label: 'Dream Dispatch' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`taskbar-window-tab ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                if (onNavClick) onNavClick(item.id);
              }}
            >
              <Sparkles size={11} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="taskbar-right">
        <ThemeToggle />
        <SoundToggle />

        <div className="taskbar-tray-item font-mono" title="Connected to Moonbeam Relay v2">
          <Wifi size={13} color="var(--pip-green)" />
          <span>NET: OK</span>
        </div>

        <div className="taskbar-tray-item font-mono taskbar-clock" title="Bedtime Clock">
          <Clock size={13} />
          <span>{currentTime}</span>
        </div>
      </div>
    </footer>
  );
}
