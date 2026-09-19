import React from 'react';
import { Swords } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none animate-in fade-in duration-75">
      {/* Top red laser progress line */}
      <div className="fixed top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.9)]" />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/40 bg-black/80 px-6 py-4 shadow-glow-crimson">
        <Swords className="h-6 w-6 text-arena-accent animate-spin" />
        <span className="font-heading text-xs font-black uppercase tracking-widest text-white">
          LOADING ARENA...
        </span>
      </div>
    </div>
  );
}
