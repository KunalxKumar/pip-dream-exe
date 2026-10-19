import React from 'react';
import { Heart, Sparkles, Clock, Wifi, Folder, Music, Compass, Moon, Gamepad2, Star, BookOpen } from 'lucide-react';
import SoundToggle from './SoundToggle';
import ThemeToggle from './ThemeToggle';
import StarTrailToggle from './StarTrailToggle';
import { playClickSound } from '../utils/audio';
import { appsData } from '../data/appsData';

export default function StatusBar({
  openWindowIds = [],
  minimizedIds = {},
  activeWindowId,
  onWindowTabClick,
  onStartAppOpen,
  onOpenEasterEgg,
  viewportInfo,
  starTrailEnabled = true,
  onToggleStarTrail,
}) {
  const [currentTime, setCurrentTime] = React.useState('23:47');
  const [startMenuOpen, setStartMenuOpen] = React.useState(false);
  const startMenuRef = React.useRef(null);

  React.useEffect(() => {
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

  // Close start menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target)) {
        setStartMenuOpen(false);
      }
    };
    if (startMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startMenuOpen]);

  const getAppIcon = (id) => {
    switch (id) {
      case 'hero': return <Heart size={12} />;
      case 'projects': return <Folder size={12} />;
      case 'dream-memory': return <Gamepad2 size={12} />;
      case 'lullaby': return <Music size={12} />;
      case 'dream-route': return <Compass size={12} />;
      case 'nightlights': return <Moon size={12} />;
      case 'dream-log': return <Sparkles size={12} />;
      case 'dreambook': return <BookOpen size={12} />;
      case 'secret': return <Star size={12} />;
      default: return <Sparkles size={12} />;
    }
  };

  return (
    <footer className="pip-taskbar" role="contentinfo" aria-label="PipOS System Taskbar">
      {/* Start Menu Popup */}
      {startMenuOpen && (
        <div ref={startMenuRef} className="pip-start-menu font-retro" aria-label="PipOS Start Menu">
          <div className="pip-start-banner">
            <span className="font-pixel" style={{ color: 'var(--pip-yellow)' }}>♥ PipOS v1.0 1998</span>
            <span className="font-pixel" style={{ fontSize: '0.6rem', opacity: 0.8 }}>Tiny Magical Computer</span>
          </div>
          <div className="pip-start-divider" />
          <div className="pip-start-list">
            {appsData.map((app) => (
              <button
                key={app.id}
                type="button"
                className="pip-start-item"
                onClick={() => {
                  playClickSound();
                  setStartMenuOpen(false);
                  if (onStartAppOpen) onStartAppOpen(app.id);
                }}
              >
                <span className="start-item-icon">{app.emoji}</span>
                <div className="start-item-text">
                  <span className="font-retro">{app.title}</span>
                  <span className="font-pixel start-desc">{app.desc}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="pip-start-divider" />
          <button
            type="button"
            className="pip-start-item"
            onClick={() => {
              playClickSound();
              if (onToggleStarTrail) onToggleStarTrail();
            }}
          >
            <Sparkles size={14} color="var(--pip-yellow)" />
            <div className="start-item-text">
              <span className="font-retro">
                {starTrailEnabled ? '✦ Star Trail: ON' : '✧ Star Trail: OFF'}
              </span>
              <span className="font-pixel start-desc">Toggle cursor starlight</span>
            </div>
          </button>
          <button
            type="button"
            className="pip-start-item pip-start-footer-btn"
            onClick={() => {
              playClickSound();
              setStartMenuOpen(false);
              if (onOpenEasterEgg) onOpenEasterEgg();
            }}
          >
            <Star size={14} color="var(--pip-yellow)" />
            <span className="font-retro">★ About & Star Charm</span>
          </button>
        </div>
      )}

      <div className="taskbar-left">
        <button
          type="button"
          className={`pip-button pip-button-primary taskbar-start-btn ${startMenuOpen ? 'is-active' : ''}`}
          onClick={() => {
            playClickSound();
            setStartMenuOpen((prev) => !prev);
          }}
          aria-label="PipOS Start Menu"
          aria-expanded={startMenuOpen}
        >
          <Heart size={14} fill="#FFF8F1" />
          <span>PipOS / START</span>
        </button>

        {/* Dynamic Taskbar Tabs for Open Windows */}
        <nav className="taskbar-quick-links" aria-label="Open window tabs">
          {openWindowIds.map((appId) => {
            const app = appsData.find((a) => a.id === appId);
            if (!app) return null;
            const isActive = activeWindowId === appId && !minimizedIds[appId];
            const isMinimized = !!minimizedIds[appId];

            return (
              <button
                key={appId}
                type="button"
                className={`taskbar-window-tab ${isActive ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`}
                onClick={() => {
                  playClickSound();
                  if (onWindowTabClick) onWindowTabClick(appId);
                }}
                title={`${app.title} (${isMinimized ? 'Minimized' : isActive ? 'Active' : 'Open'})`}
              >
                {getAppIcon(appId)}
                <span className="font-pixel">{app.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="taskbar-right">
        <div className="taskbar-tray-item font-mono tray-visitor-counter" title="Early Web Souvenir #0042">
          <span>VISITOR #0042</span>
        </div>
        <div
          className="taskbar-tray-item font-mono tray-resolution-item"
          title={viewportInfo ? `${viewportInfo.resolutionTitle} (${viewportInfo.width}x${viewportInfo.height})` : 'Best Viewed at 800x600'}
        >
          <span className="res-badge-text">{viewportInfo?.chaosTag || '800x600'}</span>
        </div>
        <div className="taskbar-tray-item font-mono tray-patch-item" title="Last Dream Patch: 10/19/1998">
          <span>PATCH 10/19/98</span>
        </div>

        <StarTrailToggle
          enabled={starTrailEnabled}
          onToggle={onToggleStarTrail}
          className="taskbar-trail-toggle"
        />
        <ThemeToggle className="taskbar-theme-toggle" />
        <SoundToggle className="taskbar-sound-toggle" />

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
