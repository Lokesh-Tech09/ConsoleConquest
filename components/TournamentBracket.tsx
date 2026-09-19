'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Swords, ShieldCheck, Flame, RefreshCw, Layers } from 'lucide-react';
import { MatchData } from '@/lib/types';
import { combatSound } from '@/lib/sound';

export default function TournamentBracket() {
  const [selectedPool, setSelectedPool] = useState<string>('A');
  const [byPool, setByPool] = useState<Record<string, Record<number, MatchData[]>>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBracket = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/bracket');
      if (res.ok) {
        const data = await res.json();
        setByPool(data.byPool || {});
      }
    } catch {
      // Keep existing data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBracket();

    // Polling every 15s for tournament sync (prevents DB flood & lag)
    const interval = setInterval(fetchBracket, 15000);

    // Instant local event update whenever any registration occurs
    const handleTournamentUpdate = () => {
      fetchBracket();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tournament_updated_at') {
        fetchBracket();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBracket();
      }
    };

    window.addEventListener('tournament-updated', handleTournamentUpdate);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('tournament-updated', handleTournamentUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const poolOptions = [
    { key: 'A', name: 'POOL A', slots: 'Slots 001 - 032' },
    { key: 'B', name: 'POOL B', slots: 'Slots 033 - 064' },
    { key: 'C', name: 'POOL C', slots: 'Slots 065 - 096' },
    { key: 'D', name: 'POOL D', slots: 'Slots 097 - 128' },
    { key: 'FINALS', name: 'CHAMPIONSHIP STAGE', slots: 'Final 4 Pool Champions' },
  ];

  const poolRoundNames: Record<string, Record<number, string>> = {
    A: { 1: 'ROUND OF 32 (Bo1)', 2: 'ROUND OF 16 (Bo1)', 3: 'QUARTERFINALS (Bo1)', 4: 'SEMIFINALS (Bo1)', 5: 'GROUP FINAL (Bo3)' },
    B: { 1: 'ROUND OF 32 (Bo1)', 2: 'ROUND OF 16 (Bo1)', 3: 'QUARTERFINALS (Bo1)', 4: 'SEMIFINALS (Bo1)', 5: 'GROUP FINAL (Bo3)' },
    C: { 1: 'ROUND OF 32 (Bo1)', 2: 'ROUND OF 16 (Bo1)', 3: 'QUARTERFINALS (Bo1)', 4: 'SEMIFINALS (Bo1)', 5: 'GROUP FINAL (Bo3)' },
    D: { 1: 'ROUND OF 32 (Bo1)', 2: 'ROUND OF 16 (Bo1)', 3: 'QUARTERFINALS (Bo1)', 4: 'SEMIFINALS (Bo1)', 5: 'GROUP FINAL (Bo3)' },
    FINALS: { 1: 'CHAMPIONSHIP SEMIFINALS (Bo3)', 2: 'GRAND FINAL (Bo5) & 3RD PLACE (Bo3)' },
  };

  const handlePoolChange = (poolKey: string) => {
    setSelectedPool(poolKey);
    if (combatSound && combatSound.playSlash) combatSound.playSlash();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-red-500 font-heading text-lg font-bold">
          <Swords className="h-6 w-6 animate-spin" />
          <span>LOADING 128-PLAYER TOURNAMENT BRACKET...</span>
        </div>
      </div>
    );
  }

  const currentPoolRounds = byPool[selectedPool] || {};
  const roundNumbers = Object.keys(currentPoolRounds).map(Number).sort((a, b) => a - b);

  return (
    <div className="relative">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-arena-accent">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>AISSMS COE • 21ST ENGINEERING TODAY-2026</span>
          </div>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-black uppercase text-white">
            128-PLAYER CHAMPIONSHIP BRACKET
          </h2>
          <p className="text-xs text-slate-400">
            4 Symmetrical Pools of 32 → 4 Pool Champions → Semifinals → Grand Final & 3rd Place
          </p>
        </div>

        <button
          onClick={fetchBracket}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-arena-accent' : ''}`} />
          <span>REFRESH BRACKET</span>
        </button>
      </div>

      {/* Pool Selector Tabs */}
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {poolOptions.map((opt) => {
          const isSelected = selectedPool === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => handlePoolChange(opt.key)}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-75 cursor-pointer touch-manipulation active:scale-95 ${
                isSelected
                  ? 'border-red-500 bg-red-950/70 text-white shadow-glow-crimson scale-[1.02]'
                  : 'border-slate-800 bg-black/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="font-heading text-xs font-black tracking-wider uppercase">
                {opt.name}
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                {opt.slots}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bracket Tree */}
      <div className="overflow-x-auto pb-8 pt-2">
        {roundNumbers.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No matches generated for this stage yet. Check back during live tournament execution.
          </div>
        ) : (
          <div className="flex gap-8 min-w-[950px] items-start">
            {roundNumbers.map((rNum) => {
              const matches = currentPoolRounds[rNum] || [];
              const roundTitle =
                poolRoundNames[selectedPool]?.[rNum] || `ROUND ${rNum}`;

              return (
                <div key={rNum} className="flex-1 min-w-[270px]">
                  {/* Round Header */}
                  <div className="mb-4 rounded-lg border border-arena-cardBorder bg-arena-card/90 p-2.5 text-center">
                    <span className="font-heading text-xs font-black uppercase tracking-widest text-red-400">
                      {roundTitle}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-bold mt-0.5">
                      {matches.length} {matches.length === 1 ? 'MATCH' : 'MATCHES'}
                    </span>
                  </div>

                  {/* Match Cards List */}
                  <div className="flex flex-col gap-4">
                    {matches.map((m) => {
                      const isP1Winner = m.winnerSlot !== null && m.winnerSlot === m.player1Slot;
                      const isP2Winner = m.winnerSlot !== null && m.winnerSlot === m.player2Slot;

                      return (
                        <div
                          key={m.id}
                          className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                            m.status === 'LIVE'
                              ? 'border-red-500 bg-red-950/20 shadow-glow-crimson'
                              : m.status === 'COMPLETED'
                              ? 'border-slate-800 bg-arena-card/70'
                              : 'border-slate-800/80 bg-arena-dark/90 hover:border-slate-700'
                          }`}
                        >
                          {/* Match Header info */}
                          <div className="flex items-center justify-between border-b border-slate-800/80 bg-black/40 px-3 py-1 text-[10px] font-bold text-slate-400">
                            <span>MATCH #{m.matchNumber}</span>
                            <span
                              className={
                                m.status === 'LIVE'
                                  ? 'text-red-400 font-black animate-pulse'
                                  : m.status === 'COMPLETED'
                                  ? 'text-slate-400 font-bold'
                                  : 'text-slate-500'
                              }
                            >
                              {m.status}
                            </span>
                          </div>

                          {/* Player 1 Row */}
                          <div
                            className={`flex items-center justify-between px-3 py-2.5 border-b border-slate-900 ${
                              isP1Winner ? 'bg-red-950/50 text-white font-black' : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400">
                                {m.player1Slot ? `#${String(m.player1Slot).padStart(3, '0')}` : '??'}
                              </span>
                              <div className="truncate">
                                <span className="block font-heading text-xs font-black truncate">
                                  {m.player1Name || 'Open Contender Slot'}
                                </span>
                                {m.player1Fighter && (
                                  <span className="block text-[9px] text-red-400 font-bold">
                                    {m.player1Fighter}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span
                              className={`font-heading text-sm font-black ${
                                isP1Winner ? 'text-red-400' : 'text-slate-400'
                              }`}
                            >
                              {m.score1}
                            </span>
                          </div>

                          {/* Player 2 Row */}
                          <div
                            className={`flex items-center justify-between px-3 py-2.5 ${
                              isP2Winner ? 'bg-red-950/50 text-white font-black' : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400">
                                {m.player2Slot ? `#${String(m.player2Slot).padStart(3, '0')}` : '??'}
                              </span>
                              <div className="truncate">
                                <span className="block font-heading text-xs font-black truncate">
                                  {m.player2Name || 'Open Contender Slot'}
                                </span>
                                {m.player2Fighter && (
                                  <span className="block text-[9px] text-red-400 font-bold">
                                    {m.player2Fighter}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span
                              className={`font-heading text-sm font-black ${
                                isP2Winner ? 'text-red-400' : 'text-slate-400'
                              }`}
                            >
                              {m.score2}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
