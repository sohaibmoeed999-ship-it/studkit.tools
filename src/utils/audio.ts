// Web Audio Synthesizer for study ambiance, timers, and game sound effects
export type AmbientSoundType =
  | 'rain'
  | 'whitenoise'
  | 'campfire'
  | 'binaural'
  | 'ocean'
  | 'forest'
  | 'lofi'
  | 'cafe'
  | 'night'
  | 'library';

class SoundController {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private intervalTimer: any = null;
  private isPlayingAmbient = false;
  private currentAmbientType: AmbientSoundType | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playPop() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  public playSuccess() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.32);
      });
    } catch {}
  }

  public playBeep(freq = 440, duration = 0.15) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  public playTimerDone() {
    try {
      const ctx = this.getContext();
      const chime = [880, 1108.73, 1318.51, 1760];
      chime.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const st = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.25, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.65);
      });
    } catch {}
  }

  public toggleAmbientSound(type: AmbientSoundType): boolean {
    const ctx = this.getContext();
    if (this.isPlayingAmbient && this.currentAmbientType === type) {
      this.stopAmbientSound();
      return false;
    }
    this.stopAmbientSound();

    if (type === 'lofi') {
      // Synthesize repeating Lo-Fi Chill Study Chord progression
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0], // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23], // G7
      ];
      let step = 0;
      const playChord = () => {
        if (!this.isPlayingAmbient) return;
        const currentChord = chords[step % chords.length];
        currentChord.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          const t = ctx.currentTime;
          gain.gain.setValueAtTime(0.04, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 2.9);
        });
        step++;
      };

      playChord();
      this.intervalTimer = setInterval(playChord, 3000);
      this.isPlayingAmbient = true;
      this.currentAmbientType = type;
      return true;
    }

    if (type === 'binaural') {
      // 210 Hz Left + 220 Hz Right (10 Hz Alpha wave focus beat)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const gain = ctx.createGain();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.value = 210;
      oscR.frequency.value = 220;
      gain.gain.value = 0.08;

      oscL.connect(gain);
      oscR.connect(gain);
      gain.connect(ctx.destination);
      oscL.start();
      oscR.start();

      this.noiseNode = gain;
      this.isPlayingAmbient = true;
      this.currentAmbientType = type;
      return true;
    }

    // Audio Buffer Synthesizer for Noise-based tracks
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'whitenoise') {
        output[i] = white * 0.5;
      } else if (type === 'rain') {
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (type === 'ocean') {
        // Low frequency surging waves
        output[i] = (lastOut + 0.008 * white) / 1.008;
        lastOut = output[i];
        output[i] *= 6.0;
      } else if (type === 'campfire') {
        // Campfire crackle
        const r = Math.random();
        output[i] = r > 0.985 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.05;
      } else if (type === 'night') {
        // Crickets chirping high harmonics
        const r = Math.random();
        output[i] = r > 0.99 ? Math.sin(i * 0.5) * 0.4 : (Math.random() * 2 - 1) * 0.03;
      } else if (type === 'forest') {
        // Forest wind + rustling leaves
        output[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = output[i];
        output[i] *= 2.5;
      } else if (type === 'cafe') {
        // Low ambient murmur
        output[i] = (lastOut + 0.01 * white) / 1.01;
        lastOut = output[i];
        output[i] *= 2.0;
      } else {
        // Library brown noise
        output[i] = (lastOut + 0.005 * white) / 1.005;
        lastOut = output[i];
        output[i] *= 4.0;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type =
      type === 'whitenoise'
        ? 'lowpass'
        : type === 'rain'
        ? 'bandpass'
        : type === 'ocean'
        ? 'lowpass'
        : type === 'campfire'
        ? 'lowpass'
        : 'lowpass';
    filter.frequency.value =
      type === 'whitenoise'
        ? 800
        : type === 'rain'
        ? 1100
        : type === 'ocean'
        ? 350
        : type === 'campfire'
        ? 600
        : 500;

    const gain = ctx.createGain();
    gain.gain.value = 0.12;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    this.noiseNode = source;
    this.isPlayingAmbient = true;
    this.currentAmbientType = type;
    return true;
  }

  public stopAmbientSound() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    if (this.noiseNode) {
      try {
        if ('stop' in this.noiseNode) {
          (this.noiseNode as AudioBufferSourceNode).stop();
        }
      } catch {}
      this.noiseNode = null;
    }
    this.isPlayingAmbient = false;
    this.currentAmbientType = null;
  }

  public isAmbientPlaying(): boolean {
    return this.isPlayingAmbient;
  }

  public getActiveAmbientType(): AmbientSoundType | null {
    return this.currentAmbientType;
  }
}

export const sounds = new SoundController();

export function playBeep(freq = 440, duration = 0.2) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}
