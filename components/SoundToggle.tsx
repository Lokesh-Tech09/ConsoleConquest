'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { combatSound } from '@/lib/sound';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mk11_sound_enabled');
      setEnabled(stored === 'true');
    }
  }, []);

  const handleToggle = () => {
    if (combatSound && combatSound.toggleSound) {
      const newState = combatSound.toggleSound();
      setEnabled(newState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
        enabled
          ? 'border-arena-accent bg-arena-accent/20 text-red-300 shadow-glow-crimson'
          : 'border-slate-800 bg-black/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
      }`}
      title={enabled ? 'Mute Combat Audio' : 'Unmute Combat Audio (Sound Effects)'}
      aria-label="Toggle combat audio"
    >
      {enabled ? (
        <>
          <Volume2 className="h-3.5 w-3.5 text-arena-accent animate-pulse" />
          <span className="hidden sm:inline text-arena-accent">SOUND ON</span>
        </>
      ) : (
        <>
          <VolumeX className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300" />
          <span className="hidden sm:inline text-slate-500 group-hover:text-slate-300">SOUND OFF</span>
        </>
      )}
    </button>
  );
}
