import React, { useState, useEffect } from 'react';
import { SaveSlot, CharacterId } from '../types/game';
import { CHARACTERS, ASSET_PATHS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { Play, Trash2, PlusCircle, Sparkles, Clock, MapPin, User, ArrowLeft, Shield } from 'lucide-react';

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
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-black text-slate-100 select-none overflow-hidden animate-fadeIn">
      {/* Background Environment */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.settingsChamber}
          alt="Ancient stone sanctuary chamber"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-105"
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
            CHRONICLE ARCHIVES
          </h2>
        </div>

        <span className="text-xs font-cinzel text-slate-500 hidden sm:block">
          RECORDS OF MINAKAMI
        </span>
      </header>

      {/* Center Layout: 3 Slots on Left, Inspected Slot Info on Right */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-6 sm:px-12 py-6 gap-8 overflow-hidden">
        {/* Left Slots List */}
        <div className="w-full md:w-1/2 space-y-4 overflow-y-auto">
          <span className="text-[11px] font-cinzel tracking-[0.25em] text-slate-400 uppercase font-semibold block mb-2">
            SELECT CHRONICLE VESSEL
          </span>

          {saveSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const char = slot.character ? CHARACTERS[slot.character as CharacterId] : null;

            return (
              <div
                key={slot.id}
                onClick={() => handleSelectSlot(slot.id)}
                className={`p-4 rounded border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-400/90 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel text-xs tracking-widest text-amber-300 font-bold uppercase">
                    SLOT {slot.id}
                  </span>
                  <span className="text-[10px] font-cinzel text-slate-500 uppercase font-mono">
                    {slot.isEmpty ? 'EMPTY' : slot.lastPlayed}
                  </span>
                </div>

                {slot.isEmpty ? (
                  <div className="flex items-center gap-3 py-3 text-slate-500">
                    <PlusCircle className="w-5 h-5 text-slate-600" />
                    <span className="font-cinzel text-xs tracking-wider uppercase">
                      Unwritten Chronicle — No Recorded Journey
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-base font-bold text-slate-100 tracking-wider">
                        {char?.name || slot.characterName}
                      </span>
                      <span className="text-[11px] font-cinzel text-cyan-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> {slot.echoesCount} Echoes
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">{slot.chapter}</p>
                  </div>
                )}

                {/* Selection Pip */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Inspection Panel */}
        <div className="w-full md:w-1/2 p-6 rounded border border-slate-800 bg-black/60 flex flex-col justify-between overflow-y-auto">
          {selectedSlot && !selectedSlot.isEmpty ? (
            <div className="space-y-5">
              {/* Character Header preview */}
              {selectedSlot.character && (
                <div className="relative h-44 rounded overflow-hidden border border-slate-800">
                  <img
                    src={CHARACTERS[selectedSlot.character as CharacterId].imagePath}
                    alt={selectedSlot.characterName}
                    className="w-full h-full object-cover object-top filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-cinzel tracking-widest text-amber-400 uppercase">
                      PROTAGONIST
                    </span>
                    <h3 className="font-cinzel text-2xl font-bold tracking-wider text-white">
                      {CHARACTERS[selectedSlot.character as CharacterId].name}
                    </h3>
                  </div>
                </div>
              )}

              {/* Stat Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs font-cinzel">
                <div className="p-3 bg-slate-900/40 rounded border border-slate-800/80">
                  <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                    <MapPin className="w-3 h-3 text-amber-400" /> Location
                  </span>
                  <span className="text-slate-200 font-semibold block mt-1">
                    {selectedSlot.location || 'Outer Temple Ruins'}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/40 rounded border border-slate-800/80">
                  <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3 text-cyan-400" /> Playtime
                  </span>
                  <span className="text-slate-200 font-semibold block mt-1">
                    {selectedSlot.playtimeMinutes || 0} minutes
                  </span>
                </div>

                <div className="p-3 bg-slate-900/40 rounded border border-slate-800/80">
                  <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Echoes Inherited
                  </span>
                  <span className="text-cyan-300 font-semibold block mt-1">
                    {selectedSlot.echoesCount || 0} Memories
                  </span>
                </div>

                <div className="p-3 bg-slate-900/40 rounded border border-slate-800/80">
                  <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                    <Shield className="w-3 h-3 text-amber-400" /> Difficulty
                  </span>
                  <span className="text-amber-200 font-semibold block mt-1">
                    {selectedSlot.difficulty || 'Normal'}
                  </span>
                </div>
              </div>

              {/* Delete Prompt or Trigger */}
              {deleteConfirmId === selectedSlot.id ? (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded text-center space-y-2">
                  <p className="text-xs text-red-200 font-cinzel">
                    Permanently extinguish this recorded chronicle?
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-slate-800 text-xs font-cinzel text-slate-300 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedSlot.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-xs font-cinzel text-white font-bold rounded cursor-pointer"
                    >
                      Erase
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(selectedSlot.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-300 font-cinzel uppercase transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Erase Chronicle Slot
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <PlusCircle className="w-12 h-12 text-slate-700 stroke-[1]" />
              <h4 className="font-cinzel text-base font-bold text-slate-300 uppercase tracking-widest">
                EMPTY CHRONICLE
              </h4>
              <p className="text-xs text-slate-500 max-w-xs font-sans">
                No memories or vessel are recorded in this slot. Launching will initialize a new awakening.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6 border-t border-slate-900">
            <button
              type="button"
              onClick={() => handleAction(selectedSlot)}
              className={`w-full py-3 rounded font-cinzel text-xs tracking-[0.2em] uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedSlot.isEmpty
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)]'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {selectedSlot.isEmpty ? 'INITIALIZE NEW CHRONICLE' : 'RESUME CHRONICLE'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <footer className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-4 border-t border-slate-900 bg-black/70 backdrop-blur-sm text-xs font-cinzel text-slate-500">
        <span>CHRONICLE STORAGE MEMORY ACTIVE</span>
        <div className="flex items-center gap-4 text-[10px] sm:text-[11px] tracking-widest uppercase">
          <span><span className="text-amber-400 font-bold mr-1">[W / S]</span> CHOOSE SLOT</span>
          <span>·</span>
          <span><span className="text-amber-400 font-bold mr-1">[ENTER]</span> CONFIRM</span>
          <span>·</span>
          <span><span className="text-amber-400 font-bold mr-1">[ESC]</span> RETURN</span>
        </div>
      </footer>
    </div>
  );
};
