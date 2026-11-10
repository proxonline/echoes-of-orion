import React, { useState, useEffect } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { LORE_ENTRIES, CHARACTERS, CREDITS_DATA, ASSET_PATHS } from '../data/gameData';
import { BookOpen, Users, Sparkles, Award, Image, ArrowLeft } from 'lucide-react';

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
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-[#040508] text-[#ede8dc] select-none overflow-hidden animate-fadeIn">
      {/* Background Environment */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.settingsChamber}
          alt="Ancient sanctuary"
          className="w-full h-full object-cover object-center filter brightness-[0.3] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508]/95 via-[#040508]/85 to-[#040508]/75" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-5 border-b border-[#181d26] bg-[#040508]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="group flex items-center gap-2 text-[#848c98] hover:text-[#ede8dc] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-ui text-xs tracking-widest uppercase font-semibold">
              BACK [ESC]
            </span>
          </button>

          <div className="h-4 w-[1px] bg-[#222834]" />

          <h2 className="font-title text-lg sm:text-xl font-bold tracking-[0.24em] uppercase text-[#ede8dc]">
            CHRONICLE ARCHIVE & EXTRAS
          </h2>
        </div>

        <span className="text-xs font-mono text-[#5a6270] hidden sm:block">
          ECHOES OF ORION CODEX
        </span>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="relative z-10 flex border-b border-[#181d26] bg-[#07090e]/80 px-8 sm:px-12 overflow-x-auto">
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
              className={`flex items-center gap-2 py-3 px-5 font-ui text-xs tracking-[0.18em] uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5'
                  : 'border-transparent text-[#7d848f] hover:text-[#ded9cd]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Center Body */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 sm:px-12 py-6 max-w-6xl mx-auto w-full custom-scroll">
        {/* TAB 1: WORLD LORE */}
        {activeTab === 'lore' && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-2 border-b md:border-b-0 md:border-r border-[#181d26] pb-4 md:pb-0 md:pr-6">
              <span className="text-[10px] font-ui tracking-[0.25em] text-[#5a6270] uppercase block mb-3 font-semibold">
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
                    className={`w-full text-left p-3 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#c5a059]/70 bg-[#c5a059]/10 text-[#ede8dc]'
                        : 'border-[#181d26] bg-[#07090e] text-[#848c98] hover:border-[#2e3442] hover:text-[#ded9cd]'
                    }`}
                  >
                    <span className="text-[9px] font-mono tracking-wider text-[#6b7382] block uppercase">
                      {entry.category}
                    </span>
                    <span className="font-title text-xs font-bold tracking-wide block mt-0.5">
                      {entry.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="w-full md:w-2/3 space-y-4">
              <div className="border-b border-[#181d26] pb-3">
                <span className="text-[10px] font-ui tracking-[0.25em] text-[#c5a059] uppercase font-semibold">
                  {selectedLore.category} RECORD
                </span>
                <h3 className="font-title text-2xl font-bold tracking-wider text-[#ede8dc] uppercase mt-1">
                  {selectedLore.title}
                </h3>
                <p className="font-ui text-xs text-[#848c98] italic mt-0.5">
                  {selectedLore.subtitle}
                </p>
              </div>

              <div className="space-y-4 font-ui text-sm text-[#b8b3a7] leading-relaxed">
                {selectedLore.content.map((paragraph, index) => (
                  <p key={index} className="text-[#a0a6b2]">
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
                className="bg-[#07090e] border border-[#181d26] overflow-hidden flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={char.imagePath}
                    alt={char.name}
                    className="w-full h-full object-cover object-top filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-ui tracking-widest text-[#c5a059] uppercase">
                      {char.role} · {char.gender}
                    </span>
                    <h4 className="font-title text-2xl font-bold tracking-wider text-[#ede8dc]">
                      {char.name}
                    </h4>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="font-ui text-xs text-[#b8b3a7] leading-relaxed">
                    &ldquo;{char.description}&rdquo;
                  </p>
                  <p className="font-kanji text-xs text-[#7d848f] italic">
                    &ldquo;{char.quote}&rdquo;
                  </p>

                  <div className="border-t border-[#181d26] pt-3 space-y-2 text-xs font-ui">
                    <div className="flex justify-between text-[#6b7382]">
                      <span className="uppercase text-[11px]">Weapon:</span>
                      <span className="text-[#ded9cd] font-medium">{char.weapon}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7382]">
                      <span className="uppercase text-[11px]">Martial Discipline:</span>
                      <span className="text-[#ded9cd]">{char.specialty}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7382]">
                      <span className="uppercase text-[11px]">Divine Gift:</span>
                      <span className="text-[#c5a059] font-medium">{char.ability}</span>
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
            <div className="border-b border-[#181d26] pb-3">
              <span className="text-[10px] font-ui tracking-[0.25em] text-[#c5a059] uppercase font-semibold">
                CENTRAL LORE & MECHANICS
              </span>
              <h3 className="font-title text-2xl font-bold tracking-wider text-[#ede8dc] uppercase mt-1">
                THE ECHO INHERITANCE
              </h3>
              <p className="font-ui text-xs text-[#848c98] italic mt-0.5">
                &ldquo;Every deceased person leaves behind an echo containing fragments of their knowledge,
                talents, combat abilities, and memories.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#07090e] border border-[#181d26] space-y-2">
                <span className="text-[10px] font-ui tracking-widest text-[#c5a059] uppercase font-bold">
                  01. ANCESTRAL WISDOM
                </span>
                <h4 className="font-title text-sm font-bold text-[#ede8dc]">Approaching the Fallen</h4>
                <p className="text-xs text-[#848c98] font-ui leading-relaxed">
                  The bodies of fallen villagers and temple artisans radiate faint spiritual echoes.
                  Stepping near initiates resonance.
                </p>
              </div>

              <div className="p-5 bg-[#07090e] border border-[#181d26] space-y-2">
                <span className="text-[10px] font-ui tracking-widest text-[#c5a059] uppercase font-bold">
                  02. MEMORY WEAVING
                </span>
                <h4 className="font-title text-sm font-bold text-[#ede8dc]">Inheriting Talent</h4>
                <p className="text-xs text-[#848c98] font-ui leading-relaxed">
                  Absorbing an echo permanently weaves ancestral muscle memory: master parries, celestial
                  slashes, and counter-deflections.
                </p>
              </div>

              <div className="p-5 bg-[#07090e] border border-[#181d26] space-y-2">
                <span className="text-[10px] font-ui tracking-widest text-[#c5a059] uppercase font-bold">
                  03. DIVINE RESISTANCE
                </span>
                <h4 className="font-title text-sm font-bold text-[#ede8dc]">Piercing the Rift</h4>
                <p className="text-xs text-[#848c98] font-ui leading-relaxed">
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
            <div className="relative h-96 border border-[#181d26] overflow-hidden bg-black">
              <img
                src={activeGalleryImage}
                alt="Selected Concept Artwork"
                className="w-full h-full object-contain filter brightness-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <span className="text-[11px] font-title text-[#c5a059] uppercase tracking-widest font-bold">
                  {galleryItems.find((g) => g.path === activeGalleryImage)?.title}
                </span>
                <p className="text-xs text-[#b8b3a7] font-ui mt-0.5">
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
                  className={`h-20 border overflow-hidden transition-all cursor-pointer ${
                    activeGalleryImage === item.path
                      ? 'border-[#c5a059] ring-1 ring-[#c5a059]'
                      : 'border-[#181d26] opacity-50 hover:opacity-100'
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
              <h3 className="font-title text-3xl font-black uppercase text-[#ede8dc] tracking-widest">
                ECHOES OF ORION
              </h3>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#5a6270] uppercase block">
                PRODUCTION COUNCIL & CREDITS
              </span>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#181d26]">
              {CREDITS_DATA.map((item, index) => (
                <div key={index} className="space-y-0.5">
                  <span className="text-[10px] font-ui tracking-widest text-[#6b7382] uppercase block">
                    {item.role}
                  </span>
                  <span className="font-title text-sm font-bold text-[#ede8dc] tracking-wider">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-3 border-t border-[#181d26] bg-[#040508]/80 backdrop-blur-sm text-xs font-mono text-[#5a6270]">
        <span>ARCHIVE INSPECTION MODE</span>
        <span>[ESC] RETURN TO TITLE</span>
      </footer>
    </div>
  );
};
