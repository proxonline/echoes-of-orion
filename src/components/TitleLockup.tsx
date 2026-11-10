import React from 'react';
import { ASSET_PATHS } from '../data/gameData';

export const TitleLockup: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none relative z-20">
      {/* Restrained Celestial Motif */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="w-10 h-10 md:w-12 md:h-12 opacity-65 mix-blend-screen">
          <img
            src={ASSET_PATHS.orionSigil}
            alt="Celestial Rupture Sigil"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          />
        </div>
        {/* Subtle Horizontal Hairline Divider */}
        <div className="absolute left-1/2 -translate-x-1/2 w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent top-1/2" />
      </div>

      {/* Main Title Typography: Sharp, Chiseled, Authentic Dark Fantasy */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm tracking-[0.45em] text-[#a8a396] font-title uppercase">
          <span>ECHOES</span>
          <span className="text-amber-500/60 font-light text-[10px]">OF</span>
        </div>

        {/* ORION: Monolithic Title Face */}
        <h1 className="font-title text-5xl sm:text-7xl md:text-8xl tracking-[0.24em] font-black uppercase text-[#ede8dc] drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
          ORION
        </h1>

        {/* Kanji Subtitle: 冥響のオリオン */}
        <div className="font-kanji text-xs md:text-sm tracking-[0.6em] text-[#7d848f] opacity-80 pt-1 font-medium">
          冥 響 の オ リ オ ン
        </div>
      </div>

      {/* Tagline */}
      <div className="mt-5 max-w-md px-4">
        <p className="font-ui text-[10px] md:text-[11px] tracking-[0.32em] text-[#9ca3af] uppercase font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
          &ldquo;WHEN THE WORLD FALLS SILENT, THE DEAD STILL SPEAK.&rdquo;
        </p>
      </div>

      <div className="mt-3 w-10 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
    </div>
  );
};
