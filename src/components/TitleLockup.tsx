import React from 'react';
import { ASSET_PATHS } from '../data/gameData';

export const TitleLockup: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none relative z-20">
      {/* Background Celestial Sigil Glow */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Ambient Halo */}
        <div className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-cyan-500/10 blur-2xl animate-ethereal-pulse" />
        
        {/* Rotating Celestial Sigil */}
        <div className="relative w-20 h-20 md:w-28 md:h-28 opacity-80 mix-blend-screen transition-opacity duration-700">
          <img
            src={ASSET_PATHS.orionSigil}
            alt="Celestial Rupture Sigil"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(123,229,255,0.4)] animate-celestial-spin-slow"
          />
        </div>

        {/* Subtle Horizontal Astral Rule */}
        <div className="absolute left-1/2 -translate-x-1/2 w-48 md:w-72 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent top-1/2" />
      </div>

      {/* Main Title Typography */}
      <div className="space-y-1 md:space-y-2">
        <div className="font-cinzel text-xl md:text-3xl tracking-[0.45em] uppercase text-silver-gradient font-light">
          ECHOES
        </div>

        <div className="flex items-center justify-center gap-4 my-0.5">
          <div className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-500/50" />
          <span className="font-cinzel text-xs md:text-sm tracking-[0.6em] text-amber-200/60 uppercase font-normal">
            OF
          </span>
          <div className="w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>

        {/* ORION with special visual emphasis */}
        <h1 className="font-cinzel-dec text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.25em] font-black uppercase text-gold-gradient relative px-4 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
          ORION
          {/* Subtle celestial glint */}
          <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-cyan-300 blur-[1px] shadow-[0_0_12px_#7be5ff] opacity-80" />
        </h1>
      </div>

      {/* Atmospheric Tagline */}
      <div className="mt-5 md:mt-6 max-w-xl px-4">
        <p className="font-cinzel text-[11px] md:text-xs tracking-[0.35em] text-slate-300/80 uppercase font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          &ldquo;WHEN THE WORLD FALLS SILENT, THE DEAD STILL SPEAK.&rdquo;
        </p>
      </div>

      {/* Understated divider */}
      <div className="mt-3 w-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </div>
  );
};
