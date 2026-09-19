'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Flame, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { TournamentStatus } from '@/lib/types';

interface SlotCounterProps {
  initialStatus?: TournamentStatus | null;
  compact?: boolean;
}

export default function SlotCounter({ initialStatus, compact = false }: SlotCounterProps) {
  const [status, setStatus] = useState<TournamentStatus | null>(initialStatus || null);
  const [loading, setLoading] = useState(!initialStatus);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/tournament/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // Keep existing data if offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Polling every 15 seconds (prevents SQLite lockup & UI thread contention)
    const interval = setInterval(fetchStatus, 15000);

    // Instant local event reflection whenever registration occurs
    const handleTournamentUpdate = () => {
      fetchStatus();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tournament_updated_at') {
        fetchStatus();
      }
    };

    window.addEventListener('tournament-updated', handleTournamentUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('tournament-updated', handleTournamentUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalSlots = status?.maxSlots || 128;
  const registeredCount = status?.registeredCount || 0;
  const availableSlots = Math.max(0, totalSlots - registeredCount);
  const percentage = Math.min(100, Math.round((registeredCount / totalSlots) * 100));
  const isFull = availableSlots === 0;
  const isClosed = status?.isRegistrationOpen === false;

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-arena-cardBorder bg-arena-card/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <Users className="h-4 w-4 text-arena-accent" />
          <span>{registeredCount} / {totalSlots} REGISTERED</span>
        </div>
        <span className="text-slate-600">•</span>
        <span className={isFull ? 'font-bold text-amber-500' : 'font-bold text-emerald-400'}>
          {isFull ? 'WAITLIST OPEN' : `${availableSlots} SLOTS LEFT`}
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-arena-cardBorder bg-gradient-to-b from-arena-card to-arena-dark/95 p-6 shadow-2xl backdrop-blur-md">
      {/* Background ambient accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-red-600/10 blur-3xl" />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-400">
              LIVE TOURNAMENT CAPACITY
            </span>
            <button
              onClick={fetchStatus}
              title="Refresh live slot counts"
              className="ml-1 text-slate-500 hover:text-slate-300"
              aria-label="Refresh slot count"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin text-arena-accent' : ''}`} />
            </button>
          </div>
          <h3 className="mt-1 font-heading text-2xl font-black tracking-wider text-white">
            {registeredCount} <span className="text-slate-500">/</span> {totalSlots}{' '}
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              PLAYERS CLAIMED
            </span>
          </h3>
        </div>

        {/* Status Badge */}
        <div>
          {isClosed ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-800 bg-red-950/70 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-red-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              REGISTRATION CLOSED
            </span>
          ) : isFull ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-800 bg-amber-950/70 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
              <Flame className="h-3.5 w-3.5" />
              SLOTS FULL • WAITLIST ACTIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/80 bg-emerald-950/60 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 shadow-glow-crimson">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {availableSlots} SLOTS AVAILABLE
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold tracking-wider">
          <span className="text-slate-400">SLOT FILL LEVEL</span>
          <span className={isFull ? 'text-amber-400 font-extrabold' : 'text-red-400 font-extrabold'}>
            {percentage}% OCCUPIED
          </span>
        </div>
        <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-900/90 border border-slate-800/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-700 via-arena-accent to-orange-500 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Quick summary line */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-arena-cardBorder/50 pt-3 text-xs text-slate-400">
        <span>
          {isFull ? (
            <strong className="text-amber-400 font-bold">All {totalSlots} tournament bracket slots are occupied.</strong>
          ) : (
            <>
              Next available contender receives{' '}
              <strong className="text-slate-200 font-bold">SLOT #{String(registeredCount + 1).padStart(3, '0')}</strong>
              {status?.waitlistEnabled ? ' (Registration open)' : ''}.
            </>
          )}
        </span>
        <Link
          href="/register"
          className="font-bold text-red-400 hover:text-red-300 hover:underline"
        >
          {isFull ? 'Join Waitlist →' : 'Claim Slot Now →'}
        </Link>
      </div>
    </div>
  );
}
