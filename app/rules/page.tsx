import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ScrollText, Swords, AlertOctagon } from 'lucide-react';
import RulesSection from '@/components/RulesSection';

export const metadata = {
  title: 'Official Rules & Guidelines | Console Conquest MK11',
  description: 'Official competition rules, controller guidelines, disconnection protocols, and tournament code of conduct for Console Conquest 1v1.',
};

export default function RulesPage() {
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
            ENTER THE ARENA
          </Link>
        </div>

        <RulesSection />

        <div className="mt-12 rounded-2xl border border-red-900/60 bg-red-950/30 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <AlertOctagon className="h-6 w-6 shrink-0 text-red-400 mt-0.5" />
            <div>
              <h3 className="font-heading text-lg font-black text-white">REFEREE AUTHORITY & INTEGRITY</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Tournament marshals and head referees possess ultimate discretionary authority over station disputes, hardware malfunctions, game desynchronizations, or unsportsmanlike behavior. All rulings rendered on-stage are final and binding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
