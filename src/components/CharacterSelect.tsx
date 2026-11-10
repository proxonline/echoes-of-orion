import React, { useState, useEffect } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS, ASSET_PATHS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { ArrowLeft, Check, Swords, Sparkles } from 'lucide-react';

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

  const handleSelectHero = (id: CharacterId) => {
    if (selectedCharId !== id) {
      soundEngine.playHover();
      setSelectedCharId(id);
    } else {
      soundEngine.playSelect();
      setShowConfirmModal(true);
    }
  };

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-[#040508] text-[#ede8dc] select-none overflow-hidden animate-fadeIn">
      {/* 1. Full-Screen Atmospheric Shrine Stage */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.characterSelectEnvironment}
          alt="Ancient shrine steps under midnight sky"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        {/* Controlled Scrims for environmental depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-transparent to-[#040508]/80" />
        <div className="absolute inset-0 cinematic-vignette opacity-80" />
      </div>

      {/* 2. Top Header Bar: Restrained, No Website Badges */}
      <header className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-6">
        <button
          type="button"
          onClick={() => {
            soundEngine.playBack();
            onBack();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="group flex items-center gap-2 text-[#848c98] hover:text-[#ede8dc] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-ui text-xs tracking-[0.2em] uppercase font-semibold">
            [ESC] RETURN TO TITLE
          </span>
        </button>

        <div className="text-center">
          <span className="font-ui text-[11px] tracking-[0.35em] text-[#c5a059] uppercase font-semibold block">
            VESSEL AWAKENING
          </span>
          <h2 className="font-title text-xl sm:text-2xl font-bold tracking-[0.28em] uppercase text-[#ede8dc] mt-0.5">
            SELECT YOUR FATE
          </h2>
        </div>

        <div className="w-36 text-right hidden sm:block">
          <span className="font-mono text-[10px] tracking-widest text-[#5a6270] uppercase">
            2 SOULS RECORDED
          </span>
        </div>
      </header>

      {/* 3. Hero Visual Stage (Two Protagonists Full-Figure Environmental Staging) */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-stretch justify-center max-w-6xl mx-auto w-full px-6 py-2 my-auto gap-6 lg:gap-12">
        {/* HERO 1: KIYOJI */}
        <div
          onClick={() => handleSelectHero('kiyoji')}
          className={`group relative flex-1 h-[460px] sm:h-[520px] md:h-[560px] cursor-pointer transition-all duration-500 overflow-hidden ${
            selectedCharId === 'kiyoji'
              ? 'opacity-100 scale-[1.01]'
              : 'opacity-40 hover:opacity-70 filter brightness-75'
          }`}
        >
          {/* Hero Figure */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={kiyoji.imagePath}
              alt={kiyoji.name}
              className={`w-full h-full object-cover object-top transition-all duration-700 ${
                selectedCharId === 'kiyoji' ? 'scale-105 filter brightness-105' : 'filter brightness-75'
              }`}
            />
            {/* Ground mist and gradient blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040508]/60 via-transparent to-transparent" />
          </div>

          {/* Stance Indicator Line on Active Selection */}
          {selectedCharId === 'kiyoji' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent shadow-[0_0_10px_rgba(197,160,89,0.7)]" />
          )}

          {/* Minimalist Top Identifier */}
          <div className="relative z-10 p-6 flex items-start justify-between">
            <div>
              <span className="font-ui text-[11px] tracking-[0.25em] text-[#848c98] uppercase font-semibold">
                {kiyoji.role} · {kiyoji.gender}
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <h3 className="font-title text-3xl font-bold tracking-[0.2em] text-[#ede8dc]">
                  {kiyoji.name}
                </h3>
                <span className="font-kanji text-base text-[#7d848f] font-normal">
                  {kiyoji.kanji}
                </span>
              </div>
            </div>

            {selectedCharId === 'kiyoji' && (
              <div className="px-2 py-0.5 border border-[#c5a059]/40 bg-black/60 text-[#c5a059] font-ui text-[10px] tracking-widest uppercase">
                ACTIVE
              </div>
            )}
          </div>
        </div>

        {/* HERO 2: HANETSU */}
        <div
          onClick={() => handleSelectHero('hanetsu')}
          className={`group relative flex-1 h-[460px] sm:h-[520px] md:h-[560px] cursor-pointer transition-all duration-500 overflow-hidden ${
            selectedCharId === 'hanetsu'
              ? 'opacity-100 scale-[1.01]'
              : 'opacity-40 hover:opacity-70 filter brightness-75'
          }`}
        >
          {/* Hero Figure */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={hanetsu.imagePath}
              alt={hanetsu.name}
              className={`w-full h-full object-cover object-top transition-all duration-700 ${
                selectedCharId === 'hanetsu' ? 'scale-105 filter brightness-105' : 'filter brightness-75'
              }`}
            />
            {/* Ground mist and gradient blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040508]/60 via-transparent to-transparent" />
          </div>

          {/* Stance Indicator Line on Active Selection */}
          {selectedCharId === 'hanetsu' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent shadow-[0_0_10px_rgba(197,160,89,0.7)]" />
          )}

          {/* Minimalist Top Identifier */}
          <div className="relative z-10 p-6 flex items-start justify-between">
            <div>
              <span className="font-ui text-[11px] tracking-[0.25em] text-[#848c98] uppercase font-semibold">
                {hanetsu.role} · {hanetsu.gender}
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <h3 className="font-title text-3xl font-bold tracking-[0.2em] text-[#ede8dc]">
                  {hanetsu.name}
                </h3>
                <span className="font-kanji text-base text-[#7d848f] font-normal">
                  {hanetsu.kanji}
                </span>
              </div>
            </div>

            {selectedCharId === 'hanetsu' && (
              <div className="px-2 py-0.5 border border-[#c5a059]/40 bg-black/60 text-[#c5a059] font-ui text-[10px] tracking-widest uppercase">
                ACTIVE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Active Hero Dossier Strip (Unboxed, Sophisticated Console Game Layout) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-8 pb-4 text-center">
        <div className="space-y-2 border-t border-[#1e232d] pt-4">
          <p className="font-ui text-xs text-[#b8b3a7] max-w-2xl mx-auto leading-relaxed">
            &ldquo;{currentHero.description}&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-1 text-[11px] font-ui text-[#848c98]">
            <div>
              <span className="text-[#5a6270] uppercase mr-2 tracking-wider">Primary Weapon:</span>
              <span className="text-[#ede8dc] font-medium">{currentHero.weapon}</span>
            </div>
            <span className="text-[#2e3440]">·</span>
            <div>
              <span className="text-[#5a6270] uppercase mr-2 tracking-wider">Awakening Echo:</span>
              <span className="text-[#c5a059] font-medium">{currentHero.startingEcho.abilityName}</span>
            </div>
            <span className="text-[#2e3440]">·</span>
            <div>
              <span className="text-[#5a6270] uppercase mr-2 tracking-wider">Divine Affinity:</span>
              <span className="text-[#ded9cd] font-medium">{currentHero.ability}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation Bar */}
      <footer className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-4 border-t border-[#141820] bg-black/80 backdrop-blur-sm text-xs font-ui text-[#848c98]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#5a6270] uppercase">[A / D] SWITCH VESSEL</span>
          <span className="text-[#2e3440]">·</span>
          <span className="italic text-[#7d848f] text-[11px] font-kanji hidden sm:inline">
            &ldquo;{currentHero.quote}&rdquo;
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            setShowConfirmModal(true);
          }}
          className="px-6 py-2 border border-[#c5a059]/70 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#ede8dc] hover:text-[#fff] font-title text-xs tracking-[0.22em] uppercase font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <Check className="w-3.5 h-3.5 text-[#c5a059]" />
          [ENTER] CONFIRM {currentHero.name}
        </button>
      </footer>

      {/* 6. Explicit Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0a0d14] border border-[#2e3442] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.95)] space-y-5 text-center">
            <span className="text-[10px] font-ui tracking-[0.3em] text-[#c5a059] uppercase font-semibold block">
              AWAKENING CONSECRATION
            </span>

            <h3 className="font-title text-2xl font-bold uppercase text-[#ede8dc] tracking-[0.2em]">
              CONFIRM {currentHero.name}?
            </h3>

            <div className="p-3 bg-[#06080c] border border-[#1e232d] text-left text-xs space-y-2 font-ui">
              <div className="flex justify-between">
                <span className="text-[#5a6270] uppercase">WEAPON:</span>
                <span className="text-[#ded9cd] font-medium">{currentHero.weapon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a6270] uppercase">DIVINE GIFT:</span>
                <span className="text-[#c5a059] font-medium">{currentHero.ability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a6270] uppercase">STARTING ECHO:</span>
                <span className="text-[#ded9cd] font-medium">{currentHero.startingEcho.abilityName}</span>
              </div>
            </div>

            <p className="font-ui text-xs text-[#848c98] leading-relaxed">
              Awaken beneath the ruins of Minakami and assume the echoes of the fallen.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playBack();
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 border border-[#2e3442] hover:border-[#434b5c] text-[#848c98] hover:text-[#ede8dc] font-ui text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                GO BACK [ESC]
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playConfirm();
                  onConfirmCharacter(selectedCharId);
                }}
                className="flex-1 py-2.5 border border-[#c5a059] bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#ede8dc] font-title text-xs tracking-[0.2em] uppercase font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-3.5 h-3.5 text-[#c5a059]" />
                CONFIRM [ENTER]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
