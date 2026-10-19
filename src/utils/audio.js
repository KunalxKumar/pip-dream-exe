// Web Audio API sound generator for PipOS (Zero external sound dependencies)

let audioCtx = null;
let isAudioMuted = true; // Default MUTED per Rule 7!
let lullabyInterval = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted) {
  isAudioMuted = muted;
  if (muted && lullabyInterval) {
    clearInterval(lullabyInterval);
    lullabyInterval = null;
  }
}

export function getAudioMuted() {
  return isAudioMuted;
}

// Gentle 90s retro interface click
export function playClickSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.debug('Audio playback skipped:', e);
  }
}

// Warm soft chime for notifications and unlocks
export function playChimeSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      const startTime = ctx.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch (e) {
    console.debug('Audio chime skipped:', e);
  }
}

// Single music box note for Lullaby Lab
export function playMusicBoxNote(freq = 440, duration = 0.8) {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm music box envelope
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.debug('Music box error:', e);
  }
}

// Easter egg secret melody
export function playSecretMelody() {
  if (isAudioMuted) return;
  const melody = [523.25, 659.25, 783.99, 880, 1046.5, 1318.51];
  melody.forEach((note, i) => {
    setTimeout(() => {
      playMusicBoxNote(note, 0.6);
    }, i * 120);
  });
}

// Gentle bedtime completion motif for 01:03 Dream Delivery
export function playDeliveryCompletionMotif() {
  if (isAudioMuted) return;
  // Nursery lullaby notes: E5 -> G5 -> A5 -> G5 -> E5 -> C5
  const motif = [
    { freq: 659.25, time: 0, dur: 0.6 },    // E5
    { freq: 783.99, time: 200, dur: 0.6 },  // G5
    { freq: 880.00, time: 420, dur: 0.7 },  // A5
    { freq: 783.99, time: 660, dur: 0.7 },  // G5
    { freq: 659.25, time: 900, dur: 0.8 },  // E5
    { freq: 523.25, time: 1180, dur: 1.2 }, // C5
  ];
  motif.forEach(({ freq, time, dur }) => {
    setTimeout(() => {
      playMusicBoxNote(freq, dur);
    }, time);
  });
}
