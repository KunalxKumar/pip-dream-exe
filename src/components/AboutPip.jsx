import React from 'react';

export default function AboutPip({ isSleeping = false }) {
  return (
    <div className="lore-app-container about-pip-content font-mono">
      <div className="lore-top-badges font-pixel">
        <span className="lore-badge">EST. 1998</span>
        <span className="lore-badge">MIDNIGHT NURSERY SPEC #01</span>
        <span className="lore-badge">800×600 OPTIMIZED</span>
      </div>

      <div className="about-pip-card">
        <div className="about-pip-header font-retro">
          <span className="about-avatar" aria-hidden="true">👶</span>
          <div className="about-title-block">
            <h2 className="about-name">Pip</h2>
            <span className="about-subtitle font-pixel">The Skull Baby • Resident Dream Engineer</span>
          </div>
        </div>

        <div className="about-pip-fields font-mono">
          <div className="about-field-row">
            <span className="field-label">NAME:</span>
            <span className="field-value">Pip</span>
          </div>

          <div className="about-field-row">
            <span className="field-label">ROLE:</span>
            <span className="field-value">Junior Dream Engineer</span>
          </div>

          <div className="about-field-row">
            <span className="field-label">DEPARTMENT:</span>
            <span className="field-value">Midnight Nursery</span>
          </div>

          <div className="about-field-row">
            <span className="field-label">SHIFT:</span>
            <span className="field-value">23:47 → 01:03</span>
          </div>

          <div className="about-field-row specialties-row">
            <span className="field-label">SPECIALITIES:</span>
            <div className="specialties-list">
              <span>♫ Lullabies</span>
              <span>☾ Nightlights</span>
              <span>☁ Dream Routing</span>
            </div>
          </div>

          <div className="about-field-row">
            <span className="field-label">CURRENT STATUS:</span>
            <span className={`field-value status-tag ${isSleeping ? 'is-sleeping' : 'is-awake'}`}>
              {isSleeping ? 'Sleepy (Dream Delivered at 01:03)' : 'Calm & Working'}
            </span>
          </div>

          <div className="about-field-row">
            <span className="field-label">FAVOURITE THING:</span>
            <span className="field-value">Warm star lanterns</span>
          </div>
        </div>

        <div className="about-footer-quote font-pixel">
          “Every little dream deserves a soft landing before midnight turns to dawn.”
        </div>

        <div className="about-credits-section font-pixel">
          <div className="credits-header font-mono">✦ PIPOS ARCHIVAL ATTRIBUTION & CREDITS</div>
          <div className="credits-row">
            <span>• ARTWORK: Pip, The Skull Baby (Curated Nursery Portrait)</span>
          </div>
          <div className="credits-row">
            <span>• AUDIO: Procedural Web Audio API Synthesizer (Zero External Audio Files)</span>
          </div>
          <div className="credits-row">
            <span>• LIBRARIES: React, Vite, Framer Motion, Lucide React, Canvas Confetti</span>
          </div>
          <div className="credits-row">
            <span>• CREATED BY: Kunal Kumar (KunalxKumar/pip-dream-exe)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
