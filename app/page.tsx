'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Swords, Trophy, ShieldCheck, Flame, ChevronRight } from 'lucide-react';
import MortalKombatIntro from '@/components/MortalKombatIntro';
import HeroSection from '@/components/HeroSection';
import EventStats from '@/components/EventStats';
import RosterPreview from '@/components/RosterPreview';
import RulesSection from '@/components/RulesSection';

export default function HomePage() {
  const [replayIntro, setReplayIntro] = useState(false);

  return (
    <>
      {/* 0. Full-Screen Cinematic Mortal Kombat 11 Introduction */}
      <MortalKombatIntro
        forcePlay={replayIntro}
        onComplete={() => setReplayIntro(false)}
      />

      <div className="flex flex-col gap-12 sm:gap-16">
        {/* 1. Hero Section with Live Slot Counter & Replay Trigger */}
        <HeroSection onReplayIntro={() => setReplayIntro(true)} />

        {/* 2. The Battle - Event Specifications */}
        <EventStats />

        {/* 3. Mortal Kombat 11 Fighter Roster Preview */}
        <RosterPreview />

        {/* 4. Official Tournament Rules & Handbook */}
        <RulesSection />

        {/* 5. Bottom Call to Action Banner */}
        <section className="relative py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/50 bg-gradient-to-r from-red-950/90 via-black to-red-950/90 p-8 sm:p-12 text-center shadow-[0_0_60px_rgba(225,29,72,0.4)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0,transparent_100%)]" />

              <div className="relative z-10 flex flex-col items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-900/40 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-300">
                  <Flame className="h-4 w-4 text-amber-400" />
                  LIMITED SLOTS REMAINING
                </span>

                <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-wider text-white sm:text-5xl">
                  ARE YOU READY TO TEST YOUR MIGHT?
                </h2>

                <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
                  Claim your numbered tournament slot now. 128 Contenders across 4 Symmetrical Pools of 32 with zero automatic byes.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl border border-red-500 bg-gradient-to-r from-red-700 via-arena-accent to-red-600 px-8 py-4 font-heading text-base font-black tracking-widest text-white shadow-glow-crimson transition-all duration-300 hover:scale-[1.03]"
                  >
                    <span>ENTER THE ARENA — REGISTER (₹100)</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/lookup"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-4 font-heading text-base font-bold tracking-widest text-slate-300 hover:text-white"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>CHECK MY PASS</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
