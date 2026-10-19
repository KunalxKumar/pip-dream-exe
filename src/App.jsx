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
import { projectsData } from './data/projectsData';
import { appsData } from './data/appsData';
import { useWindowManager } from './hooks/useWindowManager';

export default function App() {
  const [hasBooted, setHasBooted] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [focusedGaze, setFocusedGaze] = useState(null);

  // Initialize Window Manager hook for Phase 1 Desktop OS
  const {
    openWindowIds,
    minimizedIds,
    activeWindowId,
    zIndices,
    windowPositions,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMinimize,
    focusWindow,
    updateWindowPosition,
  } = useWindowManager(['hero', 'projects']);

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
    } else {
      // Single click selects or focuses if open
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
        return <DreamMemory onCompleteRoute={() => openWindow('dream-route')} />;
      case 'lullaby':
        return <LullabyLab />;
      case 'dream-route':
        return <DreamRoute />;
      case 'nightlights':
        return <NightlightCollection />;
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

        {/* 90s Desktop Workspace with Left Icons */}
        <div className="pip-desktop-layout">
          <Desktop
            activeId={activeWindowId}
            onIconClick={handleDesktopIconAction}
            onEasterEggClick={() => setEasterEggOpen(true)}
            onItemHover={(gaze) => setFocusedGaze(gaze)}
            onItemLeave={() => setFocusedGaze(null)}
          />

          {/* Window Manager Canvas Area */}
          <div className="pip-windows-canvas" style={{ position: 'relative', flex: 1, minHeight: '100vh', overflow: 'hidden' }}>
            {openWindowIds.map((appId) => {
              const app = appsData.find((a) => a.id === appId);
              if (!app) return null;

              return (
                <WindowPanel
                  key={appId}
                  appId={appId}
                  title={app.title}
                  icon={<span role="img" aria-hidden="true">{app.emoji}</span>}
                  isMinimized={!!minimizedIds[appId]}
                  isActive={activeWindowId === appId}
                  position={windowPositions[appId] || { x: 80, y: 80 }}
                  zIndex={zIndices[appId] || 100}
                  onFocus={focusWindow}
                  onPositionChange={updateWindowPosition}
                  onMinimize={() => minimizeWindow(appId)}
                  onClose={() => closeWindow(appId)}
                  statusText={`${app.title} • RUNNING`}
                >
                  {renderWindowContent(appId)}
                </WindowPanel>
              );
            })}
          </div>
        </div>

        {/* 90s Taskbar Fixed Bottom with Start Menu & Dynamic Tabs */}
        <StatusBar
          openWindowIds={openWindowIds}
          minimizedIds={minimizedIds}
          activeWindowId={activeWindowId}
          onWindowTabClick={toggleMinimize}
          onStartAppOpen={handleStartAppOpen}
          onOpenEasterEgg={() => setEasterEggOpen(true)}
        />

        {/* System Message Notification Dialog */}
        <SystemNotification
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          onHelpPip={() => openWindow('dream-memory')}
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
