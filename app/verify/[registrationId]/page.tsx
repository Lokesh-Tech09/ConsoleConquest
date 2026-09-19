import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Swords, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { EVENT_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { registrationId: string };
}

export default async function VerifyPassPage({ params }: PageProps) {
  const regId = decodeURIComponent(params.registrationId).trim();

  const participant = await prisma.participant.findUnique({
    where: { registrationId: regId },
  });

  if (!participant) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-800 bg-red-950/70 p-8 shadow-2xl">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 font-heading text-2xl font-black text-white">INVALID CREDENTIAL</h2>
          <p className="mt-2 text-xs text-slate-300">
            Registration credential &ldquo;{regId}&rdquo; was not recognized by tournament verification marshals.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-2 text-xs font-bold text-slate-300 hover:text-white"
          >
            ARENA HOME
          </Link>
        </div>
      </div>
    );
  }

  const isCheckedIn = participant.status === 'CHECKED-IN';
  const slotPadded = participant.slotNumber ? String(participant.slotNumber).padStart(3, '0') : null;

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-b from-[#0e1814] via-[#090e0c] to-[#070908] p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.25)] text-center">
          {/* Verification Badge Header */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-glow-gold">
            <ShieldCheck className="h-9 w-9" />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-emerald-300">
            OFFICIAL TOURNAMENT VERIFIED
          </div>

          <h1 className="mt-3 font-heading text-3xl font-black uppercase tracking-wider text-white">
            {EVENT_CONFIG.EVENT_NAME}
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            {EVENT_CONFIG.GAME_NAME} • 1V1 CHAMPIONSHIP
          </p>

          {/* Slot Highlight */}
          <div className="my-6 rounded-xl border border-emerald-500/30 bg-black/60 p-4">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              ALLOCATED TOURNAMENT SEED
            </span>
            <span className="font-heading text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400">
              {participant.slotNumber ? `SLOT ${slotPadded}` : `WAITLIST #${participant.waitlistPosition}`}
            </span>
            <span className="mt-1 block font-mono text-xs font-bold text-slate-400">
              {participant.registrationId}
            </span>
          </div>

          {/* Player Verified Bio */}
          <div className="space-y-3 text-left border-t border-slate-800/80 pt-4 text-xs">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400 font-bold uppercase">PLAYER:</span>
              <span className="font-heading font-black text-white">{participant.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400 font-bold uppercase">GAMER TAG:</span>
              <span className="font-bold text-red-400">{participant.gamerTag}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400 font-bold uppercase">MAIN FIGHTER:</span>
              <span className="font-bold text-slate-200">{participant.preferredFighter || 'Scorpion'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400 font-bold uppercase">COLLEGE:</span>
              <span className="text-slate-300 truncate max-w-[200px]">{participant.college}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400 font-bold uppercase">CHECK-IN STATUS:</span>
              <span
                className={`rounded px-2.5 py-0.5 text-[10px] font-black uppercase ${
                  isCheckedIn
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : 'bg-sky-950 text-sky-300 border border-sky-600'
                }`}
              >
                {participant.status}
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>RETURN TO MAIN PORTAL</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
