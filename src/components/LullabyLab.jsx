import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { playMusicBoxNote, playClickSound, getAudioMuted, setAudioMuted } from '../utils/audio';

export default function LullabyLab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState(-1);
  const [isMuted, setIsMuted] = useState(getAudioMuted());
  const timerRef = useRef(null);

  // Calibrated to 68 BPM bedtime tempo (each 16th/8th beat is ~440ms)
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

  // Stop sequence on unmount
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

    // If currently muted, unmute on direct user interaction
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

    // Play first note immediately
    playMusicBoxNote(lullabyMelody[0].freq, 0.85);
    setActiveNoteIdx(0);

    // 68 BPM rhythm interval (~441ms per step)
    timerRef.current = setInterval(() => {
      step = (step + 1) % lullabyMelody.length;
      setActiveNoteIdx(step);
      playMusicBoxNote(lullabyMelody[step].freq, 0.85);
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
      icon={<Music size={14} color="var(--pip-berry)" />}
      statusText="FREQ: 432 Hz SLEEP HARMONICS • 68 BPM"
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
              <span className="spec-label">CAROUSEL</span>
              <span className="spec-value font-pixel">
                {isPlaying ? 'SPINNING UNICORN...' : 'WOUND UP & READY'}
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

        {/* Actions bar matching spec: [ ▶ PLAY LULLABY ] and 🔊 SOUND */}
        <div className="lullaby-controls-bar">
          <button
            type="button"
            className="pip-button pip-button-primary play-lullaby-btn"
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
                <VolumeX size={14} color="var(--pip-berry)" />
                <span className="font-mono">🔇 SOUND OFF</span>
              </>
            ) : (
              <>
                <Volume2 size={14} color="var(--pip-berry)" />
                <span className="font-mono">🔊 SOUND ON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </WindowPanel>
  );
}
