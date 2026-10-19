import React from 'react';
import { X, RotateCcw, Sliders, Check, Volume2, VolumeX } from 'lucide-react';
import { TARGET_DEFINITIONS } from '../data/footTargets';
import { getSensitivityRule } from '../data/levels';
import { GameConfig } from '../types/game';

interface SensitivitySettingsModalProps {
  config: GameConfig;
  sensitivities: Record<string, number>;
  onUpdateConfig: (newConfig: Partial<GameConfig>) => void;
  onUpdateSensitivity: (targetId: string, value: number) => void;
  onResetToDefaults: () => void;
  onClose: () => void;
}

export const SensitivitySettingsModal: React.FC<SensitivitySettingsModalProps> = ({
  config,
  sensitivities,
  onUpdateConfig,
  onUpdateSensitivity,
  onResetToDefaults,
  onClose,
}) => {
  const leftTargets = TARGET_DEFINITIONS.filter((t) => t.foot === 'left');
  const rightTargets = TARGET_DEFINITIONS.filter((t) => t.foot === 'right');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#1b0e29] to-[#12071d] border border-purple-800/50 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/40 bg-[#160a22]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-purple-100">
              Session Configuration & Sensitivity Rules
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-purple-200">
          {/* Section 1: Audio & Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400/80 mb-3">
              Audio & Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-100">Audio Feedback</div>
                  <div className="text-[11px] text-purple-400/80">Procedural synthesizer tones on touch</div>
                </div>
                <button
                  onClick={() => onUpdateConfig({ soundEnabled: !config.soundEnabled })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    config.soundEnabled
                      ? 'bg-purple-900/60 text-purple-200 border-purple-600/70'
                      : 'bg-[#22102e] text-purple-500 border-purple-900/40'
                  }`}
                >
                  {config.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4" />}
                  <span>{config.soundEnabled ? 'Enabled' : 'Muted'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-purple-200 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    Master Volume
                  </span>
                  <span className="font-bold text-amber-300 tabular-nums">
                    {Math.round(config.masterVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.masterVolume}
                  onChange={(e) => onUpdateConfig({ masterVolume: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <span className="text-[11px] text-purple-400/70">Affects reflex tones and character laughter</span>
              </div>

              <div className="p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-100">Keyboard Hints</div>
                  <div className="text-[11px] text-purple-400/80">Display Q-D and U-L key overlays</div>
                </div>
                <button
                  onClick={() => onUpdateConfig({ showKeyboardShortcuts: !config.showKeyboardShortcuts })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    config.showKeyboardShortcuts
                      ? 'bg-purple-900/60 text-purple-200 border-purple-600/70'
                      : 'bg-[#22102e] text-purple-500 border-purple-900/40'
                  }`}
                >
                  <span>{config.showKeyboardShortcuts ? 'Shown' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Timer & Round Configuration */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400/80 mb-3">
              Timer & Loss Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-purple-200">Starting Round Timer</span>
                  <span className="font-bold text-amber-300 tabular-nums">
                    {config.roundDurationSec}s
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={config.roundDurationSec}
                  onChange={(e) => onUpdateConfig({ roundDurationSec: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <span className="text-[11px] text-purple-400/70">Standard duration for each round (default 20s)</span>
              </div>

              <div className="p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-purple-200">Max Loss Tokens</span>
                  <span className="font-bold text-rose-400 tabular-nums">
                    {config.maxLossTokens}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={config.maxLossTokens}
                  onChange={(e) => onUpdateConfig({ maxLossTokens: Number(e.target.value) })}
                  className="w-full accent-rose-500"
                />
                <span className="text-[11px] text-purple-400/70">Tokens before game over (official rule: 6 tokens)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Bilateral Target Sensitivities (Ratings 1 to 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400/80">
                Target Sensitivity Ratings (1 to 5)
              </h3>
              <span className="text-[11px] text-purple-400/70">Independent left & right foot ratings</span>
            </div>
            <p className="text-xs text-purple-300/70 mb-3">
              Higher sensitivity grants higher score value with lower timer deduction:
              Sens 5 = +100pts / -0.5s · Sens 1 = +10pts / -3.0s.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Foot */}
              <div className="space-y-2.5 p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                  Left Sole Targets
                </div>
                {leftTargets.map((t) => {
                  const val = Math.round(sensitivities[t.id] ?? t.defaultSensitivity);
                  const rule = getSensitivityRule(val);

                  return (
                    <div key={t.id} className="p-2.5 bg-[#1e102d] rounded-xl border border-purple-800/40 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-purple-100 truncate">{t.name.replace('Left ', '')}</span>
                        <span className="font-bold text-amber-300 tabular-nums">
                          Rating {val} (+{rule.points} pts / -{rule.timeDeductionSec}s)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={val}
                        onChange={(e) => onUpdateSensitivity(t.id, Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right Foot */}
              <div className="space-y-2.5 p-3.5 bg-[#140b1e]/90 rounded-2xl border border-purple-900/40">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                  Right Sole Targets
                </div>
                {rightTargets.map((t) => {
                  const val = Math.round(sensitivities[t.id] ?? t.defaultSensitivity);
                  const rule = getSensitivityRule(val);

                  return (
                    <div key={t.id} className="p-2.5 bg-[#1e102d] rounded-xl border border-purple-800/40 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-purple-100 truncate">{t.name.replace('Right ', '')}</span>
                        <span className="font-bold text-amber-300 tabular-nums">
                          Rating {val} (+{rule.points} pts / -{rule.timeDeductionSec}s)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={val}
                        onChange={(e) => onUpdateSensitivity(t.id, Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140a20] border-t border-purple-900/40">
          <button
            onClick={onResetToDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Character Profile</span>
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
