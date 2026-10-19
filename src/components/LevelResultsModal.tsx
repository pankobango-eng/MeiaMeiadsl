import React from 'react';
import { Trophy, CheckCircle, ArrowRight, RotateCcw, Home, Lock } from 'lucide-react';
import { CharacterDefinition } from '../types/game';

interface LevelResultsModalProps {
  character: CharacterDefinition;
  totalScore: number;
  lossTokens: number;
  maxLossTokens: number;
  isUnlockedNext: boolean;
  nextCharacter: CharacterDefinition | null;
  onContinueNextCharacter: () => void;
  onReplayLevel: () => void;
  onExitToMenu: () => void;
}

export const LevelResultsModal: React.FC<LevelResultsModalProps> = ({
  character,
  totalScore,
  lossTokens,
  maxLossTokens,
  nextCharacter,
  onContinueNextCharacter,
  onReplayLevel,
  onExitToMenu,
}) => {
  const metThreshold = nextCharacter ? totalScore >= nextCharacter.minScoreToUnlock : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1c0f2a] to-[#12071d] border border-purple-800/50 rounded-3xl p-6 sm:p-7 shadow-2xl text-center">
        {/* Character Portrait with Trophy Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-[#0a0510]">
              <img
                src={character.portraitUrl}
                alt={character.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg border border-amber-300">
              <Trophy className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-purple-100 tracking-tight">
          Level Cleared: {character.name}!
        </h2>
        <p className="text-xs text-purple-300/80 mt-1 max-w-sm mx-auto">
          Successfully completed all 10 rounds of {character.name}&apos;s reflex challenge.
        </p>

        {/* Character Quote */}
        <div className="my-3 px-3 py-2 bg-[#140b1e]/90 border border-purple-900/40 rounded-xl text-xs italic text-purple-200">
          {character.quote}
        </div>

        {/* Unlock Status Banner */}
        <div className="my-3">
          {nextCharacter ? (
            metThreshold ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-2xl text-xs text-emerald-200 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Threshold Reached!</strong> Unlocked next character:{' '}
                  <strong>{nextCharacter.name}</strong> ({nextCharacter.aesthetic}).
                </span>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/60 border border-amber-700/60 rounded-2xl text-xs text-amber-200 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Score threshold for {nextCharacter.name} ({nextCharacter.minScoreToUnlock.toLocaleString()} pts) not reached. Replay to unlock!
                </span>
              </div>
            )
          ) : (
            <div className="p-3 bg-purple-950/60 border border-purple-700/60 rounded-2xl text-xs text-purple-200 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Grand Mastery!</strong> All 8 characters cleared across the entire roster!
              </span>
            </div>
          )}
        </div>

        {/* Stats Table */}
        <div className="my-4 p-4 bg-[#140b1e]/90 border border-purple-900/40 rounded-2xl space-y-2.5 text-xs text-left shadow-inner">
          <div className="flex justify-between items-center text-purple-300/80">
            <span>Final Level Score</span>
            <span className="text-base font-black text-amber-300 tabular-nums">
              {totalScore.toLocaleString()} pts
            </span>
          </div>

          {nextCharacter && (
            <div className="flex justify-between items-center text-purple-300/80">
              <span>Next Unlock Target</span>
              <span className="font-bold text-purple-100 tabular-nums">
                {nextCharacter.minScoreToUnlock.toLocaleString()} pts
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-purple-300/80">
            <span>Loss Tokens Incurred</span>
            <span className="font-bold text-purple-100 tabular-nums">
              {lossTokens} / {maxLossTokens}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {nextCharacter && metThreshold && (
            <button
              onClick={onContinueNextCharacter}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to {nextCharacter.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onReplayLevel}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#231336] hover:bg-[#2e1946] border border-purple-800/40 text-purple-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay {character.name}&apos;s Level</span>
          </button>

          <button
            onClick={onExitToMenu}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-purple-400 hover:text-purple-200 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Character Roster</span>
          </button>
        </div>
      </div>
    </div>
  );
};
