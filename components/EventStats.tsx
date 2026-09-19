import React from 'react';
import { Gamepad2, Swords, Trophy, MapPin, Tag, Clock, Phone, Award } from 'lucide-react';
import { EVENT_CONFIG } from '@/lib/config';

export default function EventStats() {
  const cards = [
    {
      icon: Gamepad2,
      label: 'GAMING PLATFORM & MODE',
      value: EVENT_CONFIG.PLATFORM,
      desc: 'Official PlayStation 5 console setups. Local 1v1 Versus mode with default controllers.',
      accent: 'text-sky-400',
      border: 'hover:border-sky-500/60',
    },
    {
      icon: Swords,
      label: 'TOURNAMENT STRUCTURE',
      value: '128 PLAYERS • 4 POOLS',
      desc: 'Zero automatic byes. 4 symmetrical pools of 32 contenders advancing to the Championship stage.',
      accent: 'text-red-400',
      border: 'hover:border-red-500/60',
    },
    {
      icon: Trophy,
      label: 'EXCITING REWARDS',
      value: EVENT_CONFIG.PRIZE_POOL_TOTAL,
      desc: '1st: ₹5,000/- (Champion) • 2nd: ₹3,000/- (Runner-up) • Participation certificates for all.',
      accent: 'text-amber-400',
      border: 'hover:border-amber-500/60',
    },
    {
      icon: MapPin,
      label: 'DAY, DATE & VENUE',
      value: 'ROOM NO. 340',
      desc: `${EVENT_CONFIG.EVENT_DATE_DISPLAY}. In ${EVENT_CONFIG.INSTITUTION_NAME}.`,
      accent: 'text-emerald-400',
      border: 'hover:border-emerald-500/60',
    },
  ];

  return (
    <section id="battle" className="relative py-16 border-t border-arena-cardBorder/60 bg-arena-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-red-400">
            <Swords className="h-3 w-3" />
            OFFICIAL EVENT SPECIFICATIONS
          </div>
          <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">
            THE BATTLE
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            &ldquo;CONSOLE CONQUEST is a 1v1 gaming championship where players showcase their skills, strategy and reflexes in an exciting knockout tournament on PlayStation 5. Compete, outplay and conquer to be the ultimate champion.&rdquo;
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-xl border border-arena-cardBorder bg-arena-card/70 p-6 backdrop-blur-sm transition-all duration-300 ${item.border} hover:-translate-y-1 hover:bg-arena-cardHover`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/80">
                  <Icon className={`h-6 w-6 ${item.accent}`} />
                </div>
                <span className="mt-4 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {item.label}
                </span>
                <h3 className="mt-1 font-heading text-base font-black text-white">
                  {item.value}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Details Bar */}
        <div className="mt-8 rounded-xl border border-slate-800/80 bg-black/50 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">ENTRY FEE</span>
              <span className="font-heading font-black text-emerald-400">{EVENT_CONFIG.ENTRY_FEE}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">ROUND TIME</span>
              <span className="font-heading font-black text-white">90 Seconds / Round</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">EVENT COORDINATOR</span>
              <span className="font-heading font-black text-red-400">Lokesh Joshi (7558610917)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">JOINT GEN. SECRETARY</span>
              <span className="font-heading font-black text-slate-200">Parth S. (9529425106)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
