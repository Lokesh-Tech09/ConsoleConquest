import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Swords, Home, Trophy, Search, ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Realm Not Found | Console Conquest MK11',
  description: 'The requested tournament arena page could not be located in Outworld or Earthrealm.',
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-16">
      {/* Red ambient spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-red-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-lg text-center">
        {/* MK Emblem Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-red-500/60 bg-gradient-to-br from-red-950/80 via-black to-red-950/80 shadow-[0_0_40px_rgba(225,29,72,0.5)]">
          <ShieldAlert className="h-10 w-10 text-red-400 animate-pulse" />
        </div>

        <span className="mt-6 inline-block rounded-full border border-red-500/40 bg-red-950/50 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-400">
          FATALITY • CODE 404
        </span>

        <h1 className="mt-3 font-heading text-4xl font-black uppercase tracking-wider text-white sm:text-6xl">
          REALM NOT FOUND
        </h1>

        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
          The arena you seek has been banished to the Netherrealm. The URL may have been mistyped or the combat page has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-red-500 bg-gradient-to-r from-red-700 via-arena-accent to-red-600 px-6 py-3.5 font-heading text-sm font-black uppercase tracking-wider text-white shadow-glow-crimson transition-all hover:scale-105 active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>RETURN TO ARENA</span>
          </Link>

          <Link
            href="/register"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-slate-200 transition-all hover:border-slate-500 hover:text-white"
          >
            <Swords className="h-4 w-4 text-red-400" />
            <span>REGISTER NOW</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 rounded-xl border border-slate-800/80 bg-black/50 p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Tournament Quick Navigation
          </span>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/bracket" className="text-slate-300 hover:text-red-400 transition-colors flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Live Bracket</span>
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/lookup" className="text-slate-300 hover:text-red-400 transition-colors flex items-center gap-1">
              <Search className="h-3.5 w-3.5 text-emerald-400" />
              <span>Check Pass</span>
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/rules" className="text-slate-300 hover:text-red-400 transition-colors">
              Rule Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
