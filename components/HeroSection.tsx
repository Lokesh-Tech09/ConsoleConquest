'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, Trophy, Calendar, Gamepad2, ShieldAlert, Sparkles, ChevronRight, Play } from 'lucide-react';
import SlotCounter from './SlotCounter';
import { EVENT_CONFIG } from '@/lib/config';
import { combatSound } from '@/lib/sound';

interface HeroSectionProps {
  onReplayIntro?: () => void;
}

export default function HeroSection({ onReplayIntro }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(EVENT_CONFIG.EVENT_DATE).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCtaClick = () => {
    if (combatSound && combatSound.playSlash) {
      combatSound.playSlash();
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-20 lg:pt-10 lg:pb-28">
      {/* Radial red and amber spotlight in background */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[550px] w-[900px] rounded-full bg-gradient-to-b from-red-600/20 via-amber-600/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Institution & Fest Pill */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1.5 shadow-glow-crimson backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-arena-accent animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-widest text-red-300">
                AISSMS COE • DEPT. OF AIML
              </span>
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              {EVENT_CONFIG.FESTIVAL_NAME}
            </span>
          </div>

          {/* Featured Mortal Kombat 11 Visual Emblem */}
          <div className="relative mt-6 mb-4 flex items-center justify-center w-full">
            <div className="relative w-[75vw] max-w-[320px] md:max-w-[360px] h-[320px] sm:h-[380px] md:h-[420px] transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/images/mk11-hero.png"
                alt="Mortal Kombat 11 Scorpion - Official tournament champion combatant artwork"
                fill
                priority
                sizes="(max-width: 768px) 75vw, 360px"
                className="object-contain filter drop-shadow-[0_10px_35px_rgba(245,158,11,0.45)] animate-subtle-breathe"
              />
            </div>
          </div>

          {/* Main Titles */}
          <h1 className="mt-2 font-heading text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-[0_4px_25px_rgba(225,29,72,0.4)]">
            CONSOLE CONQUEST
          </h1>
          <p className="mt-2 font-heading text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-arena-accent to-amber-400 sm:text-2xl">
            MORTAL KOMBAT 11 • 1V1 TOURNAMENT
          </p>

          <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            &ldquo;{EVENT_CONFIG.TAGLINE}&rdquo;
            <br />
            <strong>128 Contenders • 4 Symmetrical Pools of 32 • Zero Byes • PlayStation 5 Local Versus Mode</strong>
          </p>

          {/* Key Event Badges Grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-3xl w-full">
            <div className="rounded-lg border border-arena-cardBorder bg-arena-card/80 p-3 backdrop-blur-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">VENUE</span>
              <span className="mt-1 block font-heading text-sm font-black text-white">{EVENT_CONFIG.VENUE}</span>
            </div>
            <div className="rounded-lg border border-arena-cardBorder bg-arena-card/80 p-3 backdrop-blur-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">DATE & TIME</span>
              <span className="mt-1 block font-heading text-xs font-black text-white">29 & 30 SEPT • 9:00 AM</span>
            </div>
            <div className="rounded-lg border border-arena-cardBorder bg-arena-card/80 p-3 backdrop-blur-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">ENTRY FEE</span>
              <span className="mt-1 block font-heading text-sm font-black text-emerald-400">{EVENT_CONFIG.ENTRY_FEE}</span>
            </div>
            <div className="rounded-lg border border-arena-cardBorder bg-arena-card/80 p-3 backdrop-blur-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">REWARDS POOL</span>
              <span className="mt-1 block font-heading text-sm font-black text-amber-400">{EVENT_CONFIG.PRIZE_POOL_TOTAL}</span>
            </div>
          </div>

          {/* Point 20: Single Dominant Call to Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              prefetch={true}
              onClick={handleCtaClick}
              id="hero-register-cta-btn"
              className="group relative flex w-full sm:w-auto min-h-[52px] items-center justify-center gap-3 overflow-hidden rounded-xl border border-red-500 bg-gradient-to-r from-red-800 via-arena-accent to-red-700 px-8 py-4 font-heading text-base font-black tracking-widest text-white shadow-glow-crimson transition-all duration-100 hover:from-red-700 hover:to-orange-600 hover:shadow-[0_0_35px_rgba(225,29,72,0.9)] active:scale-95 cursor-pointer touch-manipulation"
            >
              <span>ENTER THE ARENA — REGISTER (₹100)</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/bracket"
              prefetch={true}
              onClick={handleCtaClick}
              className="flex w-full sm:w-auto min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-4 font-heading text-base font-bold tracking-widest text-slate-200 transition-all duration-100 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-95 cursor-pointer touch-manipulation"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>VIEW TOURNAMENT</span>
            </Link>

            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-black/50 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-amber-500/50 hover:text-amber-300 hover:bg-black/80"
                title="Replay cinematic opening sequence"
              >
                <Play className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>REPLAY INTRO</span>
              </button>
            )}
          </div>

          {/* Countdown Clock (Points 12, 13) */}
          <div className="mt-10 rounded-xl border border-arena-cardBorder/80 bg-arena-dark/80 px-6 py-4 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
              BATTLE COMMENCES IN
            </div>
            <div className="flex items-center gap-3 sm:gap-6 font-heading font-black text-white">
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl text-red-400">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300">Days</span>
              </div>
              <span className="text-xl text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl text-red-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300">Hours</span>
              </div>
              <span className="text-xl text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl text-red-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300">Mins</span>
              </div>
              <span className="text-xl text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl text-orange-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300">Secs</span>
              </div>
            </div>
          </div>

          {/* Embedded Real-time Slot Counter Card */}
          <div className="mt-12 w-full max-w-2xl">
            <SlotCounter />
          </div>
        </div>
      </div>
    </section>
  );
}
