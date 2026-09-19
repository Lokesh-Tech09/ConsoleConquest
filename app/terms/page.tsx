import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ScrollText, ArrowLeft, Gamepad2, Award, AlertTriangle, ShieldCheck, Swords, HelpCircle } from 'lucide-react';
import { EVENT_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Console Conquest MK11 Tournament',
  description: 'Official tournament terms, conditions, controller regulations, code of conduct, and prize pool rules for Console Conquest MK11.',
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen py-12 sm:py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 h-[400px] w-[800px] rounded-full bg-gradient-to-b from-red-600/15 via-arena-accent/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-red-500/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 text-red-400" />
            <span>Return to Arena</span>
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-2xl border border-arena-cardBorder/80 bg-arena-card/90 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3 text-arena-accent">
            <ScrollText className="h-7 w-7 text-red-400" />
            <span className="text-xs font-black uppercase tracking-widest text-red-400">
              Tournament Rulebook &amp; Legal Framework
            </span>
          </div>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Console Conquest: Mortal Kombat 11 1v1 Tournament • {EVENT_CONFIG.FESTIVAL_NAME}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold text-slate-400 border-t border-slate-800/80 pt-4">
            <span>Entry Fee: {EVENT_CONFIG.ENTRY_FEE}</span>
            <span>•</span>
            <span>Platform: {EVENT_CONFIG.PLATFORM}</span>
            <span>•</span>
            <span>Total Contenders: {EVENT_CONFIG.DEFAULT_MAX_SLOTS}</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-8 space-y-6 text-slate-300">
          {/* 1. Contender Eligibility */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <ShieldCheck className="h-5 w-5 text-red-400" />
              <h2>1. Contender Eligibility &amp; Identification</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Registration is open to bona fide undergraduate and postgraduate students from recognized colleges and universities:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li>Every participant must provide authentic identity credentials including a valid College Student ID and Roll Number.</li>
              <li>Only one registration per player is allowed. Impersonation or ghost-playing will result in immediate disqualification.</li>
              <li>Contenders must present their physical Student ID card and their digital QR Registration Pass at the Tournament Check-in Desk.</li>
            </ul>
          </div>

          {/* 2. Slot Allocation & Non-Refundable Entry */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Award className="h-5 w-5 text-red-400" />
              <h2>2. Slot Allocation, Waitlist &amp; Refund Policy</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Slots are allocated dynamically and atomically on a strict first-come, first-served basis up to 128 maximum contenders across 4 symmetric pools (A, B, C, D):
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li>The registration fee is <strong className="text-white">₹100 per participant</strong>.</li>
              <li>Registration fees are <strong className="text-red-400">non-refundable</strong> once a slot is confirmed, except in the event of tournament cancellation by the organizing committee.</li>
              <li>Registrations beyond slot 128 are automatically placed on the numbered Waitlist. If a confirmed contender fails to check in 15 minutes before their scheduled pool kickoff, waitlisted players are promoted sequentially.</li>
            </ul>
          </div>

          {/* 3. Hardware, Platform & Controller Standards */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Gamepad2 className="h-5 w-5 text-red-400" />
              <h2>3. Platform &amp; Controller Standards</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              All official matches are executed on PlayStation 5 consoles running Mortal Kombat 11 in local 1v1 Versus mode:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li>Official Sony DualSense wireless/wired controllers will be provided at each station.</li>
              <li>Players may bring their own official PS5-compatible fight sticks or controllers, provided they are submitted to referees for inspection prior to match commencement.</li>
              <li>Hardware macros, turbo functionality, programmable button sequences, and Cronus/cheat converters are strictly prohibited and punishable by instant lifetime event ban.</li>
              <li>Pausing mid-round without referee authorization incurs an automatic forfeit of that round.</li>
            </ul>
          </div>

          {/* 4. Match Rules & Zero Byes Policy */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Swords className="h-5 w-5 text-red-400" />
              <h2>4. Single Elimination &amp; Zero Byes Policy</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              In accordance with rule #2 of our official tournament bylaws:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li><strong className="text-white">Zero Automatic Byes:</strong> Every registered contender must battle from Round 1. No player receives an automatic pass into later rounds.</li>
              <li><strong className="text-white">Match Calls:</strong> When a match is announced over the arena PA or WhatsApp broadcast, contenders have 5 minutes to report to their assigned PlayStation 5 station. Failure to report results in match forfeiture.</li>
              <li><strong className="text-white">Referee Authority:</strong> All referee calls regarding character selection lock, stage hazards, and match restarts are final and binding.</li>
            </ul>
          </div>

          {/* 5. Code of Conduct & Fair Play */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h2>5. Sportsmanship &amp; Zero Tolerance Policy</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Console Conquest fosters competitive excellence and camaraderie across the collegiate esports community:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li>Verbal abuse, hate speech, physical aggression, or equipment abuse (slamming controllers/consoles) will result in immediate disqualification and campus security removal.</li>
              <li>Collusion, match-fixing, or deliberate throwing will result in both players being disqualified without certificate or prize entitlement.</li>
            </ul>
          </div>

          {/* 6. Intellectual Property Disclaimer */}
          <div className="rounded-2xl border border-slate-800 bg-black/60 p-6 sm:p-8 backdrop-blur-sm text-xs text-slate-400 leading-relaxed">
            <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <span>Fair Use &amp; Intellectual Property Notice</span>
            </div>
            <p>
              Mortal Kombat 11, character designs, logos, and related audio-visual assets are registered trademarks and copyrights of NetherRealm Studios and Warner Bros. Entertainment Inc. Console Conquest is a collegiate student-organized non-commercial competitive gaming championship held within the 21st Engineering Today annual festival at AISSMS College of Engineering. All trademarks are utilized under nominative fair use for competitive sports identification purposes.
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">
          <Link href="/privacy" className="text-xs font-bold text-red-400 hover:underline">
            ← Read Privacy Policy
          </Link>
          <Link href="/rules" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-xs font-bold text-slate-200 hover:border-red-500/50 hover:text-white">
            <span>Read 12 Official Rules</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
