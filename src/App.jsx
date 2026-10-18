import React, { useState, useRef, useEffect } from 'react';
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
import { projectsData } from './data/projectsData';
import { Sparkles, Moon, Compass } from 'lucide-react';
import { playClickSound } from './utils/audio';

export default function App() {
  const [hasBooted, setHasBooted] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [focusedGaze, setFocusedGaze] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeTool, setActiveTool] = useState('lullaby-lab');

  // Section refs for smooth scrolling & scroll tracking
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const storyRef = useRef(null);
  const interactiveRef = useRef(null);

  // Trigger system notification 800ms after boot finishes
  const handleBootComplete = () => {
    setHasBooted(true);
    setTimeout(() => {
      setNotificationOpen(true);
    }, 800);
  };

  // Scroll spy to highlight taskbar windows dynamically as user scrolls
  useEffect(() => {
    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'projects', ref: projectsRef },
      { id: 'story', ref: storyRef },
      { id: 'dream-lab', ref: interactiveRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.ref.current === entry.target);
            if (match) {
              setActiveSection(match.id);
            }
          }
        });
      },
      { threshold: 0.35, rootMargin: '-40px 0px -40px 0px' }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [hasBooted]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    if (id === 'hero' && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'projects' && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'story' && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if ((id === 'dream-lab' || id === 'lullaby-lab' || id === 'dream-route' || id === 'nightlight-lab') && interactiveRef.current) {
      if (id !== 'dream-lab') setActiveTool(id);
      interactiveRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId);
    if (interactiveRef.current) {
      interactiveRef.current.scrollIntoView({ behavior: 'smooth' });
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
            activeId={activeSection === 'dream-lab' ? activeTool : activeSection}
            onIconClick={scrollToSection}
            onEasterEggClick={() => setEasterEggOpen(true)}
            onItemHover={(gaze) => setFocusedGaze(gaze)}
            onItemLeave={() => setFocusedGaze(null)}
          />

          {/* Main Scrollable Canvas for Pip's World */}
          <main className="pip-window-stack" id="main-content">
            {/* 1. Hero Section: Meet Pip */}
            <section ref={heroRef} id="hero-section" aria-label="Meet Pip">
              <Pip
                onEnterDreamspace={() => scrollToSection('projects')}
                onTriggerEasterEgg={() => setEasterEggOpen(true)}
                focusedGaze={focusedGaze}
              />
            </section>

            {/* 2. Projects Section: 3 Pip Projects */}
            <section ref={projectsRef} id="projects-section" aria-label="Pip's Projects" style={{ marginTop: '28px' }}>
              <div className="section-title-bar">
                <span className="font-retro title-text">PROJECTS & BEDTIME ENGINES</span>
                <span className="font-pixel subtitle-text">[ 3 Systems Operational ]</span>
              </div>
              <div className="projects-grid">
                {projectsData.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onInteract={handleToolSelect}
                  />
                ))}
              </div>
            </section>

            {/* 3. Origin Story Section: 6-Scene Origin Chronicle */}
            <section ref={storyRef} id="story-section" aria-label="Pip's Origin Story" style={{ marginTop: '36px' }}>
              <div className="section-title-bar">
                <span className="font-retro title-text">PIP'S MIDNIGHT CHRONICLE</span>
                <span className="font-pixel subtitle-text">[ Origin Log 23:47 → 01:03 ]</span>
              </div>
              <StoryScene />
            </section>

            {/* 4. Interactive Bedtime Laboratory */}
            <section ref={interactiveRef} id="interactive-section" aria-label="Interactive Dream Lab" style={{ marginTop: '36px' }}>
              <div className="section-title-bar">
                <span className="font-retro title-text">INTERACTIVE DREAM WORKBENCH</span>
                <span className="font-pixel subtitle-text">[ Help Pip Deliver Dreams ]</span>
              </div>

              {/* Workbench Tab Switcher */}
              <div className="workbench-selector-bar">
                <button
                  type="button"
                  className={`pip-button ${activeTool === 'lullaby-lab' ? 'pip-button-primary' : ''}`}
                  onClick={() => {
                    playClickSound();
                    setActiveTool('lullaby-lab');
                  }}
                >
                  <Sparkles size={13} />
                  <span>PROJECT 01: LULLABY LAB</span>
                </button>
                <button
                  type="button"
                  className={`pip-button ${activeTool === 'dream-route' ? 'pip-button-primary' : ''}`}
                  onClick={() => {
                    playClickSound();
                    setActiveTool('dream-route');
                  }}
                >
                  <Compass size={13} />
                  <span>PROJECT 02: DREAM DELIVERY ROUTES</span>
                </button>
                <button
                  type="button"
                  className={`pip-button ${activeTool === 'nightlight-lab' ? 'pip-button-primary' : ''}`}
                  onClick={() => {
                    playClickSound();
                    setActiveTool('nightlight-lab');
                  }}
                >
                  <Moon size={13} />
                  <span>PROJECT 03: NIGHTLIGHT COLLECTION</span>
                </button>
              </div>

              <div className="active-tool-container" style={{ marginTop: '16px' }}>
                {activeTool === 'lullaby-lab' && <LullabyLab />}
                {activeTool === 'dream-route' && <DreamRoute />}
                {activeTool === 'nightlight-lab' && <NightlightCollection />}
              </div>
            </section>

            {/* 5. Goodnight Nursery Footer Note */}
            <section className="nursery-goodnight-window" style={{ marginTop: '40px', marginBottom: '80px' }}>
              <WindowPanel
                title="Goodnight Protocol"
                icon={<Moon size={14} color="var(--pip-yellow)" />}
                statusText="ALL DREAMERS TUCKED IN • SAFE & SOUND"
              >
                <div className="goodnight-content font-body">
                  <p>
                    "Thank you for stopping by my little corner of the 1998 web.
                    Remember: the world is big and sometimes noisy, but underneath the starlight,
                    everything is safe and gentle."
                  </p>
                  <div className="goodnight-footer font-pixel">
                    <span>Crafted with love for Pip • Track 1 Hackathon</span>
                    <button
                      type="button"
                      className="pip-button pip-button-soft"
                      onClick={() => setEasterEggOpen(true)}
                      style={{ padding: '4px 10px', fontSize: '0.65rem' }}
                    >
                      <span>★ Find Pip's Charm</span>
                    </button>
                  </div>
                </div>
              </WindowPanel>
            </section>
          </main>
        </div>

        {/* 90s Taskbar Fixed Bottom */}
        <StatusBar
          activeSection={activeSection}
          onNavClick={scrollToSection}
          onStartClick={() => setEasterEggOpen(true)}
        />

        {/* System Message Notification Dialog */}
        <SystemNotification
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          onHelpPip={() => scrollToSection('dream-lab')}
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
