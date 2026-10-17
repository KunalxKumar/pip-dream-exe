import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export default function SoundToggle({ className = '' }) {
  const { muted, toggleMute } = useSound();

  return (
    <button
      type="button"
      className={`pip-button pip-button-soft ${className}`}
      onClick={toggleMute}
      aria-label={muted ? 'Turn sound ON' : 'Turn sound OFF'}
      title={muted ? 'Sound: MUTED (Click to unmute)' : 'Sound: ACTIVE (Click to mute)'}
      style={{ padding: '6px 12px', fontSize: '0.68rem' }}
    >
      {muted ? (
        <>
          <VolumeX size={14} color="var(--pip-berry)" />
          <span className="font-retro">🔇 SOUND OFF</span>
        </>
      ) : (
        <>
          <Volume2 size={14} color="var(--pip-berry)" />
          <span className="font-retro">🔊 SOUND ON</span>
        </>
      )}
    </button>
  );
}
