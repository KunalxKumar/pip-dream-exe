import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, ArrowDown, Activity, Check } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { useMousePosition } from '../hooks/useMousePosition';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function Pip({
  onEnterDreamspace,
  onTriggerEasterEgg,
  focusedGaze = null, // 'sidebar', 'projects', 'story', 'interactive'
  missionState = null,
  onDeliverDream = null,
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

  const isSleeping = missionState && missionState.dreamDelivered;

  // Calculate gaze direction based on mouse or focused element
  let eyeOffsetX = mousePos.x;
  let eyeOffsetY = mousePos.y;

  if (isSleeping) {
    eyeOffsetX = 0;
    eyeOffsetY = 0;
  } else if (isHoveringCta) {
    eyeOffsetX = 1.5;
    eyeOffsetY = 3.5;
  } else if (focusedGaze === 'sidebar') {
    eyeOffsetX = -4.5;
    eyeOffsetY = -1.0;
  } else if (focusedGaze === 'projects' || focusedGaze === 'interactive') {
    eyeOffsetX = 0.5;
    eyeOffsetY = 4.0;
  } else if (focusedGaze === 'story') {
    eyeOffsetX = 3.5;
    eyeOffsetY = 3.0;
  }

  return (
    <WindowPanel
      title="PIP.DREAM.EXE — SYSTEM RESIDENT"
      icon={<Heart size={14} color="var(--pip-berry)" />}
      statusText={
        isSleeping
          ? 'LOCATION: SLEEPING • STATUS: DREAM DELIVERED (01:03) • Zzz...'
          : 'LOCATION: MIDNIGHT NURSERY • STATUS: ON DUTY • BEDTIME: 01:03'
      }
      className="pip-hero-window"
    >
      <div className="pip-hero-grid">
        {/* Left Column: Pip Portrait with reactive expressions */}
        <div className="pip-portrait-wrapper" ref={portraitRef}>
          <div
            className={`pip-image-frame ${isHoveringCta ? 'pip-excited' : ''} ${focusedGaze ? 'pip-curious' : ''} ${isSleeping ? 'pip-sleeping' : ''}`}
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
            title={isSleeping ? 'Pip is fast asleep at 01:03' : 'Tap Pip to say goodnight'}
          >
            <img
              src="/assets/pip.jpg"
              alt="Pip, The Skull Baby: a tiny gentle skull baby wearing starry pajamas and a nightcap with a pink bow, holding a glowing star lantern"
              className="pip-official-img"
            />

            {/* Subtle Eye Tracking Pupil Starlights (or closed eyes when sleeping) */}
            {!isSleeping ? (
              <>
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
              </>
            ) : (
              <div className="pip-sleeping-overlay font-retro" aria-hidden="true">
                <span className="zzz-1">Z</span>
                <span className="zzz-2">z</span>
                <span className="zzz-3">z</span>
              </div>
            )}

            {isHoveringCta && !isSleeping && (
              <span className="pip-excitement-sparkle" aria-hidden="true">
                ✨
              </span>
            )}
          </div>

          <div className="portrait-caption font-pixel">
            <span>{isSleeping ? '[ Pip is Asleep at 01:03 ]' : '[ Pip, The Skull Baby ]'}</span>
            <span className="heart-counter">♥ {clickCount > 0 ? clickCount : ''}</span>
          </div>
        </div>

        {/* Right Column: Hero Identity, Dream Queue & Primary CTA */}
        <div className="pip-hero-bio">
          <div className="hero-identity">
            <span className="nursery-badge font-mono">✦ MIDNIGHT NURSERY ✦</span>
            <h1 className="hero-name font-retro">PIP</h1>
            <h2 className="hero-role font-pixel">
              {isSleeping ? 'Dream Delivered (Sleeping)' : 'Junior Dream Engineer'}
            </h2>
          </div>

          <div className="hero-quote-card font-body">
            <p className="quote-text">
              {isSleeping
                ? '“Goodnight... the dreams are safely delivered at 01:03. Sweet dreams!”'
                : '“I build the dreams you fall asleep inside.”'}
            </p>
          </div>

          {/* Dream Queue / System Status Box */}
          <div className="dream-queue-card" aria-label="Current Dream Queue Status">
            <div className="queue-header font-pixel">
              <span className="queue-title font-mono">┌ DREAM MISSION STAGE</span>
              <span className="queue-status-tag font-mono">
                <Activity size={10} /> {missionState ? missionState.currentStage : 'ACTIVE'}
              </span>
            </div>

            <div className="queue-body font-mono">
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">1. Dream Memory:</span>
                </div>
                <span className={`queue-pill-status ${missionState?.dreamMemoryComplete ? 'online' : 'waiting'}`}>
                  {missionState?.dreamMemoryComplete ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">2. Lullaby Lab:</span>
                </div>
                <span className={`queue-pill-status ${missionState?.lullabyComplete ? 'online' : 'waiting'}`}>
                  {missionState?.lullabyComplete ? 'HARMONIZED' : 'PENDING'}
                </span>
              </div>
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">3. Dream Router:</span>
                </div>
                <span className={`queue-pill-status ${missionState?.routeComplete ? 'online' : 'waiting'}`}>
                  {missionState?.routeComplete ? 'DISPATCHED' : 'PENDING'}
                </span>
              </div>
              <div className="queue-item">
                <div className="queue-item-left">
                  <span className="queue-bullet font-pixel">✦</span>
                  <span className="queue-desc">4. Nightlights:</span>
                </div>
                <span className={`queue-pill-status ${missionState?.nightlightComplete ? 'online' : 'waiting'}`}>
                  {missionState?.nightlightComplete ? 'GLOWING' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button or Delivery Complete Banner */}
          <div className="hero-actions">
            {isSleeping ? (
              <div className="wow-delivery-verdict" style={{ background: '#FFFDF7', border: '2px solid var(--pip-green)', padding: '12px' }}>
                <div className="verdict-header font-retro" style={{ color: 'var(--pip-green)' }}>
                  <Check size={16} />
                  <span>✓ DREAM DELIVERY COMPLETE (01:03)</span>
                </div>
                <p className="verdict-quote font-body" style={{ margin: '6px 0 10px 0' }}>
                  Pip's eyes are closed and sleep has arrived. Heartfelt goodnight from PipOS!
                </p>
                <button
                  type="button"
                  className="pip-button pip-button-soft"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    playClickSound();
                    window.location.reload();
                  }}
                >
                  <span>[ Return to PipOS (New Dream) ]</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

                {missionState &&
                  missionState.dreamMemoryComplete &&
                  missionState.lullabyComplete &&
                  missionState.routeComplete &&
                  missionState.nightlightComplete &&
                  !missionState.dreamDelivered && (
                    <button
                      type="button"
                      className="pip-button pip-button-primary"
                      style={{ background: 'var(--pip-green)', color: '#FFF' }}
                      onClick={() => {
                        playClickSound();
                        playChimeSound();
                        if (onDeliverDream) onDeliverDream();
                      }}
                    >
                      <Check size={16} />
                      <span className="font-retro">[ FINAL DELIVER DREAM & SLEEP (01:03) ]</span>
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </WindowPanel>
  );
}
