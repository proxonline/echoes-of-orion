import React, { useState, useEffect } from 'react';
import { SaveSlot, CharacterId } from '../types/game';
import { CHARACTERS, ASSET_PATHS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { Play, Trash2, ArrowLeft } from 'lucide-react';

interface LoadGameModalProps {
  saveSlots: SaveSlot[];
  onLoadSlot: (slot: SaveSlot) => void;
  onNewGameSlot: (slotId: number) => void;
  onDeleteSlot: (slotId: number) => void;
  onClose: () => void;
}

export const LoadGameModal: React.FC<LoadGameModalProps> = ({
  saveSlots,
  onLoadSlot,
  onNewGameSlot,
  onDeleteSlot,
  onClose,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<number>(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const selectedSlot = saveSlots.find((s) => s.id === selectedSlotId) || saveSlots[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (deleteConfirmId) {
        if (e.key === 'Escape') {
          e.preventDefault();
          soundEngine.playBack();
          setDeleteConfirmId(null);
        }
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        soundEngine.playHover();
        setSelectedSlotId((prev) => (prev > 1 ? prev - 1 : saveSlots.length));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        soundEngine.playHover();
        setSelectedSlotId((prev) => (prev < saveSlots.length ? prev + 1 : 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSlot.isEmpty) {
          onNewGameSlot(selectedSlot.id);
        } else {
          soundEngine.playConfirm();
          onLoadSlot(selectedSlot);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playBack();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSlotId, selectedSlot, saveSlots, deleteConfirmId, onLoadSlot, onNewGameSlot, onClose]);

  const handleSelectSlot = (id: number) => {
    soundEngine.playHover();
    setSelectedSlotId(id);
    setDeleteConfirmId(null);
  };

  const handleAction = (slot: SaveSlot) => {
    if (slot.isEmpty) {
      onNewGameSlot(slot.id);
    } else {
      soundEngine.playConfirm();
      onLoadSlot(slot);
    }
  };

  const handleDelete = (id: number) => {
    soundEngine.playBack();
    onDeleteSlot(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-[#040508] text-[#ede8dc] select-none overflow-hidden animate-fadeIn">
      {/* Background Environment */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.settingsChamber}
          alt="Ancient stone sanctuary chamber"
          className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-105"
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
            LOAD CHRONICLE
          </h2>
        </div>

        <span className="text-xs font-mono text-[#5a6270] hidden sm:block">
          RECORDS OF MINAKAMI
        </span>
      </header>

      {/* Center Layout: 3 Slots on Left, Inspected Slot Info on Right */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-6 sm:px-12 py-6 gap-8 overflow-hidden">
        {/* Left Slots List */}
        <div className="w-full md:w-1/2 space-y-3 overflow-y-auto">
          <span className="text-[10px] font-ui tracking-[0.25em] text-[#848c98] uppercase font-semibold block mb-2">
            CHRONICLE SLOTS
          </span>

          {saveSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const char = slot.character ? CHARACTERS[slot.character as CharacterId] : null;

            return (
              <div
                key={slot.id}
                onClick={() => handleSelectSlot(slot.id)}
                className={`p-4 border transition-all duration-150 cursor-pointer relative ${
                  isSelected
                    ? 'border-[#c5a059]/70 bg-[#c5a059]/10'
                    : 'border-[#1e232d] bg-[#07090e] hover:border-[#384152] hover:bg-[#0b0e14]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-title text-xs tracking-widest text-[#c5a059] font-bold uppercase">
                    SLOT {slot.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#6b7382] uppercase">
                    {slot.isEmpty ? 'EMPTY VESSEL' : slot.lastPlayed}
                  </span>
                </div>

                {slot.isEmpty ? (
                  <div className="py-2 text-[#5a6270] font-ui text-xs tracking-wide">
                    Unwritten Chronicle — No Recorded Journey
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-title text-base font-bold text-[#ede8dc] tracking-wider">
                        {char?.name || slot.characterName}
                      </span>
                      <span className="text-[11px] font-ui text-[#c5a059]">
                        {slot.echoesCount} Echoes
                      </span>
                    </div>
                    <p className="text-xs text-[#848c98] font-ui">{slot.chapter}</p>
                  </div>
                )}

                {/* Left Active Tick */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.8)]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Inspection Panel */}
        <div className="w-full md:w-1/2 p-6 border border-[#1e232d] bg-[#07090e] flex flex-col justify-between overflow-y-auto">
          {selectedSlot && !selectedSlot.isEmpty ? (
            <div className="space-y-5">
              {selectedSlot.character && (
                <div className="relative h-44 overflow-hidden border border-[#1e232d]">
                  <img
                    src={CHARACTERS[selectedSlot.character as CharacterId].imagePath}
                    alt={selectedSlot.characterName}
                    className="w-full h-full object-cover object-top filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-ui tracking-widest text-[#c5a059] uppercase">
                      PROTAGONIST
                    </span>
                    <h3 className="font-title text-2xl font-bold tracking-wider text-[#ede8dc]">
                      {CHARACTERS[selectedSlot.character as CharacterId].name}
                    </h3>
                  </div>
                </div>
              )}

              {/* Stat Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs font-ui">
                <div className="p-3 bg-[#0a0d14] border border-[#181d26]">
                  <span className="text-[#5a6270] uppercase block text-[10px] tracking-wider">Location</span>
                  <span className="text-[#ded9cd] font-medium block mt-0.5">
                    {selectedSlot.location || 'Outer Temple Ruins'}
                  </span>
                </div>

                <div className="p-3 bg-[#0a0d14] border border-[#181d26]">
                  <span className="text-[#5a6270] uppercase block text-[10px] tracking-wider">Playtime</span>
                  <span className="text-[#ded9cd] font-medium block mt-0.5 font-mono">
                    {selectedSlot.playtimeMinutes || 0} minutes
                  </span>
                </div>

                <div className="p-3 bg-[#0a0d14] border border-[#181d26]">
                  <span className="text-[#5a6270] uppercase block text-[10px] tracking-wider">Echoes Inherited</span>
                  <span className="text-[#c5a059] font-medium block mt-0.5">
                    {selectedSlot.echoesCount || 0} Memories
                  </span>
                </div>

                <div className="p-3 bg-[#0a0d14] border border-[#181d26]">
                  <span className="text-[#5a6270] uppercase block text-[10px] tracking-wider">Difficulty</span>
                  <span className="text-[#ded9cd] font-medium block mt-0.5">
                    {selectedSlot.difficulty || 'Normal'}
                  </span>
                </div>
              </div>

              {/* Erase Prompt */}
              {deleteConfirmId === selectedSlot.id ? (
                <div className="p-3 bg-[#8a242a]/20 border border-[#8a242a]/50 text-center space-y-2">
                  <p className="text-xs text-[#ede8dc] font-ui">
                    Permanently extinguish this recorded chronicle?
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-[#141822] text-xs font-ui text-[#848c98] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedSlot.id)}
                      className="px-3 py-1 bg-[#8a242a] text-xs font-ui text-[#ede8dc] font-bold cursor-pointer"
                    >
                      Erase
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(selectedSlot.id)}
                    className="flex items-center gap-1.5 text-xs text-[#848c98] hover:text-[#8a242a] font-ui uppercase transition-colors cursor-pointer text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    Erase Chronicle Slot
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <h4 className="font-title text-base font-bold text-[#848c98] uppercase tracking-widest">
                EMPTY CHRONICLE
              </h4>
              <p className="text-xs text-[#5a6270] max-w-xs font-ui">
                No memories or vessel are recorded in this slot. Launching will initialize a new awakening.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6 border-t border-[#181d26]">
            <button
              type="button"
              onClick={() => handleAction(selectedSlot)}
              className={`w-full py-2.5 font-title text-xs tracking-[0.2em] uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedSlot.isEmpty
                  ? 'bg-[#0f131a] hover:bg-[#181d26] text-[#848c98] hover:text-[#ede8dc] border border-[#222834]'
                  : 'bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#ede8dc] border border-[#c5a059]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {selectedSlot.isEmpty ? 'INITIALIZE NEW CHRONICLE' : 'RESUME CHRONICLE'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <footer className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-3 border-t border-[#181d26] bg-[#040508]/80 backdrop-blur-sm text-xs font-mono text-[#5a6270]">
        <span>CHRONICLE MEMORY ACTIVE</span>
        <div className="flex items-center gap-3 tracking-wider uppercase">
          <span><span className="text-[#848c98] font-bold">[W / S]</span> CHOOSE SLOT</span>
          <span>·</span>
          <span><span className="text-[#848c98] font-bold">[ENTER]</span> CONFIRM</span>
          <span>·</span>
          <span><span className="text-[#848c98] font-bold">[ESC]</span> RETURN</span>
        </div>
      </footer>
    </div>
  );
};
