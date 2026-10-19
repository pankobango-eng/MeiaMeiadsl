import {
  CharacterDefinition,
  DialogueTriggerEvent,
  FootSide,
  FootTargetDefinition,
  LaughterIntensity,
  ComposureTier,
} from '../types/game';
import { CHARACTER_DIALOGUES, CharacterDialogueData } from '../data/characterDialogue';

export interface DialogueContext {
  character: CharacterDefinition;
  event: DialogueTriggerEvent;
  target?: FootTargetDefinition;
  sensitivity?: number;
  remainingTimeSec?: number;
  timeLimitSec?: number;
  targetsStruckCount?: number;
  targetsRequired?: number;
  lossTokens?: number;
  roundNumber?: number;
  isIneffectiveChoice?: boolean;
  score?: number;
  highScore?: number;
}

export interface GeneratedDialogueResult {
  text: string;
  intensity: LaughterIntensity;
  event: DialogueTriggerEvent;
  composureTier: ComposureTier;
}

class DialogueEngine {
  // Ring buffer of recently used lines per character to prevent repetition
  private recentLinesPerChar: Map<string, string[]> = new Map();
  private maxHistoryPerChar: number = 7;

  // Track whether each character's composure was broken on their last reaction
  private composureBrokenPerChar: Map<string, boolean> = new Map();

