import { useState, useCallback } from 'react';
import {
  getAudioMuted,
  setAudioMuted,
  playClickSound,
  playChimeSound,
  playMusicBoxNote,
  playSecretMelody,
} from '../utils/audio';

export function useSound() {
  const [muted, setMutedState] = useState(getAudioMuted());

  const toggleMute = useCallback(() => {
    const next = !muted;
    setAudioMuted(next);
    setMutedState(next);
    if (!next) {
      playClickSound();
    }
  }, [muted]);

  const click = useCallback(() => {
    playClickSound();
  }, []);

  const chime = useCallback(() => {
    playChimeSound();
  }, []);

  const note = useCallback((freq, duration) => {
    playMusicBoxNote(freq, duration);
  }, []);

  const secret = useCallback(() => {
    playSecretMelody();
  }, []);

  return {
    muted,
    toggleMute,
    playClick: click,
    playChime: chime,
    playNote: note,
    playSecret: secret,
  };
}
