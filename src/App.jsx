import React, { useState } from 'react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import Pip from './components/Pip';
import ProjectCard from './components/ProjectCard';
import LullabyLab from './components/LullabyLab';
import DreamRoute from './components/DreamRoute';
import NightlightCollection from './components/NightlightCollection';
import StoryScene from './components/StoryScene';
import EasterEgg from './components/EasterEgg';
import StatusBar from './components/StatusBar';
import SystemNotification from './components/SystemNotification';
import WindowPanel from './components/WindowPanel';
import DreamMemory from './components/DreamMemory';
import Dreambook from './components/Dreambook';
import { projectsData } from './data/projectsData';
import { appsData } from './data/appsData';
import { useWindowManager } from './hooks/useWindowManager';
import { useDreamMission } from './hooks/useDreamMission';
import { useViewportMode } from './hooks/useViewportMode';
import ThemeToggle from './components/ThemeToggle';
import SoundToggle from './components/SoundToggle';
import { playClickSound } from './utils/audio';

export default function App() {
  const [hasBooted, setHasBooted] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [focusedGaze, setFocusedGaze] = useState(null);

  // Initialize Viewport Mode Hook for Responsive Chaos
  const viewportInfo = useViewportMode();

  // Initialize Dream Mission State Hook
  const missionState = useDreamMission();

  // Initialize Window Manager hook for Phase 1 Desktop OS
  const {
    openWindowIds,
    minimizedIds,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMinimize,
    focusWindow,
  } = useWindowManager(['hero']);

  // Trigger system notification 800ms after boot finishes
  const handleBootComplete = () => {
    setHasBooted(true);
    setTimeout(() => {
      setNotificationOpen(true);
    }, 800);
  };

  const handleDesktopIconAction = (appId, action) => {
    if (action === 'open') {
      openWindow(appId);
      if (appId === 'dream-memory') {
        setNotificationOpen(false);
      }
    } else {
      if (openWindowIds.includes(appId)) {
        focusWindow(appId);
      }
    }
  };

  const handleStartAppOpen = (appId) => {
    if (appId === 'secret') {
      setEasterEggOpen(true);
    } else {
      openWindow(appId);
    }
  };

  const renderWindowContent = (appId) => {
    switch (appId) {
      case 'hero':
        return (
          <Pip
            onEnterDreamspace={() => openWindow('projects')}
            onTriggerEasterEgg={() => setEasterEggOpen(true)}
            focusedGaze={focusedGaze}
            missionState={missionState}
            onDeliverDream={missionState.deliverDream}
          />
        );
      case 'projects':
        return (
          <div className="projects-window-content">
            <div className="section-title-bar" style={{ marginBottom: '16px' }}>
              <span className="font-retro title-text">PROJECTS & BEDTIME ENGINES</span>
              <span className="font-pixel subtitle-text">[ 3 Systems Operational ]</span>
            </div>
            <div className="projects-grid">
              {projectsData.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onInteract={(toolId) => {
                    const mapping = {
                      'lullaby-lab': 'lullaby',
                      'dream-route': 'dream-route',
                      'nightlight-lab': 'nightlights',
                    };
                    const target = mapping[toolId] || 'lullaby';
                    openWindow(target);
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'dream-memory':
        return (
          <DreamMemory
            onCompleteRoute={() => {
              missionState.completeDreamMemory();
              openWindow('dream-route');
            }}
          />
        );
      case 'lullaby':
        return (
          <LullabyLab
            isCompleted={missionState.lullabyComplete}
            onLullabyComplete={missionState.completeLullaby}
          />
        );
      case 'dream-route':
        return (
          <DreamRoute
            isCompleted={missionState.routeComplete}
            onRouteComplete={missionState.completeRoute}
          />
        );
      case 'nightlights':
        return (
          <NightlightCollection
            isCompleted={missionState.nightlightComplete}
            onNightlightComplete={missionState.completeNightlight}
          />
        );
      case 'dream-log':
        return (
          <div>
            <div className="section-title-bar" style={{ marginBottom: '16px' }}>
              <span className="font-retro title-text">PIP'S MIDNIGHT CHRONICLE</span>
              <span className="font-pixel subtitle-text">[ Origin Log 23:47 → 01:03 ]</span>
            </div>
            <StoryScene />
          </div>
        );
      case 'dreambook':
        return (
          <Dreambook
            isMissionActive={!missionState.dreamDelivered}
          />
        );
      default:
        return <div>App content loading...</div>;
    }
  };

  return (
    <div className="pip-os-root">
      {/* Phase 2 Boot Screen */}
      {!hasBooted && (
        <BootScreen onBootComplete={handleBootComplete} />
      )}

      {/* Main 90s Operating System Desktop */}
      <div className="pip-desktop-environment">
        {/* Floating Decorative Nursery Stars & Drifting Moonbeam */}
        <div className="nursery-stars-layer" aria-hidden="true">
          <span className="star-twinkle s1">✦</span>
          <span className="star-twinkle s2">★</span>
          <span className="star-twinkle s3">✦</span>
          <span className="star-twinkle s4">★</span>
          <span className="star-twinkle s5">✦</span>
          <div className="drifting-starmote m1" />
          <div className="drifting-starmote m2" />
        </div>

        {/* Pocket PipOS Header & App Dock (for mobile viewports <= 768px) */}
        {viewportInfo.isMobile && (
          <header className="pocket-pipos-header" aria-label="Pocket PipOS Mobile Interface">
            <div className="pocket-header-top">
              <div className="pocket-brand">
                <span className="pocket-title font-pixel">♥ PIPOS POCKET</span>
                <span className="pocket-tag font-pixel" title={viewportInfo.chaosMessage}>
                  {viewportInfo.chaosTag}
                </span>
              </div>
              <div className="pocket-toggles">
                <ThemeToggle />
                <SoundToggle />
              </div>
            </div>

            <div className="pocket-sub-bar font-pixel">
              <div className="pocket-mission-badge" title="Pip's Bedtime Mission State">
                <span className="mission-star">★</span>
                <span>MISSION: {missionState.completedCount}/4 COMPLETE</span>
              </div>
              <div className="pocket-res-badge font-mono" title={viewportInfo.resolutionTitle}>
                <span>{viewportInfo.width}x{viewportInfo.height}</span>
              </div>
            </div>

            {/* Playful Retro Chaos Status Ticker */}
            <div className="pocket-chaos-ticker font-pixel" role="status" aria-live="polite">
              <span className="ticker-sparkle">✦</span>
              <span className="ticker-text">{viewportInfo.chaosMessage}</span>
              <span className="ticker-sparkle">✦</span>
            </div>

            {/* Pocket Application Quick Launch Dock */}
            <nav className="pocket-app-dock" aria-label="Pocket PipOS Applications">
              {appsData.map((app) => {
                const isActive = activeWindowId === app.id && !minimizedIds[app.id];
                return (
                  <button
                    key={app.id}
                    type="button"
                    className={`pocket-dock-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      playClickSound();
                      if (app.id === 'secret') {
                        setEasterEggOpen(true);
                      } else {
                        openWindow(app.id);
                        if (app.id === 'dream-memory') {
                          setNotificationOpen(false);
                        }
                      }
                    }}
                    aria-label={`Open ${app.title}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="dock-icon">{app.emoji}</span>
                    <span className="dock-label font-pixel">{app.shortLabel}</span>
                    {isActive && <span className="dock-active-indicator" aria-hidden="true" />}
                  </button>
                );
              })}
            </nav>
          </header>
        )}

        {/* 90s Desktop Workspace with Left Icons */}
        <div className="pip-desktop-layout">
          <Desktop
            activeId={activeWindowId}
            onIconClick={handleDesktopIconAction}
            onEasterEggClick={() => setEasterEggOpen(true)}
            onItemHover={(gaze) => setFocusedGaze(gaze)}
            onItemLeave={() => setFocusedGaze(null)}
          />

          {/* Centered Active Window Workspace */}
          <main className="pip-windows-canvas" aria-label="Active Desktop Application Workspace">
            {(() => {
              const activeApp = appsData.find((a) => a.id === activeWindowId) || appsData[0];
              const isMinimized = !!minimizedIds[activeWindowId];

              if (isMinimized) {
                return (
                  <div className="pip-desktop-idle-placeholder font-pixel">
                    <span className="idle-sparkle font-retro">✦ PIPOS IDLE ✦</span>
                    <span style={{ fontSize: '1.2rem' }}>WINDOW MINIMIZED TO TASKBAR</span>
                    <button
                      type="button"
                      className="pip-button pip-button-primary"
                      onClick={() => toggleMinimize(activeApp.id)}
                      style={{ marginTop: '8px' }}
                    >
                      <span>RESTORE {activeApp.shortLabel}</span>
                    </button>
                  </div>
                );
              }

              return (
                <WindowPanel
                  key={activeApp.id}
                  appId={activeApp.id}
                  title={activeApp.title}
                  icon={<span role="img" aria-hidden="true">{activeApp.emoji}</span>}
                  isMinimized={false}
                  isActive={true}
                  width={activeApp.width}
                  onMinimize={() => minimizeWindow(activeApp.id)}
                  onClose={() => {
                    closeWindow(activeApp.id);
                    if (activeApp.id !== 'hero') {
                      openWindow('hero');
                    }
                  }}
                  statusText={`${activeApp.title} • ACTIVE`}
                >
                  {renderWindowContent(activeApp.id)}
                </WindowPanel>
              );
            })()}
          </main>
        </div>

        {/* 90s Taskbar Fixed Bottom with Start Menu, Visitor Counter, and Dynamic Tabs */}
        <StatusBar
          openWindowIds={openWindowIds}
          minimizedIds={minimizedIds}
          activeWindowId={activeWindowId}
          onWindowTabClick={toggleMinimize}
          onStartAppOpen={handleStartAppOpen}
          onOpenEasterEgg={() => setEasterEggOpen(true)}
          viewportInfo={viewportInfo}
        />

        {/* System Message Notification Dialog */}
        <SystemNotification
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          onHelpPip={() => {
            openWindow('dream-memory');
            setNotificationOpen(false);
          }}
        />

        {/* Easter Egg Modal */}
        <EasterEgg
          isOpen={easterEggOpen}
          onClose={() => setEasterEggOpen(false)}
        />
      </div>
    </div>
  );
}
