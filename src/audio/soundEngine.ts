/**
 * Echoes of Orion - Procedural Dark Fantasy Audio Engine
 * Uses Web Audio API to create authentic dark fantasy ambient soundscapes
 * and responsive tactile UI sound effects without external audio file dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isPlayingAmbience = false;

  // Master and sub-bus gain nodes
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  // Ambience nodes for procedural soundscapes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private windNode: AudioNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private chimeInterval: number | null = null;

  private settings = {
    master: 0.8,
    music: 0.75,
    sfx: 0.85,
    ambient: 0.7,
    voice: 0.9,
    isMuted: false,
  };

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Setup audio buses
    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.ambientGain = this.ctx.createGain();
    this.voiceGain = this.ctx.createGain();

    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.ambientGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.applyGains();
    this.isInitialized = true;
  }

  public setVolumes(settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    voiceVolume?: number;
    isMuted: boolean;
  }) {
    this.settings = {
      master: settings.masterVolume / 100,
      music: settings.musicVolume / 100,
      sfx: settings.sfxVolume / 100,
      ambient: settings.ambientVolume / 100,
      voice: (settings.voiceVolume ?? 90) / 100,
      isMuted: settings.isMuted,
    };
    this.applyGains();
  }

  private applyGains() {
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.sfxGain || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const masterVal = this.settings.isMuted ? 0 : this.settings.master;

    this.masterGain.gain.setTargetAtTime(masterVal, now, 0.05);
    this.musicGain.gain.setTargetAtTime(this.settings.music, now, 0.05);
    this.sfxGain.gain.setTargetAtTime(this.settings.sfx, now, 0.05);
    this.ambientGain.gain.setTargetAtTime(this.settings.ambient, now, 0.05);
    if (this.voiceGain) {
      this.voiceGain.gain.setTargetAtTime(this.settings.voice, now, 0.05);
    }
  }

  public async startAmbience() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return;
      }
    }

    if (this.isPlayingAmbience) return;
    this.isPlayingAmbience = true;

    try {
      // 1. Deep Sub-Bass & Harmonic Cello Drone (A1 55Hz & E2 82.5Hz)
      const droneOsc1 = this.ctx.createOscillator();
      const droneOsc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      const droneGain = this.ctx.createGain();

      droneOsc1.type = 'sawtooth';
      droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(82.5, this.ctx.currentTime); // Fifth (E2)

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      droneFilter.Q.setValueAtTime(3, this.ctx.currentTime);

      droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3);

      droneOsc1.connect(droneFilter);
      droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      if (this.ambientGain) droneGain.connect(this.ambientGain);

      droneOsc1.start();
      droneOsc2.start();

      this.droneOsc1 = droneOsc1;
      this.droneOsc2 = droneOsc2;
      this.droneFilter = droneFilter;

      // 2. Procedural Howling Wind Generator (Filtered Noise + Slow LFO Sweep)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02; // Brown/pinkish noise
        lastOut = output[i];
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      windFilter.Q.setValueAtTime(2.2, this.ctx.currentTime);

      // LFO for organic wind surging
      const windLfo = this.ctx.createOscillator();
      const windLfoGain = this.ctx.createGain();
      windLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second cycle
      windLfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
      windLfo.connect(windFilter.frequency);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      windGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 4);

      noiseSource.connect(windFilter);
      windFilter.connect(windGain);
      if (this.ambientGain) windGain.connect(this.ambientGain);

      noiseSource.start();
      windLfo.start();

      this.windNode = noiseSource;
      this.windFilter = windFilter;
      this.windLfo = windLfo;

      // 3. Sporadic Mystical Distant Celestial Chimes
      this.chimeInterval = window.setInterval(() => {
        if (!this.settings.isMuted && Math.random() > 0.4) {
          this.playRandomCelestialChime();
        }
      }, 7000);
    } catch {
      // Audio playback restrictions or browser context issue
    }
  }

  private playRandomCelestialChime() {
    if (!this.ctx || !this.ambientGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [220, 261.63, 329.63, 392, 440, 523.25, 659.25]; // Ancient minor pentatonic
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(gain);
    gain.connect(this.ambientGain);

    osc.start(now);
    osc.stop(now + 3.6);
  }

  public stopAmbience() {
    if (!this.isPlayingAmbience) return;
    this.isPlayingAmbience = false;

    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }

    try {
      this.droneOsc1?.stop();
      this.droneOsc2?.stop();
      this.windLfo?.stop();
      (this.windNode as AudioBufferSourceNode)?.stop();
    } catch {
      // Ignore cleanup error
    }

    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.windNode = null;
  }

  // --- UI SOUND EFFECTS ---

  public playHover() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.095);
  }

  public playSelect() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Bronze chime harmonic sound
    const freqs = [587.33, 1174.66]; // D5 and octave
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.14 : 0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.65);
    });
  }

  public playBack() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Muted low wooden resonance / thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playConfirm() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Profound ancient celestial gong strike
    const harmonics = [110, 220, 440, 660, 880];
    harmonics.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i < 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.16 / (i + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.45);
    });
  }

  public playEchoAbsorb() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Ascending spectral resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.9);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.15);
  }

  public playTick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playRebind() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(660, now + 0.06);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // --- 2D GAMEPLAY SOUNDS ---

  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Ascending wind whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playLand() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Stone impact thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playStep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const pitch = 140 + Math.random() * 40;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.065);
  }

  public playBladeSlash() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // High velocity whoosh + metallic blade ring
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(420, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1240, now);
    osc2.frequency.exponentialRampToValueAtTime(320, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.27);
    osc2.stop(now + 0.27);
  }

  public playStoneShatter() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.settings.isMuted) return;
    const now = this.ctx.currentTime;

    // Explosive crunch / heavy stone shatter
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.38);
  }
}

export const soundEngine = new SoundEngine();
