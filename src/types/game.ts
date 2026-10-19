export type FootSide = 'left' | 'right';

export type FootRegionKey =
  | 'toes'
  | 'ball'
  | 'inner_arch'
  | 'outer_arch'
  | 'mid_sole'
  | 'heel';

export interface TargetRegionGeometry {
  center: { x: number; y: number };
  badgePos: { x: number; y: number };
  path: string;
}

export interface CharacterTheme {
  primary: string; // e.g. '#7c3aed'
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  skinBase: string;
  skinMid: string;
  skinShadow: string;
  skinDeep: string;
  skinHighlight: string;
  creaseColor: string;
  pedicureColor: string;
  pedicureGloss: string;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  age: number;
  aesthetic: string; // e.g. 'Goth', 'Coquette', 'Emo', etc.
  personality: string;
  quote: string;
  bio: string;
  portraitUrl: string;
  feetIllustrationUrl: string;
  theme: CharacterTheme;
  footCharacteristics: {
    archType: 'high' | 'graceful' | 'medium' | 'athletic' | 'petite';
    toeShape: 'elongated' | 'delicate' | 'compact' | 'tapered' | 'toned';
    details: string;
  };
  sensitivityProfile: Record<string, number>; // 12 keys: left/right + 6 regions (1 to 5)
  minScoreToUnlock: number; // 0 for initial character, score threshold for later ones
}

export interface FootTargetDefinition {
  id: string; // e.g. 'left_toes', 'right_heel'
  foot: FootSide;
  regionKey: FootRegionKey;
  name: string;
  anatomicalTerm: string;
  defaultSensitivity: number; // 1 to 5
  description: string;
  keyboardKey: string;
  keyLabel: string;
}

export type GameState =
  | 'MAIN_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'ROUND_INTERMISSION'
  | 'LEVEL_RESULTS'
  | 'GAME_OVER';

export interface GameConfig {
  roundDurationSec: number; // default 20s
  targetsRequiredPerRound: number; // 6 required targets
  maxLossTokens: number; // 6 loss tokens
  totalRoundsPerLevel: number; // 10 rounds
  soundEnabled: boolean;
  masterVolume: number; // 0.0 to 1.0, default 0.8
  showKeyboardShortcuts: boolean;
}

export interface StruckTargetRecord {
  targetId: string;
  foot: FootSide;
  regionKey: FootRegionKey;
  timestamp: number;
  sensitivity: number;
  pointsAwarded: number;
  timeDeductedSec: number;
}

export interface RoundStats {
  roundNumber: number; // 1 to 10
  isWon: boolean;
  timeRemainingSec: number;
  timeLimitSec: number;
  targetsStruckCount: number;
  roundScore: number;
  cumulativeScore: number;
  struckTargets: StruckTargetRecord[];
}

export interface PlayerProgression {
  overallHighScore: number;
  characterHighScores: Record<string, number>;
  unlockedCharacterIds: string[];
  lastSelectedCharacterId: string;
}

export interface ActiveRunState {
  characterId: string;
  roundNumber: number;
  cumulativeScore: number;
  currentRoundScore: number;
  lossTokens: number;
  timeRemainingSec: number;
  disabledTargetIds: string[];
  sensitivities: Record<string, number>;
  roundStruckList: StruckTargetRecord[];
  isIntermission: boolean;
  lastRoundStats: RoundStats | null;
}

export type LaughterIntensity = 'mild' | 'high' | 'extreme';

export type ComposureTier = 'composed' | 'rattled' | 'broken';

export interface ComposureState {
  currentTier: ComposureTier;
  justBrokeKayfabe: boolean;
  consecutiveHighHits: number;
}

export type DialogueTriggerEvent =
  | 'ROUND_START'
  | 'TARGET_HIT_EXTREME'
  | 'TARGET_HIT_HIGH'
  | 'TARGET_HIT_MILD'
  | 'TARGET_INEFFECTIVE'
  | 'COMPOSURE_RECOVERY'
  | 'ROUND_WON_FAST'
  | 'ROUND_WON_CLUTCH'
  | 'ROUND_LOST'
  | 'REPEATED_LOSSES'
  | 'NEW_HIGH_SCORE'
  | 'CHARACTER_UNLOCKED'
  | 'REMATCH_START'
  | 'GAME_OVER';

export interface EventLogItem {
  id: string;
  sequenceNumber: number;
  timestamp: number;
  roundNumber: number;
  foot: FootSide;
  targetName: string;
  regionKey: FootRegionKey;
  sensitivity: number;
  pointsAwarded: number;
  timeDeductedSec: number;
  dialogueLine: string;
  characterName: string;
  intensity: LaughterIntensity;
}


