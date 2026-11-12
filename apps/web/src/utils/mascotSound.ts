export type MascotSoundType = 'plop' | 'drip' | 'flush';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Memutar efek suara interaktif kawaii via Web Audio API (tanpa file audio eksternal).
 */
export function playMascotSound(type: MascotSoundType): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'plop') {
    // Suara "bloop-plop!" yang memantul lucu
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
    return;
  }

  if (type === 'drip') {
    // Suara tetesan air kristal "ting-drip!"
    const notes = [680, 1040];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.45, start + 0.11);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.24, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
    return;
  }

  // 'flush': suara "wuuusshhh!" + lonceng kecil "cling!"
  const bufferSize = Math.floor(ctx.sampleRate * 0.36);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(2.5, now);
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.exponentialRampToValueAtTime(2200, now + 0.18);
  filter.frequency.exponentialRampToValueAtTime(550, now + 0.35);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.001, now);
  noiseGain.gain.linearRampToValueAtTime(0.22, now + 0.08);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.36);

  // Lonceng bersih setelah siram
  const chime = ctx.createOscillator();
  const chimeGain = ctx.createGain();
  chime.type = 'sine';
  chime.frequency.setValueAtTime(1174.66, now + 0.24); // D6
  chime.frequency.exponentialRampToValueAtTime(1567.98, now + 0.32); // G6

  chimeGain.gain.setValueAtTime(0.001, now + 0.24);
  chimeGain.gain.linearRampToValueAtTime(0.18, now + 0.26);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

  chime.connect(chimeGain);
  chimeGain.connect(ctx.destination);
  chime.start(now + 0.24);
  chime.stop(now + 0.5);
}
