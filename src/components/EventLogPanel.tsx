import React, { useRef, useEffect, useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp, History, Sparkles } from 'lucide-react';
import { EventLogItem } from '../types/game';

interface EventLogPanelProps {
  events: EventLogItem[];
  characterThemePrimary: string;
}

export const EventLogPanel: React.FC<EventLogPanelProps> = ({
  events,
  characterThemePrimary,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Auto-scroll to bottom whenever new event arrives
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP VIEW: Left-docked sticky event log panel         */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex flex-col w-72 h-[520px] bg-[#140b1e]/95 border border-purple-900/50 rounded-3xl p-3.5 shadow-2xl backdrop-blur-md shrink-0 mr-4 self-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-purple-900/40 px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">
              Plantar Reflex Log
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {/* Scrollable list */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-2 pr-1 text-left text-xs scroll-smooth"
        >
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-purple-400/60">
              <ScrollText className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
              <p className="text-xs font-medium">No target selections yet.</p>
              <p className="text-[11px] text-purple-500/80 mt-1">
                Click sole targets to record reflex data & dialogue.
              </p>
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="p-2.5 bg-[#1b0f29] rounded-xl border border-purple-900/40 hover:border-purple-700/60 transition-all shadow-xs"
              >
                {/* Event header line: sequence, round, foot */}
                <div className="flex items-center justify-between text-[10px] text-purple-400/80 mb-1">
                  <span className="font-mono font-bold text-purple-300">
                    #{ev.sequenceNumber.toString().padStart(2, '0')} · R{ev.roundNumber}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ev.foot === 'left'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                    }`}
                  >
                    {ev.foot.toUpperCase()}
                  </span>
                </div>

                {/* Target name & scoring impact */}
                <div className="flex items-baseline justify-between gap-1 mb-1.5">
                  <span className="font-bold text-purple-100 truncate text-[11px]">
                    {ev.targetName}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono">
                    <span className="font-bold text-amber-300">+{ev.pointsAwarded}</span>
                    <span className="text-rose-400 font-semibold">-{ev.timeDeductedSec}s</span>
                  </div>
                </div>

                {/* Character Dialogue Triggered */}
                {ev.dialogueLine && (
                  <div className="pt-1.5 border-t border-purple-900/30 text-[11px] italic text-purple-200/90 leading-tight">
                    <span className="text-purple-400 not-italic font-bold text-[10px] mr-1">
                      {ev.characterName}:
                    </span>
                    &ldquo;{ev.dialogueLine}&rdquo;
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE VIEW: Collapsible drawer toggle at bottom/header  */}
      {/* ======================================================== */}
      <div className="lg:hidden w-full max-w-lg mx-auto px-2 mt-2">
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#160b22] border border-purple-900/40 rounded-xl text-xs font-bold text-purple-200 cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>Reflex Event Log ({events.length})</span>
          </div>
          {isMobileOpen ? (
            <ChevronUp className="w-4 h-4 text-purple-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-purple-400" />
          )}
        </button>

        {isMobileOpen && (
          <div className="mt-1.5 p-2 bg-[#12071d] border border-purple-900/50 rounded-2xl max-h-48 overflow-y-auto space-y-1.5 text-left text-xs shadow-xl">
            {events.length === 0 ? (
              <div className="text-center py-3 text-purple-400/70 text-xs">
                No events recorded yet.
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 bg-[#1a0e27] rounded-lg border border-purple-900/40 text-[11px]"
                >
                  <div className="flex items-center justify-between text-[10px] text-purple-400">
                    <span className="font-mono">
                      #{ev.sequenceNumber} · R{ev.roundNumber} · {ev.foot.toUpperCase()}
                    </span>
                    <span className="font-mono text-amber-300 font-bold">
                      +{ev.pointsAwarded}pts / -{ev.timeDeductedSec}s
                    </span>
                  </div>
                  <div className="font-semibold text-purple-100">{ev.targetName}</div>
                  {ev.dialogueLine && (
                    <div className="text-[10px] italic text-purple-200 mt-0.5">
                      &ldquo;{ev.dialogueLine}&rdquo;
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};
