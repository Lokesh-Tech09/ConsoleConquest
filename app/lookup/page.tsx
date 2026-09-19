'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, AlertCircle, ArrowRight, ArrowLeft, Swords, Loader2 } from 'lucide-react';
import { combatSound } from '@/lib/sound';

export default function LookupPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    id: string;
    registrationId: string;
    slotNumber: number | null;
    fullName: string;
    college: string;
    gamerTag: string;
    preferredFighter: string | null;
    status: string;
    waitlistPosition: number | null;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    if (combatSound && combatSound.playSlash) combatSound.playSlash();

    try {
      const res = await fetch(`/api/registration/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || `No challenger found matching "${query}".`);
      } else {
        setResult(data.participant);
        if (combatSound && combatSound.playGong) combatSound.playGong();
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ARENA HOME</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-arena-cardBorder bg-arena-card/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-950/60 text-arena-accent shadow-glow-crimson">
              <Search className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-heading text-3xl font-black uppercase tracking-wider text-white">
              CHECK TOURNAMENT PASS
            </h1>
            <p className="mt-2 text-xs text-slate-400">
              Enter your official Registration ID (e.g. <code className="text-red-400">CC-2026-0017</code>) or registered email address to look up your slot assignment.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="CC-2026-XXXX or player@domain.com"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                className="flex-1 rounded-xl border border-slate-800 bg-black/70 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-700 px-6 py-3 font-heading text-xs font-black tracking-widest text-white shadow-glow-crimson hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>LOOKUP PASS</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/80 p-4 text-xs font-semibold text-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="font-bold">RECORD NOT FOUND</p>
                <p className="mt-0.5 text-red-300">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8 overflow-hidden rounded-xl border border-red-500/40 bg-black/60 p-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-heading text-xs font-black uppercase text-red-400">
                  {result.registrationId}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                    result.status === 'CHECKED-IN'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : result.status === 'REGISTERED'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800'
                      : result.status === 'WAITLISTED'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {result.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">FIGHTER NAME</span>
                  <span className="font-heading text-lg font-black text-white">{result.fullName}</span>
                  <span className="block text-red-400 font-bold">{result.gamerTag}</span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">ASSIGNED SEED</span>
                  <span className="font-heading text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    {result.slotNumber
                      ? `SLOT #${String(result.slotNumber).padStart(3, '0')}`
                      : `WAITLIST #${result.waitlistPosition}`}
                  </span>
                  <span className="block text-slate-400 text-[11px]">{result.preferredFighter || 'Scorpion'}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-4 flex justify-end">
                <Link
                  href={`/confirmation/${encodeURIComponent(result.registrationId)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/80 bg-red-900/60 px-4 py-2 font-heading text-xs font-bold text-white shadow-glow-crimson hover:bg-red-800"
                >
                  <span>VIEW FULL PASS & QR CODE</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
