import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, MessageSquareQuote, BookOpen } from 'lucide-react';
import { RoundStats, CharacterDefinition } from '../types/game';
import { dialogueEngine } from '../utils/dialogueEngine';

interface RoundTransitionModalProps {
  character: CharacterDefinition;
  roundStats: RoundStats;
  totalRounds: number;
  totalScore: number;
  lossTokens: number;
  maxLossTokens: number;
  intermissionDialogue?: string;
  roundSeed?: number;
  onBeginNextRound: () => void;
  onExitToMenu: () => void;
}

export const RoundTransitionModal: React.FC<RoundTransitionModalProps> = ({
  character,
  roundStats,
  totalRounds,
  totalScore,
  lossTokens,
  maxLossTokens,
  intermissionDialogue,
  roundSeed = 0,
  onBeginNextRound,
  onExitToMenu,
}) => {
  const isWon = roundStats.isWon;
  const nextRoundNumber = roundStats.roundNumber + 1;
  const tokensRemaining = Math.max(0, maxLossTokens - lossTokens);

  // Retrieve 2-3 paragraph tickle-fight narrative scene when the round is lost
  const lostRoundNarrative = useMemo(() => {
    if (!isWon) {
      return dialogueEngine.getLostRoundNarrative(character.id, roundSeed + roundStats.roundNumber);
    }
    return [];
  }, [isWon, character.id, roundSeed, roundStats.roundNumber]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#1c0f2a] to-[#12071d] border border-purple-800/60 rounded-3xl p-5 sm:p-6 shadow-2xl text-center my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Character Lockup */}
        <div className="flex items-center justify-center gap-3 mb-2 shrink-0">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-xl bg-[#0a0510] shrink-0">
            <img
              src={character.portraitUrl}
              alt={character.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-lg ${
                isWon ? 'bg-emerald-600 border border-emerald-400' : 'bg-rose-600 border border-rose-400'
              }`}
            >
              {isWon ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3 h-3" />}
            </div>
          </div>
          <div className="text-left">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#261338] border border-purple-700/40">
              <span className={isWon ? 'text-emerald-400' : 'text-rose-400'}>
                Round {roundStats.roundNumber} of {totalRounds} · {isWon ? 'Cleared' : 'Round Conceded'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-purple-100 tracking-tight mt-0.5">
              {isWon ? `${character.name}'s Defense Breached!` : `${character.name}'s Counter-Attack`}
            </h2>
          </div>
        </div>

        {/* Scrollable Story & Narrative Body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2 text-left">
          {/* Vibrant character dialogue reaction: breathing, gloating, or flustered */}
          {intermissionDialogue && (
            <div
              className={`px-4 py-3 rounded-2xl text-xs shadow-lg text-left relative border transition-all ${
                isWon
                  ? 'bg-[#1e0f2d] border-purple-700/50'
                  : 'bg-[#240c1e] border-rose-700/50 shadow-rose-950/40'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <MessageSquareQuote
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isWon ? 'text-purple-400' : 'text-rose-400'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`font-bold block text-[11px] ${
                        isWon ? 'text-purple-300' : 'text-rose-300'
                      }`}
                    >
                      {character.name} {isWon ? 'gasps breathlessly:' : 'catches her breath & gloats:'}
                    </span>
                    {!isWon && (
                      <span className="px-1.5 py-0.2 rounded-md bg-rose-950 border border-rose-600/40 text-[9px] font-bold text-rose-300 uppercase tracking-wider">
                        Playful Relief
                      </span>
                    )}
                  </div>
                  <p className="text-purple-100 italic leading-relaxed text-[11px] sm:text-xs">
                    &ldquo;{intermissionDialogue}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LOST ROUND: 2-3 paragraph character-specific tickle-fight narrative */}
          {!isWon && lostRoundNarrative.length > 0 && (
            <div className="p-4 bg-[#180a22]/90 border border-purple-800/40 rounded-2xl shadow-inner space-y-2.5 text-xs sm:text-[13px] text-purple-100/95 leading-relaxed font-serif">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-purple-900/40 text-purple-300 text-xs font-sans font-bold uppercase tracking-wider not-italic">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Intermission Encounter: {character.name} Counter-Attacks</span>
              </div>
              {lostRoundNarrative.map((paragraph, idx) => (
                <p key={idx} className="indent-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Breakdown Panel in Dark Plum / Burgundy */}
          <div className="p-3 bg-[#140b1e]/90 border border-purple-900/40 rounded-2xl space-y-2 text-xs text-left shadow-inner">
            <div className="flex justify-between items-center text-purple-300/80">
              <span>Targets Struck</span>
              <span className="font-bold text-purple-100 tabular-nums">
                {roundStats.targetsStruckCount} / 6
              </span>
            </div>

            <div className="flex justify-between items-center text-purple-300/80">
              <span>Round Score</span>
              <span className="font-bold text-amber-300 tabular-nums">
                +{roundStats.roundScore.toLocaleString()} pts
              </span>
            </div>

            <div className="pt-1.5 border-t border-purple-900/40 flex justify-between items-center font-bold text-purple-100">
              <span>Total Score</span>
              <span className="text-sm text-amber-300 tabular-nums">
                {totalScore.toLocaleString()} pts
              </span>
            </div>

            <div className="flex justify-between items-center text-purple-300/80 pt-0.5">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Loss Tokens
              </span>
              <span
                className={`font-bold tabular-nums ${
                  lossTokens >= 4 ? 'text-rose-400' : 'text-purple-200'
                }`}
              >
                {lossTokens} / {maxLossTokens} ({tokensRemaining} remaining)
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Begin next round */}
        <div className="flex flex-col gap-2 pt-2 border-t border-purple-900/40 shrink-0">
          <button
            onClick={onBeginNextRound}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
          >
            <span>Begin Round {nextRoundNumber} of {totalRounds}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExitToMenu}
            className="w-full py-1.5 px-4 text-xs font-semibold text-purple-400 hover:text-purple-200 transition-colors cursor-pointer"
          >
            Save & Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
