import { CharacterDefinition, PlayerProgression } from '../types/game';

// Import Character Portraits
import portraitRaven from '../assets/images/portrait_raven_1792404563883.jpg';
import portraitMika from '../assets/images/portrait_mika_1792404564572.jpg';
import portraitIvy from '../assets/images/portrait_ivy_1792404565384.jpg';
import portraitCeleste from '../assets/images/portrait_celeste_1792404566000.jpg';
import portraitJade from '../assets/images/portrait_jade_1792404567265.jpg';
import portraitSofia from '../assets/images/portrait_sofia_1792404567020.jpg';
import portraitAmara from '../assets/images/portrait_amara_1792404568355.jpg';
import portraitYuna from '../assets/images/portrait_yuna_1792404568012.jpg';

// Import Distinct Character Foot Illustrations
import feetRaven from '../assets/images/feet_raven_1792405145381.jpg';
import feetMika from '../assets/images/feet_mika_1792405146655.jpg';
import feetIvy from '../assets/images/feet_ivy_1792405147864.jpg';
import feetCeleste from '../assets/images/feet_celeste_1792405148298.jpg';
import feetJade from '../assets/images/feet_jade_1792405148598.jpg';
import feetSofia from '../assets/images/feet_sofia_1792405150160.jpg';
import feetAmara from '../assets/images/feet_amara_1792405151337.jpg';
import feetYuna from '../assets/images/feet_yuna_1792405151316.jpg';

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: 'char_raven',
    name: 'Raven',
    age: 23,
    aesthetic: 'Goth Aesthetic',
    personality: 'Mysterious, quietly confident, with razor-sharp sarcastic humor.',
    quote: '"Careful now... let us see if your reflexes can match your curiosity."',
    bio: 'An architectural archivist who favors candlelit libraries, dark velvet tailoring, and antique silver talismans. Her high-arched slender soles exhibit acute tactile responsiveness.',
    portraitUrl: portraitRaven,
    feetIllustrationUrl: feetRaven,
    theme: {
      primary: '#a855f7',
      bgGradient: 'from-[#120a1c] via-[#0d0714] to-[#07040a]',
      badgeBg: 'bg-purple-950/70 border-purple-700/60',
      badgeText: 'text-purple-300',
      skinBase: '#fbf5f0',
      skinMid: '#eddcd0',
      skinShadow: '#d8bea8',
      skinDeep: '#bd9e84',
      skinHighlight: '#ffffff',
      creaseColor: '#9f785e',
      pedicureColor: '#2e1065', // Dark blackberry purple
      pedicureGloss: '#c084fc',
    },
    footCharacteristics: {
      archType: 'high',
      toeShape: 'elongated',
      details: 'Slender elongated digits, pronounced delicate medial arch curve.',
    },
    sensitivityProfile: {
      left_toes: 3,
      left_ball: 2,
      left_inner_arch: 5,
      left_outer_arch: 3,
      left_mid_sole: 4,
      left_heel: 1,
      right_toes: 4,
      right_ball: 3,
      right_inner_arch: 5,
      right_outer_arch: 2,
      right_mid_sole: 4,
      right_heel: 1,
    },
    minScoreToUnlock: 0, // Unlocked initially
  },
  {
    id: 'char_mika',
    name: 'Mika',
    age: 22,
    aesthetic: 'Emo Aesthetic',
    personality: 'Mischievous, fiercely competitive, and playfully defiant.',
    quote: '"Think you have fast fingers? Do not blink or you will forfeit."',
    bio: 'A live music sound engineer with crimson-streaked dark hair, spiked leather accents, and an infectious energetic grin. Her compact, agile soles react in split-second bursts.',
    portraitUrl: portraitMika,
    feetIllustrationUrl: feetMika,
    theme: {
      primary: '#f43f5e',
      bgGradient: 'from-[#1c080d] via-[#120508] to-[#080204]',
      badgeBg: 'bg-rose-950/70 border-rose-700/60',
      badgeText: 'text-rose-300',
      skinBase: '#faede7',
      skinMid: '#ecc9bc',
      skinShadow: '#d4a190',
      skinDeep: '#b67a68',
      skinHighlight: '#fff5f0',
      creaseColor: '#9c5b4b',
      pedicureColor: '#881337', // Deep crimson lacquer
      pedicureGloss: '#fb7185',
    },
    footCharacteristics: {
      archType: 'medium',
      toeShape: 'compact',
      details: 'Nimble, compact toe cushions with highly reactive metatarsal balls.',
    },
    sensitivityProfile: {
      left_toes: 5,
      left_ball: 4,
      left_inner_arch: 3,
      left_outer_arch: 2,
      left_mid_sole: 4,
      left_heel: 2,
      right_toes: 5,
      right_ball: 5,
      right_inner_arch: 3,
      right_outer_arch: 1,
      right_mid_sole: 3,
      right_heel: 2,
    },
    minScoreToUnlock: 2200,
  },
  {
    id: 'char_ivy',
    name: 'Ivy',
    age: 24,
    aesthetic: 'Earthy Boho Aesthetic',
    personality: 'Relaxed, organic, gentle, and radiantly playful.',
    quote: '"Breathe easy. Precision is about flow, not force."',
    bio: 'A botanical illustrator who spends her days barefoot on garden soil and riverside flagstones. Her warm olive-toned soles are naturally balanced and grounded.',
    portraitUrl: portraitIvy,
    feetIllustrationUrl: feetIvy,
    theme: {
      primary: '#22c55e',
      bgGradient: 'from-[#0b170f] via-[#07100a] to-[#040805]',
      badgeBg: 'bg-emerald-950/70 border-emerald-700/60',
      badgeText: 'text-emerald-300',
      skinBase: '#eed5bd',
      skinMid: '#dcb594',
      skinShadow: '#be906d',
      skinDeep: '#9c6f4e',
      skinHighlight: '#fff0df',
      creaseColor: '#7e5334',
      pedicureColor: '#78350f', // Warm earthy glaze
      pedicureGloss: '#fbbf24',
    },
    footCharacteristics: {
      archType: 'medium',
      toeShape: 'toned',
      details: 'Organic healthy proportions with resilient heel and sensitive outer columns.',
    },
    sensitivityProfile: {
      left_toes: 3,
      left_ball: 3,
      left_inner_arch: 4,
      left_outer_arch: 5,
      left_mid_sole: 4,
      left_heel: 2,
      right_toes: 4,
      right_ball: 3,
      right_inner_arch: 3,
      right_outer_arch: 5,
      right_mid_sole: 4,
      right_heel: 2,
    },
    minScoreToUnlock: 2500,
  },
  {
    id: 'char_celeste',
    name: 'Celeste',
    age: 21,
    aesthetic: 'Coquette Aesthetic',
    personality: 'Sweet, softly teasing, elegant, and disarmingly charming.',
    quote: '"Did that tickle, or was it just your rhythm slipping?"',
    bio: 'A pastry chef and fashion curator enveloped in soft cashmere, satin ribbons, and blush tones. Her petite, fair-skinned soles possess hyper-tender arches and toe cushions.',
    portraitUrl: portraitCeleste,
    feetIllustrationUrl: feetCeleste,
    theme: {
      primary: '#f472b6',
      bgGradient: 'from-[#1c0a16] via-[#13060f] to-[#090308]',
      badgeBg: 'bg-pink-950/70 border-pink-700/60',
      badgeText: 'text-pink-300',
      skinBase: '#fff2eb',
      skinMid: '#f5d3c2',
      skinShadow: '#e0aba0',
      skinDeep: '#c28578',
      skinHighlight: '#ffffff',
      creaseColor: '#a76a5e',
      pedicureColor: '#f472b6', // Pastel baby pink polish
      pedicureGloss: '#fdf2f8',
    },
    footCharacteristics: {
      archType: 'petite',
      toeShape: 'delicate',
      details: 'Petite rounded cushions, delicate slender heel, tender high instep.',
    },
    sensitivityProfile: {
      left_toes: 5,
      left_ball: 4,
      left_inner_arch: 5,
      left_outer_arch: 2,
      left_mid_sole: 4,
      left_heel: 1,
      right_toes: 5,
      right_ball: 3,
      right_inner_arch: 5,
      right_outer_arch: 3,
      right_mid_sole: 4,
      right_heel: 1,
    },
    minScoreToUnlock: 2800,
  },
  {
    id: 'char_jade',
    name: 'Jade',
    age: 23,
    aesthetic: 'Punk Aesthetic',
    personality: 'Rebellious, energetic, cocky, and full of raw adrenaline.',
    quote: '"Bring all the speed you got. I don\'t flinch easily."',
    bio: 'A motorcycle restorer with jade-tipped hair and an assertive street demeanor. Her feet feature defined contours, firm arches, and sensitive metatarsal cushions.',
    portraitUrl: portraitJade,
    feetIllustrationUrl: feetJade,
    theme: {
      primary: '#14b8a6',
      bgGradient: 'from-[#071715] via-[#040f0e] to-[#020807]',
      badgeBg: 'bg-teal-950/70 border-teal-700/60',
      badgeText: 'text-teal-300',
      skinBase: '#edd9c7',
      skinMid: '#dcbfa8',
      skinShadow: '#be9980',
      skinDeep: '#9c7760',
      skinHighlight: '#fff4ea',
      creaseColor: '#7d5943',
      pedicureColor: '#134e4a', // Dark teal metallic
      pedicureGloss: '#2dd4bf',
    },
    footCharacteristics: {
      archType: 'athletic',
      toeShape: 'toned',
      details: 'Defined athletic architecture with heightened lateral arch feedback.',
    },
    sensitivityProfile: {
      left_toes: 3,
      left_ball: 5,
      left_inner_arch: 2,
      left_outer_arch: 5,
      left_mid_sole: 4,
      left_heel: 2,
      right_toes: 4,
      right_ball: 5,
      right_inner_arch: 3,
      right_outer_arch: 4,
      right_mid_sole: 3,
      right_heel: 2,
    },
    minScoreToUnlock: 3100,
  },
  {
    id: 'char_sofia',
    name: 'Sofia',
    age: 26,
    aesthetic: 'Classic Elegance',
    personality: 'Poised, aristocratic, self-assured, and captivatingly serene.',
    quote: '"Poise under pressure reveals true mastery. Show me yours."',
    bio: 'A classical cellist and art curator with sculpted Mediterranean features and timeless poise. Her aristocratic high arches and manicured feet possess sophisticated nerve distribution.',
    portraitUrl: portraitSofia,
    feetIllustrationUrl: feetSofia,
    theme: {
      primary: '#fbbf24',
      bgGradient: 'from-[#191105] via-[#100a03] to-[#080501]',
      badgeBg: 'bg-amber-950/70 border-amber-700/60',
      badgeText: 'text-amber-300',
      skinBase: '#ecd8c4',
      skinMid: '#dbc0a5',
      skinShadow: '#ba9a7c',
      skinDeep: '#9b775c',
      skinHighlight: '#fff3e6',
      creaseColor: '#7a573d',
      pedicureColor: '#7f1d1d', // Bordeaux wine lacquer
      pedicureGloss: '#fca5a5',
    },
    footCharacteristics: {
      archType: 'high',
      toeShape: 'elongated',
      details: 'Sculpted high arch curvature, graceful long digits, smooth calcaneal base.',
    },
    sensitivityProfile: {
      left_toes: 4,
      left_ball: 3,
      left_inner_arch: 5,
      left_outer_arch: 2,
      left_mid_sole: 5,
      left_heel: 1,
      right_toes: 3,
      right_ball: 4,
      right_inner_arch: 5,
      right_outer_arch: 3,
      right_mid_sole: 4,
      right_heel: 1,
    },
    minScoreToUnlock: 3400,
  },
  {
    id: 'char_amara',
    name: 'Amara',
    age: 24,
    aesthetic: 'Athletic Modern',
    personality: 'Upbeat, confident, radiant, and relentlessly positive.',
    quote: '"Stay on your toes! Reflexes are like muscles—train them hard."',
    bio: 'A track sprinter and fitness coach with glowing warm bronze skin and an infectious smile. Her conditioned feet boast high spring elasticity and sensitive forefoot cushions.',
    portraitUrl: portraitAmara,
    feetIllustrationUrl: feetAmara,
    theme: {
      primary: '#f97316',
      bgGradient: 'from-[#1c0c05] via-[#120703] to-[#080301]',
      badgeBg: 'bg-orange-950/70 border-orange-700/60',
      badgeText: 'text-orange-300',
      skinBase: '#aa724a',
      skinMid: '#925830',
      skinShadow: '#723e1b',
      skinDeep: '#53290e',
      skinHighlight: '#d4986d',
      creaseColor: '#3d1c07',
      pedicureColor: '#ea580c', // Vibrant coral polish
      pedicureGloss: '#fed7aa',
    },
    footCharacteristics: {
      archType: 'athletic',
      toeShape: 'toned',
      details: 'Muscular athletic plantar fascia, springy metatarsal pads, resilient heel.',
    },
    sensitivityProfile: {
      left_toes: 4,
      left_ball: 5,
      left_inner_arch: 3,
      left_outer_arch: 4,
      left_mid_sole: 3,
      left_heel: 1,
      right_toes: 5,
      right_ball: 5,
      right_inner_arch: 4,
      right_outer_arch: 3,
      right_mid_sole: 3,
      right_heel: 1,
    },
    minScoreToUnlock: 3700,
  },
  {
    id: 'char_yuna',
    name: 'Yuna',
    age: 23,
    aesthetic: 'Modern Alternative',
    personality: 'Reserved, sharp, subtly playful, and observant.',
    quote: '"Rhythm isn\'t hurried. You missed that corner by a millisecond."',
    bio: 'A modern UI designer and electronic music producer from Tokyo with a sleek blunt bob and geometric jewelry. Her fair, meticulously cared-for soles feature tender arch curves.',
    portraitUrl: portraitYuna,
    feetIllustrationUrl: feetYuna,
    theme: {
      primary: '#a855f7',
      bgGradient: 'from-[#140b1f] via-[#0d0714] to-[#060309]',
      badgeBg: 'bg-violet-950/70 border-violet-700/60',
      badgeText: 'text-violet-300',
      skinBase: '#faeee3',
      skinMid: '#ebcfbe',
      skinShadow: '#d3aca0',
      skinDeep: '#b68778',
      skinHighlight: '#ffffff',
      creaseColor: '#966355',
      pedicureColor: '#475569', // Polished slate chrome
      pedicureGloss: '#e2e8f0',
    },
    footCharacteristics: {
      archType: 'graceful',
      toeShape: 'delicate',
      details: 'Porcelain smooth sole texture, neat aligned toe pads, delicate arch vault.',
    },
    sensitivityProfile: {
      left_toes: 4,
      left_ball: 3,
      left_inner_arch: 5,
      left_outer_arch: 4,
      left_mid_sole: 4,
      left_heel: 2,
      right_toes: 4,
      right_ball: 4,
      right_inner_arch: 5,
      right_outer_arch: 4,
      right_mid_sole: 3,
      right_heel: 2,
    },
    minScoreToUnlock: 4000,
  },
];

const STORAGE_KEY = 'sole_reflex_roster_progression_v3';

export const DEFAULT_PROGRESSION: PlayerProgression = {
  overallHighScore: 0,
  characterHighScores: {},
  unlockedCharacterIds: ['char_raven'],
  lastSelectedCharacterId: 'char_raven',
};

export function loadProgression(): PlayerProgression {
  if (typeof window === 'undefined') return DEFAULT_PROGRESSION;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESSION;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESSION,
      ...parsed,
      unlockedCharacterIds:
        Array.isArray(parsed.unlockedCharacterIds) && parsed.unlockedCharacterIds.length > 0
          ? parsed.unlockedCharacterIds
          : ['char_raven'],
    };
  } catch {
    return DEFAULT_PROGRESSION;
  }
}

export function saveProgression(prog: PlayerProgression): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
  } catch {}
}

export function resetAllProgression(): PlayerProgression {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('sole_reflex_progression_v2');
      localStorage.removeItem('sole_reflex_high_score');
    } catch {}
  }
  return { ...DEFAULT_PROGRESSION };
}
