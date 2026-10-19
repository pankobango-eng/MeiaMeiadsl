import { FootTargetDefinition, GameConfig } from '../types/game';

/**
 * 12 Independent Target Definitions (6 per foot)
 * 1. Toe pads (toes)
 * 2. Ball of the foot (ball)
 * 3. Inner arch (inner_arch)
 * 4. Outer arch (outer_arch)
 * 5. Mid-sole (mid_sole)
 * 6. Heel (heel)
 */
export const TARGET_DEFINITIONS: FootTargetDefinition[] = [
  // LEFT FOOT
  {
    id: 'left_toes',
    foot: 'left',
    regionKey: 'toes',
    name: 'Left Toe Pads',
    anatomicalTerm: 'Apical Toe Pads (L)',
    defaultSensitivity: 4,
    description: 'Delicate sensory cushions of the digital pads.',
    keyboardKey: 'q',
    keyLabel: 'Q',
  },
  {
    id: 'left_ball',
    foot: 'left',
    regionKey: 'ball',
    name: 'Left Ball of Foot',
    anatomicalTerm: 'Metatarsal Cushion (L)',
    defaultSensitivity: 3,
    description: 'Broad anterior weight-bearing forefoot pad.',
    keyboardKey: 'w',
    keyLabel: 'W',
  },
  {
    id: 'left_inner_arch',
    foot: 'left',
    regionKey: 'inner_arch',
    name: 'Left Inner Arch',
    anatomicalTerm: 'Medial Longitudinal Arch (L)',
    defaultSensitivity: 5,
    description: 'Concave instep with acute reflex tickle sensitivity.',
    keyboardKey: 'e',
    keyLabel: 'E',
  },
  {
    id: 'left_outer_arch',
    foot: 'left',
    regionKey: 'outer_arch',
    name: 'Left Outer Arch',
    anatomicalTerm: 'Lateral Sole Column (L)',
    defaultSensitivity: 2,
    description: 'Firm outer border along the lateral arch margin.',
    keyboardKey: 'a',
    keyLabel: 'A',
  },
  {
    id: 'left_mid_sole',
    foot: 'left',
    regionKey: 'mid_sole',
    name: 'Left Mid-Sole',
    anatomicalTerm: 'Central Plantar Vault (L)',
    defaultSensitivity: 4,
    description: 'Tender central sole region over the plantar fascia.',
    keyboardKey: 's',
    keyLabel: 'S',
  },
  {
    id: 'left_heel',
    foot: 'left',
    regionKey: 'heel',
    name: 'Left Heel',
    anatomicalTerm: 'Calcaneal Fat Pad (L)',
    defaultSensitivity: 1,
    description: 'Resilient posterior heel cushion.',
    keyboardKey: 'd',
    keyLabel: 'D',
  },

  // RIGHT FOOT
  {
    id: 'right_toes',
    foot: 'right',
    regionKey: 'toes',
    name: 'Right Toe Pads',
    anatomicalTerm: 'Apical Toe Pads (R)',
    defaultSensitivity: 4,
    description: 'Delicate sensory cushions of the digital pads.',
    keyboardKey: 'u',
    keyLabel: 'U',
  },
  {
    id: 'right_ball',
    foot: 'right',
    regionKey: 'ball',
    name: 'Right Ball of Foot',
    anatomicalTerm: 'Metatarsal Cushion (R)',
    defaultSensitivity: 3,
    description: 'Broad anterior weight-bearing forefoot pad.',
    keyboardKey: 'i',
    keyLabel: 'I',
  },
  {
    id: 'right_inner_arch',
    foot: 'right',
    regionKey: 'inner_arch',
    name: 'Right Inner Arch',
    anatomicalTerm: 'Medial Longitudinal Arch (R)',
    defaultSensitivity: 5,
    description: 'Concave instep with acute reflex tickle sensitivity.',
    keyboardKey: 'o',
    keyLabel: 'O',
  },
  {
    id: 'right_outer_arch',
    foot: 'right',
    regionKey: 'outer_arch',
    name: 'Right Outer Arch',
    anatomicalTerm: 'Lateral Sole Column (R)',
    defaultSensitivity: 2,
    description: 'Firm outer border along the lateral arch margin.',
    keyboardKey: 'j',
    keyLabel: 'J',
  },
  {
    id: 'right_mid_sole',
    foot: 'right',
    regionKey: 'mid_sole',
    name: 'Right Mid-Sole',
    anatomicalTerm: 'Central Plantar Vault (R)',
    defaultSensitivity: 4,
    description: 'Tender central sole region over the plantar fascia.',
    keyboardKey: 'k',
    keyLabel: 'K',
  },
  {
    id: 'right_heel',
    foot: 'right',
    regionKey: 'heel',
    name: 'Right Heel',
    anatomicalTerm: 'Calcaneal Fat Pad (R)',
    defaultSensitivity: 1,
    description: 'Resilient posterior heel cushion.',
    keyboardKey: 'l',
    keyLabel: 'L',
  },
];

export const DEFAULT_CONFIG: GameConfig = {
  roundDurationSec: 20,
  targetsRequiredPerRound: 6,
  maxLossTokens: 6,
  totalRoundsPerLevel: 10,
  soundEnabled: true,
  masterVolume: 0.8,
  showKeyboardShortcuts: true,
};

