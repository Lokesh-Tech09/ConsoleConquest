'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Volume2, VolumeX, Flame, Swords, Sparkles } from 'lucide-react';
import { combatSound } from '@/lib/sound';

interface MortalKombatIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export default function MortalKombatIntro({
  onComplete,
  forcePlay = false,
}: MortalKombatIntroProps) {
  // Start as false so server-rendered and returning visits are never blocked
  const [visible, setVisible] = useState(false);
  const [textPhase, setTextPhase] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const alreadySeen = sessionStorage.getItem('cc_intro_seen');
      if (alreadySeen === 'true' && !forcePlay) {
        setVisible(false);
        if (onComplete) onComplete();
        return;
      }
      // Only show if never seen or force played
      setVisible(true);
      setSoundActive(combatSound?.getSoundState ? combatSound.getSoundState() : false);
    }
    if (combatSound?.playSlash) combatSound.playSlash();

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setTextPhase(1), 350));
    timers.push(setTimeout(() => setTextPhase(2), 1000));
    timers.push(setTimeout(() => setTextPhase(3), 1700));
    timers.push(setTimeout(() => setTextPhase(4), 2400));
    timers.push(setTimeout(() => setShowCTA(true), 2900));
    return () => timers.forEach(clearTimeout);
  }, [forcePlay, onComplete]);

  const finishIntro = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('cc_intro_seen', 'true');
    setVisible(false);
    if (onComplete) onComplete();
  };

  const handleToggleSound = () => {
    if (combatSound?.toggleSound) setSoundActive(combatSound.toggleSound());
  };

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let raf: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });
    const COUNT = W < 768 ? 35 : 55;
    const COLORS = ['#f59e0b', '#ea580c', '#ef4444', '#fbbf24', '#fb923c', '#fcd34d'];
    const embers = Array.from({ length: COUNT }).map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.4 + 0.4),
      a: Math.random() * 0.8 + 0.2,
      da: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const e of embers) {
        e.y += e.vy; e.x += e.vx; e.a += e.da;
        if (e.a > 0.9 || e.a < 0.12) e.da = -e.da;
        if (e.y < -10) { e.y = H + 10; e.x = Math.random() * W; }
        if (e.x < -10) e.x = W + 10;
        if (e.x > W + 10) e.x = -10;

        // High performance: fast arc without shadowBlur
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, e.a));
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#060408] select-none touch-manipulation"
      aria-label="Console Conquest Cinematic Intro"
    >
      {/* === BACKGROUND === */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,#3b0a00_0%,#14060a_45%,#060408_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_60%,rgba(185,28,28,0.18)_0%,transparent_70%)]" />

      {/* Animated volumetric fire glow */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 h-[55vh] w-[55vw] rounded-full bg-gradient-to-br from-amber-700/35 via-red-800/25 to-orange-700/20 blur-[90px] animate-pulse" />

      {/* Canvas for floating embers */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* === CENTER HERO CONTENT === */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl">
        {/* DEPARTMENT & FEST PILL */}
        <div className={`transition-all duration-700 ${textPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-950/60 px-5 py-1.5 shadow-[0_0_20px_rgba(225,29,72,0.4)] backdrop-blur-sm">
            <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.25em] text-red-300">
              Department of Artificial Intelligence &amp; Machine Learning
            </span>
          </div>
          <p className="mt-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-amber-400/90">
            Presents the Flagship Esports Championship of
          </p>
        </div>

        {/* FESTIVAL TITLE */}
        <div className={`mt-2 transition-all duration-700 delay-100 ${textPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <p
            className="font-heading text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-amber-300"
            style={{ textShadow: '0 0 25px rgba(245,158,11,0.8), 0 2px 4px rgba(0,0,0,0.9)' }}
          >
            21st Engineering Today 2026
          </p>
        </div>

        {/* SWORDS CLASH ICON */}
        <div className={`my-4 sm:my-6 transition-all duration-500 ${textPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 border-red-500/80 bg-gradient-to-br from-red-950/90 via-black to-red-950/90 shadow-[0_0_50px_rgba(225,29,72,0.8)]">
            <Swords className="h-8 w-8 sm:h-10 sm:w-10 text-arena-accent animate-pulse" />
          </div>
        </div>

        {/* CONSOLE CONQUEST MAIN TITLE */}
        <div className={`transition-all duration-700 ${textPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <h1
            className="font-heading text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-none"
            style={{
              textShadow: '0 0 40px rgba(225,29,72,0.9), 0 0 80px rgba(225,29,72,0.4), 0 4px 12px rgba(0,0,0,0.95)',
              letterSpacing: '-0.02em',
            }}
          >
            CONSOLE
            <br />
            CONQUEST
          </h1>
        </div>

        {/* MORTAL KOMBAT 11 */}
        <div className={`mt-3 transition-all duration-500 delay-100 ${textPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p
            className="font-heading text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest"
            style={{ color: '#f97316', textShadow: '0 0 30px rgba(249,115,22,0.7), 0 2px 8px rgba(0,0,0,0.9)' }}
          >
            MORTAL <span style={{ color: '#ef4444' }}>KOMBAT</span> 11
          </p>
          <p className="mt-1 font-heading text-sm sm:text-lg font-bold uppercase tracking-[0.3em] text-white/60">
            1V1 TOURNAMENT
          </p>
        </div>

        {/* ENTER THE ARENA badge */}
        <div className={`mt-3 transition-all duration-500 ${textPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/40 px-4 py-1 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              AISSMS COE • ENGINEERING TODAY 2026
            </span>
          </div>
        </div>
      </div>

      {/* === ENTER THE ARENA CTA === */}
      <div
        className={`absolute bottom-24 sm:bottom-32 z-30 flex flex-col items-center gap-3 transition-all duration-500 ${
          showCTA ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="absolute -inset-12 rounded-full bg-red-600/10 blur-3xl animate-pulse pointer-events-none" />

        <Link
          href="/register"
          onClick={finishIntro}
          id="enter-the-arena-btn"
          prefetch={true}
          className="group relative inline-flex items-center gap-3 sm:gap-5 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-red-950 via-black to-red-950 px-8 sm:px-12 py-4 sm:py-5 font-heading text-xl sm:text-3xl font-black uppercase tracking-widest text-white transition-transform duration-75 active:scale-95 hover:border-amber-300 cursor-pointer touch-manipulation"
          style={{
            boxShadow: '0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(225,29,72,0.2)',
            textShadow: '0 0 20px rgba(245,158,11,0.9)',
          }}
        >
          <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400 shrink-0" />
          <span>ENTER THE ARENA</span>
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400 shrink-0 group-hover:translate-x-1.5 transition-transform" />
        </Link>

        <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-400">
          Click to register &amp; enter the tournament
        </p>
      </div>

      {/* === SKIP INTRO === */}
      <button
        onClick={finishIntro}
        id="skip-intro-btn"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-slate-700/80 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-md transition-all active:scale-95 hover:border-red-500 hover:text-white cursor-pointer touch-manipulation min-h-[44px]"
      >
        <span>SKIP INTRO</span>
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Sound Toggle */}
      <button
        onClick={handleToggleSound}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-slate-700/80 bg-black/60 px-3.5 py-2 text-xs font-bold text-slate-200 backdrop-blur-md active:scale-95 hover:text-white cursor-pointer touch-manipulation min-h-[44px]"
        aria-label={soundActive ? 'Mute tournament sound' : 'Unmute tournament sound'}
      >
        {soundActive ? <Volume2 className="h-4 w-4 text-arena-accent" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
        <span className="font-mono text-[10px] uppercase tracking-wider">{soundActive ? 'SOUND ON' : 'MUTED'}</span>
      </button>
    </div>
  );
}