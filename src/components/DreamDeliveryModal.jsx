import React, { useState, useEffect } from 'react';
import { playDeliveryCompletionMotif, playClickSound } from '../utils/audio';

const STAGES = [
  { id: 1, text: 'DREAM DELIVERY\nINITIALIZING...', duration: 900 },
  { id: 2, text: 'DREAM PACKET READY', duration: 900 },
  { id: 3, text: 'ROUTE LOCKED', duration: 900 },
  { id: 4, text: 'NIGHTLIGHT ONLINE', duration: 900 },
  { id: 5, text: 'DELIVERING DREAM...', duration: 1100 },
  { id: 6, text: '✓ DREAM DELIVERY COMPLETE\n\nMIDNIGHT NURSERY\n01:03\n\nGOODNIGHT, LITTLE DREAMER.', duration: 1800 },
];

export default function DreamDeliveryModal({ isOpen, onClose }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isSequenceDone, setIsSequenceDone] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Play gentle audio motif
    playDeliveryCompletionMotif();

    let timeoutId;
    let step = 0;

    const advanceStep = () => {
      if (step < STAGES.length - 1) {
        step += 1;
        setCurrentStageIdx(step);
        timeoutId = setTimeout(advanceStep, STAGES[step].duration);
      } else {
        setIsSequenceDone(true);
      }
    };

    timeoutId = setTimeout(advanceStep, STAGES[0].duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReturnToPipOS = () => {
    playClickSound();
    setCurrentStageIdx(0);
    setIsSequenceDone(false);
    onClose();
  };

  return (
    <div
      className="dream-delivery-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="01:03 Dream Delivery Final Sequence"
    >
      <div className="dream-delivery-window font-retro">
        <div className="dream-delivery-titlebar">
          <span className="font-pixel">✦ DREAM DELIVERY COMPLETE</span>
          <span className="window-time-badge font-mono">01:03</span>
        </div>

        <div className="dream-delivery-body">
          {!isSequenceDone ? (
            <div className="delivery-cinematic-stage font-pixel">
              <div className="stage-star-icon" aria-hidden="true">★ ✧ ★</div>
              <div className="stage-progress-bar">
                <div
                  className="stage-progress-fill"
                  style={{ width: `${((currentStageIdx + 1) / STAGES.length) * 100}%` }}
                />
              </div>
              <pre className="stage-text-display font-retro">
                {STAGES[currentStageIdx].text}
              </pre>
              <span className="stage-subtle-hint font-pixel">
                Phase {currentStageIdx + 1} of {STAGES.length} • Please wait...
              </span>
            </div>
          ) : (
            <div className="delivery-ending-card">
              <div className="ending-star-cluster" aria-hidden="true">
                <span>✦</span>
                <span>★</span>
                <span>✧</span>
              </div>

              <div className="ending-clock-display font-retro">01:03</div>

              <div className="ending-nursery-title font-pixel">
                MIDNIGHT NURSERY
              </div>

              <div className="ending-narrative font-body">
                Pip is going to sleep now.
              </div>

              <div className="ending-signoff font-retro">
                GOODNIGHT ♡
              </div>

              <div className="ending-button-row">
                <button
                  type="button"
                  className="pip-button pip-button-primary return-pipos-btn"
                  onClick={handleReturnToPipOS}
                  autoFocus
                >
                  [ RETURN TO PIPOS ]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