  /**
   * Generates a context-aware line for a character based on immediate game state & composure
   */
  public generateLine(ctx: DialogueContext): GeneratedDialogueResult {
    const charData = CHARACTER_DIALOGUES[ctx.character.id] || CHARACTER_DIALOGUES.char_raven;
    const history = this.getHistory(ctx.character.id);
    const wasBroken = this.composureBrokenPerChar.get(ctx.character.id) || false;

    let candidatePool: string[] = [];
    let intensity: LaughterIntensity = 'high';
    let composureTier: ComposureTier = 'composed';

    // Check if we should attempt a recovery line (if composure broke on previous hit and current hit is mild/medium)
    const isRecoveryCandidate =
      wasBroken &&
      (ctx.event === 'TARGET_HIT_MILD' || ctx.event === 'TARGET_INEFFECTIVE') &&
      charData.reactions.recovery &&
      charData.reactions.recovery.length > 0;

    if (isRecoveryCandidate && Math.random() < 0.65) {
      candidatePool = charData.reactions.recovery;
      intensity = 'mild';
      composureTier = 'composed';
      this.composureBrokenPerChar.set(ctx.character.id, false);
    } else {
      switch (ctx.event) {
        case 'TARGET_HIT_EXTREME':
          candidatePool = [...charData.reactions.extremeSensitivity];
          intensity = 'extreme';
          composureTier = 'broken';
          this.composureBrokenPerChar.set(ctx.character.id, true);
          break;

        case 'TARGET_HIT_HIGH':
          candidatePool = [...charData.reactions.highSensitivity];
          intensity = 'high';
          composureTier = 'rattled';
          this.composureBrokenPerChar.set(ctx.character.id, false);
          break;

        case 'TARGET_HIT_MILD':
          candidatePool = [...charData.reactions.mildSensitivity];
          intensity = 'mild';
          composureTier = 'composed';
          this.composureBrokenPerChar.set(ctx.character.id, false);
          break;

        case 'TARGET_INEFFECTIVE':
          candidatePool = [...charData.reactions.ineffectiveChoice];
          intensity = 'mild';
          composureTier = 'composed';
          this.composureBrokenPerChar.set(ctx.character.id, false);
          break;

        case 'ROUND_START':
          candidatePool = charData.reactions.roundStart;
          intensity = 'mild';
          composureTier = 'composed';
          this.composureBrokenPerChar.set(ctx.character.id, false);
          break;

        case 'ROUND_WON_FAST':
          candidatePool = charData.reactions.roundWonFast;
          intensity = 'high';
          composureTier = 'composed';
          break;

        case 'ROUND_WON_CLUTCH':
          candidatePool = charData.reactions.roundWonClutch;
          intensity = 'high';
          composureTier = 'rattled';
          break;

        case 'ROUND_LOST':
          candidatePool = charData.reactions.roundLost && charData.reactions.roundLost.length > 0
            ? [...charData.reactions.roundLost]
            : [...charData.reactions.roundStart];
          intensity = 'mild';
          composureTier = 'composed';
          this.composureBrokenPerChar.set(ctx.character.id, false);
          break;

        case 'REPEATED_LOSSES':
          candidatePool = charData.reactions.repeatedLosses && charData.reactions.repeatedLosses.length > 0
            ? [...charData.reactions.repeatedLosses]
            : (charData.reactions.roundLost && charData.reactions.roundLost.length > 0
                ? [...charData.reactions.roundLost]
                : [...charData.reactions.roundStart]);
          intensity = 'high';
          composureTier = 'composed';
          this.composureBrokenPerChar.set(ctx.character.id, false);
          break;

        case 'NEW_HIGH_SCORE':
          candidatePool = charData.reactions.newHighScore;
          intensity = 'high';
          composureTier = 'composed';
          break;

        case 'CHARACTER_UNLOCKED':
          candidatePool = charData.reactions.unlockedNext;
          intensity = 'high';
          composureTier = 'composed';
          break;

        case 'REMATCH_START':
          candidatePool = charData.reactions.rematch;
          intensity = 'high';
          composureTier = 'composed';
          break;

        default:
          candidatePool = charData.reactions.highSensitivity;
          intensity = 'high';
          composureTier = 'composed';
          break;
      }

      // If a spot-specific line exists for this target region, blend it into the pool with high weight!
      if (ctx.target && charData.reactions.spotSpecific) {
        let spotLines: string[] | undefined;
        if (ctx.target.regionKey === 'toes') {
          spotLines = charData.reactions.spotSpecific.toes;
        } else if (ctx.target.regionKey === 'inner_arch' || ctx.target.regionKey === 'outer_arch') {
          spotLines = charData.reactions.spotSpecific.arch;
        } else if (ctx.target.regionKey === 'heel') {
          spotLines = charData.reactions.spotSpecific.heel;
        } else if (ctx.target.regionKey === 'ball') {
          spotLines = charData.reactions.spotSpecific.ball;
        } else if (ctx.target.regionKey === 'mid_sole') {
          spotLines = charData.reactions.spotSpecific.mid_sole;
        }

        if (spotLines && spotLines.length > 0) {
          // Double the spot lines to increase chance of hyper-relevant regional reaction
          candidatePool = [...candidatePool, ...spotLines, ...spotLines];
        }
      }
    }

    if (!candidatePool || candidatePool.length === 0) {
      candidatePool = [ctx.character.quote];
    }

    // Filter out recently used lines if alternatives exist
    const unusedCandidates = candidatePool.filter((line) => !history.includes(line));
    const poolToSelectFrom = unusedCandidates.length > 0 ? unusedCandidates : candidatePool;

    // Pick random line from the filtered pool
    let selectedLine = poolToSelectFrom[Math.floor(Math.random() * poolToSelectFrom.length)];

    // Escalating combo context: If player has already landed 4+ targets this round and is hitting a high/extreme target,
    // add a spontaneous breathless reaction prefix to simulate losing breath during an intense tickle barrage!
    if (
      ctx.targetsStruckCount &&
      ctx.targetsStruckCount >= 4 &&
      (ctx.event === 'TARGET_HIT_HIGH' || ctx.event === 'TARGET_HIT_EXTREME') &&
      !selectedLine.startsWith('*')
    ) {
      const breathyPrefixes: Record<string, string[]> = {
        char_raven: ['*struggles to keep foot still* ', '*breathless gasp* ', 'Nnh... '],
        char_mika: ['*gasping for air* ', 'Wait, stop—hahaha! ', '*kicking heels* '],
        char_ivy: ['*giggling uncontrollably* ', '*bashful squeak* ', 'Hehe—goodness! '],
        char_celeste: ['*fluttering breathless giggle* ', '*curling toes tightly* ', 'Eeeek—! '],
        char_jade: ['*roaring out of breath* ', 'Damn it—bwahaha! ', '*bucking leg* '],
        char_sofia: ['*strained polite gasp* ', 'Heavens—ah-ha! ', '*flustered composure* '],
        char_amara: ['*laughing hysterically* ', 'Timeout—hahaha! ', '*gasping between words* '],
        char_yuna: ['*muffled squeak* ', 'Fufu... ah! ', '*holding back laughter* '],
      };
      const prefixes = breathyPrefixes[ctx.character.id] || ['*breathless* '];
      const chosenPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      if (Math.random() < 0.5) {
        selectedLine = `${chosenPrefix}${selectedLine}`;
      }
    }

    // Record in history buffer
    this.recordHistory(ctx.character.id, selectedLine);

    return {
      text: selectedLine,
      intensity,
      event: ctx.event,
      composureTier,
    };
  }

