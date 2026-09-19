'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, ChevronRight, Zap } from 'lucide-react';
import { combatSound } from '@/lib/sound';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on registration or confirmation pages
  const isExcluded =
    pathname === '/register' ||
    pathname.startsWith('/confirmation') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    if (isExcluded) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show when scrolled down more than 350px
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExcluded]);

  if (isExcluded || !visible) return null;

  const handleClick = () => {
    if (combatSound && combatSound.playSlash) {
      combatSound.playSlash();
    }
  };

  return (
    <div
      role="region"
      aria-label="Quick Registration Bar"
      className="fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-black via-[#0f0a12]/95 to-transparent backdrop-blur-lg border-t border-red-500/30 md:hidden animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" />
            128 SLOTS • ₹100
          </span>
          <span className="font-heading text-xs font-black uppercase tracking-wider text-white">
            CONSOLE CONQUEST
          </span>
        </div>

        <Link
          href="/register"
          prefetch={true}
          onClick={handleClick}
          id="sticky-mobile-register-btn"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-500 bg-gradient-to-r from-red-700 via-arena-accent to-red-600 px-5 py-2.5 font-heading text-xs font-black uppercase tracking-widest text-white shadow-glow-crimson transition-transform active:scale-95 cursor-pointer touch-manipulation"
        >
          <Swords className="h-4 w-4" />
          <span>REGISTER NOW</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
