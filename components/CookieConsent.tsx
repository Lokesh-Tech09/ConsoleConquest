'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X, Check, Lock } from 'lucide-react';

export type CookieConsentType = 'all' | 'necessary' | 'declined';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cc_cookie_consent');
      if (!stored) {
        // Small delay so it doesn't pop in aggressively during first load
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleConsent = (choice: CookieConsentType) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cc_cookie_consent', choice);
      window.dispatchEvent(
        new CustomEvent('cookie_consent_changed', { detail: choice })
      );
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-br from-[#181119] via-[#0d0c13] to-[#140e18] p-5 sm:p-6 shadow-[0_0_40px_rgba(225,29,72,0.35)] backdrop-blur-xl">
        {/* Subtle top crimson border line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/40 bg-red-950/60 text-arena-accent shadow-glow-crimson">
            <Cookie className="h-6 w-6 text-red-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Cookie className="h-4 w-4 text-red-400 sm:hidden" />
                Tournament Cookies &amp; Privacy
              </span>
              <button
                onClick={() => handleConsent('necessary')}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close cookie banner with necessary cookies only"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              We use essential cookies to maintain secure registration sessions, admin authentication, and rate limiting. Optional anonymous telemetry helps us optimize tournament bracket updates. Read our{' '}
              <Link href="/privacy" className="font-bold text-red-400 underline hover:text-red-300">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="font-bold text-red-400 underline hover:text-red-300">
                Terms
              </Link>.
            </p>

            {showPreferences && (
              <div className="mt-3 rounded-xl border border-slate-800 bg-black/60 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    Essential Cookies
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Required for slot allocation, admin token security, and CSRF protection.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                    Analytics &amp; Sound Preferences
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Remembers your audio toggle and logs anonymous funnel conversions.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleConsent('all')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500 bg-gradient-to-r from-red-700 via-arena-accent to-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-glow-crimson transition-transform active:scale-95 cursor-pointer touch-manipulation"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept All</span>
              </button>

              <button
                type="button"
                onClick={() => handleConsent('necessary')}
                className="rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-slate-500 hover:text-white transition-transform active:scale-95 cursor-pointer touch-manipulation"
              >
                Necessary Only
              </button>

              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-[11px] font-bold uppercase tracking-wider text-slate-400 underline hover:text-slate-200 cursor-pointer touch-manipulation py-1"
              >
                {showPreferences ? 'Hide Details' : 'Customize'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
