'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Menu, X } from 'lucide-react';
import SoundToggle from './SoundToggle';
import { combatSound } from '@/lib/sound';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    if (combatSound && combatSound.playSlash) {
      combatSound.playSlash();
    }
  };

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'THE BATTLE', href: '/#battle' },
    { name: 'RULES', href: '/rules' },
    { name: 'BRACKET', href: '/bracket' },
    { name: 'CHECK PASS', href: '/lookup' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-arena-cardBorder/60 bg-arena-bg/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={handleNavClick}
          prefetch={true}
          className="group flex items-center gap-2.5 transition-transform active:scale-95 min-h-[44px] cursor-pointer touch-manipulation"
          aria-label="Console Conquest - Mortal Kombat 11 Home"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-arena-accent/40 bg-gradient-to-br from-red-950/80 to-black shadow-glow-crimson group-hover:border-arena-accent">
            <Swords className="h-5 w-5 text-arena-accent transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
          </div>
          <div>
            <span className="block font-heading text-lg font-black tracking-wider text-white group-hover:text-red-400">
              CONSOLE CONQUEST
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-red-400">
              AISSMS COE • AIML DEPT • ET-2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                onClick={handleNavClick}
                className={`px-3.5 py-2.5 text-xs font-bold tracking-widest transition-all duration-75 min-h-[44px] flex items-center cursor-pointer touch-manipulation active:scale-95 ${
                  isActive
                    ? 'border-b-2 border-arena-accent text-red-400'
                    : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-slate-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action & Sound */}
        <div className="hidden items-center gap-3 md:flex">
          <SoundToggle />
          <Link
            href="/register"
            onClick={handleNavClick}
            prefetch={true}
            id="nav-enter-arena-btn"
            className="relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-md border border-red-500/60 bg-gradient-to-r from-red-700 to-arena-accent px-5 py-2 text-xs font-black tracking-widest text-white shadow-glow-crimson transition-all duration-75 hover:from-red-600 hover:to-red-500 active:scale-95 cursor-pointer touch-manipulation"
          >
            ENTER THE ARENA (₹100)
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <SoundToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-700 bg-slate-950/90 p-2.5 text-slate-200 hover:text-white active:scale-90 cursor-pointer touch-manipulation"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-arena-cardBorder bg-arena-dark/95 px-4 pb-6 pt-3 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                onClick={handleNavClick}
                className="flex min-h-[48px] items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold tracking-wider text-slate-200 transition-colors active:scale-95 hover:bg-red-950/40 hover:text-white cursor-pointer touch-manipulation"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/register"
                prefetch={true}
                onClick={handleNavClick}
                className="flex min-h-[48px] w-full items-center justify-center rounded-lg border border-red-600/60 bg-gradient-to-r from-red-700 to-arena-accent py-3 text-center text-sm font-black tracking-widest text-white shadow-glow-crimson active:scale-95 cursor-pointer touch-manipulation"
              >
                ENTER THE ARENA (REGISTER ₹100)
              </Link>
            </div>
            <div className="flex items-center justify-around pt-3 border-t border-slate-800 text-xs text-slate-400">
              <Link href="/privacy" prefetch={true} onClick={handleNavClick} className="hover:text-white py-2 cursor-pointer touch-manipulation active:scale-95">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" prefetch={true} onClick={handleNavClick} className="hover:text-white py-2 cursor-pointer touch-manipulation active:scale-95">
                Terms &amp; Rules
              </Link>
              <span>•</span>
              <Link href="/admin" prefetch={true} onClick={handleNavClick} className="hover:text-white py-2 cursor-pointer touch-manipulation active:scale-95">
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
