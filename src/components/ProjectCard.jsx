import React, { useState } from 'react';
import { Music, MapPin, Lamp, Sparkles, Send, Lightbulb, Play, Check } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { playClickSound, playMusicBoxNote, playChimeSound } from '../utils/audio';

const iconMap = {
  '01': Music,
  '02': MapPin,
  '03': Lamp,
};

export default function ProjectCard({ project, onInteract }) {
  const IconComponent = iconMap[project.num] || Sparkles;

  // Mini-preview interactive state
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('IDLE');
  const [isLightOn, setIsLightOn] = useState(true);

  const handleOpenProject = () => {
    playClickSound();
    if (onInteract) {
      onInteract(project.interactiveTarget);
    }
  };

  // Mini-action for Project 01: Lullaby Lab
  const handlePlayMiniLullaby = () => {
    playClickSound();
    setIsPlayingLullaby(true);
    // Play a gentle 3-note music box sequence (F4 -> A4 -> C5)
    playMusicBoxNote(349.23, 0.4);
    setTimeout(() => playMusicBoxNote(440.00, 0.4), 250);
    setTimeout(() => playMusicBoxNote(523.25, 0.6), 500);
    setTimeout(() => setIsPlayingLullaby(false), 900);
  };

  // Mini-action for Project 02: Dream Delivery Routes
  const handleDeliverMiniDream = () => {
    playClickSound();
    setDeliveryStatus('DISPATCHING');
    setTimeout(() => {
      setDeliveryStatus('DELIVERED');
      playChimeSound();
      setTimeout(() => setDeliveryStatus('IDLE'), 2400);
    }, 1000);
  };

  // Mini-action for Project 03: Nightlight Collection
  const handleToggleMiniLight = () => {
    playClickSound();
    setIsLightOn((prev) => !prev);
  };

  return (
    <WindowPanel
      title={`PROJECT ${project.num} — ${project.title}`}
      icon={<IconComponent size={14} color="var(--pip-berry)" />}
      statusText={`SYS_STATE: ${project.meta.status || 'ONLINE'}`}
      className="project-window"
    >
      <div className="project-card-content">
        <div className="project-card-header">
          <div className="project-badge-row">
            <span className="pip-tag font-pixel">PROJECT {project.num}</span>
            <span className="project-status-dot font-mono">● READY</span>
          </div>
          <h3 className="project-card-title font-retro">{project.title}</h3>
          <p className="project-tagline font-body italic">
            "{project.tagline}"
          </p>
        </div>

        {/* --- INTERACTIVE MINI-APP PREVIEW (Show First) --- */}
        <div className="project-mini-stage">
          {project.id === 'lullaby-lab' && (
            <div className="mini-lullaby-preview">
              <div className="mini-stage-header">
                <span className="mini-stage-label font-pixel">♪ LULLABY SYNTH PREVIEW</span>
                <span className="mini-stage-tempo font-mono">TEMPO: 68 BPM</span>
              </div>
              <div className={`mini-visual-notes ${isPlayingLullaby ? 'is-playing' : ''}`}>
                <span className="note-item n1">♪</span>
                <span className="note-item n2">♫</span>
                <span className="note-item n3">♪</span>
                <span className="mini-note-mood font-mono">[ MOOD: SLEEPY ]</span>
              </div>
              <button
                type="button"
                className={`pip-button mini-trigger-btn ${isPlayingLullaby ? 'active' : ''}`}
                onClick={handlePlayMiniLullaby}
                aria-label="Play sample lullaby chime"
              >
                <Play size={12} />
                <span>{isPlayingLullaby ? 'CHIMING...' : 'PLAY LULLABY'}</span>
              </button>
            </div>
          )}

          {project.id === 'dream-routes' && (
            <div className="mini-routes-preview">
              <div className="mini-stage-header">
                <span className="mini-stage-label font-pixel">CELESTIAL ROUTE PIPELINE</span>
                <span className="mini-stage-tempo font-mono">
                  {deliveryStatus === 'DISPATCHING' ? 'TRANSIT' : 'READY'}
                </span>
              </div>
              <div className="mini-route-flow font-pixel">
                <span className={`step-node ${deliveryStatus === 'DISPATCHING' ? 'active-moon' : ''}`}>MOON</span>
                <span className="step-arrow">↓</span>
                <span className={`step-node ${deliveryStatus === 'DISPATCHING' ? 'active-cloud' : ''}`}>CLOUD</span>
                <span className="step-arrow">↓</span>
                <span className={`step-node ${deliveryStatus === 'DELIVERED' ? 'active-win' : ''}`}>WINDOW</span>
                <span className="step-arrow">↓</span>
                <span className={`step-node ${deliveryStatus === 'DELIVERED' ? 'active-sleep' : ''}`}>SLEEP</span>
              </div>
              <button
                type="button"
                className={`pip-button mini-trigger-btn ${deliveryStatus === 'DISPATCHING' ? 'active' : ''}`}
                onClick={handleDeliverMiniDream}
                disabled={deliveryStatus === 'DISPATCHING'}
                aria-label="Dispatch test dream packet"
              >
                {deliveryStatus === 'DELIVERED' ? (
                  <>
                    <Check size={12} />
                    <span>DELIVERED (0s LOSS)</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>{deliveryStatus === 'DISPATCHING' ? 'DISPATCHING...' : 'DELIVER DREAM'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {project.id === 'nightlight-collection' && (
            <div className={`mini-nightlight-preview ${isLightOn ? 'light-active' : 'light-dim'}`}>
              <div className="mini-stage-header">
                <span className="mini-stage-label font-pixel">✦ MOON GLOW LAMP</span>
                <span className="mini-stage-tempo font-mono">
                  {isLightOn ? 'STATUS: ON' : 'STATUS: STANDBY'}
                </span>
              </div>
              <div className="mini-lamp-display">
                <div className="mini-lamp-glow">
                  <span className="lamp-beam font-pixel">
                    {isLightOn ? '✦ WARM HONEY GLOW ✦' : '✧ SHADOW GUARD STANDBY ✧'}
                  </span>
                </div>
                <div className="mini-meter-row">
                  <span className="mini-meter-label font-mono">BRIGHTNESS:</span>
                  <span className="mini-meter-blocks font-mono">
                    {isLightOn ? '████████░░ 80%' : '░░░░░░░░░░  0%'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`pip-button mini-trigger-btn ${isLightOn ? 'active' : ''}`}
                onClick={handleToggleMiniLight}
                aria-label="Toggle nightlight state"
              >
                <Lightbulb size={12} />
                <span>{isLightOn ? 'TURN OFF' : 'TURN ON'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Explain Second: Description & Note */}
        <p className="project-description font-body">{project.description}</p>

        <div className="project-pip-note">
          <span className="font-pixel note-label">Pip's Blueprint Note:</span>
          <p className="note-text font-body">{project.pipNote}</p>
        </div>

        <div className="project-tags">
          {(project.tags || []).map((tag, idx) => (
            <span key={idx} className="project-chip font-mono">
              #{tag}
            </span>
          ))}
        </div>

        {/* Dedicated primary action to open/expand project workbench */}
        <button
          type="button"
          className="pip-button pip-button-primary project-action-btn"
          onClick={handleOpenProject}
          aria-label={`Open interactive ${project.title}`}
        >
          <Sparkles size={13} />
          <span>[ {project.actionLabel} ]</span>
        </button>
      </div>
    </WindowPanel>
  );
}
