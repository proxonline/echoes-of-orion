import React from 'react';
import { ASSET_PATHS } from '../data/gameData';

export const TitleLockup: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none relative z-20">
      {/* Restrained Celestial Motif */}
      <div className="relative mb-2 flex items-center justify-center">
        <div className="w-12 h-12 md:w-16 md:h-16 opacity-75 mix-blend-screen transition-opacity duration-700">
          <img
            src={ASSET_PATHS.orionSigil}
            alt="Celestial Rupture Sigil"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(123,229,255,0.4)] animate-celestial-spin-slow"
          />
        </div>
        {/* Subtle Horizontal Hairline Rule */}
        <div className="absolute left-1/2 -translate-x-1/2 w-40 md:w-64 h-[1px] bg-gradient-to-r from-transparent via-amber-400/35 to-transparent top-1/2" />
      </div>

      {/* Main Title Typography */}
      <div className="space-y-0.5 md:space-y-1">
        <div className="font-cinzel text-lg sm:text-2xl md:text-3xl tracking-[0.45em] uppercase text-silver-gradient font-light">
          ECHOES
        </div>

        <div className="flex items-center justify-center gap-3 my-0.5">
          <div className="w-6 md:w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-500/40" />
          <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.55em] text-amber-200/60 uppercase font-normal">
            OF
          </span>
          <div className="w-6 md:w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>

        {/* ORION */}
        <h1 className="font-cinzel-dec text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.22em] font-black uppercase text-gold-gradient relative px-4 drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)]">
          ORION
        </h1>
      </div>

      {/* Tagline */}
      <div className="mt-4 md:mt-5 max-w-lg px-4">
        <p className="font-cinzel text-[10px] md:text-xs tracking-[0.3em] text-slate-300/80 uppercase font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          &ldquo;WHEN THE WORLD FALLS SILENT, THE DEAD STILL SPEAK.&rdquo;
        </p>
      </div>

      <div className="mt-2 w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
    </div>
  );
};
