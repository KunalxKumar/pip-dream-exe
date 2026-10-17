import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, ArrowDown } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { useMousePosition } from '../hooks/useMousePosition';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function Pip({ onEnterDreamspace, onTriggerEasterEgg }) {
  const [clickCount, setClickCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const portraitRef = useRef(null);

  // Subtle mouse tracking hook with mobile idle animation fallback
  const mousePos = useMousePosition(portraitRef);

  // Periodic gentle blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4200);
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

  return (
    <WindowPanel
      title="PIP.DREAM.EXE — SYSTEM RESIDENT"
      icon={<Heart size={14} color="var(--pip-berry)" />}
      statusText="LOCATION: MIDNIGHT NURSERY • STATUS: ON DUTY"
      className="pip-hero-window"
    >
      <div className="pip-hero-grid">
        {/* Visually dominant Pip Portrait */}
        <div className="pip-portrait-wrapper" ref={portraitRef}>
          <div
            className="pip-image-frame"
            onClick={handlePipClick}
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
              className="pip-eye-track-glow left"
              style={{
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                opacity: isBlinking ? 0 : 0.95,
              }}
              aria-hidden="true"
            />
            <div
              className="pip-eye-track-glow right"
              style={{
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                opacity: isBlinking ? 0 : 0.95,
              }}
              aria-hidden="true"
            />
          </div>

          <div className="portrait-caption font-pixel">
            <span>[ Pip, The Skull Baby ]</span>
            <span className="heart-counter">♥ {clickCount > 0 ? clickCount : ''}</span>
          </div>
        </div>

        {/* Hero Copy strictly adhering to Section 9 */}
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

          <div className="hero-actions">
            <button
              type="button"
              className="pip-button pip-button-primary enter-dreamspace-btn"
              onClick={() => {
                playClickSound();
                if (onEnterDreamspace) onEnterDreamspace();
              }}
            >
              <Sparkles size={14} />
              <span className="font-retro">[ ENTER DREAMSPACE ]</span>
              <ArrowDown size={14} />
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
