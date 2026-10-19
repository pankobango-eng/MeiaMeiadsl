import React from 'react';
import { TARGET_DEFINITIONS } from '../data/footTargets';

interface KeyboardShortcutsLegendProps {
  disabledTargetIds: Set<string>;
}

export const KeyboardShortcutsLegend: React.FC<KeyboardShortcutsLegendProps> = ({
  disabledTargetIds,
}) => {
  const leftTargets = TARGET_DEFINITIONS.filter((t) => t.foot === 'left');
  const rightTargets = TARGET_DEFINITIONS.filter((t) => t.foot === 'right');

  return (
    <div className="w-full max-w-3xl mx-auto mt-3 px-4 py-2.5 bg-[#140b1e]/90 border border-purple-900/40 rounded-2xl text-xs text-purple-300/80 shadow-lg backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Left Foot Keys */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="font-bold text-purple-300 mr-1 text-[11px] uppercase tracking-wider">
            Left Sole:
          </span>
          {leftTargets.map((t) => {
            const isDisabled = disabledTargetIds.has(t.id);
            return (
              <span
                key={t.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono border transition-all ${
                  isDisabled
                    ? 'bg-[#1e102e] text-purple-600 border-purple-950 line-through opacity-50'
                    : 'bg-[#261338] text-purple-100 border-purple-700/60 font-bold shadow-xs'
                }`}
                title={`${t.name} (${t.keyLabel})`}
              >
                <span>{t.keyLabel}</span>
              </span>
            );
          })}
        </div>

        {/* Global Controls */}
        <div className="text-[11px] text-purple-400/80 whitespace-nowrap">
          <kbd className="px-1.5 py-0.5 bg-[#261338] border border-purple-700/60 rounded-md font-mono text-purple-200 font-bold">Space</kbd> Pause
          <span className="mx-1.5 text-purple-800">·</span>
          <kbd className="px-1.5 py-0.5 bg-[#261338] border border-purple-700/60 rounded-md font-mono text-purple-200 font-bold">Enter</kbd> Continue
        </div>

        {/* Right Foot Keys */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="font-bold text-purple-300 mr-1 text-[11px] uppercase tracking-wider">
            Right Sole:
          </span>
          {rightTargets.map((t) => {
            const isDisabled = disabledTargetIds.has(t.id);
            return (
              <span
                key={t.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono border transition-all ${
                  isDisabled
                    ? 'bg-[#1e102e] text-purple-600 border-purple-950 line-through opacity-50'
                    : 'bg-[#261338] text-purple-100 border-purple-700/60 font-bold shadow-xs'
                }`}
                title={`${t.name} (${t.keyLabel})`}
              >
                <span>{t.keyLabel}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
