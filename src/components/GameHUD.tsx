import React from 'react';
import { Volume2, VolumeX, Keyboard, Pause, Play, RotateCcw, Sliders, ShieldAlert } from 'lucide-react';
import { GameState, CharacterDefinition } from '../types/game';

interface GameHUDProps {
  roundNumber: number;
  totalRounds: number;
  cumulativeScore: number;
  roundScore: number;
  highScore: number;
  timeRemainingSec: number;
  timeLimitSec: number;
  targetsStruckCount: number;
  targetsRequired: number;
  lossTokens: number;
  maxLossTokens: number;
  gameState: GameState;
  character: CharacterDefinition;
  soundEnabled: boolean;
  showKeyboardShortcuts: boolean;
  onToggleSound: () => void;
  onToggleKeyboardShortcuts: () => void;
  onTogglePause: () => void;
  onRestartRun: () => void;
  onOpenSettings: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  roundNumber,
  totalRounds,
  cumulativeScore,
  roundScore,
  highScore,
  timeRemainingSec,
  timeLimitSec,
  targetsStruckCount,
  targetsRequired,
  lossTokens,
  maxLossTokens,
  gameState,
  character,
  soundEnabled,
  showKeyboardShortcuts,
  onToggleSound,
  onToggleKeyboardShortcuts,
  onTogglePause,
  onRestartRun,
  onOpenSettings,
}) => {
  const timeFraction = Math.max(0, timeRemainingSec / Math.max(timeLimitSec, 0.1));
  const isTimeCritical = timeRemainingSec <= 4.0;
  const remainingTokens = Math.max(0, maxLossTokens - lossTokens);

  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2.5">
      {/* Top Bar: Brand, Character Badge, and Control Actions */}
      <div className="flex items-center justify-between gap-4 border-b border-purple-900/30 pb-2.5">
        <div className="flex items-center gap-3">
          <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-rose-200 tracking-tight whitespace-nowrap">
            Sole Reflex
          </span>

          {/* Active Character Compact Lockup */}
          <div className="flex items-center gap-2 pl-3 border-l border-purple-900/40">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-purple-500/50 shadow-sm">
              <img
                src={character.portraitUrl}
                alt={character.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-bold text-purple-100 truncate">
              {character.name}
            </span>
            <span className="text-[11px] text-purple-400 hidden sm:inline truncate">
              · {character.aesthetic}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <button
              onClick={onTogglePause}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-200 hover:text-white bg-[#221232] hover:bg-[#2c183f] border border-purple-800/40 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              title={gameState === 'PAUSED' ? 'Resume (Space)' : 'Pause (Space)'}
            >
              {gameState === 'PAUSED' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{gameState === 'PAUSED' ? 'Resume' : 'Pause'}</span>
            </button>
          ) : null}

          <button
            onClick={onToggleKeyboardShortcuts}
            className={`p-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
              showKeyboardShortcuts
                ? 'bg-purple-900/70 text-purple-200 border-purple-600 shadow-sm'
                : 'text-purple-400 hover:text-purple-200 bg-[#1c0f2a] hover:bg-[#251538] border-purple-900/40'
            }`}
            title="Toggle keyboard shortcuts"
            aria-label="Toggle keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className={`p-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
              soundEnabled
                ? 'text-purple-300 hover:text-purple-100 bg-[#1c0f2a] hover:bg-[#251538] border-purple-900/40'
                : 'text-purple-600 line-through bg-[#140b1e] border-purple-950'
            }`}
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            aria-label="Toggle audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 text-xs text-purple-400 hover:text-purple-100 bg-[#1c0f2a] hover:bg-[#251538] border border-purple-900/40 rounded-lg transition-colors cursor-pointer"
            title="Configure gameplay rules"
            aria-label="Gameplay settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onRestartRun}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Restart run"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Main Status Panel: Dark plum / muted burgundy surface */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 p-3 bg-[#160d21]/90 border border-purple-900/40 rounded-2xl shadow-xl backdrop-blur-md">
        {/* 1. Round indicator: "Round X of 10" */}
        <div className="flex flex-col">
          <div className="text-[11px] text-purple-400/80 uppercase tracking-wider font-bold">
            Progress
          </div>
          <div className="text-lg sm:text-xl font-black text-purple-100 tabular-nums">
            Round {roundNumber} of {totalRounds}
          </div>
          <div className="text-[11px] text-purple-400 truncate">
            {character.name} · Level Session
          </div>
        </div>

        {/* 2. Countdown Timer */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-purple-400/80 uppercase tracking-wider font-bold">
              Time Left
            </span>
            {isTimeCritical && gameState === 'PLAYING' && (
              <span className="text-[10px] text-rose-400 font-bold animate-pulse">
                Critical!
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-lg sm:text-xl font-black tabular-nums transition-colors ${
                isTimeCritical && gameState === 'PLAYING'
                  ? 'text-rose-400 animate-pulse'
                  : 'text-purple-100'
              }`}
            >
              {Math.max(0, timeRemainingSec).toFixed(1)}s
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#251536] rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-100 ease-linear rounded-full ${
                isTimeCritical ? 'bg-rose-500 shadow-sm shadow-rose-500' : 'bg-gradient-to-r from-purple-500 to-rose-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, timeFraction * 100))}%` }}
            />
          </div>
        </div>

        {/* 3. Selections completed out of 6 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-purple-400/80 uppercase tracking-wider font-bold">
              Round Targets
            </span>
            <span className="text-xs font-bold text-purple-200 tabular-nums">
              {targetsStruckCount} / {targetsRequired}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1 mt-2">
            {Array.from({ length: targetsRequired }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-xs transition-all duration-200 ${
                  i < targetsStruckCount
                    ? 'bg-purple-400 shadow-sm shadow-purple-400'
                    : 'bg-[#29173d]'
                }`}
                title={`Selection ${i + 1} of ${targetsRequired}`}
              />
            ))}
          </div>
          <div className="text-[10px] text-purple-400/70 mt-1">
            {targetsRequired - targetsStruckCount} remaining
          </div>
        </div>

        {/* 4. Loss Tokens */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-purple-400/80 uppercase tracking-wider font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Loss Tokens
            </span>
            <span
              className={`text-xs font-black tabular-nums ${
                lossTokens >= 4 ? 'text-rose-400' : 'text-purple-200'
              }`}
            >
              {lossTokens} / {maxLossTokens}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: maxLossTokens }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-xs transition-colors ${
                  i < lossTokens ? 'bg-rose-500 shadow-sm shadow-rose-500' : 'bg-[#29173d]'
                }`}
                title={`Loss token ${i + 1}`}
              />
            ))}
          </div>
          <div className="text-[10px] text-purple-400/70 mt-1">
            {remainingTokens} before Game Over
          </div>
        </div>

        {/* 5. Cumulative Score & Round Score */}
        <div className="flex flex-col col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-purple-400/80 uppercase tracking-wider font-bold">
              Total Score
            </span>
            <span className="text-[10px] text-amber-400/80 tabular-nums">
              Best: {highScore.toLocaleString()}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-300 tabular-nums">
            {cumulativeScore.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-300/80 tabular-nums">
            Round: <span className="text-purple-100 font-semibold">+{roundScore}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
