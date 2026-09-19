import React from 'react';
import Link from 'next/link';
import { Swords, Lock, Shield, FileText } from 'lucide-react';
import { EVENT_CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-arena-cardBorder bg-arena-dark/90 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-arena-accent/40 bg-red-950/40 text-arena-accent shadow-glow-crimson">
                <Swords className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div>
                <span className="font-heading text-lg font-black tracking-wider text-white block">
                  CONSOLE CONQUEST
                </span>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                  {EVENT_CONFIG.INSTITUTION_NAME}
                </span>
              </div>
            </div>
            <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-slate-300">
              Organized by the <strong className="text-white">{EVENT_CONFIG.DEPARTMENT}</strong> as part of the <strong className="text-white">{EVENT_CONFIG.FESTIVAL_NAME}</strong>. An official 128-contender 1v1 Mortal Kombat 11 championship on PlayStation 5.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
              <span className="rounded bg-slate-900 px-2 py-1 border border-slate-800">Platform: {EVENT_CONFIG.PLATFORM}</span>
              <span className="rounded bg-slate-900 px-2 py-1 border border-slate-800">Entry: {EVENT_CONFIG.ENTRY_FEE}</span>
              <span className="rounded bg-slate-900 px-2 py-1 border border-slate-800 text-amber-300">Prize Pool: {EVENT_CONFIG.PRIZE_POOL_TOTAL}</span>
            </div>
          </div>

          {/* Quick links & Legal */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">
              Tournament Links &amp; Legal
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/register" prefetch={true} className="text-slate-300 transition-colors hover:text-red-400 py-1 inline-block touch-manipulation">
                  Register Contender (₹100)
                </Link>
              </li>
              <li>
                <Link href="/bracket" prefetch={true} className="text-slate-300 transition-colors hover:text-red-400 py-1 inline-block touch-manipulation">
                  128-Player Bracket (4 Pools)
                </Link>
              </li>
              <li>
                <Link href="/rules" prefetch={true} className="text-slate-300 transition-colors hover:text-red-400 py-1 inline-block touch-manipulation">
                  Official Rule Book (12 Rules)
                </Link>
              </li>
              <li>
                <Link href="/lookup" prefetch={true} className="text-slate-300 transition-colors hover:text-red-400 py-1 inline-block touch-manipulation">
                  Verify / Check Pass
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800/80">
                <Link href="/privacy" prefetch={true} className="text-slate-300 transition-colors hover:text-red-400 flex items-center gap-1.5 py-1 touch-manipulation">
                  <Shield className="h-3.5 w-3.5 text-red-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={true} className="text-slate-300 transition-colors hover:text-red-400 flex items-center gap-1.5 py-1 touch-manipulation">
                  <FileText className="h-3.5 w-3.5 text-red-400" />
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Event details & Coordinators */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">
              Event Desk &amp; Contacts
            </h4>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <p>
                <strong className="text-white">Venue:</strong> {EVENT_CONFIG.VENUE}
              </p>
              <p>
                <strong className="text-white">Dates:</strong> {EVENT_CONFIG.EVENT_DATE_DISPLAY}
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <p className="text-slate-200 font-bold">Coordinator Inquiries:</p>
                <p>Lokesh Joshi: <a href="tel:7558610917" className="text-red-400 font-semibold hover:underline">+91 7558610917</a></p>
                <p>Pratosh Jadhar: <a href="tel:9112157569" className="text-red-400 font-semibold hover:underline">+91 9112157569</a></p>
                <p>Parth S.: <a href="tel:9529425106" className="text-red-400 font-semibold hover:underline">+91 9529425106</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-arena-cardBorder/50 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 AISSMS COE - Dept. of AIML • 21st Engineering Today. Mortal Kombat is a trademark of Warner Bros. Entertainment Inc.</p>
          
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-slate-400 transition-colors hover:text-slate-200"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="text-slate-400 transition-colors hover:text-slate-200"
            >
              Terms
            </Link>
            <span>•</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-400 transition-colors hover:text-red-400"
              title="Organizer Command Center"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
