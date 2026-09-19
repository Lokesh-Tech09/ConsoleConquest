import React from 'react';
import { OFFICIAL_RULES, MATCH_FORMAT_SETTINGS, EVENT_CONFIG } from '@/lib/config';
import { ScrollText, ShieldAlert, CheckCircle2, Phone, Award, UserCheck, Flame } from 'lucide-react';

export default function RulesSection() {
  return (
    <section className="relative py-16 border-t border-arena-cardBorder/60 bg-arena-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-arena-accent">
            <ScrollText className="h-3.5 w-3.5" />
            {EVENT_CONFIG.INSTITUTION_NAME} • {EVENT_CONFIG.DEPARTMENT}
          </span>
          <h2 className="mt-2 font-heading text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">
            OFFICIAL TOURNAMENT RULE BOOK & STRUCTURE
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            21st Engineering Today-2026 • Console Conquest (Mortal Kombat 11 1v1 Championship)
          </p>
        </div>

        {/* 1. Official 12 Rules & Regulations Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-heading text-xl font-black uppercase tracking-wider text-white">
              RULES & REGULATIONS FOR THE EVENT
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {OFFICIAL_RULES.map((rule) => (
              <div
                key={rule.id}
                className="relative overflow-hidden rounded-xl border border-arena-cardBorder bg-arena-card/80 p-5 backdrop-blur-sm transition-all hover:border-red-500/50 hover:bg-arena-card"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-500/40 bg-red-950/60 font-heading font-black text-xs text-arena-accent shadow-glow-crimson">
                    {String(rule.id).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-black text-white">
                      {rule.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                      {rule.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Tournament Structure (4 Symmetrical Pools of 32) */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-5 w-5 text-amber-400" />
            <h3 className="font-heading text-xl font-black uppercase tracking-wider text-white">
              TOURNAMENT STRUCTURE (128 CONTENDERS → 4 POOLS)
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-arena-cardBorder bg-black/50">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-red-950/30 text-[10px] font-black uppercase tracking-wider text-red-300">
                <tr>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Players</th>
                  <th className="px-4 py-3">Matches & Format Progression</th>
                  <th className="px-4 py-3">Advancement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {MATCH_FORMAT_SETTINGS.stageProgression.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-heading font-black text-white">{row.stage}</td>
                    <td className="px-4 py-3 text-red-400 font-bold">{row.players}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">{row.format}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{row.advancement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Pill Banner */}
          <div className="mt-4 rounded-xl border border-purple-500/40 bg-purple-950/20 p-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-heading font-bold text-purple-200">
                128 Registered Contenders → 4 Symmetrical Pools of 32 → 4 Pool Champions → Semifinals → Grand Final & 3rd-Place Match → 1st, 2nd, and 3rd Podium Decided.
              </span>
              <span className="shrink-0 rounded bg-purple-900/60 border border-purple-600/50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-purple-200">
                ZERO AUTOMATIC BYES
              </span>
            </div>
          </div>
        </div>

        {/* 3. Rewards & Series Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rewards Card */}
          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
              <Award className="h-4 w-4" />
              <span>EXCITING TOURNAMENT REWARDS</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-800 bg-black/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">TOTAL PRIZE POOL</span>
                <span className="mt-1 block font-heading text-xl font-black text-amber-400">{EVENT_CONFIG.PRIZE_POOL_TOTAL}</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-black/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">1ST PRIZE (CHAMPION)</span>
                <span className="mt-1 block font-heading text-xl font-black text-white">{EVENT_CONFIG.FIRST_PRIZE}</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-black/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">2ND PRIZE (RUNNER-UP)</span>
                <span className="mt-1 block font-heading text-xl font-black text-slate-200">{EVENT_CONFIG.SECOND_PRIZE}</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-black/60 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">ALL PARTICIPANTS</span>
                <span className="mt-1 block text-xs font-bold text-emerald-400">Official Certificate</span>
              </div>
            </div>
          </div>

          {/* Console & Match Settings */}
          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-400">
              <ShieldAlert className="h-4 w-4" />
              <span>CONSOLE & MATCH SETTINGS</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              {MATCH_FORMAT_SETTINGS.consoleSettings.map((cs, idx) => (
                <li key={idx} className="flex flex-col border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white">{cs.label}:</span>
                  <span className="text-slate-400 mt-0.5">{cs.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Event Committee & Coordinators */}
        <div className="rounded-2xl border border-arena-cardBorder bg-gradient-to-r from-arena-card via-black to-arena-card p-6 sm:p-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            EVENT COMMITTEE • 21ST ENGINEERING TODAY-2026
          </span>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-lg border border-slate-800 bg-black/60 p-4">
              <div>
                <span className="block text-[10px] text-red-400 font-bold uppercase">EVENT COORDINATOR</span>
                <span className="mt-1 block font-heading text-sm font-black text-white">Lokesh Joshi</span>
                <a href="tel:7558610917" className="mt-1 text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                  <Phone className="h-3 w-3 text-red-400" />
                  +91 7558610917
                </a>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="block text-[10px] text-red-400 font-bold uppercase">EVENT CO-COORDINATOR</span>
                <span className="mt-1 block font-heading text-sm font-black text-white">Pratosh Jadhar</span>
                <a href="tel:9112157569" className="mt-1 text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                  <Phone className="h-3 w-3 text-red-400" />
                  +91 9112157569
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-black/60 p-4">
              <span className="block text-[10px] text-red-400 font-bold uppercase">DEPT. JOINT GENERAL SECRETARY</span>
              <span className="mt-1 block font-heading text-sm font-black text-white">Mr. Parth S. Suryawanshi</span>
              <a href="tel:9529425106" className="mt-1 text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                <Phone className="h-3 w-3 text-red-400" />
                +91 9529425106
              </a>
            </div>

            <div className="rounded-lg border border-slate-800 bg-black/60 p-4">
              <span className="block text-[10px] text-red-400 font-bold uppercase">FACULTY / DEPT. ET COORDINATOR</span>
              <span className="mt-1 block font-heading text-sm font-black text-white">Mrs. Rupali S. Saha</span>
              <span className="mt-1 block text-[11px] text-slate-400">Dept. of AIML, AISSMS COE</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-black/60 p-4">
              <span className="block text-[10px] text-red-400 font-bold uppercase">HEAD OF DEPARTMENT</span>
              <span className="mt-1 block font-heading text-sm font-black text-white">Dr. D. M. Ujalambkar</span>
              <span className="mt-1 block text-[11px] text-slate-400">H.O.D. AIML, AISSMS COE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
