import React, { useEffect, useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { ArrowRight, Home, Play } from 'lucide-react';

interface PrologueTransitionProps {
  characterId: CharacterId;
  onReturnToTitle: () => void;
  onGoToLoadGame: () => void;
  onEnterLevel: () => void;
}

export const PrologueTransition: React.FC<PrologueTransitionProps> = ({
  characterId,
  onReturnToTitle,
  onGoToLoadGame,
  onEnterLevel,
}) => {
  const character = CHARACTERS[characterId];
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    soundEngine.playEchoAbsorb();

    const t1 = setTimeout(() => setStage(1), 1000);
    const t2 = setTimeout(() => setStage(2), 2400);
    const t3 = setTimeout(() => setStage(3), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playBack();
        onReturnToTitle();
      } else if (e.key === 'Enter') {
        soundEngine.playConfirm();
        onEnterLevel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturnToTitle, onEnterLevel]);

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 bg-[#05070a]/95 text-center select-none animate-fadeIn">
      {/* Background Vignette */}
      <div className="absolute inset-0 cinematic-vignette opacity-90 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Main Title Heading */}
        <div className="space-y-2">
          <span className="font-ui text-[11px] tracking-[0.35em] text-[#c5a059] uppercase font-semibold block">
            CHRONICLE INITIATION
          </span>
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl tracking-[0.24em] font-bold uppercase text-[#ede8dc]">
            THE ECHOES BEGIN.
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent mx-auto mt-2" />
        </div>

        {/* Narrative Prose */}
        <div
          className={`space-y-4 font-ui text-[#b8b3a7] text-sm sm:text-base leading-relaxed max-w-xl mx-auto transition-all duration-700 ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p>
            You awaken beneath the shattered timber of Minakami. Above, the celestial rift turns the
            midnight sky into a vortex of cold divine light.
          </p>
          <p className="text-[#848c98]">
            Around you lie the silent bodies of master artisans, temple guards, and village elders.
            Their voices have ceased, yet in the stillness, luminous wisps rise from their
            hands—calling directly to yours.
          </p>
        </div>

        {/* Echo Absorption Card: Restrained Stone Surface */}
        <div
          className={`bg-[#0a0d14] border border-[#262c38] p-5 max-w-lg mx-auto transition-all duration-700 ${
            stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
          }`}
        >
          <span className="font-ui text-[10px] tracking-[0.28em] text-[#c5a059] uppercase block mb-1">
            FIRST ECHO INHERITED
          </span>
          <h4 className="font-title text-xl font-bold text-[#ede8dc] tracking-wider">
            {character.startingEcho.abilityName}
          </h4>
          <span className="text-[11px] font-ui text-[#7d848f] block mt-0.5">
            Origin: {character.startingEcho.origin}
          </span>
          <p className="text-xs text-[#a0a6b2] font-ui mt-3 border-t border-[#1a1f28] pt-2.5 leading-relaxed">
            {character.startingEcho.description}
          </p>
        </div>

        {/* Milestone Notice */}
        <div
          className={`border-t border-[#1a1f28] pt-6 space-y-2 transition-all duration-700 ${
            stage >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="font-ui text-[11px] tracking-[0.25em] text-[#c5a059] uppercase font-semibold block">
            PROLOGUE LEVEL UNLOCKED
          </span>
          <p className="font-ui text-xs text-[#7d848f] max-w-md mx-auto">
            Vessel choice ({character.name}) has awakened beneath the ruins of Minakami. Explore the
            ruined village, test platform traversal, and seek the Echo Remnants.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playBack();
                onReturnToTitle();
              }}
              className="w-full sm:w-auto px-5 py-2.5 border border-[#262c38] hover:border-[#434b5c] text-[#848c98] hover:text-[#ede8dc] font-ui text-xs tracking-[0.18em] uppercase font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              [ESC] TITLE
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playConfirm();
                onEnterLevel();
              }}
              className="w-full sm:w-auto px-6 py-2.5 border border-[#c5a059] bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#ede8dc] font-title text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#c5a059]" />
              <span>[ENTER] ENTER ASHES OF MINAKAMI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
