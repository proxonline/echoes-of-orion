import React, { useState, useEffect } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS, ASSET_PATHS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { ArrowLeft, Check, Sparkles, Swords, Zap, Shield, User } from 'lucide-react';

interface CharacterSelectProps {
  onBack: () => void;
  onConfirmCharacter: (characterId: CharacterId) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onBack,
  onConfirmCharacter,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>('kiyoji');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const kiyoji = CHARACTERS.kiyoji;
  const hanetsu = CHARACTERS.hanetsu;
  const currentHero = CHARACTERS[selectedCharId];

  // Keyboard navigation for character selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmModal) {
        if (e.key === 'Escape') {
          e.preventDefault();
          soundEngine.playBack();
          setShowConfirmModal(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          soundEngine.playConfirm();
          onConfirmCharacter(selectedCharId);
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (selectedCharId !== 'kiyoji') {
          soundEngine.playHover();
          setSelectedCharId('kiyoji');
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (selectedCharId !== 'hanetsu') {
          soundEngine.playHover();
          setSelectedCharId('hanetsu');
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        soundEngine.playSelect();
        setShowConfirmModal(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playBack();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCharId, showConfirmModal, onConfirmCharacter, onBack]);

  const handleSelect = (id: CharacterId) => {
    if (selectedCharId !== id) {
      soundEngine.playHover();
      setSelectedCharId(id);
    } else {
      soundEngine.playSelect();
      setShowConfirmModal(true);
    }
  };

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-black text-slate-100 select-none overflow-hidden animate-fadeIn">
      {/* 1. Full-screen Cinematic Sanctuary Environment */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.characterSelectEnvironment}
          alt="Ancient shrine steps under midnight sky"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
        />
        {/* Atmospheric ground mist and radial vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* 2. Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-6 border-b border-slate-900 bg-black/60 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => {
            soundEngine.playBack();
            onBack();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="group flex items-center gap-2 px-3 py-1.5 border border-slate-800 hover:border-amber-500/60 text-slate-400 hover:text-amber-200 transition-colors rounded cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel text-xs tracking-widest uppercase font-semibold">
            BACK TO TITLE
          </span>
        </button>

        <div className="text-center">
          <h2 className="font-cinzel text-xl sm:text-2xl font-black tracking-[0.3em] uppercase text-gold-gradient">
            SELECT YOUR VESSEL
          </h2>
          <p className="font-cinzel text-[11px] tracking-[0.25em] text-slate-400 uppercase mt-0.5">
            &ldquo;Two souls. One shattered world. Countless echoes.&rdquo;
          </p>
        </div>

        <div className="text-right text-xs font-cinzel text-slate-500 hidden sm:block">
          <span className="tracking-widest uppercase">PROTAGONIST AWAKENING</span>
        </div>
      </header>

      {/* 3. Hero Visual Stage (Two Protagonists in Scene) */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto w-full px-6 py-4 my-auto">
        {/* HERO 1: KIYOJI */}
        <div
          onClick={() => handleSelect('kiyoji')}
          className={`group relative flex-1 w-full max-w-md h-[460px] sm:h-[520px] rounded border transition-all duration-500 cursor-pointer overflow-hidden ${
            selectedCharId === 'kiyoji'
              ? 'border-amber-400/90 shadow-[0_0_40px_rgba(245,158,11,0.25)] scale-[1.02] bg-gradient-to-t from-black via-black/60 to-transparent'
              : 'border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-85 filter brightness-75'
          }`}
        >
          {/* Portrait artwork */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={kiyoji.imagePath}
              alt={kiyoji.name}
              className={`w-full h-full object-cover object-top transition-all duration-700 ${
                selectedCharId === 'kiyoji' ? 'scale-105 filter brightness-100' : 'filter brightness-80'
              }`}
            />
            {/* Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
          </div>

          {/* Header */}
          <div className="relative z-10 p-5 flex items-start justify-between">
            <div>
              <span className="font-cinzel text-[11px] tracking-[0.25em] text-amber-400 uppercase font-semibold">
                {kiyoji.role} · {kiyoji.gender}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="font-cinzel text-2xl font-black tracking-widest text-white">
                  {kiyoji.name}
                </h3>
                <span className="font-cinzel text-xs text-slate-400 font-light">{kiyoji.kanji}</span>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded border flex items-center justify-center ${
                selectedCharId === 'kiyoji'
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-slate-800 bg-black/60 text-slate-500'
              }`}
            >
              <Swords className="w-4 h-4" />
            </div>
          </div>

          {/* Active indicator bar */}
          {selectedCharId === 'kiyoji' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b]" />
          )}

          {/* Bottom stats and quote */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 space-y-3 bg-gradient-to-t from-black via-black/95 to-transparent">
            <p className="font-sans text-xs text-slate-300 line-clamp-2 leading-relaxed">
              &ldquo;{kiyoji.description}&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px] font-cinzel">
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Primary Weapon</span>
                <span className="text-slate-200 font-semibold">{kiyoji.weapon}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Starting Echo</span>
                <span className="text-amber-300 font-semibold">{kiyoji.startingEcho.abilityName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('kiyoji');
              }}
              className={`w-full py-2.5 font-cinzel text-xs tracking-[0.25em] uppercase font-bold transition-all rounded cursor-pointer ${
                selectedCharId === 'kiyoji'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {selectedCharId === 'kiyoji' ? 'CONFIRM VESSEL' : 'SELECT KIYOJI'}
            </button>
          </div>
        </div>

        {/* HERO 2: HANETSU */}
        <div
          onClick={() => handleSelect('hanetsu')}
          className={`group relative flex-1 w-full max-w-md h-[460px] sm:h-[520px] rounded border transition-all duration-500 cursor-pointer overflow-hidden ${
            selectedCharId === 'hanetsu'
              ? 'border-cyan-400/90 shadow-[0_0_40px_rgba(56,189,248,0.25)] scale-[1.02] bg-gradient-to-t from-black via-black/60 to-transparent'
              : 'border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-85 filter brightness-75'
          }`}
        >
          {/* Portrait artwork */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={hanetsu.imagePath}
              alt={hanetsu.name}
              className={`w-full h-full object-cover object-top transition-all duration-700 ${
                selectedCharId === 'hanetsu' ? 'scale-105 filter brightness-100' : 'filter brightness-80'
              }`}
            />
            {/* Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
          </div>

          {/* Header */}
          <div className="relative z-10 p-5 flex items-start justify-between">
            <div>
              <span className="font-cinzel text-[11px] tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                {hanetsu.role} · {hanetsu.gender}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="font-cinzel text-2xl font-black tracking-widest text-white">
                  {hanetsu.name}
                </h3>
                <span className="font-cinzel text-xs text-slate-400 font-light">{hanetsu.kanji}</span>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded border flex items-center justify-center ${
                selectedCharId === 'hanetsu'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-slate-800 bg-black/60 text-slate-500'
              }`}
            >
              <Zap className="w-4 h-4" />
            </div>
          </div>

          {/* Active indicator bar */}
          {selectedCharId === 'hanetsu' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#38bdf8]" />
          )}

          {/* Bottom stats and quote */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 space-y-3 bg-gradient-to-t from-black via-black/95 to-transparent">
            <p className="font-sans text-xs text-slate-300 line-clamp-2 leading-relaxed">
              &ldquo;{hanetsu.description}&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px] font-cinzel">
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Primary Weapon</span>
                <span className="text-slate-200 font-semibold">{hanetsu.weapon}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Starting Echo</span>
                <span className="text-cyan-300 font-semibold">{hanetsu.startingEcho.abilityName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('hanetsu');
              }}
              className={`w-full py-2.5 font-cinzel text-xs tracking-[0.25em] uppercase font-bold transition-all rounded cursor-pointer ${
                selectedCharId === 'hanetsu'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {selectedCharId === 'hanetsu' ? 'CONFIRM VESSEL' : 'SELECT HANETSU'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Control Hints Bar */}
      <footer className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-4 border-t border-slate-900 bg-black/70 backdrop-blur-sm text-xs font-cinzel text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold uppercase">SELECTED VESSEL:</span>
          <span className="text-slate-200 tracking-wider font-semibold">{currentHero.name}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 italic font-sans text-[11px]">
            &ldquo;{currentHero.quote}&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] sm:text-[11px] tracking-widest text-slate-500 uppercase">
          <span>
            <span className="text-amber-400 font-bold mr-1">[A / D]</span> CHOOSE VESSEL
          </span>
          <span>·</span>
          <span>
            <span className="text-amber-400 font-bold mr-1">[ENTER]</span> CONFIRM
          </span>
          <span>·</span>
          <span>
            <span className="text-amber-400 font-bold mr-1">[ESC]</span> BACK
          </span>
        </div>
      </footer>

      {/* 5. Explicit Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#090d14] border border-amber-500/60 rounded p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4 text-center">
            <span className="text-[11px] font-cinzel tracking-[0.3em] text-amber-400 uppercase font-semibold block">
              AWAKENING CONSECRATION
            </span>

            <h3 className="font-cinzel text-2xl font-black uppercase text-white tracking-widest">
              CONFIRM {currentHero.name}?
            </h3>

            <div className="p-3 bg-black/50 border border-slate-800 rounded text-left text-xs space-y-2 font-cinzel">
              <div className="flex justify-between">
                <span className="text-slate-500">WEAPON:</span>
                <span className="text-slate-200">{currentHero.weapon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DIVINE GIFT:</span>
                <span className="text-cyan-300 font-semibold">{currentHero.ability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">INITIAL RESONANCE:</span>
                <span className="text-amber-300">{currentHero.startingEcho.abilityName}</span>
              </div>
            </div>

            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              Awaken beneath the ruins of Minakami and assume the echoes of the fallen.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playBack();
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-cinzel text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                GO BACK
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playConfirm();
                  onConfirmCharacter(selectedCharId);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-cinzel text-xs tracking-wider uppercase font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                CONFIRM CHARACTER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
