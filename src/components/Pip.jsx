import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, ArrowDown, Activity } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { useMousePosition } from '../hooks/useMousePosition';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function Pip({
  onEnterDreamspace,
  onTriggerEasterEgg,
  focusedGaze = null, // 'sidebar', 'projects', 'story', 'interactive'
}) {
  const [clickCount, setClickCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHoveringCta, setIsHoveringCta] = useState(false);
  const portraitRef = useRef(null);

  // Subtle mouse tracking hook
  const mousePos = useMousePosition(portraitRef);

  // Periodic gentle blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handlePipClick = () => {
    playClickSound();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      playChimeSound();
      if (onTriggerEasterEgg) {
        onTriggerEasterEgg();
      }
    }
  };

  // Calculate gaze direction based on mouse or focused element
  let eyeOffsetX = mousePos.x;
  let eyeOffsetY = mousePos.y;

  if (isHoveringCta) {
    // When hovering Enter button, Pip looks down toward the button with anticipation
    eyeOffsetX = 1.5;
    eyeOffsetY = 3.5;
  } else if (focusedGaze === 'sidebar') {
    // Pip looks left toward the sidebar
    eyeOffsetX = -4.5;
    eyeOffsetY = -1.0;
  } else if (focusedGaze === 'projects' || focusedGaze === 'interactive') {
    // Pip looks down toward the projects & lab
    eyeOffsetX = 0.5;
    eyeOffsetY = 4.0;
  } else if (focusedGaze === 'story') {
    // Pip looks down-right toward the dream log
    eyeOffsetX = 3.5;
    eyeOffsetY = 3.0;
  }

  return (
    <WindowPanel
      title="PIP.DREAM.EXE — SYSTEM RESIDENT"
      icon={<Heart size={14} color="var(--pip-berry)" />}
      statusText="LOCATION: MIDNIGHT NURSERY • STATUS: ON DUTY • BEDTIME: 01:03"
      className="pip-hero-window"
    >
      <div className="pip-hero-grid">
        {/* Left Column: Pip Portrait with reactive expressions */}
        <div className="pip-portrait-wrapper" ref={portraitRef}>
          <div
            className={`pip-image-frame ${isHoveringCta ? 'pip-excited' : ''} ${focusedGaze ? 'pip-curious' : ''}`}
            onClick={handlePipClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePipClick();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Interact with Pip, The Skull Baby"
            title="Tap Pip to say goodnight"
          >
            <img
              src="/assets/pip.jpg"
              alt="Pip, The Skull Baby: a tiny gentle skull baby wearing starry pajamas and a nightcap with a pink bow, holding a glowing star lantern"
              className="pip-official-img"
            />

            {/* Subtle Eye Tracking Pupil Starlights */}
            <div
              className={`pip-eye-track-glow left ${isHoveringCta ? 'excited' : ''}`}
              style={{
                transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
                opacity: isBlinking ? 0 : 0.95,
              }}
              aria-hidden="true"
            />
            <div
              className={`pip-eye-track-glow right ${isHoveringCta ? 'excited' : ''}`}
              style={{
                transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
                opacity: isBlinking ? 0 : 0.95,
              }}
              aria-hidden="true"
            />

            {/* Subtle floating lantern particle when excited */}
            {isHoveringCta && (
              <span className="pip-excitement-sparkle" aria-hidden="true">
                ✨
              </span>
            )}
          </div>

          <div className="portrait-caption font-pixel">
            <span>[ Pip, The Skull Baby ]</span>
            <span className="heart-counter">♥ {clickCount > 0 ? clickCount : ''}</span>
          </div>
        </div>

        {/* Right Column: Hero Identity, Dream Queue & Primary CTA */}
        <div className="pip-hero-bio">
          <div className="hero-identity">
            <span className="nursery-badge font-mono">✦ MIDNIGHT NURSERY ✦</span>
            <h1 className="hero-name font-retro">PIP</h1>
            <h2 className="hero-role font-pixel">Junior Dream Engineer</h2>
          </div>

          <div className="hero-quote-card font-body">
            <p className="quote-text">
              “I build the dreams you fall asleep inside.”
            </p>
          </div>

          {/* Dream Queue / System Status Box */}
          <div className="dream-queue-card" aria-label="Current Dream Queue Status">
            <div className="queue-header font-pixel">
              <span className="queue-title font-mono">┌ DREAM QUEUE</span>
              <span className="queue-status-tag font-mono">
                <Activity size={10} /> 1 PENDING
              </span>
            </div>

            <div className="queue-body font-mono">
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">1 dream waiting</span>
                </div>
                <span className="queue-pill-status waiting">QUEUED</span>
              </div>
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">3 systems online</span>
                </div>
                <span className="queue-pill-status online">ONLINE</span>
              </div>
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">bedtime: 01:03</span>
                </div>
                <span className="queue-pill-status bedtime">SYNCED</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="hero-actions">
            <button
              type="button"
              className="pip-button pip-button-primary enter-dreamspace-btn primary-cta-pulse"
              onClick={() => {
                playClickSound();
                if (onEnterDreamspace) onEnterDreamspace();
              }}
              onMouseEnter={() => setIsHoveringCta(true)}
              onMouseLeave={() => setIsHoveringCta(false)}
              aria-label="Enter dreamspace and inspect projects"
            >
              <Sparkles size={16} />
              <span className="font-retro">[ ✦ ENTER DREAMSPACE ]</span>
              <ArrowDown size={15} className="cta-arrow" />
            </button>

            <span className="hero-subhint font-pixel">
              Explore 3 bedtime systems, origin logs, and interactive dispatch.
            </span>
          </div>
        </div>
      </div>
    </WindowPanel>
  );
}
