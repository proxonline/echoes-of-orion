import React, { useEffect, useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { Sparkles, ArrowRight, Home } from 'lucide-react';

interface PrologueTransitionProps {
  characterId: CharacterId;
  onReturnToTitle: () => void;
  onGoToLoadGame: () => void;
}

export const PrologueTransition: React.FC<PrologueTransitionProps> = ({
  characterId,
  onReturnToTitle,
  onGoToLoadGame,
}) => {
  const character = CHARACTERS[characterId];
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Sound cue on prologue entrance
    soundEngine.playEchoAbsorb();

    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2600);
    const t3 = setTimeout(() => setStage(3), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 bg-black/92 backdrop-blur-md text-center select-none animate-fadeIn">
      {/* Ambient Celestial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Main Cinematic Heading */}
        <div className="space-y-3">
          <span className="font-cinzel text-xs tracking-[0.4em] text-cyan-400 uppercase font-semibold block">
            CHRONICLE INITIATION
          </span>
          <h2 className="font-cinzel-dec text-4xl sm:text-5xl md:text-6xl tracking-[0.25em] font-black uppercase text-gold-gradient">
            THE ECHOES BEGIN.
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mt-2" />
        </div>

        {/* Narrative Vignette */}
        <div
          className={`space-y-4 font-sans text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto transition-all duration-1000 ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p>
            You awaken beneath the shattered beams of Minakami. Above, the celestial rift turns the
            midnight sky into a vortex of cold divine light.
          </p>
          <p className="text-slate-400">
            Around you lie the silent bodies of master artisans, temple guards, and village elders.
            Their voices have ceased, yet in the stillness, tiny luminous wisps rise from their
            hands—calling directly to yours.
          </p>
        </div>

        {/* Echo Absorption Card */}
        <div
          className={`bg-slate-950/80 border border-cyan-500/40 rounded-lg p-5 max-w-lg mx-auto shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-1000 ${
            stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2 text-cyan-300 text-xs font-cinzel tracking-[0.25em] uppercase">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            FIRST ECHO INHERITED
          </div>
          <h4 className="font-cinzel text-xl font-bold text-amber-200 tracking-wider">
            {character.startingEcho.abilityName}
          </h4>
          <span className="text-[11px] font-cinzel text-slate-400 block mt-0.5">
            Source: {character.startingEcho.origin}
          </span>
          <p className="text-xs text-slate-300/90 font-sans mt-3 border-t border-slate-800/80 pt-2.5">
            {character.startingEcho.description}
          </p>
        </div>

        {/* Development Stage Notice */}
        <div
          className={`border-t border-slate-800/80 pt-6 space-y-2 transition-all duration-1000 ${
            stage >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="font-cinzel text-[11px] tracking-[0.2em] text-amber-400/90 uppercase font-semibold block">
            GAME ENGINE MILESTONE REACHED
          </span>
          <p className="font-sans text-xs text-slate-400 max-w-md mx-auto">
            The title screen transition sequence has successfully recorded your vessel choice ({character.name})
            into save slot memory. The 3D world exploration and combat system are the next development stage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => {
                soundEngine.playSelect();
                onReturnToTitle();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-cinzel text-xs tracking-[0.2em] uppercase font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              RETURN TO TITLE
            </button>

            <button
              onClick={() => {
                soundEngine.playSelect();
                onGoToLoadGame();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded border border-amber-500/70 bg-gradient-to-r from-amber-600/70 to-amber-700/70 hover:from-amber-500 hover:to-amber-600 text-black font-cinzel text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>INSPECT SAVED CHRONICLE</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
