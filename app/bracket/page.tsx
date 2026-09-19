import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Swords } from 'lucide-react';
import TournamentBracket from '@/components/TournamentBracket';

export const metadata = {
  title: 'Tournament Bracket | Console Conquest MK11',
  description: 'Live 1v1 Mortal Kombat 11 championship bracket. Track real-time match advancement, player slots, and tournament progress.',
};

export default function BracketPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO ARENA</span>
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-red-500/80 bg-red-900/60 px-4 py-2 font-heading text-xs font-bold text-white shadow-glow-crimson hover:bg-red-800 transition-all"
          >
            CLAIM AN OPEN SLOT
          </Link>
        </div>

        <div className="rounded-2xl border border-arena-cardBorder bg-arena-card/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <TournamentBracket />
        </div>
      </div>
    </div>
  );
}
