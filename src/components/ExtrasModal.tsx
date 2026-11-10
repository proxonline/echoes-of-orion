import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { LORE_ENTRIES, CHARACTERS, CREDITS_DATA } from '../data/gameData';
import { X, BookOpen, Users, Sparkles, Award } from 'lucide-react';

interface ExtrasModalProps {
  onClose: () => void;
}

type ExtraCategory = 'world_lore' | 'character_archive' | 'echo_system' | 'credits';

export const ExtrasModal: React.FC<ExtrasModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<ExtraCategory>('world_lore');
  const [selectedLoreId, setSelectedLoreId] = useState<string>(LORE_ENTRIES[0].id);

  const selectedLore = LORE_ENTRIES.find((l) => l.id === selectedLoreId) || LORE_ENTRIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-4xl bg-[#070a10] border border-slate-700/80 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090e18]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rotate-45 bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <h2 className="font-cinzel text-xl font-bold tracking-[0.2em] uppercase text-white">
              CHRONICLES & ARCHIVES
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-1.5 text-slate-400 hover:text-white rounded border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Close Extras"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-black/40 px-6 overflow-x-auto">
          {[
            { id: 'world_lore', label: 'WORLD LORE', icon: BookOpen },
            { id: 'character_archive', label: 'CHARACTER ARCHIVE', icon: Users },
            { id: 'echo_system', label: 'ECHO SYSTEM', icon: Sparkles },
            { id: 'credits', label: 'GAME CREDITS', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playSelect();
                  setActiveTab(tab.id as ExtraCategory);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`flex items-center gap-2 py-3 px-4 font-cinzel text-xs tracking-[0.2em] uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: WORLD LORE */}
          {activeTab === 'world_lore' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Lore Index List (Left) */}
              <div className="w-full md:w-1/3 space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
                <span className="text-[10px] font-cinzel tracking-[0.2em] text-slate-500 uppercase block mb-3 font-semibold">
                  RECORDED SCROLLS
                </span>
                {LORE_ENTRIES.map((entry) => {
                  const isSelected = selectedLoreId === entry.id;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        soundEngine.playSelect();
                        setSelectedLoreId(entry.id);
                      }}
                      onMouseEnter={() => soundEngine.playHover()}
                      className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400/80 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
                      }`}
                    >
                      <span className="text-[10px] font-cinzel tracking-wider text-slate-400 block uppercase">
                        {entry.category}
                      </span>
                      <span className="font-cinzel text-xs font-bold tracking-wide block mt-0.5">
                        {entry.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Lore Reading Sheet (Right) */}
              <div className="w-full md:w-2/3 space-y-4 md:pl-2">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-cinzel tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                    {selectedLore.category} RECORD
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold tracking-wider text-slate-100 uppercase mt-1">
                    {selectedLore.title}
                  </h3>
                  <p className="font-cinzel text-xs text-amber-300/80 italic mt-0.5">
                    {selectedLore.subtitle}
                  </p>
                </div>

                <div className="space-y-4 font-sans text-sm text-slate-300 leading-relaxed">
                  {selectedLore.content.map((paragraph, index) => (
                    <p key={index} className="text-slate-300/90">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHARACTER ARCHIVE */}
          {activeTab === 'character_archive' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[CHARACTERS.kiyoji, CHARACTERS.hanetsu].map((char) => (
                <div
                  key={char.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={char.imagePath}
                      alt={char.name}
                      className="w-full h-full object-cover object-top filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-cinzel tracking-widest text-amber-400 uppercase">
                        {char.role} · {char.gender}
                      </span>
                      <h4 className="font-cinzel text-2xl font-bold tracking-wider text-white">
                        {char.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="font-sans text-xs text-slate-300 leading-relaxed">
                        &ldquo;{char.description}&rdquo;
                      </p>
                      <p className="font-cinzel text-xs text-amber-300/90 italic">
                        &ldquo;{char.quote}&rdquo;
                      </p>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 space-y-2 text-xs font-cinzel">
                      <div className="flex justify-between text-slate-400">
                        <span>Weapon:</span>
                        <span className="text-slate-200 font-semibold">{char.weapon}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Martial Style:</span>
                        <span className="text-slate-200">{char.specialty}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Divine Ability:</span>
                        <span className="text-cyan-300 font-semibold">{char.ability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ECHO SYSTEM */}
          {activeTab === 'echo_system' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-cinzel tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                  CORE GAMEPLAY PILLAR
                </span>
                <h3 className="font-cinzel text-2xl font-bold tracking-wider text-slate-100 uppercase mt-1">
                  THE ECHO INHERITANCE ARCHITECTURE
                </h3>
                <p className="font-cinzel text-xs text-amber-300/80 italic mt-0.5">
                  &ldquo;Every deceased person leaves behind an echo containing fragments of their knowledge,
                  talents, combat abilities, and memories.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                  <span className="text-[10px] font-cinzel tracking-widest text-amber-400 uppercase font-bold">
                    01. RESONANCE COMMUNION
                  </span>
                  <h4 className="font-cinzel text-sm font-bold text-white">Approaching the Fallen</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    When exploring destroyed shrines, barricades, and ruined homes, remnants of the fallen
                    glow with faint pale-blue spectral auras. Stepping near initiates spiritual resonance.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/80 border border-cyan-800/50 rounded-lg space-y-2">
                  <span className="text-[10px] font-cinzel tracking-widest text-cyan-400 uppercase font-bold">
                    02. MEMORY ABSORPTION
                  </span>
                  <h4 className="font-cinzel text-sm font-bold text-white">Inheriting Talent</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Absorbing an echo permanently weaves ancestral muscle memory: blacksmiths teach sword
                    tempering, temple guards bestow counter-deflections, and high oracles unveil celestial vision.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                  <span className="text-[10px] font-cinzel tracking-widest text-amber-400 uppercase font-bold">
                    03. SUPERNATURAL COMBAT
                  </span>
                  <h4 className="font-cinzel text-sm font-bold text-white">Piercing the Divine</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Normal steel shatters against celestial beings. By chaining inherited echoes in battle,
                    the protagonist manifests spectral blades capable of severing divine rifts.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded text-xs font-cinzel text-slate-300 space-y-1">
                <span className="text-amber-400 uppercase tracking-widest font-semibold block">
                  CANON INVENTORY NOTICE
                </span>
                <p className="text-slate-400 font-sans">
                  The Echo Inheritance is an exclusive vessel gift. All discovered echoes will be recorded in
                  the Chronicle Codex during the prologue journey.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: GAME CREDITS */}
          {activeTab === 'credits' && (
            <div className="space-y-6 max-w-xl mx-auto py-4 text-center">
              <div className="space-y-1">
                <h3 className="font-cinzel-dec text-3xl font-black uppercase text-gold-gradient tracking-widest">
                  ECHOES OF ORION
                </h3>
                <span className="text-[11px] font-cinzel tracking-[0.3em] text-slate-500 uppercase block">
                  PRE-ALPHA BUILD CREDITS
                </span>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                {CREDITS_DATA.map((item, index) => (
                  <div key={index} className="space-y-0.5">
                    <span className="text-[11px] font-cinzel tracking-widest text-slate-400 uppercase block">
                      {item.role}
                    </span>
                    <span className="font-cinzel text-sm font-bold text-slate-100 tracking-wider">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#090e18] flex justify-end">
          <button
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            className="px-6 py-2 border border-slate-700 hover:border-slate-600 rounded text-xs font-cinzel uppercase text-slate-300 cursor-pointer"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
