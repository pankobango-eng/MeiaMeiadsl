import React, { useState } from 'react';
import {
  Play,
  Sliders,
  Lock,
  CheckCircle2,
  RotateCcw,
  AlertOctagon,
  Sparkles,
  Users,
  Award,
  Volume2,
  VolumeX,
  ArrowRight,
  X,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { CharacterDefinition, PlayerProgression, ActiveRunState } from '../types/game';

interface MainMenuProps {
  progression: PlayerProgression;
  selectedCharacter: CharacterDefinition;
  onSelectCharacter: (char: CharacterDefinition) => void;
  onStartLevel: () => void;
  onOpenSettings: () => void;
  onResetProgress: () => void;
  activeRun: ActiveRunState | null;
  onResumeRun: () => void;
  onAbandonRun: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progression,
  selectedCharacter,
  onSelectCharacter,
  onStartLevel,
  onOpenSettings,
  onResetProgress,
  activeRun,
  onResumeRun,
  onAbandonRun,
  soundEnabled,
  onToggleSound,
}) => {
  const [showRoster, setShowRoster] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState<boolean>(false);

  const selectedCharBest = progression.characterHighScores[selectedCharacter.id] || 0;
  const isSelectedUnlocked = progression.unlockedCharacterIds.includes(selectedCharacter.id);

  // Active run character lookup if run is in progress
  const activeRunChar = activeRun
    ? CHARACTERS.find((c) => c.id === activeRun.characterId) || selectedCharacter
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center text-center">
      {/* ======================================================== */}
      {/* TOP UTILITY HEADER: Sound, Settings, & High Score        */}
      {/* ======================================================== */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 px-1">
        {/* Record Score pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180e23] border border-purple-800/40 text-xs shadow-md backdrop-blur-md">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-purple-300/80 font-medium hidden sm:inline">Record Score:</span>
          <strong className="text-amber-300 font-bold tabular-nums">
            {progression.overallHighScore.toLocaleString()} pts
          </strong>
        </div>

        {/* Audio & Settings Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Sound Toggle with tactile state */}
          <button
            onClick={onToggleSound}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
              soundEnabled
                ? 'bg-[#221032] hover:bg-[#2c153f] text-purple-200 border-purple-700/50'
                : 'bg-[#150a1e] text-purple-600 border-purple-950 line-through'
            }`}
            title={soundEnabled ? 'Audio enabled (click to mute)' : 'Audio muted (click to enable)'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-purple-600" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e0f2d] hover:bg-[#28153b] text-purple-200 hover:text-white rounded-xl border border-purple-800/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Configure Gameplay & Sensitivity Rules"
            aria-label="Gameplay Settings"
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GAME TITLE & SUBTITLE                                    */}
      {/* ======================================================== */}
      <div className="mb-6 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-[11px] font-bold text-purple-300 uppercase tracking-widest mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Plantar Reflex Simulator</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-rose-100 to-amber-200 tracking-tight drop-shadow-md">
          Sole Reflex
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-purple-300/80 max-w-lg mx-auto font-normal leading-relaxed">
          A high-stakes 10-round reflex challenge across 8 distinct adult women. Precision timing, sensory time penalties, and bilateral plantar target zones.
        </p>
      </div>

      {/* ======================================================== */}
      {/* IN-PROGRESS RESUME BANNER (If Active Run Exists)          */}
      {/* ======================================================== */}
      {activeRun && activeRunChar && (
        <div className="w-full bg-gradient-to-r from-amber-950/70 via-[#261338] to-purple-950/70 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-pulse-glow">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-400/60 shadow-md">
              <img
                src={activeRunChar.portraitUrl}
                alt={activeRunChar.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-0.5 border border-amber-500/30">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Session In Progress</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-purple-100">
                {activeRunChar.name} · Round {activeRun.roundNumber} of 10
              </div>
              <div className="text-xs text-purple-300/80 flex items-center gap-2 mt-0.5">
                <span className="text-amber-300 font-semibold">{activeRun.cumulativeScore.toLocaleString()} pts</span>
                <span className="text-purple-600">·</span>
                <span className="flex items-center gap-1 text-rose-300">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  {activeRun.lossTokens} / 6 Losses
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onResumeRun}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continue Run</span>
            </button>

            {showAbandonConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-800 p-1.5 rounded-xl text-xs">
                <span className="text-[11px] text-rose-200 px-1">Abandon?</span>
                <button
                  onClick={() => {
                    onAbandonRun();
                    setShowAbandonConfirm(false);
                  }}
                  className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowAbandonConfirm(false)}
                  className="px-2 py-1 bg-[#251535] text-purple-200 rounded text-[11px] cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAbandonConfirm(true)}
                className="p-3 bg-[#1e0f2d] hover:bg-rose-950/60 text-purple-400 hover:text-rose-300 rounded-xl border border-purple-800/40 transition-colors cursor-pointer text-xs"
                title="Discard session and return to fresh run"
                aria-label="Discard session"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* HERO CHARACTER STAGE COMPOSITION                         */}
      {/* ======================================================== */}
      <div className="w-full bg-gradient-to-br from-[#1c102a] via-[#140b20] to-[#0a0512] border border-purple-800/50 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden mb-8 text-left">
        {/* Subtle radial backdrop accent */}
        <div
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: selectedCharacter.theme.primary }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          {/* Character Art Showcase (Portrait & Aesthetic badge) */}
          <div className="md:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-2xl bg-[#0a0510] group">
              <img
                src={selectedCharacter.portraitUrl}
                alt={selectedCharacter.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/90 text-purple-200 border border-purple-700/60 text-[11px] font-bold backdrop-blur-md">
                  {selectedCharacter.aesthetic}
                </span>
                <span className="text-purple-200 font-semibold text-[11px]">Age {selectedCharacter.age}</span>
              </div>
            </div>
          </div>

          {/* Character Details & Primary Action Buttons */}
          <div className="md:col-span-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-purple-100 tracking-tight">
                  {selectedCharacter.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-900/50 text-purple-300 border border-purple-700/50">
                  Level {CHARACTERS.findIndex((c) => c.id === selectedCharacter.id) + 1} of {CHARACTERS.length}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed mt-2 line-clamp-3">
                {selectedCharacter.bio}
              </p>

              <blockquote className="my-3 px-3.5 py-2.5 rounded-xl bg-[#140a1e]/90 border border-purple-900/40 text-xs italic text-purple-200 shadow-inner">
                {selectedCharacter.quote}
              </blockquote>

              <div className="flex flex-wrap items-center gap-3 text-xs text-purple-300/80 mb-5">
                <span className="flex items-center gap-1">
                  <strong className="text-purple-200">Arch:</strong> <span className="capitalize">{selectedCharacter.footCharacteristics.archType}</span>
                </span>
                <span className="text-purple-700">·</span>
                <span className="flex items-center gap-1">
                  <strong className="text-purple-200">Toes:</strong> <span className="capitalize">{selectedCharacter.footCharacteristics.toeShape}</span>
                </span>
                <span className="text-purple-700">·</span>
                <span className="flex items-center gap-1">
                  <strong className="text-purple-200">Best:</strong>{' '}
                  <span className="text-amber-300 font-bold tabular-nums">
                    {selectedCharBest > 0 ? `${selectedCharBest.toLocaleString()} pts` : 'Unplayed'}
                  </span>
                </span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartLevel}
                disabled={!isSelectedUnlocked}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap ${
                  isSelectedUnlocked
                    ? 'bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white hover:shadow-purple-500/25'
                    : 'bg-[#20132b] text-purple-500 border border-purple-900/40 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Level: {selectedCharacter.name}</span>
              </button>

              <button
                onClick={() => setShowRoster(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#251537] hover:bg-[#301c46] text-purple-200 hover:text-white font-semibold text-xs rounded-xl border border-purple-700/50 transition-all cursor-pointer shadow-sm"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Choose Character ({CHARACTERS.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK CHARACTER ROSTER GRID PREVIEW                      */}
      {/* ======================================================== */}
      <div className="w-full text-left mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-300/80 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Character Roster Quick Select</span>
          </div>
          <span className="text-[11px] text-purple-400/90 font-medium">
            {progression.unlockedCharacterIds.length} of {CHARACTERS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {CHARACTERS.map((char) => {
            const isUnlocked = progression.unlockedCharacterIds.includes(char.id);
            const isSelected = selectedCharacter.id === char.id;

            return (
              <button
                key={char.id}
                onClick={() => {
                  if (isUnlocked) onSelectCharacter(char);
                }}
                disabled={!isUnlocked}
                className={`group relative rounded-xl p-2 flex flex-col items-center text-center transition-all cursor-pointer overflow-hidden border ${
                  isSelected
                    ? 'bg-[#311644] border-purple-500 ring-2 ring-purple-500/60 shadow-md'
                    : isUnlocked
                    ? 'bg-[#180e24] hover:bg-[#241334] border-purple-900/40 hover:border-purple-700/60'
                    : 'bg-[#100818]/60 border-purple-950/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-[#0a0510]">
                  <img
                    src={char.portraitUrl}
                    alt={char.name}
                    className={`w-full h-full object-cover ${!isUnlocked ? 'grayscale' : 'group-hover:scale-105 transition-transform'}`}
                    referrerPolicy="no-referrer"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-purple-950" />
                  )}
                </div>
                <span className="text-xs font-bold text-purple-100 truncate w-full">
                  {char.name}
                </span>
                <span className="text-[10px] text-purple-400/80 truncate w-full">
                  {char.aesthetic.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SENSITIVITY SCORING & DEDUCTION MATRIX                   */}
      {/* ======================================================== */}
      <div className="w-full text-left bg-[#140b1e]/90 border border-purple-900/40 rounded-2xl p-4 sm:p-5 mb-8 shadow-inner">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-3 flex items-center gap-2">
          <span>Sensitivity Scoring & Real-Time Penalty System</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-3 bg-[#1e0f2d] rounded-xl border border-purple-800/40 shadow-xs">
            <div className="font-bold text-amber-400">Rating 5</div>
            <div className="text-purple-100 font-semibold mt-0.5">+100 pts</div>
            <div className="text-rose-400 text-[11px] font-medium">-0.5s penalty</div>
          </div>
          <div className="p-3 bg-[#1e0f2d] rounded-xl border border-purple-800/40 shadow-xs">
            <div className="font-bold text-amber-300">Rating 4</div>
            <div className="text-purple-100 font-semibold mt-0.5">+75 pts</div>
            <div className="text-rose-400 text-[11px] font-medium">-1.0s penalty</div>
          </div>
          <div className="p-3 bg-[#1e0f2d] rounded-xl border border-purple-800/40 shadow-xs">
            <div className="font-bold text-teal-400">Rating 3</div>
            <div className="text-purple-100 font-semibold mt-0.5">+50 pts</div>
            <div className="text-rose-400 text-[11px] font-medium">-1.5s penalty</div>
          </div>
          <div className="p-3 bg-[#1e0f2d] rounded-xl border border-purple-800/40 shadow-xs">
            <div className="font-bold text-indigo-400">Rating 2</div>
            <div className="text-purple-100 font-semibold mt-0.5">+25 pts</div>
            <div className="text-rose-400 text-[11px] font-medium">-2.0s penalty</div>
          </div>
          <div className="p-3 bg-[#1e0f2d] rounded-xl border border-purple-800/40 shadow-xs">
            <div className="font-bold text-purple-400">Rating 1</div>
            <div className="text-purple-100 font-semibold mt-0.5">+10 pts</div>
            <div className="text-rose-400 text-[11px] font-medium">-3.0s penalty</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM SYSTEM ACTIONS & PROGRESS RESET                   */}
      {/* ======================================================== */}
      <div className="w-full flex items-center justify-between text-xs text-purple-400/70 pt-2 border-t border-purple-900/30">
        <div>
          <span>Sole Reflex</span>
          <span className="mx-2 text-purple-700">·</span>
          <span>Dark Aesthetic Edition</span>
        </div>

        {showResetConfirm ? (
          <div className="p-2.5 bg-rose-950/90 border border-rose-800 rounded-xl flex items-center gap-3 text-xs text-rose-200">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Wipe all unlocked characters and high scores?</span>
            <button
              onClick={() => {
                onResetProgress();
                setShowResetConfirm(false);
              }}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded cursor-pointer"
            >
              Reset All
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2 py-1 bg-[#251535] text-purple-200 rounded border border-purple-700/50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Saved Progress</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* EXPANDED FULL ROSTER BROWSER MODAL                       */}
      {/* ======================================================== */}
      {showRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-gradient-to-b from-[#1b0e29] to-[#12071d] border border-purple-800/60 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40 mb-5">
              <div>
                <h3 className="text-xl font-bold text-purple-100">Character Roster Selection</h3>
                <p className="text-xs text-purple-300/70 mt-0.5">
                  Select an unlocked woman to explore her plantar reflex level and sensitivity profile
                </p>
              </div>
              <button
                onClick={() => setShowRoster(false)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-bold cursor-pointer border border-purple-700/60 transition-colors"
              >
                Back to Menu
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-1">
              {CHARACTERS.map((char) => {
                const isUnlocked = progression.unlockedCharacterIds.includes(char.id);
                const isSelected = selectedCharacter.id === char.id;
                const bestScore = progression.characterHighScores[char.id] || 0;

                return (
                  <div
                    key={char.id}
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectCharacter(char);
                        setShowRoster(false);
                      }
                    }}
                    className={`rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#2d153e] border-purple-500 ring-2 ring-purple-500/60 shadow-lg'
                        : isUnlocked
                        ? 'bg-[#180e23] hover:bg-[#221332] border-purple-900/40 hover:border-purple-700/60 cursor-pointer'
                        : 'bg-[#0f0817]/60 border-purple-950/40 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#0a0510]">
                      <img
                        src={char.portraitUrl}
                        alt={char.name}
                        className={`w-full h-full object-cover ${!isUnlocked ? 'grayscale' : ''}`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2">
                        {isUnlocked ? (
                          <span className="p-1 rounded-full bg-emerald-600 text-white shadow-xs block">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="p-1 rounded-full bg-black/80 text-white shadow-xs block backdrop-blur-xs">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/75 text-purple-200 text-[10px] font-semibold backdrop-blur-xs">
                        {char.aesthetic}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-100">{char.name}</span>
                        <span className="text-[11px] text-purple-400">Age {char.age}</span>
                      </div>
                      <p className="text-[11px] text-purple-300/70 line-clamp-2 mt-1">
                        {char.personality}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px]">
                      {isUnlocked ? (
                        <>
                          <span className="text-purple-400">Best:</span>
                          <span className="font-bold text-amber-300 tabular-nums">
                            {bestScore > 0 ? `${bestScore.toLocaleString()} pts` : 'Ready'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-400">Unlock:</span>
                          <span className="font-semibold text-rose-300 tabular-nums">
                            {char.minScoreToUnlock.toLocaleString()} pts
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
