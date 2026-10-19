/**
 * Web Audio API procedural sound synthesizer & character laughter engine.
 *
 * Includes:
 * 1. Prerecorded audio slot loader system with graceful fallback.
 *    Audio asset slots:
 *    `/audio/characters/${characterId}/laughter_${intensity}_${variant}.mp3`
 *    Where intensity: 'mild' | 'high' | 'extreme', and variant: 1 | 2 | 3.
 * 2. Character-specific procedural vocalic laughter & chuckle synthesizer
 *    (uses dual formant bandpass filters, harmonic pulse trains, and rhythmic envelope
 *    shaping tailored to each of the 8 characters' pitch, cadence, and vowel characteristics).
 * 3. Rapid 50ms fade-out of previous vocalizations to prevent chaotic overlap.
 * 4. Master volume control and non-repeating clip variation selection.
 */

import { LaughterIntensity } from '../types/game';
import { CHARACTER_DIALOGUES } from '../data/characterDialogue';

export interface LaughterAudioSlot {
  characterId: string;
  intensity: LaughterIntensity;
  variant: number;
  url: string;
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.8;

  // Active audio node or HTMLAudioElement for current vocalization, used for quick fade-out
  private activeVocalGain: GainNode | null = null;
  private activeAudioElement: HTMLAudioElement | null = null;

  // Track last played variant per character & intensity to avoid consecutive repeats
  private lastPlayedVariant: Map<string, number> = new Map();

  // Registry for prerecorded audio clip URLs
  private audioSlotRegistry: Map<string, string> = new Map();

  constructor() {
    this.registerDefaultAudioSlots();
  }

  /**
   * Register known audio slots for all 8 characters across 3 intensities: mild, high, extreme
   */
  private registerDefaultAudioSlots() {
    const charIds = [
      'char_raven',
      'char_mika',
      'char_ivy',
      'char_celeste',
      'char_jade',
      'char_sofia',
      'char_amara',
      'char_yuna',
    ];
    const intensities: LaughterIntensity[] = ['mild', 'high', 'extreme'];

    charIds.forEach((charId) => {
      intensities.forEach((intensity) => {
        for (let variant = 1; variant <= 3; variant++) {
          const key = `${charId}_${intensity}_${variant}`;
          this.audioSlotRegistry.set(
            key,
            `/audio/characters/${charId}/laughter_${intensity}_${variant}.mp3`
          );
        }
      });
    });
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopCurrentVocalization();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.activeAudioElement) {
      this.activeAudioElement.volume = this.masterVolume;
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Stops or rapidly fades out the currently playing vocalization (50ms) to avoid chaotic overlap
   */
  public stopCurrentVocalization() {
    if (this.activeVocalGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.activeVocalGain.gain.cancelScheduledValues(now);
        this.activeVocalGain.gain.setValueAtTime(this.activeVocalGain.gain.value, now);
        this.activeVocalGain.gain.linearRampToValueAtTime(0.001, now + 0.05);
      } catch {}
      this.activeVocalGain = null;
    }

    if (this.activeAudioElement) {
      try {
        this.activeAudioElement.pause();
        this.activeAudioElement.currentTime = 0;
      } catch {}
      this.activeAudioElement = null;
    }
  }

  /**
   * Character-specific laughter / giggle playback.
   * Checks for prerecorded audio asset first; falls back to procedural vocalic synthesizer.
   */
  public playCharacterLaughter(characterId: string, intensity: LaughterIntensity) {
    if (!this.enabled || this.masterVolume <= 0) return;

    // Immediately stop or fade previous vocalization
    this.stopCurrentVocalization();

    // Select variant (1, 2, or 3) avoiding consecutive repeat
    const trackerKey = `${characterId}_${intensity}`;
    const lastVar = this.lastPlayedVariant.get(trackerKey) || 0;
    let nextVar = Math.floor(Math.random() * 3) + 1;
    if (nextVar === lastVar) {
      nextVar = (nextVar % 3) + 1;
    }
    this.lastPlayedVariant.set(trackerKey, nextVar);

    const slotKey = `${characterId}_${intensity}_${nextVar}`;
    const audioUrl = this.audioSlotRegistry.get(slotKey);

    // Attempt prerecorded asset load
    if (audioUrl && typeof Audio !== 'undefined') {
      const audio = new Audio(audioUrl);
      audio.volume = this.masterVolume;

      let playedSuccessfully = false;
      audio.oncanplaythrough = () => {
        if (!playedSuccessfully) {
          playedSuccessfully = true;
          this.activeAudioElement = audio;
          audio.play().catch(() => {
            // If play fails (e.g. missing file or autoplay restriction), fallback to synthesis
            this.playProceduralLaughterFallback(characterId, intensity, nextVar);
          });
        }
      };

      audio.onerror = () => {
        // File does not exist -> Seamless fallback to procedural formant vocal synthesizer
        this.playProceduralLaughterFallback(characterId, intensity, nextVar);
      };

      setTimeout(() => {
        if (!playedSuccessfully && !this.activeAudioElement) {
          this.playProceduralLaughterFallback(characterId, intensity, nextVar);
        }
      }, 75);
      return;
    }

    // Direct procedural synthesis fallback
    this.playProceduralLaughterFallback(characterId, intensity, nextVar);
  }

