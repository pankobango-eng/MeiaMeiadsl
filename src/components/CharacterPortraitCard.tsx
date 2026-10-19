import React from 'react';
import { MessageSquareQuote, Flame, Sparkles } from 'lucide-react';
import { CharacterDefinition, ComposureTier } from '../types/game';

interface CharacterPortraitCardProps {
  character: CharacterDefinition;
  lossTokens: number;
  maxLossTokens: number;
  currentDialogue: string | null;
  composureTier?: ComposureTier;
}

export const CharacterPortraitCard: React.FC<CharacterPortraitCardProps> = ({
  character,
  lossTokens,
  currentDialogue,
  composureTier = 'composed',
}) => {
  const displayLine = currentDialogue || character.quote;
  const isCustomDialogue = Boolean(currentDialogue);

  return (
    <div className="absolute top-2 left-2 z-20 flex flex-col items-start max-w-[280px] sm:max-w-[340px] pointer-events-none sm:pointer-events-auto transition-all">
      {/* Top Identity Badge */}
      <div className="flex items-center gap-2.5 p-2 pr-3 bg-[#140b1e]/95 backdrop-blur-md border border-purple-900/50 rounded-2xl shadow-xl">
        {/* High-fidelity Anime-Photorealistic Portrait */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-purple-500/40 shadow-md bg-[#0a0510]">
          <img
            src={character.portraitUrl}
            alt={character.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle theme ring indicator */}
          <div
            className="absolute inset-0 rounded-xl ring-1 ring-inset pointer-events-none"
            style={{ borderColor: character.theme.primary }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-purple-100 truncate">
              {character.name}
            </span>
            <span className="text-[10px] text-purple-400/80">· Age {character.age}</span>
          </div>
          <div className="text-[10px] text-purple-300/80 font-medium truncate">
            {character.aesthetic}
          </div>
          <div className="text-[10px] text-purple-400/70 truncate flex items-center gap-1">
            <span className="capitalize">{character.footCharacteristics.archType}</span> arch
            <span>·</span>
            <span className="capitalize">{character.footCharacteristics.toeShape}</span> toes
          </div>
        </div>
      </div>

      {/* Dynamic Animated Speech Bubble below portrait */}
      <div className="relative mt-2 ml-1 text-left animate-fade-in transition-all duration-200">
        {/* Speech tail pointer pointing back to the portrait */}
        <div
          className={`absolute -top-1.5 left-5 w-3 h-3 rotate-45 border-t border-l transition-colors ${
            composureTier === 'broken'
              ? 'bg-[#260c1d] border-rose-500/70'
              : 'bg-[#1e0f2d] border-purple-700/60'
          }`}
        />

        <div
          className={`relative px-3.5 py-2.5 rounded-2xl text-xs shadow-xl backdrop-blur-md border transition-all ${
            composureTier === 'broken'
              ? 'bg-[#240c1c]/95 border-rose-500/80 text-rose-100 shadow-rose-950/50 ring-2 ring-rose-500/40 animate-pulse-glow'
              : composureTier === 'rattled'
              ? 'bg-[#1e0f2d]/95 border-purple-500/70 text-purple-100 shadow-purple-900/40 ring-1 ring-purple-500/40'
              : isCustomDialogue
              ? 'bg-[#1e0f2d]/95 border-purple-700/50 text-purple-200 shadow-purple-900/30'
              : 'bg-[#140b1e]/90 border-purple-900/40 text-purple-300/90'
          }`}
        >
          {/* Composure broken badge */}
          {composureTier === 'broken' && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-950/80 border border-rose-700/60 text-[9px] font-bold uppercase tracking-wider text-rose-300 mb-1">
              <Flame className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              <span>Composure Broken!</span>
            </div>
          )}

          <div className="flex items-start gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px] sm:text-xs italic font-medium">
              &ldquo;{displayLine}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
