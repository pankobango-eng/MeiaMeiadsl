/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FootTargetDefinition,
  GameState,
  GameConfig,
  RoundStats,
  StruckTargetRecord,
  CharacterDefinition,
  PlayerProgression,
  ActiveRunState,
  EventLogItem,
  ComposureTier,
} from './types/game';
import { TARGET_DEFINITIONS, DEFAULT_CONFIG } from './data/footTargets';
import {
  CHARACTERS,
  loadProgression,
  saveProgression,
  resetAllProgression,
} from './data/characters';
import { getSensitivityRule } from './data/levels';
import { soundManager } from './utils/audio';
import { dialogueEngine } from './utils/dialogueEngine';
import { FootIllustration } from './components/FootIllustration';
import { CharacterPortraitCard } from './components/CharacterPortraitCard';
import { EventLogPanel } from './components/EventLogPanel';
import { GameHUD } from './components/GameHUD';
import { MainMenu } from './components/MainMenu';
import { RoundTransitionModal } from './components/RoundTransitionModal';
import { LevelResultsModal } from './components/LevelResultsModal';
import { GameOverModal } from './components/GameOverModal';
import { SensitivitySettingsModal } from './components/SensitivitySettingsModal';
import { KeyboardShortcutsLegend } from './components/KeyboardShortcutsLegend';

