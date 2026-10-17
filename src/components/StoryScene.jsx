import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Radio,
  Music,
  Compass,
  Sparkles,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import WindowPanel from './WindowPanel';
import { storyScenes } from '../data/storyData';
import { playClickSound, playChimeSound } from '../utils/audio';

const iconMap = {
  Moon: Moon,
  Radio: Radio,
  Music: Music,
  Compass: Compass,
  Sparkles: Sparkles,
  BedDouble: BedDouble,
};

export default function StoryScene() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [wowStage, setWowStage] = useState('IDLE'); // 'SIGNAL', 'CALCULATING', 'LOCKED', 'DELIVERING', 'DELIVERED'

  const scene = storyScenes[currentIdx];
  const SceneIcon = iconMap[scene.icon] || Sparkles;

  // Auto-play timer for cinematic scroll / progression
  useEffect(() => {
    let interval = null;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= storyScenes.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          playClickSound();
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // When arriving at scene 6, trigger the Section 15 WOW MOMENT sequence
  useEffect(() => {
    if (currentIdx === 5) {
      setWowStage('SIGNAL');
      const t1 = setTimeout(() => setWowStage('CALCULATING'), 700);
      const t2 = setTimeout(() => setWowStage('LOCKED'), 1400);
      const t3 = setTimeout(() => setWowStage('DELIVERING'), 2100);
      const t4 = setTimeout(() => {
        setWowStage('DELIVERED');
        playChimeSound();
      }, 2900);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setWowStage('IDLE');
    }
  }, [currentIdx]);

  const handleNext = () => {
    playClickSound();
    if (currentIdx < storyScenes.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <WindowPanel
      title={`ORIGIN CHRONICLE — SCENE ${scene.num} OF 06`}
      icon={<BookOpenIcon size={14} color="var(--pip-berry)" />}
      statusText={`TIMESTAMP: ${scene.time} • LOCATION: ${scene.location}`}
      className="story-window"
    >
      <div className="story-cinematic-container">
        {/* Progress Timeline Header */}
        <div className="story-timeline-bar">
          <div className="timeline-clock-badge font-mono">
            <span className="clock-time">{scene.time}</span>
            <span className="clock-loc">{scene.location}</span>
          </div>

          {/* 6 Scene Step Indicator */}
          <div className="timeline-steps" role="tablist" aria-label="Story Scene Progress">
            {storyScenes.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`timeline-step-pill ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx ? 'completed' : ''}`}
                onClick={() => {
                  playClickSound();
                  setCurrentIdx(idx);
                }}
                aria-label={`Jump to Scene ${idx + 1}: ${s.time}`}
                title={`Scene ${idx + 1}: ${s.title}`}
              >
                <span className="step-time font-mono">{s.time}</span>
                <span className="step-dot" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pip-button pip-button-soft autoplay-toggle-btn"
            onClick={() => {
              playClickSound();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            title={isAutoPlaying ? 'Pause cinematic progression' : 'Play cinematic progression'}
          >
            {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span className="font-pixel">{isAutoPlaying ? 'PAUSE' : 'CINEMATIC'}</span>
          </button>
        </div>

        {/* Scene Animated Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="story-stage-viewport"
            style={{
              borderColor: scene.color,
            }}
          >
            <div className="stage-scene-badge-row">
              <span className="font-pixel scene-counter">SCENE {scene.num}</span>
              <span className="scene-status-tag font-mono">{scene.badge}</span>
            </div>

            <div className="stage-content-row">
              <div className="stage-icon-halo" style={{ backgroundColor: scene.color }}>
                <SceneIcon size={32} color="var(--pip-brown)" />
              </div>

              <div className="stage-narrative-copy">
                <p className="narrative-headline font-body">{scene.headline}</p>
                <p className="narrative-subline font-body text-muted">{scene.subline}</p>
                <p className="narrative-punchline font-retro" style={{ color: 'var(--pip-berry)' }}>
                  “{scene.punchline}”
                </p>
              </div>
            </div>

            {/* Special Section 15 WOW MOMENT on Scene 6 */}
            {currentIdx === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="dream-delivery-wow-card"
              >
                <div className="wow-pipeline font-mono">
                  <span className={`pipe-node ${wowStage !== 'IDLE' ? 'lit' : ''}`}>
                    DREAM SIGNAL DETECTED
                  </span>
                  <span className="pipe-arrow">↓</span>
                  <span className={`pipe-node ${wowStage === 'CALCULATING' || wowStage === 'LOCKED' || wowStage === 'DELIVERING' || wowStage === 'DELIVERED' ? 'lit' : ''}`}>
                    CALCULATING ROUTE...
                  </span>
                  <span className="pipe-arrow">↓</span>
                  <span className={`pipe-node ${wowStage === 'LOCKED' || wowStage === 'DELIVERING' || wowStage === 'DELIVERED' ? 'lit' : ''}`}>
                    ROUTE LOCKED
                  </span>
                  <span className="pipe-arrow">↓</span>
                  <span className={`pipe-node ${wowStage === 'DELIVERING' || wowStage === 'DELIVERED' ? 'lit' : ''}`}>
                    DELIVERING DREAM...
                  </span>
                </div>

                {wowStage === 'DELIVERED' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="wow-delivery-verdict"
                  >
                    <div className="verdict-header font-retro">
                      <CheckCircle2 size={16} color="var(--pip-green)" />
                      <span>✓ DREAM DELIVERED</span>
                    </div>
                    <div className="verdict-stamp font-mono">
                      <span>MIDNIGHT NURSERY</span>
                      <span>01:03</span>
                    </div>
                    <p className="verdict-quote font-retro">
                      GOODNIGHT, LITTLE DREAMER.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="story-nav-footer">
          <button
            type="button"
            className="pip-button pip-button-soft"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            aria-label="Previous origin scene"
          >
            <ChevronLeft size={14} />
            <span>PREV SCENE</span>
          </button>

          <span className="font-pixel story-page-indicator">
            [ Scene {currentIdx + 1} of {storyScenes.length} ]
          </span>

          <button
            type="button"
            className="pip-button pip-button-primary"
            onClick={handleNext}
            disabled={currentIdx === storyScenes.length - 1}
            aria-label="Next origin scene"
          >
            <span>NEXT SCENE</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </WindowPanel>
  );
}

function BookOpenIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
