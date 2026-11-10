import React, { useState, useEffect } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { LORE_ENTRIES, CHARACTERS, CREDITS_DATA, ASSET_PATHS } from '../data/gameData';
import { BookOpen, Users, Sparkles, Award, Image, ArrowLeft, Volume2 } from 'lucide-react';

interface ExtrasModalProps {
  onClose: () => void;
}

type ExtraCategory = 'lore' | 'characters' | 'echo_system' | 'gallery' | 'credits';

export const ExtrasModal: React.FC<ExtrasModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<ExtraCategory>('lore');
  const [selectedLoreId, setSelectedLoreId] = useState<string>(LORE_ENTRIES[0].id);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string>(ASSET_PATHS.titleEnvironment);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playBack();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const selectedLore = LORE_ENTRIES.find((l) => l.id === selectedLoreId) || LORE_ENTRIES[0];

  const galleryItems = [
    { title: 'The Ruined Village of Minakami', path: ASSET_PATHS.titleEnvironment, desc: 'Catastrophic celestial descent over the ancient timber pagoda.' },
    { title: 'Kiyoji — The Silent Wanderer', path: ASSET_PATHS.kiyojiCharacter, desc: 'Male survivor concept with weathered katana and spectral wisp.' },
    { title: 'Hanetsu — The Crescent Sentinel', path: ASSET_PATHS.hanetsuCharacter, desc: 'Female survivor concept with crescent moon glaive.' },
    { title: 'The Orion Celestial Sigil', path: ASSET_PATHS.orionSigil, desc: 'Ancient astronomical ring and the central rift.' },
    { title: 'Sanctuary Interior Chamber', path: ASSET_PATHS.settingsChamber, desc: 'Ancient stone temple chamber and lantern flame.' },
    { title: 'Sacred Mountain Shrine Steps', path: ASSET_PATHS.characterSelectEnvironment, desc: 'Ruined torii and midnight mountain mist.' },
  ];

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-black text-slate-100 select-none overflow-hidden animate-fadeIn">
      {/* Background Environment */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.settingsChamber}
          alt="Ancient sanctuary"
          className="w-full h-full object-cover object-center filter brightness-[0.3] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/75" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-6 border-b border-slate-900 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="group flex items-center gap-2 px-3 py-1.5 border border-slate-800 hover:border-amber-500/60 text-slate-400 hover:text-amber-200 transition-colors rounded cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-cinzel text-xs tracking-widest uppercase font-semibold">
              BACK TO TITLE
            </span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          <h2 className="font-cinzel text-xl font-bold tracking-[0.25em] uppercase text-white">
            CHRONICLE ARCHIVE & EXTRAS
          </h2>
        </div>

        <span className="text-xs font-cinzel text-slate-500 hidden sm:block">
          ECHOES OF ORION CODEX
        </span>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="relative z-10 flex border-b border-slate-900 bg-black/50 px-8 sm:px-12 overflow-x-auto">
        {[
          { id: 'lore', label: 'WORLD LORE', icon: BookOpen },
          { id: 'characters', label: 'CHARACTER ARCHIVE', icon: Users },
          { id: 'echo_system', label: 'ECHO INHERITANCE', icon: Sparkles },
          { id: 'gallery', label: 'CONCEPT ART GALLERY', icon: Image },
          { id: 'credits', label: 'CREDITS', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundEngine.playSelect();
                setActiveTab(tab.id as ExtraCategory);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className={`flex items-center gap-2 py-3 px-5 font-cinzel text-xs tracking-[0.2em] uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Center Body */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 sm:px-12 py-6 max-w-6xl mx-auto w-full">
        {/* TAB 1: WORLD LORE */}
        {activeTab === 'lore' && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-2 border-b md:border-b-0 md:border-r border-slate-900 pb-4 md:pb-0 md:pr-6">
              <span className="text-[10px] font-cinzel tracking-[0.25em] text-slate-500 uppercase block mb-3 font-semibold">
                ANCIENT RECORDS
              </span>
              {LORE_ENTRIES.map((entry) => {
                const isSelected = selectedLoreId === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playSelect();
                      setSelectedLoreId(entry.id);
                    }}
                    onMouseEnter={() => soundEngine.playHover()}
                    className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400/80 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
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

            <div className="w-full md:w-2/3 space-y-4">
              <div className="border-b border-slate-900 pb-3">
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

        {/* TAB 2: CHARACTERS */}
        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[CHARACTERS.kiyoji, CHARACTERS.hanetsu].map((char) => (
              <div
                key={char.id}
                className="bg-black/60 border border-slate-800 rounded overflow-hidden flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={char.imagePath}
                    alt={char.name}
                    className="w-full h-full object-cover object-top filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
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
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">
                    &ldquo;{char.description}&rdquo;
                  </p>
                  <p className="font-cinzel text-xs text-amber-300/90 italic">
                    &ldquo;{char.quote}&rdquo;
                  </p>

                  <div className="border-t border-slate-900 pt-3 space-y-2 text-xs font-cinzel">
                    <div className="flex justify-between text-slate-400">
                      <span>Weapon:</span>
                      <span className="text-slate-200 font-semibold">{char.weapon}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Martial Discipline:</span>
                      <span className="text-slate-200">{char.specialty}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Divine Gift:</span>
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
            <div className="border-b border-slate-900 pb-3">
              <span className="text-[11px] font-cinzel tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                CENTRAL LORE & MECHANICS
              </span>
              <h3 className="font-cinzel text-2xl font-bold tracking-wider text-slate-100 uppercase mt-1">
                THE ECHO INHERITANCE
              </h3>
              <p className="font-cinzel text-xs text-amber-300/80 italic mt-0.5">
                &ldquo;Every deceased person leaves behind an echo containing fragments of their knowledge,
                talents, combat abilities, and memories.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-black/60 border border-slate-800 rounded space-y-2">
                <span className="text-[10px] font-cinzel tracking-widest text-amber-400 uppercase font-bold">
                  01. ANCESTRAL WISDOM
                </span>
                <h4 className="font-cinzel text-sm font-bold text-white">Approaching the Fallen</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  The bodies of fallen villagers and temple artisans radiate ethereal pale-blue energy.
                  Approaching them initiates resonance.
                </p>
              </div>

              <div className="p-5 bg-black/60 border border-slate-800 rounded space-y-2">
                <span className="text-[10px] font-cinzel tracking-widest text-cyan-400 uppercase font-bold">
                  02. MEMORY WEAVING
                </span>
                <h4 className="font-cinzel text-sm font-bold text-white">Inheriting Talent</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Absorbing an echo permanently transfers ancestral muscle memory: master parries, celestial
                  slashes, and counter-deflections.
                </p>
              </div>

              <div className="p-5 bg-black/60 border border-slate-800 rounded space-y-2">
                <span className="text-[10px] font-cinzel tracking-widest text-amber-400 uppercase font-bold">
                  03. DIVINE RESISTANCE
                </span>
                <h4 className="font-cinzel text-sm font-bold text-white">Piercing the Rift</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Normal steel cannot harm celestial entities. Only by channeling inherited echoes can the
                  protagonist shatter divine armor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ART GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="relative h-96 rounded border border-slate-800 overflow-hidden bg-black">
              <img
                src={activeGalleryImage}
                alt="Selected Concept Artwork"
                className="w-full h-full object-contain filter brightness-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <span className="text-[11px] font-cinzel text-amber-300 uppercase tracking-widest font-bold">
                  {galleryItems.find((g) => g.path === activeGalleryImage)?.title}
                </span>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  {galleryItems.find((g) => g.path === activeGalleryImage)?.desc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {galleryItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEngine.playSelect();
                    setActiveGalleryImage(item.path);
                  }}
                  className={`h-20 rounded border overflow-hidden transition-all cursor-pointer ${
                    activeGalleryImage === item.path
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.path} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CREDITS */}
        {activeTab === 'credits' && (
          <div className="max-w-xl mx-auto py-6 text-center space-y-6">
            <div className="space-y-1">
              <h3 className="font-cinzel-dec text-3xl font-black uppercase text-gold-gradient tracking-widest">
                ECHOES OF ORION
              </h3>
              <span className="text-[11px] font-cinzel tracking-[0.3em] text-slate-500 uppercase block">
                GAME CREDITS & PRODUCTION COUNCIL
              </span>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-900">
              {CREDITS_DATA.map((item, index) => (
                <div key={index} className="space-y-0.5">
                  <span className="text-[10px] font-cinzel tracking-widest text-slate-500 uppercase block">
                    {item.role}
                  </span>
                  <span className="font-cinzel text-sm font-bold text-slate-200 tracking-wider">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-4 border-t border-slate-900 bg-black/70 backdrop-blur-sm text-xs font-cinzel text-slate-500">
        <span>ARCHIVE INSPECTION MODE</span>
        <span>[ESC] RETURN TO TITLE</span>
      </footer>
    </div>
  );
};
