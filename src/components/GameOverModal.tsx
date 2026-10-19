import React, { useMemo } from 'react';
import { RotateCcw, Home, Skull, Sparkles, BookOpen } from 'lucide-react';
import { CharacterDefinition } from '../types/game';
import { dialogueEngine } from '../utils/dialogueEngine';

interface GameOverModalProps {
  character: CharacterDefinition;
  finalScore: number;
  roundsCompleted: number;
  totalRounds: number;
  lossTokens: number;
  maxLossTokens: number;
  highScore: number;
  runSeed?: number;
  onRestartRun: () => void;
  onExitToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  character,
  finalScore,
  roundsCompleted,
  totalRounds,
  lossTokens,
  maxLossTokens,
  highScore,
  runSeed = 0,
  onRestartRun,
  onExitToMenu,
}) => {
  // Retrieve the 3-paragraph consensual tickle-fight finale scene tailored to this character
  const finaleParagraphs = useMemo(() => {
    return dialogueEngine.getGameOverFinaleScene(character.id, runSeed);
  }, [character.id, runSeed]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#220d19] via-[#160914] to-[#0d040c] border border-rose-900/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-center my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header Lockup */}
        <div className="flex items-center justify-center gap-3 mb-2 shrink-0">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-rose-600/70 shadow-lg bg-[#0a0510] shrink-0">
            <img
              src={character.portraitUrl}
              alt={character.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Skull className="w-3 h-3" />
            </div>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-800/40">
              <Skull className="w-3 h-3 text-rose-400" />
              <span>Match Forfeited · {maxLossTokens} Tokens Incurred</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-100 tracking-tight mt-0.5">
              {character.name}&apos;s Triumph
            </h2>
          </div>
        </div>

        {/* Scrollable Story & Narrative Body */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 my-3 text-left">
          {/* Fictional Tickle-Fight Epilogue Narrative (3 distinct paragraphs) */}
          <div className="p-4 sm:p-5 bg-[#170a14]/90 border border-rose-900/40 rounded-2xl shadow-inner space-y-3 text-xs sm:text-[13px] text-rose-100/90 leading-relaxed font-serif">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-950 text-rose-300 text-xs font-sans font-bold uppercase tracking-wider not-italic">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Epilogue: The Champion&apos;s Concession</span>
            </div>

            {/* Paragraph 1: Setup & atmospheric approach */}
            <p className="indent-4 text-rose-200/90">
              {finaleParagraphs[0]}
            </p>

            {/* Paragraph 2: Playful tickle battle action & breathless giggles */}
            <p className="indent-4 text-rose-100">
              {finaleParagraphs[1]}
            </p>

            {/* Paragraph 3: Tap out surrender & victorious aftermath */}
            <p className="indent-4 text-rose-200/90">
              {finaleParagraphs[2]}
            </p>
          </div>

          {/* Stats Summary Panel */}
          <div className="p-3.5 bg-[#140812]/90 border border-rose-950 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-[#1b0a18] rounded-xl border border-rose-900/30">
              <div className="text-[10px] text-rose-400/80 font-bold uppercase">Rounds</div>
              <div className="text-base font-black text-rose-100 mt-0.5 tabular-nums">
                {roundsCompleted} / {totalRounds}
              </div>
            </div>

            <div className="p-2 bg-[#1b0a18] rounded-xl border border-rose-900/30">
              <div className="text-[10px] text-rose-400/80 font-bold uppercase">Losses</div>
              <div className="text-base font-black text-rose-400 mt-0.5 tabular-nums">
                {lossTokens} / {maxLossTokens}
              </div>
            </div>

            <div className="p-2 bg-[#1b0a18] rounded-xl border border-rose-900/30">
              <div className="text-[10px] text-rose-400/80 font-bold uppercase">Final Score</div>
              <div className="text-base font-black text-amber-300 mt-0.5 tabular-nums">
                {finalScore.toLocaleString()}
              </div>
            </div>

            <div className="p-2 bg-[#1b0a18] rounded-xl border border-rose-900/30">
              <div className="text-[10px] text-rose-400/80 font-bold uppercase">Record</div>
              <div className="text-base font-black text-amber-400/90 mt-0.5 tabular-nums">
                {highScore.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-rose-950 shrink-0">
          <button
            onClick={onRestartRun}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch: {character.name}&apos;s Level</span>
          </button>

          <button
            onClick={onExitToMenu}
            className="sm:w-44 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-rose-300/80 hover:text-white bg-[#1a0a18] hover:bg-[#250f22] border border-rose-900/40 rounded-xl transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Character Roster</span>
          </button>
        </div>
      </div>
    </div>
  );
};
