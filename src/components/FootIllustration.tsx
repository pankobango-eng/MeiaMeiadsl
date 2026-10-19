import React, { useState } from 'react';
import { FootSide, FootRegionKey, FootTargetDefinition, CharacterDefinition } from '../types/game';
import { getSensitivityRule } from '../data/levels';

interface FootIllustrationProps {
  character: CharacterDefinition;
  targets: FootTargetDefinition[];
  disabledTargetIds: Set<string>;
  onTargetClick: (target: FootTargetDefinition) => void;
  showKeyHints: boolean;
  activeLastHitId: string | null;
  sensitivities: Record<string, number>;
  interactive: boolean;
}

interface FloatingEffect {
  id: number;
  x: number;
  y: number;
  text: string;
  subtext: string;
  isPenalty: boolean;
}

export const FootIllustration: React.FC<FootIllustrationProps> = ({
  character,
  targets,
  disabledTargetIds,
  onTargetClick,
  showKeyHints,
  activeLastHitId,
  sensitivities,
  interactive,
}) => {
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);

  const getTarget = (foot: FootSide, regionKey: FootRegionKey): FootTargetDefinition | undefined => {
    return targets.find((t) => t.foot === foot && t.regionKey === regionKey);
  };

  const handleRegionClick = (
    e: React.MouseEvent<SVGElement> | React.TouchEvent<SVGElement>,
    foot: FootSide,
    regionKey: FootRegionKey
  ) => {
    e.preventDefault();
    if (!interactive) return;

    const target = getTarget(foot, regionKey);
    if (!target) return;

    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const clientX =
      'touches' in e && e.touches[0]
        ? e.touches[0].clientX
        : (e as React.MouseEvent).clientX || rect.left + rect.width / 2;
    const clientY =
      'touches' in e && e.touches[0]
        ? e.touches[0].clientY
        : (e as React.MouseEvent).clientY || rect.top + rect.height / 2;

    const currentSensitivity = sensitivities[target.id] ?? target.defaultSensitivity;
    const rule = getSensitivityRule(currentSensitivity);
    const isAlreadyDisabled = disabledTargetIds.has(target.id);
    const effectId = Date.now() + Math.random();

    setFloatingEffects((prev) => [
      ...prev,
      {
        id: effectId,
        x: clientX,
        y: clientY,
        text: isAlreadyDisabled ? 'Target Disabled' : `+${rule.points} pts`,
        subtext: isAlreadyDisabled
          ? 'Already Selected'
          : `-${rule.timeDeductionSec.toFixed(1)}s (Sens ${rule.rating})`,
        isPenalty: !isAlreadyDisabled,
      },
    ]);

    setTimeout(() => {
      setFloatingEffects((prev) => prev.filter((item) => item.id !== effectId));
    }, 1100);

    onTargetClick(target);
  };

  const theme = character.theme;

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Floating score & penalty feedback popups */}
      {floatingEffects.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none z-50 text-center animate-rise-fade"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="px-3 py-1.5 bg-[#170e22]/95 text-amber-300 font-bold text-xs rounded-lg shadow-xl border border-purple-500/40 whitespace-nowrap backdrop-blur-md">
            {item.text}
          </div>
          {item.subtext && (
            <div
              className={`text-[11px] font-semibold drop-shadow mt-0.5 whitespace-nowrap ${
                item.isPenalty ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {item.subtext}
            </div>
          )}
        </div>
      ))}

      {/* Main Interactive Foot Arena Container */}
      <div className="relative w-full max-w-[500px] md:max-w-[540px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-purple-900/40 bg-[#0d0714] flex items-center justify-center p-1 sm:p-2">
        {/* Subtle background ambient glow matched to character */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.primary} 0%, transparent 70%)`,
          }}
        />

        {/* The Genuine Semi-Realistic Character Foot Illustration Artwork */}
        <img
          src={character.feetIllustrationUrl}
          alt={`${character.name}'s foot soles`}
          className="w-full h-full object-contain rounded-2xl select-none pointer-events-none drop-shadow-md"
          referrerPolicy="no-referrer"
        />

        {/* SVG Interactive Overlay Layer (12 Target Regions) */}
        <svg
          viewBox="0 0 1000 1000"
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            {/* Target active glow filter */}
            <filter id={`targetReflexGlow_${character.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* LEFT FOOT (On left side: X ~ 160-490, Y ~ 70-930)        */}
          {/* ======================================================== */}

          {/* 1. LEFT TOE PADS */}
          {(() => {
            const target = getTarget('left', 'toes');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'left', 'toes')}
                onTouchStart={(e) => handleRegionClick(e, 'left', 'toes')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 160 260
                     C 150 180, 185 100, 240 75
                     C 285 55, 345 55, 410 65
                     C 475 75, 495 125, 485 210
                     C 475 255, 400 270, 310 270
                     C 230 270, 180 275, 160 260 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                {/* Badge Indicator */}
                <circle
                  cx="320"
                  cy="150"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="320"
                  y="156"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 2. LEFT BALL OF FOOT */}
          {(() => {
            const target = getTarget('left', 'ball');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'left', 'ball')}
                onTouchStart={(e) => handleRegionClick(e, 'left', 'ball')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 165 270
                     C 210 260, 420 260, 485 275
                     C 495 320, 475 390, 430 420
                     C 370 455, 230 455, 175 405
                     C 150 360, 155 300, 165 270 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="320"
                  cy="345"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="320"
                  y="351"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 3. LEFT INNER ARCH (Medial concave instep, on the right side of the left foot) */}
          {(() => {
            const target = getTarget('left', 'inner_arch');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'left', 'inner_arch')}
                onTouchStart={(e) => handleRegionClick(e, 'left', 'inner_arch')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 330 435
                     C 395 425, 455 450, 455 520
                     C 455 600, 440 680, 410 710
                     C 365 710, 340 620, 335 525
                     C 335 480, 330 450, 330 435 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="405"
                  cy="555"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="405"
                  y="561"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 4. LEFT OUTER ARCH (Lateral border, on the left side of the left foot) */}
          {(() => {
            const target = getTarget('left', 'outer_arch');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'left', 'outer_arch')}
                onTouchStart={(e) => handleRegionClick(e, 'left', 'outer_arch')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 180 415
                     C 225 435, 270 450, 270 520
                     C 270 600, 260 670, 230 705
                     C 195 700, 180 630, 175 550
                     C 165 480, 170 445, 180 415 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="210"
                  cy="555"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="210"
                  y="561"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 5. LEFT MID-SOLE (Central vault) */}
          {(() => {
            const target = getTarget('left', 'mid_sole');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'left', 'mid_sole')}
                onTouchStart={(e) => handleRegionClick(e, 'left', 'mid_sole')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 270 445
                     C 300 440, 335 440, 350 460
                     C 355 520, 345 610, 325 660
                     C 300 670, 275 670, 260 650
                     C 255 600, 255 520, 270 445 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="305"
                  cy="555"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="305"
                  y="561"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 6. LEFT HEEL */}
          {(() => {
            const target = getTarget('left', 'heel');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'left', 'heel')}
                onTouchStart={(e) => handleRegionClick(e, 'left', 'heel')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 235 715
                     C 280 690, 360 690, 400 715
                     C 435 765, 435 850, 395 905
                     C 355 940, 275 940, 235 905
                     C 205 855, 205 765, 235 715 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="315"
                  cy="820"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="315"
                  y="826"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* ======================================================== */}
          {/* RIGHT FOOT (On right side: X ~ 510-840, Y ~ 70-930)      */}
          {/* ======================================================== */}

          {/* 7. RIGHT TOE PADS */}
          {(() => {
            const target = getTarget('right', 'toes');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'right', 'toes')}
                onTouchStart={(e) => handleRegionClick(e, 'right', 'toes')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 515 210
                     C 505 125, 525 75, 590 65
                     C 655 55, 715 55, 760 75
                     C 815 100, 850 180, 840 260
                     C 820 275, 770 270, 690 270
                     C 600 270, 525 255, 515 210 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="680"
                  cy="150"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="680"
                  y="156"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 8. RIGHT BALL OF FOOT */}
          {(() => {
            const target = getTarget('right', 'ball');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'right', 'ball')}
                onTouchStart={(e) => handleRegionClick(e, 'right', 'ball')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 515 275
                     C 580 260, 790 260, 835 270
                     C 845 300, 850 360, 825 405
                     C 770 455, 630 455, 570 420
                     C 525 390, 505 320, 515 275 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="680"
                  cy="345"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="680"
                  y="351"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 9. RIGHT INNER ARCH (Medial concave instep, on the left side of the right foot) */}
          {(() => {
            const target = getTarget('right', 'inner_arch');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'right', 'inner_arch')}
                onTouchStart={(e) => handleRegionClick(e, 'right', 'inner_arch')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 670 435
                     C 670 450, 665 480, 665 525
                     C 660 620, 635 710, 590 710
                     C 560 680, 545 600, 545 520
                     C 545 450, 605 425, 670 435 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="595"
                  cy="555"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="595"
                  y="561"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 10. RIGHT OUTER ARCH (Lateral border, on the right side of the right foot) */}
          {(() => {
            const target = getTarget('right', 'outer_arch');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'right', 'outer_arch')}
                onTouchStart={(e) => handleRegionClick(e, 'right', 'outer_arch')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 820 415
                     C 830 445, 835 480, 825 550
                     C 820 630, 805 700, 770 705
                     C 740 670, 730 600, 730 520
                     C 730 450, 775 435, 820 415 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="790"
                  cy="555"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="790"
                  y="561"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 11. RIGHT MID-SOLE (Central vault) */}
          {(() => {
            const target = getTarget('right', 'mid_sole');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'right', 'mid_sole')}
                onTouchStart={(e) => handleRegionClick(e, 'right', 'mid_sole')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 730 445
                     C 745 520, 745 600, 740 650
                     C 725 670, 700 670, 675 660
                     C 655 610, 645 520, 650 460
                     C 665 440, 700 440, 730 445 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="695"
                  cy="555"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="695"
                  y="561"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}

          {/* 12. RIGHT HEEL */}
          {(() => {
            const target = getTarget('right', 'heel');
            if (!target) return null;
            const isDisabled = disabledTargetIds.has(target.id);
            const isHovered = hoveredTargetId === target.id;
            const isLastHit = activeLastHitId === target.id;
            const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);

            return (
              <g
                id={target.id}
                className={`transition-all duration-200 ${
                  isDisabled || !interactive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                onMouseEnter={() => setHoveredTargetId(target.id)}
                onMouseLeave={() => setHoveredTargetId(null)}
                onClick={(e) => handleRegionClick(e, 'right', 'heel')}
                onTouchStart={(e) => handleRegionClick(e, 'right', 'heel')}
                role="button"
                tabIndex={0}
                aria-label={`${target.name} - Sens ${rating}`}
              >
                <path
                  d="M 600 715
                     C 640 690, 720 690, 765 715
                     C 795 765, 795 855, 765 905
                     C 725 940, 645 940, 605 905
                     C 565 850, 565 765, 600 715 Z"
                  fill={
                    isDisabled
                      ? 'rgba(40, 20, 50, 0.45)'
                      : isHovered || isLastHit
                      ? 'rgba(168, 85, 247, 0.28)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  stroke={
                    isDisabled
                      ? '#4b5563'
                      : isHovered || isLastHit
                      ? '#d8b4fe'
                      : 'rgba(192, 132, 252, 0.35)'
                  }
                  strokeWidth={isHovered || isLastHit ? '3' : '1.6'}
                  strokeDasharray={isDisabled ? '6 4' : 'none'}
                />
                <circle
                  cx="685"
                  cy="820"
                  r="22"
                  fill={isDisabled ? '#261b33' : isHovered ? theme.primary : '#1a1025'}
                  stroke={isDisabled ? '#4b5563' : theme.primary}
                  strokeWidth="2.2"
                  className="drop-shadow-md"
                />
                <text
                  x="685"
                  y="826"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isDisabled ? '#9ca3af' : isHovered ? '#ffffff' : '#f3e8ff'}
                >
                  {isDisabled ? '✓' : showKeyHints ? target.keyLabel : `S${rating}`}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Hover Inspection / Feedback Footer Bar */}
      <div className="h-6 mt-2 text-center">
        {hoveredTargetId && (
          (() => {
            const t = targets.find((item) => item.id === hoveredTargetId);
            if (!t) return null;
            const curSens = sensitivities[t.id] ?? t.defaultSensitivity;
            const rule = getSensitivityRule(curSens);
            const disabled = disabledTargetIds.has(t.id);
            return (
              <div className="text-xs text-purple-200 font-medium tracking-tight animate-fade-in flex items-center justify-center gap-2">
                <span className="font-semibold text-purple-100">{t.name}</span>
                <span className="text-purple-600">·</span>
                {disabled ? (
                  <span className="text-purple-400 italic">Used this round</span>
                ) : (
                  <>
                    <span className="text-amber-400 font-bold">+{rule.points} pts</span>
                    <span className="text-purple-600">·</span>
                    <span className="text-rose-400 font-semibold">
                      -{rule.timeDeductionSec.toFixed(1)}s deduction
                    </span>
                  </>
                )}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};
