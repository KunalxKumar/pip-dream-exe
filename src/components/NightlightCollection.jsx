import React, { useState } from 'react';
import { Sparkles, Lamp, Check } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { nightlightsData } from '../data/projectsData';
import { playClickSound, playChimeSound } from '../utils/audio';

export default function NightlightCollection({ onNightlightGlow, onNightlightComplete, isCompleted = false }) {
  const [activeLampId, setActiveLampId] = useState('moon-bean');
  const [isLampLit, setIsLampLit] = useState(true);
  const [completed, setCompleted] = useState(isCompleted);

  const handleToggleLamp = (lamp) => {
    playClickSound();
    if (activeLampId === lamp.id && isLampLit) {
      setIsLampLit(false);
      if (onNightlightGlow) onNightlightGlow(null);
    } else {
      setActiveLampId(lamp.id);
      setIsLampLit(true);
      setCompleted(true);
      playChimeSound();
      if (onNightlightGlow) onNightlightGlow(lamp);
      if (onNightlightComplete) onNightlightComplete();

      // Connect to site night mode
      document.documentElement.setAttribute('data-theme', 'midnight');
      localStorage.setItem('pip-dream-theme', 'midnight');
      window.dispatchEvent(new Event('themechange'));
    }
  };

  const getLampIllustration = (id, color) => {
    switch (id) {
      case 'moon-bean':
        return (
          <svg viewBox="0 0 80 80" width="70" height="70" className="lamp-svg">
            <defs>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="60%" stopColor={color} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="36" fill="url(#moonGlow)" opacity="0.75" />
            <path
              d="M52 24 C44 24 38 31 38 40 C38 49 44 56 52 56 C53 56 54 55.9 55 55.8 C51 59 46 61 41 61 C29 61 20 52 20 40 C20 31 25 24 32 21 C30 23 29 25 29 27 C29 32 33 36 38 36 C43 36 48 32 50 27 C51 26 51.5 25 52 24 Z"
              fill={color}
              stroke="var(--pip-brown)"
              strokeWidth="2"
            />
          </svg>
        );
      case 'star-pearl':
        return (
          <svg viewBox="0 0 80 80" width="70" height="70" className="lamp-svg">
            <defs>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor={color} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="36" fill="url(#starGlow)" opacity="0.75" />
            <circle cx="40" cy="40" r="22" fill="#FFFDF9" stroke="var(--pip-brown)" strokeWidth="2" />
            <path
              d="M40 26 L43 35 L52 35 L45 41 L47 50 L40 45 L33 50 L35 41 L28 35 L37 35 Z"
              fill={color}
              stroke="var(--pip-brown)"
              strokeWidth="1.5"
            />
          </svg>
        );
      case 'honey-lantern':
      default:
        return (
          <svg viewBox="0 0 80 80" width="70" height="70" className="lamp-svg">
            <defs>
              <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF4C2" />
                <stop offset="65%" stopColor={color} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="40" cy="40" r="36" fill="url(#lanternGlow)" opacity="0.75" />
            <rect x="28" y="24" width="24" height="34" rx="4" fill="#FFFDF9" stroke="var(--pip-brown)" strokeWidth="2" />
            <path d="M34 24 Q40 16 46 24" fill="none" stroke="var(--pip-brown)" strokeWidth="2" />
            <circle cx="40" cy="41" r="8" fill="#FCE7A2" />
            <path d="M40 35 L40 47 M34 41 L46 41" stroke="var(--pip-brown)" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <WindowPanel
      title="PROJECT 03 — NIGHTLIGHT COLLECTION"
      icon={<Lamp size={14} color="var(--pip-berry)" />}
      statusText={`AMBIANCE: CONNECTED TO MIDNIGHT NURSERY SKY ${completed ? '• ✓ LIT' : ''}`}
      className="nightlight-window"
    >
      <div className="nightlight-collection-grid">
        {nightlightsData.map((lamp) => {
          const isThisActive = activeLampId === lamp.id && isLampLit;

          return (
            <div
              key={lamp.id}
              className={`nightlight-spec-card ${isThisActive ? 'glowing' : ''}`}
              style={{
                boxShadow: isThisActive ? `0 0 20px ${lamp.glowColor}` : 'var(--shadow-retro)',
              }}
            >
              <div className="card-header-label font-retro">
                <span>NIGHTLIGHT {lamp.num}</span>
              </div>

              <h4 className="card-lamp-name font-retro">"{lamp.name}"</h4>

              {/* [ illustration ] */}
              <div className="lamp-illustration-box">
                {getLampIllustration(lamp.id, lamp.color)}
              </div>

              <div className="lamp-status-block">
                <span className="font-pixel status-label">STATUS</span>
                <span className={`font-mono status-val ${isThisActive ? 'status-active' : ''}`}>
                  {isThisActive ? '● GLOWING' : '● READY'}
                </span>
              </div>

              <p className="lamp-story font-body">{lamp.story}</p>

              {/* [ TURN ON ] button */}
              <button
                type="button"
                className={`pip-button ${isThisActive ? 'pip-button-primary' : 'pip-button-soft'} turn-lamp-btn`}
                onClick={() => handleToggleLamp(lamp)}
                aria-label={`${isThisActive ? 'Turn Off' : 'Turn On'} ${lamp.name}`}
              >
                <Sparkles size={13} />
                <span>[ {isThisActive ? 'TURN OFF' : 'TURN ON'} ]</span>
              </button>
            </div>
          );
        })}
      </div>

      {completed && (
        <div className="font-pixel" style={{ color: 'var(--pip-green)', fontSize: '0.75rem', textAlign: 'center', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Check size={12} /> Nightlight nursery ambiance successfully activated!
        </div>
      )}
    </WindowPanel>
  );
}
