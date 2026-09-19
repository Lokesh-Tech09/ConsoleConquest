// Web Audio API Synthesizer for Combat Sounds (Muted by default, zero external files)
// Highly optimized: Non-blocking, cached buffers, zero click delay.

class CombatAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private cachedNoiseBuffer: AudioBuffer | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mk11_sound_enabled');
        this.isEnabled = stored === 'true';
      } catch {}
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.cachedNoiseBuffer) return this.cachedNoiseBuffer;

    try {
      // Pre-compute white noise buffer ONCE (0.12s at sampleRate)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.cachedNoiseBuffer = buffer;
      return buffer;
    } catch {
      return null;
    }
  }

  public toggleSound(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mk11_sound_enabled', String(this.isEnabled));
      } catch {}
    }
    if (this.isEnabled) {
      this.initContext();
      this.playGong();
    } else {
      this.stopAmbient();
    }
    return this.isEnabled;
  }

  public getSoundState(): boolean {
    return this.isEnabled;
  }

  // Play metallic blade slash effect (Non-blocking async)
  public playSlash() {
    if (!this.isEnabled) return;

    // Run in macrotask queue so click handler returns in 0ms!
    setTimeout(() => {
      this.initContext();
      if (!this.ctx) return;

      try {
        const buffer = this.getNoiseBuffer();
        if (!buffer) return;

        const now = this.ctx.currentTime;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(800, now + 0.12);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
      } catch {}
    }, 0);
  }

  // Play deep arena gong / combat resonance
  public playGong() {
    if (!this.isEnabled) return;

    setTimeout(() => {
      this.initContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, now);
        osc1.frequency.exponentialRampToValueAtTime(55, now + 1.0);

        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(260, now);
        osc2.frequency.exponentialRampToValueAtTime(130, now + 0.7);

        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.3);
        osc2.stop(now + 0.9);
      } catch {}
    }, 0);
  }

  // Play dramatic slot reveal climax chord
  public playSlotReveal() {
    if (!this.isEnabled) return;

    setTimeout(() => {
      this.initContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        [80, 120, 160, 240].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.8);

          gain.gain.setValueAtTime(0.18 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + 1.3);
        });
      } catch {}
    }, 0);
  }

  public playIntroSweep() {
    if (!this.isEnabled) return;

    setTimeout(() => {
      this.initContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 1.0);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.3);
      } catch {}
    }, 0);
  }

  public playImpact() {
    if (!this.isEnabled) return;

    setTimeout(() => {
      this.initContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;

        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(80, now);
        sub.frequency.exponentialRampToValueAtTime(35, now + 0.8);
        subGain.gain.setValueAtTime(0.5, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + 1.0);

        const strike = this.ctx.createOscillator();
        const strikeGain = this.ctx.createGain();
        strike.type = 'triangle';
        strike.frequency.setValueAtTime(320, now);
        strike.frequency.exponentialRampToValueAtTime(110, now + 1.2);
        strikeGain.gain.setValueAtTime(0.35, now);
        strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        strike.connect(strikeGain);
        strikeGain.connect(this.ctx.destination);
        strike.start(now);
        strike.stop(now + 1.6);
      } catch {}
    }, 0);
  }

  public stopAmbient() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {}
      this.ambientOsc = null;
    }
  }
}

export const combatSound =
  typeof window !== 'undefined'
    ? new CombatAudioEngine()
    : ({} as CombatAudioEngine);
