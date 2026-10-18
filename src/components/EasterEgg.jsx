import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Moon, Award } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { playSecretMelody, playClickSound } from '../utils/audio';

export default function EasterEgg({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      playSecretMelody();

      // Launch pastel starlight confetti
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FCE7A2', '#F7D6E0', '#D8C5E5', '#A34063', '#FFF8F1'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="pip-easter-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Secret Dream Message"
    >
      <WindowPanel
        title="SYSTEM MESSAGE — SECRET_DREAM.TXT"
        icon={<Award size={14} color="var(--pip-berry)" />}
        onClose={onClose}
        className="easter-window"
      >
        <div className="easter-content">
          <div className="easter-badge-hero">
            <div className="badge-glow-ring">
              <Moon size={40} color="#FCE7A2" fill="#FCE7A2" />
            </div>
            <span className="font-mono badge-subtitle">✦ ✦ ✦</span>
          </div>

          <div className="easter-spec-body font-mono">
            <p className="easter-msg-access font-pixel">
              ACCESSING /pip/private/ ...
            </p>
            <p className="easter-msg-primary font-retro">
              HELLO, VISITOR.
              <br />
              YOU FOUND PIP'S SECRET.
              <br />
              <span className="easter-heart">♡</span>
            </p>

            <div className="easter-divider font-mono">
              ────────────────────────────────
            </div>

            <p className="easter-whisper font-body">
              "You explored the computer while the rest of the world was fast asleep.
              Thank you for keeping Pip company under the starlight."
            </p>

            <p className="font-pixel easter-sig">
              — Pip, Junior Dream Engineer ♡
            </p>

            <p className="easter-goodnight font-retro">
              GOODNIGHT.
            </p>
          </div>

          <button
            type="button"
            className="pip-button pip-button-primary"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            style={{ width: '100%', marginTop: '14px' }}
          >
            <Sparkles size={14} />
            <span className="font-retro">[ CLOSE SECRET & SLEEP ]</span>
          </button>
        </div>
      </WindowPanel>
    </div>
  );
}