  /**
   * Procedural Vocalic Laughter Synthesizer (Graceful Fallback)
   * Simulates vowel formant bursts with character-specific pitch, cadence, and rhythm.
   */
  private playProceduralLaughterFallback(
    characterId: string,
    intensity: LaughterIntensity,
    variantSeed: number
  ) {
    this.initContext();
    if (!this.ctx) return;

    try {
      const charData = CHARACTER_DIALOGUES[characterId] || CHARACTER_DIALOGUES.char_raven;
      const profile = charData.laughterProfile;

      // Burst count and intensity parameters:
      // mild: 2-3 pulses (composed, small chuckle)
      // high: 3-5 pulses (noticeable laughter, energetic)
      // extreme: 5-8 pulses (breathless, kayfabe-breaking laughter fit)
      let burstCount = 2;
      let intensityVolume = 0.14 * this.masterVolume;
      let pitchMultiplier = 1.0;

      if (intensity === 'mild') {
        burstCount = profile.burstCountRange[0];
        intensityVolume = 0.12 * this.masterVolume;
        pitchMultiplier = 0.96;
      } else if (intensity === 'high') {
        burstCount = Math.round((profile.burstCountRange[0] + profile.burstCountRange[1]) / 2);
        intensityVolume = 0.18 * this.masterVolume;
        pitchMultiplier = 1.04;
      } else {
        // extreme sensitivity
        burstCount = profile.burstCountRange[1] + (variantSeed % 2 === 0 ? 1 : 2);
        intensityVolume = 0.24 * this.masterVolume;
        pitchMultiplier = 1.14;
      }

      const now = this.ctx.currentTime;
      const masterVocalGain = this.ctx.createGain();
      masterVocalGain.gain.setValueAtTime(1.0, now);
      masterVocalGain.connect(this.ctx.destination);
      this.activeVocalGain = masterVocalGain;

      // Formant frequency definitions for simulated vowels
      const formantMap: Record<string, { f1: number; f2: number }> = {
        a: { f1: 820, f2: 1250 }, // Warm open "ha" (Ivy, Jade, Amara)
        e: { f1: 520, f2: 1850 }, // Smug, refined "heh" (Raven, Sofia)
        i: { f1: 320, f2: 2450 }, // High teasing "hee/hi" (Mika, Celeste)
        o: { f1: 460, f2: 920 },  // Understated sly "fu" (Yuna)
      };
      const formant = formantMap[profile.vowelType] || formantMap.a;

      for (let i = 0; i < burstCount; i++) {
        const spacing = intensity === 'extreme' ? profile.burstSpacingMs * 0.88 : profile.burstSpacingMs;
        const burstTime = now + (i * spacing) / 1000;
        const burstDuration = profile.staccato ? 0.08 : 0.11;

        // Base pitch with human micro-intonation curve
        const intonation =
          Math.sin((i / Math.max(1, burstCount - 1)) * Math.PI) * profile.pitchVarianceHz;
        const fundamentalFreq = (profile.basePitchHz + intonation) * pitchMultiplier;

        // 1. Fundamental Glottal Oscillator (sawtooth rich in harmonics)
        const glottal = this.ctx.createOscillator();
        glottal.type = 'sawtooth';
        glottal.frequency.setValueAtTime(fundamentalFreq, burstTime);
        glottal.frequency.exponentialRampToValueAtTime(
          fundamentalFreq * 0.93,
          burstTime + burstDuration
        );

        // 2. Formant Filter (Bandpass 1)
        const filter1 = this.ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(formant.f1, burstTime);
        filter1.Q.setValueAtTime(4.2, burstTime);

        // 3. Formant Filter (Bandpass 2)
        const filter2 = this.ctx.createBiquadFilter();
        filter2.type = 'bandpass';
        filter2.frequency.setValueAtTime(formant.f2, burstTime);
        filter2.Q.setValueAtTime(5.5, burstTime);

        // 4. Amplitude Envelope per laughter pulse
        const burstGain = this.ctx.createGain();
        burstGain.gain.setValueAtTime(0.001, burstTime);
        burstGain.gain.linearRampToValueAtTime(intensityVolume, burstTime + 0.02);
        burstGain.gain.exponentialRampToValueAtTime(0.001, burstTime + burstDuration);

        // Routing
        glottal.connect(filter1);
        glottal.connect(filter2);
        filter1.connect(burstGain);
        filter2.connect(burstGain);
        burstGain.connect(masterVocalGain);

        glottal.start(burstTime);
        glottal.stop(burstTime + burstDuration + 0.02);
      }
    } catch {}
  }

  /**
   * Sound triggered when an active foot target is clicked.
   */
  public playTargetHit(sensitivity: number) {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 320 + Math.min(sensitivity, 5.0) * 85;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);

      gain.gain.setValueAtTime(0.18 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  /**
   * Short dull thud when clicking a disabled target
   */
  public playDisabledClick() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      gain.gain.setValueAtTime(0.08 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Ascending chord when round is successfully cleared
   */
  public playRoundSuccess() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12 * this.masterVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {}
  }

  /**
   * Downward buzzer tone when timer runs out on a round
   */
  public playRoundFail() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.35);

      gain.gain.setValueAtTime(0.14 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.37);
    } catch {}
  }

  /**
   * Game Over descending motif
   */
  public playGameOver() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [330, 293.66, 261.63, 196];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15 * this.masterVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();