export default function App() {
  // Progression & Persistence
  const [progression, setProgression] = useState<PlayerProgression>(() => loadProgression());

  // Selected Character from Roster
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDefinition>(() => {
    const saved = loadProgression();
    const found = CHARACTERS.find((c) => c.id === saved.lastSelectedCharacterId);
    return found || CHARACTERS[0];
  });

  // Active Character for the ongoing match
  const [activeCharacter, setActiveCharacter] = useState<CharacterDefinition>(selectedCharacter);

  // Game Configuration
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);

  // Bilateral Target Sensitivities (Ratings 1 to 5, independent per foot)
  const [sensitivities, setSensitivities] = useState<Record<string, number>>(() => ({
    ...selectedCharacter.sensitivityProfile,
  }));

  // Contextual Dialogue & Event Log State
  const [currentDialogue, setCurrentDialogue] = useState<string | null>(null);
  const [composureTier, setComposureTier] = useState<ComposureTier>('composed');
  const [intermissionDialogue, setIntermissionDialogue] = useState<string>('');
  const [eventLogs, setEventLogs] = useState<EventLogItem[]>([]);
  const [runSeed, setRunSeed] = useState<number>(() => Math.floor(Math.random() * 100));

  // Active in-progress run state for Continue Run capability
  const [activeRun, setActiveRun] = useState<ActiveRunState | null>(() => {
    try {
      const saved = localStorage.getItem('sole_reflex_active_run');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Sync activeRun to localStorage
  useEffect(() => {
    if (activeRun) {
      try {
        localStorage.setItem('sole_reflex_active_run', JSON.stringify(activeRun));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem('sole_reflex_active_run');
    }
  }, [activeRun]);

  // Game Loop State
  const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
  const [roundNumber, setRoundNumber] = useState<number>(1); // 1 to 10
  const [cumulativeScore, setCumulativeScore] = useState<number>(0);
  const [currentRoundScore, setCurrentRoundScore] = useState<number>(0);
  const [lossTokens, setLossTokens] = useState<number>(0); // Max 6 loss tokens

  // Target Selections in current round
  const [disabledTargetIds, setDisabledTargetIds] = useState<Set<string>>(new Set());
  const [activeLastHitId, setActiveLastHitId] = useState<string | null>(null);
  const [roundStruckList, setRoundStruckList] = useState<StruckTargetRecord[]>([]);

  // Modals & Panels
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [lastRoundStats, setLastRoundStats] = useState<RoundStats | null>(null);

  // Timer Management
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(config.roundDurationSec);
  const timerRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Guard against race conditions or repeated events
  const roundFinishedRef = useRef<boolean>(false);

  // Save progression changes to localStorage
  useEffect(() => {
    saveProgression(progression);
  }, [progression]);

  // Sync sound manager enabled state and master volume with config
  useEffect(() => {
    soundManager.setEnabled(config.soundEnabled);
    soundManager.setMasterVolume(config.masterVolume);
  }, [config.soundEnabled, config.masterVolume]);

  // Update sensitivities whenever selected character changes
  useEffect(() => {
    setSensitivities({ ...selectedCharacter.sensitivityProfile });
  }, [selectedCharacter]);

  /**
   * Stops the active requestAnimationFrame timer cleanly
   */
  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Handle round failure when timer reaches 0
   */
  const handleRoundTimeout = useCallback(() => {
    if (roundFinishedRef.current) return;
    roundFinishedRef.current = true;
    stopTimer();

    const newLossTokens = lossTokens + 1;
    setLossTokens(newLossTokens);

    const stats: RoundStats = {
      roundNumber,
      isWon: false,
      timeRemainingSec: 0,
      timeLimitSec: config.roundDurationSec,
      targetsStruckCount: disabledTargetIds.size,
      roundScore: currentRoundScore,
      cumulativeScore,
      struckTargets: [...roundStruckList],
    };
    setLastRoundStats(stats);

    // Generate contextual dialogue for round loss / repeated losses
    const failEvent = newLossTokens >= 3 ? 'REPEATED_LOSSES' : 'ROUND_LOST';
    const failRes = dialogueEngine.generateLine({
      character: activeCharacter,
      event: failEvent,
      remainingTimeSec: 0,
      timeLimitSec: config.roundDurationSec,
      targetsStruckCount: disabledTargetIds.size,
      targetsRequired: config.targetsRequiredPerRound,
      lossTokens: newLossTokens,
      roundNumber,
    });
    setIntermissionDialogue(failRes.text);
    setCurrentDialogue(failRes.text);

    // If 6th loss token reached -> Immediate Game Over
    if (newLossTokens >= config.maxLossTokens) {
      soundManager.playGameOver();
      soundManager.playCharacterLaughter(activeCharacter.id, 'extreme');
      setActiveRun(null);
      setGameState('GAME_OVER');
    } else {
      soundManager.playRoundFail();
      soundManager.playCharacterLaughter(activeCharacter.id, 'mild');
      // Keep run active in intermission
      setActiveRun({
        characterId: activeCharacter.id,
        roundNumber,
        cumulativeScore,
        currentRoundScore,
        lossTokens: newLossTokens,
        timeRemainingSec: 0,
        disabledTargetIds: Array.from(disabledTargetIds),
        sensitivities: { ...sensitivities },
        roundStruckList: [...roundStruckList],
        isIntermission: true,
        lastRoundStats: stats,
      });
      setGameState('ROUND_INTERMISSION');
    }
  }, [
    lossTokens,
    roundNumber,
    config.roundDurationSec,
    config.maxLossTokens,
    config.targetsRequiredPerRound,
    disabledTargetIds,
    currentRoundScore,
    cumulativeScore,
    roundStruckList,
    activeCharacter,
    sensitivities,
    stopTimer,
  ]);

  /**
   * Main timer loop: runs ONLY while gameState === 'PLAYING'
   */
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      stopTimer();
      return;
    }

    lastTickTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (roundFinishedRef.current) {
        stopTimer();
        return;
      }

      const deltaMs = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      setTimeRemainingSec((prev) => {
        const next = prev - deltaMs / 1000;
        if (next <= 0) {
          handleRoundTimeout();
          return 0;
        }
        return next;
      });

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      stopTimer();
    };
  }, [gameState, handleRoundTimeout, stopTimer]);

  /**
   * Target Selection Handler
   * Validates target, awards points, deducts time penalty, triggers laughter & procedural dialogue, records event
   */
  const handleTargetClick = useCallback(
    (target: FootTargetDefinition) => {
      // 1. Validate round is active
      if (gameState !== 'PLAYING' || roundFinishedRef.current) return;

      // 2. Prevent repeated clicks on already used targets
      if (disabledTargetIds.has(target.id)) {
        soundManager.playDisabledClick();
        return;
      }

      // 3. Look up sensitivity rating (1 to 5) and scoring rule
      const rating = Math.round(sensitivities[target.id] ?? target.defaultSensitivity);
      const rule = getSensitivityRule(rating);

      // 4. Mark target as disabled on this foot only
      const updatedDisabled = new Set(disabledTargetIds);
      updatedDisabled.add(target.id);
      setDisabledTargetIds(updatedDisabled);
      setActiveLastHitId(target.id);

      setTimeout(() => {
        setActiveLastHitId(null);
      }, 400);

      // 5. Award points
      const points = rule.points;
      const newRoundScore = currentRoundScore + points;
      const newCumulativeScore = cumulativeScore + points;
      setCurrentRoundScore(newRoundScore);
      setCumulativeScore(newCumulativeScore);

      // Record hit
      const record: StruckTargetRecord = {
        targetId: target.id,
        foot: target.foot,
        regionKey: target.regionKey,
        timestamp: Date.now(),
        sensitivity: rating,
        pointsAwarded: points,
        timeDeductedSec: rule.timeDeductionSec,
      };
      const updatedStruck = [...roundStruckList, record];
      setRoundStruckList(updatedStruck);

      // Play tactical touch tone
      soundManager.playTargetHit(rating);

      // 6. Apply immediate time deduction penalty
      const newTime = Math.max(0, timeRemainingSec - rule.timeDeductionSec);
      setTimeRemainingSec(newTime);

      // 7. Contextual Dialogue & Laughter Trigger
      const dialogueEvent = dialogueEngine.evaluateTargetSelectionEvent(
        target,
        rating,
        TARGET_DEFINITIONS,
        disabledTargetIds,
        sensitivities
      );

      const dialogueRes = dialogueEngine.generateLine({
        character: activeCharacter,
        event: dialogueEvent,
        target,
        sensitivity: rating,
        remainingTimeSec: newTime,
        timeLimitSec: config.roundDurationSec,
        targetsStruckCount: updatedDisabled.size,
        targetsRequired: config.targetsRequiredPerRound,
        lossTokens,
        roundNumber,
      });

      setCurrentDialogue(dialogueRes.text);
      setComposureTier(dialogueRes.composureTier);

      // Trigger character-specific laughter matching reaction intensity
      soundManager.playCharacterLaughter(activeCharacter.id, dialogueRes.intensity);

      // Record in Event Log
      const logEntry: EventLogItem = {
        id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        sequenceNumber: eventLogs.length + 1,
        timestamp: Date.now(),
        roundNumber,
        foot: target.foot,
        targetName: target.name,
        regionKey: target.regionKey,
        sensitivity: rating,
        pointsAwarded: points,
        timeDeductedSec: rule.timeDeductionSec,
        dialogueLine: dialogueRes.text,
        characterName: activeCharacter.name,
        intensity: dialogueRes.intensity,
      };
      setEventLogs((prev) => [...prev, logEntry]);

      // Check if time deduction caused timer expiration
      if (newTime <= 0) {
        roundFinishedRef.current = true;
        stopTimer();
        const newLossTokens = lossTokens + 1;
        setLossTokens(newLossTokens);

        const stats: RoundStats = {
          roundNumber,
          isWon: false,
          timeRemainingSec: 0,
          timeLimitSec: config.roundDurationSec,
          targetsStruckCount: updatedDisabled.size,
          roundScore: newRoundScore,
          cumulativeScore: newCumulativeScore,
          struckTargets: updatedStruck,
        };
        setLastRoundStats(stats);

        const failEvent = newLossTokens >= 3 ? 'REPEATED_LOSSES' : 'ROUND_LOST';
        const failRes = dialogueEngine.generateLine({
          character: activeCharacter,
          event: failEvent,
          remainingTimeSec: 0,
          timeLimitSec: config.roundDurationSec,
          targetsStruckCount: updatedDisabled.size,
          targetsRequired: config.targetsRequiredPerRound,
          lossTokens: newLossTokens,
          roundNumber,
        });
        setIntermissionDialogue(failRes.text);

        if (newLossTokens >= config.maxLossTokens) {
          soundManager.playGameOver();
          soundManager.playCharacterLaughter(activeCharacter.id, 'extreme');
          setActiveRun(null);
          setGameState('GAME_OVER');
        } else {
          soundManager.playRoundFail();
          setActiveRun({
            characterId: activeCharacter.id,
            roundNumber,
            cumulativeScore: newCumulativeScore,
            currentRoundScore: newRoundScore,
            lossTokens: newLossTokens,
            timeRemainingSec: 0,
            disabledTargetIds: Array.from(updatedDisabled),
            sensitivities: { ...sensitivities },
            roundStruckList: updatedStruck,
            isIntermission: true,
            lastRoundStats: stats,
          });
          setGameState('ROUND_INTERMISSION');
        }
        return;
      }

      // 8. Check if 6 required targets have been selected
      if (updatedDisabled.size >= config.targetsRequiredPerRound) {
        roundFinishedRef.current = true;
        stopTimer();
        soundManager.playRoundSuccess();

        const stats: RoundStats = {
          roundNumber,
          isWon: true,
          timeRemainingSec: newTime,
          timeLimitSec: config.roundDurationSec,
          targetsStruckCount: updatedDisabled.size,
          roundScore: newRoundScore,
          cumulativeScore: newCumulativeScore,
          struckTargets: updatedStruck,
        };
        setLastRoundStats(stats);

        // Generate victory dialogue reacting to fast clear vs clutch buzzer-beater
        const isFastWin = newTime > 10;
        const isClutchWin = newTime <= 3.5;
        const winEvent = isFastWin ? 'ROUND_WON_FAST' : isClutchWin ? 'ROUND_WON_CLUTCH' : 'ROUND_WON_FAST';
        const winRes = dialogueEngine.generateLine({
          character: activeCharacter,
          event: winEvent,
          remainingTimeSec: newTime,
          timeLimitSec: config.roundDurationSec,
          targetsStruckCount: updatedDisabled.size,
          targetsRequired: config.targetsRequiredPerRound,
          lossTokens,
          roundNumber,
        });
        setIntermissionDialogue(winRes.text);

        // Check if level has reached 10 completed rounds
        if (roundNumber >= config.totalRoundsPerLevel) {
          // Level Completed! Check unlock criteria and update progression
          const currentIndex = CHARACTERS.findIndex((c) => c.id === activeCharacter.id);
          const nextChar =
            currentIndex !== -1 && currentIndex + 1 < CHARACTERS.length
              ? CHARACTERS[currentIndex + 1]
              : null;
          const metThreshold = nextChar
            ? newCumulativeScore >= nextChar.minScoreToUnlock
            : true;

          setProgression((prev) => {
            const nextUnlocked = [...prev.unlockedCharacterIds];
            if (nextChar && metThreshold && !nextUnlocked.includes(nextChar.id)) {
              nextUnlocked.push(nextChar.id);
            }

            const updatedHigh = Math.max(prev.overallHighScore, newCumulativeScore);
            const charBest = Math.max(
              prev.characterHighScores[activeCharacter.id] || 0,
              newCumulativeScore
            );

            return {
              ...prev,
              overallHighScore: updatedHigh,
              characterHighScores: {
                ...prev.characterHighScores,
                [activeCharacter.id]: charBest,
              },
              unlockedCharacterIds: nextUnlocked,
            };
          });

          setActiveRun(null);
          setGameState('LEVEL_RESULTS');
        } else {
          // Untimed intermission before next round
          setActiveRun({
            characterId: activeCharacter.id,
            roundNumber,
            cumulativeScore: newCumulativeScore,
            currentRoundScore: newRoundScore,
            lossTokens,
            timeRemainingSec: newTime,
            disabledTargetIds: Array.from(updatedDisabled),
            sensitivities: { ...sensitivities },
            roundStruckList: updatedStruck,
            isIntermission: true,
            lastRoundStats: stats,
          });
          setGameState('ROUND_INTERMISSION');
        }
      }
    },
    [
      gameState,
      disabledTargetIds,
      sensitivities,
      currentRoundScore,
      cumulativeScore,
      timeRemainingSec,
      config.targetsRequiredPerRound,
      config.roundDurationSec,
      config.maxLossTokens,
      config.totalRoundsPerLevel,
      roundNumber,
      activeCharacter,
      lossTokens,
      roundStruckList,
      eventLogs.length,
      stopTimer,
    ]
  );

  /**
   * Start or Restart Run on Selected Character's Level
   */
  const handleStartRun = (charToStart?: CharacterDefinition) => {
    const char = charToStart || selectedCharacter;
    setActiveCharacter(char);
    setSensitivities({ ...char.sensitivityProfile });

    setRoundNumber(1);
    setCumulativeScore(0);
    setCurrentRoundScore(0);
    setLossTokens(0);
    setDisabledTargetIds(new Set());
    setRoundStruckList([]);
    setEventLogs([]);
    setTimeRemainingSec(config.roundDurationSec);
    setLastRoundStats(null);
    setActiveRun(null);
    setRunSeed(Date.now() % 100);

    // Initial character round start greeting
    const startRes = dialogueEngine.generateLine({
      character: char,
      event: 'ROUND_START',
      roundNumber: 1,
      remainingTimeSec: config.roundDurationSec,
      timeLimitSec: config.roundDurationSec,
      targetsStruckCount: 0,
      targetsRequired: config.targetsRequiredPerRound,
      lossTokens: 0,
    });
    setCurrentDialogue(startRes.text);

    roundFinishedRef.current = false;
    setGameState('PLAYING');
  };

  /**
   * Continue / Resume an in-progress run from Main Menu
   */
  const handleResumeRun = () => {
    if (!activeRun) return;

    const char = CHARACTERS.find((c) => c.id === activeRun.characterId) || selectedCharacter;
    setActiveCharacter(char);
    setSelectedCharacter(char);
    setSensitivities({ ...activeRun.sensitivities });
    setRoundNumber(activeRun.roundNumber);
    setCumulativeScore(activeRun.cumulativeScore);
    setCurrentRoundScore(activeRun.currentRoundScore);
    setLossTokens(activeRun.lossTokens);
    setTimeRemainingSec(activeRun.timeRemainingSec);
    setDisabledTargetIds(new Set(activeRun.disabledTargetIds));
    setRoundStruckList([...activeRun.roundStruckList]);
    setLastRoundStats(activeRun.lastRoundStats);

    roundFinishedRef.current = false;
    if (activeRun.isIntermission) {
      setGameState('ROUND_INTERMISSION');
    } else {
      setGameState('PLAYING');
    }
  };

  /**
   * Abandon in-progress session
   */
  const handleAbandonRun = () => {
    setActiveRun(null);
  };

  /**
   * Save and return to Main Menu from Pause or Intermission
   */
  const handleSaveAndExitToMenu = () => {
    stopTimer();
    const runState: ActiveRunState = {
      characterId: activeCharacter.id,
      roundNumber,
      cumulativeScore,
      currentRoundScore,
      lossTokens,
      timeRemainingSec,
      disabledTargetIds: Array.from(disabledTargetIds),
      sensitivities: { ...sensitivities },
      roundStruckList: [...roundStruckList],
      isIntermission: gameState === 'ROUND_INTERMISSION',
      lastRoundStats,
    };
    setActiveRun(runState);
    setGameState('MAIN_MENU');
  };

  /**
   * Begin Next Round (called from untimed intermission)
   */
  const handleBeginNextRound = () => {
    const nextRound = roundNumber + 1;
    setRoundNumber(nextRound);
    setCurrentRoundScore(0);
    setDisabledTargetIds(new Set());
    setRoundStruckList([]);
    setTimeRemainingSec(config.roundDurationSec);

    // Contextual round start dialogue
    const startRes = dialogueEngine.generateLine({
      character: activeCharacter,
      event: 'ROUND_START',
      roundNumber: nextRound,
      remainingTimeSec: config.roundDurationSec,
      timeLimitSec: config.roundDurationSec,
      targetsStruckCount: 0,
      targetsRequired: config.targetsRequiredPerRound,
      lossTokens,
    });
    setCurrentDialogue(startRes.text);

    roundFinishedRef.current = false;
    setGameState('PLAYING');
  };

  /**
   * Continue to Next Character (after beating round 10 with threshold met)
   */
  const handleContinueNextCharacter = () => {
    const currentIndex = CHARACTERS.findIndex((c) => c.id === activeCharacter.id);
    if (currentIndex !== -1 && currentIndex + 1 < CHARACTERS.length) {
      const nextChar = CHARACTERS[currentIndex + 1];
      setSelectedCharacter(nextChar);
      handleStartRun(nextChar);
    } else {
      setGameState('MAIN_MENU');
    }
  };

  /**
   * Replay Current Character Level
   */
  const handleReplayLevel = () => {
    handleStartRun(activeCharacter);
  };

  /**
   * Reset All Progression with local storage wipe
   */
  const handleResetProgress = () => {
    const resetState = resetAllProgression();
    setProgression(resetState);
    setSelectedCharacter(CHARACTERS[0]);
    setActiveCharacter(CHARACTERS[0]);
    setSensitivities({ ...CHARACTERS[0].sensitivityProfile });
    setActiveRun(null);
    setEventLogs([]);
    dialogueEngine.resetHistory();
  };

  /**
   * Audio toggle with immediate procedural tactile feedback
   */
  const handleToggleSound = () => {
    setConfig((prev) => {
      const nextVal = !prev.soundEnabled;
      soundManager.setEnabled(nextVal);
      if (nextVal) {
        soundManager.playTargetHit(5);
      }
      return { ...prev, soundEnabled: nextVal };
    });
  };

  /**
   * Keyboard shortcuts listener
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Space to toggle pause
      if (e.code === 'Space' && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
        e.preventDefault();
        setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
        return;
      }

      // Enter to advance in non-gameplay screens
      if (e.code === 'Enter') {
        if (gameState === 'ROUND_INTERMISSION') {
          e.preventDefault();
          handleBeginNextRound();
          return;
        }
        if (gameState === 'GAME_OVER') {
          e.preventDefault();
          handleStartRun(activeCharacter);
          return;
        }
        if (gameState === 'LEVEL_RESULTS') {
          e.preventDefault();
          handleReplayLevel();
          return;
        }
        if (gameState === 'MAIN_MENU') {
          e.preventDefault();
          if (activeRun) {
            handleResumeRun();
          } else {
            handleStartRun(selectedCharacter);
          }
          return;
        }
      }

      // Escape to close settings or pause
      if (e.code === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (gameState === 'PLAYING') {
          setGameState('PAUSED');
          return;
        }
      }

      // Target hotkeys during active gameplay
      if (gameState === 'PLAYING') {
        const matched = TARGET_DEFINITIONS.find((t) => t.keyboardKey.toLowerCase() === key);
        if (matched) {
          e.preventDefault();
          handleTargetClick(matched);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    isSettingsOpen,
    activeCharacter,
    selectedCharacter,
    activeRun,
    handleTargetClick,
  ]);

  // Next character lookup for Level Results
  const currentCharIndex = CHARACTERS.findIndex((c) => c.id === activeCharacter.id);
  const nextCharacter =
    currentCharIndex !== -1 && currentCharIndex + 1 < CHARACTERS.length
      ? CHARACTERS[currentCharIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[#07040a] text-[#f5f3ff] flex flex-col justify-between selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Header HUD (during gameplay, pause, or intermission) */}
      <GameHUD
        roundNumber={roundNumber}
        totalRounds={config.totalRoundsPerLevel}
        cumulativeScore={cumulativeScore}
        roundScore={currentRoundScore}
        highScore={progression.overallHighScore}
        timeRemainingSec={timeRemainingSec}
        timeLimitSec={config.roundDurationSec}
        targetsStruckCount={disabledTargetIds.size}
        targetsRequired={config.targetsRequiredPerRound}
        lossTokens={lossTokens}
        maxLossTokens={config.maxLossTokens}
        gameState={gameState}
        character={activeCharacter}
        soundEnabled={config.soundEnabled}
        showKeyboardShortcuts={config.showKeyboardShortcuts}
        onToggleSound={handleToggleSound}
        onToggleKeyboardShortcuts={() =>
          setConfig((prev) => ({ ...prev, showKeyboardShortcuts: !prev.showKeyboardShortcuts }))
        }
        onTogglePause={() =>
          setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'))
        }
        onRestartRun={() => handleStartRun(activeCharacter)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-6xl mx-auto w-full relative">
        {gameState === 'MAIN_MENU' ? (
          <MainMenu
            progression={progression}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={(char) => {
              setSelectedCharacter(char);
              setProgression((p) => ({ ...p, lastSelectedCharacterId: char.id }));
            }}
            onStartLevel={() => handleStartRun(selectedCharacter)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onResetProgress={handleResetProgress}
            activeRun={activeRun}
            onResumeRun={handleResumeRun}
            onAbandonRun={handleAbandonRun}
            soundEnabled={config.soundEnabled}
            onToggleSound={handleToggleSound}
          />
        ) : (
          <div className="w-full flex flex-col items-center relative">
            {/* Desktop Stage: Left Event Log + Central Arena */}
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 relative">
              {/* Left-docked Event Log (Desktop) & Collapsible (Mobile) */}
              <EventLogPanel
                events={eventLogs}
                characterThemePrimary={activeCharacter.theme.primary}
              />

              {/* Central Feet Arena Container */}
              <div className="w-full max-w-[500px] md:max-w-[540px] flex flex-col items-center relative shrink-0">
                {/* Corner Character Portrait Card in Gameplay Screen with Speech Bubble */}
                <CharacterPortraitCard
                  character={activeCharacter}
                  lossTokens={lossTokens}
                  maxLossTokens={config.maxLossTokens}
                  currentDialogue={currentDialogue}
                  composureTier={composureTier}
                />

                {/* PAUSED overlay */}
                {gameState === 'PAUSED' && (
                  <div className="absolute z-30 inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-3xl p-4">
                    <div className="bg-gradient-to-b from-[#1e0f2d] to-[#12071d] border border-purple-800/60 p-7 rounded-3xl shadow-2xl text-center max-w-sm w-full">
                      <div className="text-2xl font-black text-purple-100 tracking-tight mb-1">Session Paused</div>
                      <p className="text-xs text-purple-300/80 mb-5">
                        Plantar timer and reflex targets suspended for {activeCharacter.name}.
                      </p>
                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={() => setGameState('PLAYING')}
                          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
                        >
                          Resume (Space)
                        </button>
                        <button
                          onClick={() => setIsSettingsOpen(true)}
                          className="w-full py-2.5 px-4 bg-[#231235] hover:bg-[#2d1844] text-purple-200 font-semibold text-xs rounded-xl border border-purple-800/40 transition-colors cursor-pointer"
                        >
                          Sensitivity Settings
                        </button>
                        <button
                          onClick={handleSaveAndExitToMenu}
                          className="w-full py-2 px-4 text-xs font-semibold text-purple-400 hover:text-purple-200 transition-colors cursor-pointer"
                        >
                          Save & Return to Main Menu
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Central Anatomical Feet Arena with Character-Specific Artwork & Sensitivities */}
                <FootIllustration
                  character={activeCharacter}
                  targets={TARGET_DEFINITIONS}
                  disabledTargetIds={disabledTargetIds}
                  onTargetClick={handleTargetClick}
                  showKeyHints={config.showKeyboardShortcuts}
                  activeLastHitId={activeLastHitId}
                  sensitivities={sensitivities}
                  interactive={gameState === 'PLAYING'}
                />

                {/* Keyboard shortcuts helper bar */}
                {config.showKeyboardShortcuts && (
                  <KeyboardShortcutsLegend disabledTargetIds={disabledTargetIds} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer metadata */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400/60 border-t border-purple-900/30 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-300">Sole Reflex</span>
          <span className="text-purple-700" aria-hidden="true">·</span>
          <span>8 Adult Female Characters</span>
          <span className="text-purple-700" aria-hidden="true">·</span>
          <span>Contextual Dialogue Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Max 6 Loss Tokens</span>
          <span className="text-purple-700" aria-hidden="true">·</span>
          <span>Mouse · Touch · Keyboard (Q-D / U-L)</span>
        </div>
      </footer>

      {/* Untimed Round Intermission Modal (after every completed or failed round) */}
      {gameState === 'ROUND_INTERMISSION' && lastRoundStats && (
        <RoundTransitionModal
          character={activeCharacter}
          roundStats={lastRoundStats}
          totalRounds={config.totalRoundsPerLevel}
          totalScore={cumulativeScore}
          lossTokens={lossTokens}
          maxLossTokens={config.maxLossTokens}
          intermissionDialogue={intermissionDialogue}
          onBeginNextRound={handleBeginNextRound}
          onExitToMenu={handleSaveAndExitToMenu}
        />
      )}

      {/* Level Results Screen (after round 10) */}
      {gameState === 'LEVEL_RESULTS' && (
        <LevelResultsModal
          character={activeCharacter}
          totalScore={cumulativeScore}
          lossTokens={lossTokens}
          maxLossTokens={config.maxLossTokens}
          isUnlockedNext={
            nextCharacter ? cumulativeScore >= nextCharacter.minScoreToUnlock : true
          }
          nextCharacter={nextCharacter}
          onContinueNextCharacter={handleContinueNextCharacter}
          onReplayLevel={handleReplayLevel}
          onExitToMenu={() => {
            stopTimer();
            setActiveRun(null);
            setGameState('MAIN_MENU');
          }}
        />
      )}

      {/* Game Over Screen (6 loss tokens reached) with 3-paragraph finale */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          character={activeCharacter}
          finalScore={cumulativeScore}
          roundsCompleted={roundNumber - 1}
          totalRounds={config.totalRoundsPerLevel}
          lossTokens={lossTokens}
          maxLossTokens={config.maxLossTokens}
          highScore={progression.overallHighScore}
          runSeed={runSeed}
          onRestartRun={() => handleStartRun(activeCharacter)}
          onExitToMenu={() => {
            stopTimer();
            setActiveRun(null);
            setGameState('MAIN_MENU');
          }}
        />
      )}

      {/* Configuration & Sensitivity Settings */}
      {isSettingsOpen && (
        <SensitivitySettingsModal
          config={config}
          sensitivities={sensitivities}
          onUpdateConfig={(newConf) => setConfig((prev) => ({ ...prev, ...newConf }))}
          onUpdateSensitivity={(targetId, val) =>
            setSensitivities((prev) => ({ ...prev, [targetId]: val }))
          }
          onResetToDefaults={() => {
            setSensitivities({ ...activeCharacter.sensitivityProfile });
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
