import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Check } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { playMusicBoxNote, playClickSound, playChimeSound, getAudioMuted, setAudioMuted } from '../utils/audio';

export default function LullabyLab({ onLullabyComplete, isCompleted = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState(-1);
  const [isMuted, setIsMuted] = useState(getAudioMuted());
  const [completed, setCompleted] = useState(isCompleted);
  const timerRef = useRef(null);

  // Calibrated to 68 BPM bedtime tempo (each step is ~450ms)
  const lullabyMelody = [
    { freq: 659.25, name: 'E5', label: 'Cloud' },
    { freq: 659.25, name: 'E5', label: 'Cloud' },
    { freq: 783.99, name: 'G5', label: 'Moon' },
    { freq: 659.25, name: 'E5', label: 'Cloud' },
    { freq: 523.25, name: 'C5', label: 'Star' },
    { freq: 587.33, name: 'D5', label: 'Beam' },
    { freq: 659.25, name: 'E5', label: 'Cloud' },
    { freq: 783.99, name: 'G5', label: 'Moon' },
    { freq: 880.00, name: 'A5', label: 'Unicorn' },
    { freq: 783.99, name: 'G5', label: 'Sleep' },
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleSoundMute = () => {
    playClickSound();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  const handlePlayToggle = () => {
    playClickSound();

    if (isMuted) {
      setIsMuted(false);
      setAudioMuted(false);
    }

    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setActiveNoteIdx(-1);
      return;
    }

    setIsPlaying(true);
    let step = 0;

    playMusicBoxNote(lullabyMelody[0].freq, 0.85);
    setActiveNoteIdx(0);

    timerRef.current = setInterval(() => {
      step = (step + 1) % lullabyMelody.length;
      setActiveNoteIdx(step);
      playMusicBoxNote(lullabyMelody[step].freq, 0.85);

      // Mark completed after one full loop
      if (step === lullabyMelody.length - 1 && !completed) {
        setCompleted(true);
        playChimeSound();
        if (onLullabyComplete) onLullabyComplete();
      }
    }, 450);
  };

  const handleManualChime = (note, idx) => {
    if (isMuted) {
      setIsMuted(false);
      setAudioMuted(false);
    }
    setActiveNoteIdx(idx);
    playMusicBoxNote(note.freq, 0.9);
    setTimeout(() => setActiveNoteIdx(-1), 300);
  };

  return (
    <WindowPanel
      title="PROJECT 01 — LULLABY LAB"
      icon={<Music size={14} color="var(--window-header-icon, var(--pip-berry))" />}
      statusText={`FREQ: 432 Hz SLEEP HARMONICS • 68 BPM ${completed ? '• ✓ HARMONIZED' : ''}`}
      className="lullaby-window"
    >
      <div className="lullaby-spec-card">
        {/* Animated Musical Wave & Notes */}
        <div className="lullaby-visual-stage">
          <div className="music-notes-floating font-retro" aria-hidden="true">
            <span className={`note n1 ${isPlaying ? 'bobbing' : ''}`}>♪</span>
            <span className={`note n2 ${isPlaying ? 'bobbing' : ''}`}>♫</span>
            <span className={`note n3 ${isPlaying ? 'bobbing' : ''}`}>♪</span>
          </div>

          <div className="lullaby-specs-readout">
            <div className="readout-row font-mono">
              <span className="spec-label">TEMPO</span>
              <span className="spec-value font-pixel">68 BPM</span>
            </div>
            <div className="readout-row font-mono">
              <span className="spec-label">MOOD</span>
              <span className="spec-value font-pixel mood-sleepy">SLEEPY</span>
            </div>
            <div className="readout-row font-mono">
              <span className="spec-label">HARMONY</span>
              <span className="spec-value font-pixel">
                {completed ? '✓ HARMONIZED' : isPlaying ? 'PLAYING LULLABY...' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Chimes keyboard */}
        <div className="lullaby-chimes-row">
          <span className="font-pixel chimes-heading">INTERACTIVE MUSIC BOX PINS:</span>
          <div className="chimes-list">
            {lullabyMelody.slice(0, 6).map((note, idx) => (
              <button
                key={idx}
                type="button"
                className={`chime-pin-btn ${activeNoteIdx === idx ? 'active-pin' : ''}`}
                onClick={() => handleManualChime(note, idx)}
                aria-label={`Play chime ${note.name} ${note.label}`}
              >
                <span className="pin-symbol">✦</span>
                <span className="pin-name font-retro">{note.name}</span>
                <span className="pin-sub font-pixel">{note.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions bar */}
        <div className="lullaby-controls-bar" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              type="button"
              className="pip-button pip-button-primary play-lullaby-btn"
              style={{ flex: 1 }}
              onClick={handlePlayToggle}
            >
              {isPlaying ? (
                <>
                  <Pause size={14} fill="#FFF8F1" />
                  <span>[ ⏸ PAUSE LULLABY ]</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="#FFF8F1" />
                  <span>[ ▶ PLAY LULLABY ]</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="pip-button pip-button-soft sound-indicator-btn"
              onClick={toggleSoundMute}
              aria-label={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
            >
              {isMuted ? (
                <>
                  <VolumeX size={14} color="currentColor" />
                  <span className="font-mono">🔇</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} color="currentColor" />
                  <span className="font-mono">🔊</span>
                </>
              )}
            </button>
          </div>

          {completed && (
            <div className="font-pixel" style={{ color: 'var(--pip-green)', fontSize: '0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Check size={12} /> Lullaby harmonic resonance verified!
            </div>
          )}
        </div>
      </div>
    </WindowPanel>
  );
}