  /**
   * Evaluates target click context to determine reaction tier:
   * - Rating 5: Extreme sensitivity (broken kayfabe / composure break)
   * - Rating 3-4: High sensitivity
   * - Rating 1-2: Mild sensitivity, or Ineffective choice if rating 4-5 targets were available!
   */
  public evaluateTargetSelectionEvent(
    target: FootTargetDefinition,
    rating: number,
    allTargets: FootTargetDefinition[],
    disabledTargetIds: Set<string>,
    sensitivities: Record<string, number>
  ): DialogueTriggerEvent {
    // Rating 5 -> Extreme sensitivity / break in composure
    if (rating >= 5) {
      return 'TARGET_HIT_EXTREME';
    }

    // Rating 3 or 4 -> High sensitivity
    if (rating >= 3) {
      return 'TARGET_HIT_HIGH';
    }

    // Rating 1 or 2 -> Check if an unused target had sensitivity 4 or 5 (ineffective blunder!)
    const hasHighAvailable = allTargets.some((t) => {
      if (disabledTargetIds.has(t.id)) return false;
      const targetRating = Math.round(sensitivities[t.id] ?? t.defaultSensitivity);
      return targetRating >= 4;
    });

    if (hasHighAvailable) {
      return 'TARGET_INEFFECTIVE';
    }

    return 'TARGET_HIT_MILD';
  }

  /**
   * Returns a 2-3 compact paragraph tickle-fight narrative scene for a lost round
   */
  public getLostRoundNarrative(
    characterId: string,
    roundSeed: number = 0
  ): string[] {
    const charData = CHARACTER_DIALOGUES[characterId] || CHARACTER_DIALOGUES.char_raven;
    if (roundSeed % 2 === 1) {
      return charData.lostRoundNarratives.variationB;
    }
    return charData.lostRoundNarratives.variationA;
  }

  /**
   * Returns the 3-paragraph fictional tickle-fight finale scene for game over
   */
  public getGameOverFinaleScene(
    characterId: string,
    runSeed: number = 0
  ): [string, string, string] {
    const charData = CHARACTER_DIALOGUES[characterId] || CHARACTER_DIALOGUES.char_raven;
    if (runSeed % 2 === 1) {
      return charData.gameOverFinale.variationB;
    }
    return charData.gameOverFinale.variationA;
  }

  private getHistory(charId: string): string[] {
    return this.recentLinesPerChar.get(charId) || [];
  }

  private recordHistory(charId: string, line: string) {
    const history = this.getHistory(charId);
    history.push(line);
    if (history.length > this.maxHistoryPerChar) {
      history.shift();
    }
    this.recentLinesPerChar.set(charId, history);
  }

  /**
   * Resets temporary composure state and history
   */
  public resetState() {
    this.recentLinesPerChar.clear();
    this.composureBrokenPerChar.clear();
  }

  public resetHistory() {
    this.resetState();
  }
}

export const dialogueEngine = new DialogueEngine();
