'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MK11_ROSTER } from '@/lib/config';
import { FighterInfo } from '@/lib/types';
import { Swords, Zap, Shield, Grid } from 'lucide-react';
import { combatSound } from '@/lib/sound';

export default function RosterPreview() {
  const [selectedFighter, setSelectedFighter] = useState<FighterInfo>(MK11_ROSTER[0]);
  const [showFullGrid, setShowFullGrid] = useState(false);

  const handleSelect = (fighter: FighterInfo) => {
    setSelectedFighter(fighter);
    if (combatSound && combatSound.playSlash) {
      combatSound.playSlash();
    }
  };

  const getFighterImg = (name: string) => {
    const key = name.toLowerCase().replace(/[^a-z]/g, '');
    return `/images/fighters/${key}.png`;
  };

  return (
    <section className="relative py-16 border-t border-arena-cardBorder/60 bg-arena-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-arena-accent">
            <Swords className="h-3.5 w-3.5" aria-hidden="true" />
            CHOOSE YOUR FIGHTER
          </span>
          <h2 className="mt-2 font-heading text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">
            MORTAL KOMBAT 11 ROSTER PREVIEW
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Select any official MK11 fighter as your primary tournament combatant during registration.
          </p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowFullGrid(!showFullGrid)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-black/60 px-4 py-1.5 text-xs font-bold text-slate-200 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              aria-expanded={showFullGrid}
            >
              <Grid className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              <span>{showFullGrid ? 'HIDE FULL 48-CHARACTER GRID' : 'VIEW OFFICIAL 48-CHARACTER GRID'}</span>
            </button>
          </div>
        </div>

        {/* Optional Full 48-Character Roster Grid Modal / Panel */}
        {showFullGrid && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-amber-500/40 bg-black/80 p-4 sm:p-6 backdrop-blur-md">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">
              OFFICIAL MORTAL KOMBAT 11 TOURNAMENT SELECT SCREEN
            </span>
            <div className="relative w-full max-w-2xl h-[420px] rounded-xl overflow-hidden border-2 border-slate-800">
              <Image
                src="/images/mk11-roster-grid.png"
                alt="Official Mortal Kombat 11 48-character tournament character select screen roster grid"
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Selected Fighter Showcase Spotlight */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-arena-cardBorder bg-gradient-to-r from-arena-card via-arena-dark to-arena-card p-6 lg:p-8 shadow-2xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-center">
            {/* Fighter Emblem Badge / Portrait */}
            <div className="flex flex-col items-center justify-center">
              <div
                className="relative flex h-48 w-36 sm:h-56 sm:w-44 items-center justify-center rounded-2xl border-2 shadow-2xl overflow-hidden transition-all duration-300"
                style={{
                  borderColor: selectedFighter.color,
                  boxShadow: `0 0 35px ${selectedFighter.color}40`,
                  backgroundColor: `${selectedFighter.color}15`,
                }}
              >
                <Image
                  src={getFighterImg(selectedFighter.name)}
                  alt={`${selectedFighter.name} - Mortal Kombat 11 playable tournament combatant portrait`}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute -bottom-0.5 inset-x-0 bg-black/80 py-1 text-center text-[10px] font-black uppercase tracking-widest text-white border-t border-slate-700">
                  {selectedFighter.archetype}
                </span>
              </div>
            </div>

            {/* Fighter Bio */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-heading text-3xl font-black tracking-wider text-white sm:text-4xl">
                  {selectedFighter.name}
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: `${selectedFighter.color}25`,
                    color: selectedFighter.color,
                    border: `1px solid ${selectedFighter.color}50`,
                  }}
                >
                  {selectedFighter.title}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {selectedFighter.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <span>
                    Signature Move:{' '}
                    <strong className="text-white">{selectedFighter.signatureMove}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Shield className="h-4 w-4 text-arena-accent" aria-hidden="true" />
                  <span>
                    Archetype:{' '}
                    <strong className="text-white">{selectedFighter.archetype}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Character Selection Grid with Portraits */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3" role="group" aria-label="Selectable MK11 Tournament Combatants">
          {MK11_ROSTER.map((fighter) => {
            const isSelected = selectedFighter.name === fighter.name;
            return (
              <button
                key={fighter.name}
                onClick={() => handleSelect(fighter)}
                aria-pressed={isSelected}
                aria-label={`Select ${fighter.name} as preferred combatant`}
                className={`group relative flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-75 min-h-[44px] cursor-pointer touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'border-arena-accent bg-red-950/40 shadow-glow-crimson scale-[1.03]'
                    : 'border-arena-cardBorder bg-arena-card/60 hover:border-slate-600 hover:bg-arena-card'
                }`}
              >
                <div
                  className="relative h-16 w-14 rounded-lg overflow-hidden border shadow transition-transform group-hover:scale-105"
                  style={{
                    borderColor: isSelected ? '#e11d48' : fighter.color,
                  }}
                >
                  <Image
                    src={getFighterImg(fighter.name)}
                    alt={`${fighter.name} character icon`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <span className="mt-2 font-heading text-xs font-black uppercase tracking-wider text-white truncate max-w-full">
                  {fighter.name}
                </span>
                <span className="text-[10px] text-slate-300 truncate max-w-full">
                  {fighter.archetype.split('/')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
