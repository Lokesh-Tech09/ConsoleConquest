'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Swords, Trophy, ShieldCheck, Printer, ArrowLeft, Share2, Sparkles, MapPin, Calendar, Tag, Phone } from 'lucide-react';
import QRCodeCard from './QRCodeCard';
import { ParticipantData } from '@/lib/types';
import { EVENT_CONFIG } from '@/lib/config';
import { combatSound } from '@/lib/sound';

interface ConfirmationCardProps {
  participant: ParticipantData;
}

export default function ConfirmationCard({ participant }: ConfirmationCardProps) {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReveal(true);
      if (combatSound && combatSound.playSlotReveal) {
        combatSound.playSlotReveal();
      }
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f97316', '#eab308', '#ffffff'],
        });
      } catch {}
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isWaitlisted = participant.status === 'WAITLISTED';
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${encodeURIComponent(participant.registrationId)}`
    : `https://consoleconquest.esports/verify/${participant.registrationId}`;

  const slotPadded = participant.slotNumber
    ? String(participant.slotNumber).padStart(3, '0')
    : null;

  // Derive pool
  const pool = participant.pool || (
    participant.slotNumber
      ? participant.slotNumber <= 32 ? 'A' : participant.slotNumber <= 64 ? 'B' : participant.slotNumber <= 96 ? 'C' : 'D'
      : 'A'
  );

  return (
    <div className="relative mx-auto max-w-xl">
      {/* Top Climax Announcement */}
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-300 shadow-glow-crimson animate-pulse">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          {isWaitlisted ? 'WAITLIST REGISTERED' : `SLOT CLAIMED • POOL ${pool}`}
        </span>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase tracking-wider text-white sm:text-5xl">
          PLAYER READY FOR KOMBAT
        </h1>
        <p className="mt-1.5 text-xs text-slate-400">
          Save or screenshot this official tournament pass. Present this QR badge during desk check-in.
        </p>
      </div>

      {/* Official Combat Pass Card */}
      <div
        id="printable-pass"
        className="relative overflow-hidden rounded-2xl border-2 border-red-500/60 bg-gradient-to-b from-[#14121a] via-[#0b0c10] to-[#120f18] p-6 sm:p-8 shadow-[0_0_50px_rgba(225,29,72,0.35)]"
      >
        {/* Pass Screws */}
        <div className="absolute top-3 left-3 h-2 w-2 rounded-full border border-slate-600 bg-slate-400 opacity-60" />
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full border border-slate-600 bg-slate-400 opacity-60" />
        <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full border border-slate-600 bg-slate-400 opacity-60" />
        <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full border border-slate-600 bg-slate-400 opacity-60" />

        {/* Pass Header */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-arena-accent bg-red-950/60 text-arena-accent shadow-glow-crimson">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-base font-black tracking-wider text-white block">
                CONSOLE CONQUEST
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-red-400">
                AISSMS COE • 21ST ENGINEERING TODAY-2026
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              BRACKET POOL
            </span>
            <span className="font-heading text-sm font-black text-amber-400">
              POOL {pool}
            </span>
          </div>
        </div>

        {/* Dramatic Slot Number Highlight */}
        <div className="my-6 rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-black to-red-950/40 p-5 text-center shadow-inner">
          <span className="block text-xs font-black uppercase tracking-widest text-red-400">
            {isWaitlisted ? 'WAITLIST POSITION' : `OFFICIAL 128-PLAYER TOURNAMENT SEED (POOL ${pool})`}
          </span>
          <div className="mt-1 font-heading text-6xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-red-200 to-red-500 drop-shadow-[0_0_25px_rgba(225,29,72,0.8)]">
            {reveal ? (
              isWaitlisted ? `#${participant.waitlistPosition}` : `SLOT ${slotPadded}`
            ) : (
              '...'
            )}
          </div>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
            REGISTRATION ID: <strong className="text-white font-mono">{participant.registrationId}</strong>
          </span>
        </div>

        {/* Participant Details & QR Code Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 items-center border-t border-slate-800/80 pt-5">
          <div className="sm:col-span-2 space-y-3">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">CHALLENGER NAME</span>
              <span className="font-heading text-lg font-black text-white">{participant.fullName}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">GAMER TAG / ALIAS</span>
              <span className="font-heading text-base font-bold text-red-400">{participant.gamerTag}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">CHOSEN FIGHTER</span>
                <span className="text-xs font-bold text-slate-200">{participant.preferredFighter || 'Scorpion'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">STATUS</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  {participant.status}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">COLLEGE / INSTITUTION</span>
              <span className="text-xs text-slate-300 truncate block">{participant.college}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center sm:justify-end">
            <QRCodeCard value={verificationUrl} size={135} />
          </div>
        </div>

        {/* Official Event Metadata on Card */}
        <div className="mt-6 border-t border-slate-800 pt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div>
            <span className="font-bold text-slate-300">Venue:</span> {EVENT_CONFIG.VENUE}
          </div>
          <div>
            <span className="font-bold text-slate-300">Dates:</span> 29 & 30 Sept 2026, 9:00 AM
          </div>
          <div>
            <span className="font-bold text-slate-300">Entry Fee:</span> {EVENT_CONFIG.ENTRY_FEE}
          </div>
          <div>
            <span className="font-bold text-slate-300">Coordinator:</span> Lokesh Joshi (7558610917)
          </div>
        </div>

        {/* Card Footer Notice */}
        <div className="mt-3 border-t border-slate-800/80 pt-2 text-center text-[9px] text-slate-500">
          Strict 2-minute grace period enforced. Every player competes from Round 1. Zero automatic byes.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handlePrint}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-red-500/80 bg-red-900/60 px-6 py-3 font-heading text-sm font-bold tracking-wider text-white shadow-glow-crimson hover:bg-red-800 transition-all active:scale-95"
        >
          <Printer className="h-4 w-4" />
          <span>PRINT / SAVE CREDENTIAL</span>
        </button>

        <Link
          href="/bracket"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-6 py-3 font-heading text-sm font-bold tracking-wider text-slate-200 hover:border-slate-500 hover:text-white transition-all"
        >
          <Trophy className="h-4 w-4 text-amber-400" />
          <span>VIEW 128-PLAYER BRACKET</span>
        </Link>

        <Link
          href="/"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-800 bg-black/40 px-5 py-3 text-xs font-bold text-slate-400 hover:text-slate-200 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>HOME</span>
        </Link>
      </div>
    </div>
  );
}
