import React, { useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { ArrowLeft, Check, Sparkles, Shield, Zap, Swords } from 'lucide-react';

interface CharacterSelectProps {
  onBack: () => void;
  onConfirmCharacter: (characterId: CharacterId) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onBack,
  onConfirmCharacter,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<CharacterId | null>(null);
  const [hoveredCharId, setHoveredCharId] = useState<CharacterId | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const kiyoji = CHARACTERS.kiyoji;
  const hanetsu = CHARACTERS.hanetsu;

  const handleSelect = (id: CharacterId) => {
    soundEngine.playSelect();
    setSelectedCharId(id);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!selectedCharId) return;
    soundEngine.playConfirm();
    onConfirmCharacter(selectedCharId);
  };

  const handleCancelModal = () => {
    soundEngine.playBack();
    setShowConfirmModal(false);
  };

  return (
    <div className="relative z-30 w-full h-full min-h-screen flex flex-col justify-between px-6 sm:px-12 py-8 bg-gradient-to-b from-black/85 via-black/70 to-black/90 backdrop-blur-[2px] transition-all duration-700 select-none animate-fadeIn">
      {/* Top Bar: Return Button & Title Lockup */}
      <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-4">
        <button
          onClick={() => {
            soundEngine.playBack();
            onBack();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="group flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40 rounded transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel text-xs tracking-[0.2em] uppercase font-semibold">
            RETURN TO TITLE
          </span>
        </button>

        <div className="text-center">
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl tracking-[0.3em] font-bold uppercase text-gold-gradient">
            SELECT YOUR FATE
          </h2>
          <p className="font-cinzel text-[11px] sm:text-xs tracking-[0.25em] text-slate-300/80 uppercase mt-1">
            &ldquo;Two souls. One shattered world. Countless echoes.&rdquo;
          </p>
        </div>

        <div className="w-32 hidden sm:block text-right">
          <span className="text-[10px] font-cinzel tracking-widest text-slate-500 uppercase">
            VESSEL AWAKENING
          </span>
        </div>
      </div>

      {/* Main Character Showcase: Equal 2-Column Split */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 py-4 my-auto max-w-6xl mx-auto w-full">
        {/* CHARACTER A: KIYOJI */}
        <div
          onClick={() => handleSelect('kiyoji')}
          onMouseEnter={() => {
            soundEngine.playHover();
            setHoveredCharId('kiyoji');
          }}
          onMouseLeave={() => setHoveredCharId(null)}
          className={`group relative flex-1 w-full max-w-md lg:max-w-none h-[480px] sm:h-[540px] md:h-[580px] rounded-lg overflow-hidden border transition-all duration-500 cursor-pointer ${
            hoveredCharId === 'kiyoji' || selectedCharId === 'kiyoji'
              ? 'border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.25)] scale-[1.01]'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          {/* Character Full Concept Artwork */}
          <div className="absolute inset-0 overflow-hidden bg-slate-950">
            <img
              src={kiyoji.imagePath}
              alt={kiyoji.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
                hoveredCharId === 'kiyoji' ? 'scale-105 filter brightness-110' : 'filter brightness-90'
              }`}
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-[#04060a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#04060a]/60 via-transparent to-transparent" />
            
            {/* Spectral Aura on hover */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                hoveredCharId === 'kiyoji' ? 'opacity-100' : 'opacity-0'
              } bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)]`}
            />
          </div>

          {/* Top Identifier */}
          <div className="relative z-10 p-5 flex items-start justify-between">
            <div>
              <span className="font-cinzel text-xs tracking-[0.3em] text-amber-400/90 uppercase font-semibold">
                {kiyoji.role} · {kiyoji.gender}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-cinzel text-2xl font-black tracking-widest text-white">
                  {kiyoji.name}
                </span>
                <span className="text-sm font-light text-slate-400 font-cinzel">
                  {kiyoji.kanji}
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center bg-black/60 group-hover:border-amber-400/60 transition-colors">
              <Swords className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          {/* Bottom Details Section */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent">
            {/* Tagline / Description */}
            <p className="font-sans text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
              &ldquo;{kiyoji.description}&rdquo;
            </p>

            {/* Combat Specs */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-cinzel">
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Primary Weapon</span>
                <span className="text-slate-200 font-semibold">{kiyoji.weapon}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Divine Affinity</span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> {kiyoji.ability}
                </span>
              </div>
            </div>

            {/* Starting Echo Hint */}
            <div className="bg-slate-900/80 border border-slate-800 rounded p-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-cinzel tracking-widest text-slate-400 uppercase block">
                  Inherited Awakening Echo
                </span>
                <span className="text-amber-200 font-medium font-cinzel text-xs">
                  {kiyoji.startingEcho.abilityName}
                </span>
              </div>
              <span className="text-[10px] font-cinzel text-cyan-400 uppercase tracking-widest px-2 py-0.5 border border-cyan-800/60 rounded">
                + Parry Arts
              </span>
            </div>

            {/* Select Button Hint */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('kiyoji');
              }}
              className="w-full py-2.5 font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-slate-200 bg-slate-900 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-400 transition-all rounded cursor-pointer"
            >
              CHOOSE KIYOJI
            </button>
          </div>
        </div>

        {/* CHARACTER B: HANETSU */}
        <div
          onClick={() => handleSelect('hanetsu')}
          onMouseEnter={() => {
            soundEngine.playHover();
            setHoveredCharId('hanetsu');
          }}
          onMouseLeave={() => setHoveredCharId(null)}
          className={`group relative flex-1 w-full max-w-md lg:max-w-none h-[480px] sm:h-[540px] md:h-[580px] rounded-lg overflow-hidden border transition-all duration-500 cursor-pointer ${
            hoveredCharId === 'hanetsu' || selectedCharId === 'hanetsu'
              ? 'border-cyan-400/80 shadow-[0_0_35px_rgba(56,189,248,0.25)] scale-[1.01]'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          {/* Character Full Concept Artwork */}
          <div className="absolute inset-0 overflow-hidden bg-slate-950">
            <img
              src={hanetsu.imagePath}
              alt={hanetsu.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
                hoveredCharId === 'hanetsu' ? 'scale-105 filter brightness-110' : 'filter brightness-90'
              }`}
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-[#04060a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#04060a]/60 via-transparent to-transparent" />

            {/* Spectral Aura on hover */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                hoveredCharId === 'hanetsu' ? 'opacity-100' : 'opacity-0'
              } bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18)_0%,transparent_70%)]`}
            />
          </div>

          {/* Top Identifier */}
          <div className="relative z-10 p-5 flex items-start justify-between">
            <div>
              <span className="font-cinzel text-xs tracking-[0.3em] text-cyan-400/90 uppercase font-semibold">
                {hanetsu.role} · {hanetsu.gender}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-cinzel text-2xl font-black tracking-widest text-white">
                  {hanetsu.name}
                </span>
                <span className="text-sm font-light text-slate-400 font-cinzel">
                  {hanetsu.kanji}
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center bg-black/60 group-hover:border-cyan-400/60 transition-colors">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
          </div>

          {/* Bottom Details Section */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent">
            {/* Tagline / Description */}
            <p className="font-sans text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
              &ldquo;{hanetsu.description}&rdquo;
            </p>

            {/* Combat Specs */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-cinzel">
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Primary Weapon</span>
                <span className="text-slate-200 font-semibold">{hanetsu.weapon}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase block tracking-wider">Divine Affinity</span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> {hanetsu.ability}
                </span>
              </div>
            </div>

            {/* Starting Echo Hint */}
            <div className="bg-slate-900/80 border border-slate-800 rounded p-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-cinzel tracking-widest text-slate-400 uppercase block">
                  Inherited Awakening Echo
                </span>
                <span className="text-cyan-200 font-medium font-cinzel text-xs">
                  {hanetsu.startingEcho.abilityName}
                </span>
              </div>
              <span className="text-[10px] font-cinzel text-amber-400 uppercase tracking-widest px-2 py-0.5 border border-amber-800/60 rounded">
                + Arc Reach
              </span>
            </div>

            {/* Select Button Hint */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('hanetsu');
              }}
              className="w-full py-2.5 font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-slate-200 bg-slate-900 hover:bg-cyan-600/30 border border-slate-700 hover:border-cyan-400 transition-all rounded cursor-pointer"
            >
              CHOOSE HANETSU
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between w-full border-t border-slate-800/80 pt-4 text-xs font-cinzel text-slate-400">
        <span>VESSEL SELECTION · 2 SOULS AVAILABLE</span>
        <span className="tracking-widest uppercase">THE RUINS OF MINAKAMI</span>
      </div>

      {/* CONFIRMATION MODAL OVERLAY */}
      {showConfirmModal && selectedCharId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#070b12] border border-amber-500/50 rounded-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-6">
            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <span className="text-[11px] font-cinzel tracking-[0.3em] text-amber-400 uppercase font-semibold">
                CONFIRM INHERITANCE
              </span>
              <h3 className="font-cinzel text-3xl font-black tracking-widest uppercase text-white">
                {CHARACTERS[selectedCharId].name}
              </h3>
              <p className="font-cinzel text-xs text-slate-400 italic">
                &ldquo;{CHARACTERS[selectedCharId].quote}&rdquo;
              </p>
            </div>

            {/* Character Summary in modal */}
            <div className="space-y-3 bg-black/40 p-4 rounded border border-slate-800/80 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500 uppercase font-cinzel">Role & Weapon</span>
                <span className="font-medium text-amber-200">{CHARACTERS[selectedCharId].weapon}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500 uppercase font-cinzel">Core Supernatural Gift</span>
                <span className="font-medium text-cyan-300">THE ECHO INHERITANCE</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500 uppercase font-cinzel">Initial Echo</span>
                <span className="font-medium text-slate-200">{CHARACTERS[selectedCharId].startingEcho.title}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-center font-sans">
              Are you prepared to awaken beneath the ruins of Minakami and assume the memories of the fallen?
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleCancelModal}
                className="flex-1 py-3 px-4 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-cinzel text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                GO BACK
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded border border-amber-400/80 bg-gradient-to-r from-amber-600/80 to-amber-700/80 hover:from-amber-500 hover:to-amber-600 text-black font-cinzel text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-black" />
                CONFIRM CHARACTER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
