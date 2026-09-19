import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, ArrowLeft, Lock, Database, Eye, UserCheck, Mail, Phone, Swords } from 'lucide-react';
import { EVENT_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy | Console Conquest MK11 Tournament',
  description: 'Official privacy policy for Console Conquest Mortal Kombat 11 collegiate tournament at AISSMS COE. Learn how contender data is handled securely.',
};

export default function PrivacyPolicyPage() {
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
            <Shield className="h-7 w-7 text-red-400" />
            <span className="text-xs font-black uppercase tracking-widest text-red-400">
              Official Tournament Governance
            </span>
          </div>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Console Conquest: Mortal Kombat 11 1v1 Tournament • {EVENT_CONFIG.FESTIVAL_NAME}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold text-slate-400 border-t border-slate-800/80 pt-4">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Host: {EVENT_CONFIG.INSTITUTION_NAME}</span>
            <span>•</span>
            <span>Department: AIML</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-8 space-y-6 text-slate-300">
          {/* Section 1 */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Database className="h-5 w-5 text-red-400" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              When registering as a participant for Console Conquest, we collect only the essential details required to manage bracket seeding, player check-in, and fair play verification:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li><strong className="text-white">Full Legal Name:</strong> For credential verification and official participation certificates.</li>
              <li><strong className="text-white">College / Institute Name:</strong> To verify collegiate eligibility across engineering institutions.</li>
              <li><strong className="text-white">Roll Number / Student ID:</strong> To guarantee unique identity and prevent duplicate slot claims.</li>
              <li><strong className="text-white">Email Address:</strong> To deliver confirmation passes, match schedule updates, and QR badges.</li>
              <li><strong className="text-white">Mobile Phone Number:</strong> For match call desk announcements and referee WhatsApp/SMS alerts.</li>
              <li><strong className="text-white">Gamer Tag / Alias:</strong> Displayed on live tournament brackets, streams, and projector displays.</li>
              <li><strong className="text-white">Preferred MK11 Fighter:</strong> For player profiles, tournament statistics, and match presentation.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Lock className="h-5 w-5 text-red-400" />
              <h2>2. How We Protect &amp; Use Your Data</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Your data is stored exclusively on secured tournament servers within an isolated SQLite database utilizing WAL (Write-Ahead Logging) and strict access controls:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li><strong className="text-white">No Commercial Sharing:</strong> We never sell, rent, monetize, or disclose your personal contact information to commercial third parties or external advertisers.</li>
              <li><strong className="text-white">Role-Based Admin Access:</strong> Only designated faculty coordinators and student event heads possess authenticated administrative credentials to access participant rosters.</li>
              <li><strong className="text-white">Public Bracket Visibility:</strong> Only your <span className="text-red-400 font-bold">Gamer Tag</span>, <span className="text-red-400 font-bold">Slot Number</span>, and <span className="text-red-400 font-bold">Chosen Fighter</span> are visible on public tournament brackets. Personal phone numbers, emails, and student roll numbers are strictly hidden from public bracket views.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Eye className="h-5 w-5 text-red-400" />
              <h2>3. Cookies &amp; Local Storage</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Our website uses minimal, functional client-side storage technologies:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-slate-300">
              <li><strong className="text-white">Essential Cookies:</strong> Used strictly for secure administrator session tokens (<code className="text-red-400 font-mono">cc_admin_token</code>) with HTTP-only and SameSite flags.</li>
              <li><strong className="text-white">Local Storage:</strong> Used to remember your sound preference (muted/unmuted), cookie consent preference, and cinematic intro completion flag (<code className="text-red-400 font-mono">cc_intro_seen</code>).</li>
              <li><strong className="text-white">Telemetry &amp; Analytics:</strong> Lightweight, privacy-respecting client telemetry records page views and registration progression without tracking users across external sites or recording personal identifiers.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-arena-cardBorder/60 bg-arena-dark/70 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <UserCheck className="h-5 w-5 text-red-400" />
              <h2>4. Contender Rights &amp; Retention</h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Participants retain the right to verify their registration pass at any time via the <Link href="/lookup" className="text-red-400 font-bold underline hover:text-red-300">Check Pass Portal</Link>. Data is retained for the duration of the 21st Engineering Today festival and subsequent academic accreditation archiving, after which records are sanitized.
            </p>
          </div>

          {/* Section 5 - Contact */}
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-arena-card to-red-950/40 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-white font-heading text-lg font-bold">
              <Mail className="h-5 w-5 text-arena-accent" />
              <h2>5. Privacy Contact &amp; Grievances</h2>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              If you have any questions, corrections, or data removal requests regarding your tournament registration, please contact the organizing department:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-black/60 p-4 text-xs space-y-2">
              <p><strong className="text-white">Department:</strong> {EVENT_CONFIG.DEPARTMENT}</p>
              <p><strong className="text-white">Institute:</strong> {EVENT_CONFIG.INSTITUTION_NAME}</p>
              <p><strong className="text-white">Event Head:</strong> Lokesh Joshi (<a href="tel:7558610917" className="text-red-400 hover:underline">+91 7558610917</a>)</p>
              <p><strong className="text-white">Campus Venue:</strong> {EVENT_CONFIG.VENUE}</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">
          <Link href="/terms" className="text-xs font-bold text-red-400 hover:underline">
            View Terms &amp; Conditions →
          </Link>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-gradient-to-r from-red-700 to-arena-accent px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-glow-crimson hover:from-red-600 hover:to-red-500">
            <Swords className="h-4 w-4" />
            <span>Enter the Arena</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
