// Audio Synthesizer using Web Audio API for browser audio playback without external asset dependency

export function playOrderCompleteSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Play a pleasant 3-note chime (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.15 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.15);
      osc.stop(ctx.currentTime + index * 0.15 + 0.4);
    });
  } catch (e) {
    console.error('Failed to play completion sound', e);
  }
}

export function playNewOrderSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Dual chime ding-dong (880Hz -> 659Hz)
    const notes = [880, 659.25];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.2);

      gain.gain.setValueAtTime(0.4, ctx.currentTime + index * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.2 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.2);
      osc.stop(ctx.currentTime + index * 0.2 + 0.5);
    });
  } catch (e) {
    console.error('Failed to play new order sound', e);
  }
}
