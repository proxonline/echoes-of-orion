import React, { useState } from 'react';
import { SaveSlot, CharacterId } from '../types/game';
import { CHARACTERS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { X, Play, Trash2, PlusCircle, Sparkles, Clock, MapPin, User } from 'lucide-react';

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

  const handleSelectSlot = (id: number) => {
    soundEngine.playHover();
    setSelectedSlotId(id);
    setDeleteConfirmId(null);
  };

  const handleLoad = (slot: SaveSlot) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-4xl bg-[#070a10] border border-slate-700/80 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090e18]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rotate-45 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <h2 className="font-cinzel text-xl font-bold tracking-[0.2em] uppercase text-white">
              CHRONICLE SAVE SLOTS
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-1.5 text-slate-400 hover:text-white rounded border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Close Load Game"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left slots list, Right slot preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Slots List (Left) */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-800 space-y-4 overflow-y-auto">
            <span className="text-[11px] font-cinzel tracking-[0.2em] text-slate-400 uppercase font-semibold block mb-2">
              SELECT CHRONICLE ARCHIVE
            </span>

            {saveSlots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const char = slot.character ? CHARACTERS[slot.character as CharacterId] : null;

              return (
                <div
                  key={slot.id}
                  onClick={() => handleSelectSlot(slot.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-xs tracking-wider text-amber-300 font-bold uppercase">
                      SLOT {slot.id}
                    </span>
                    <span className="text-[10px] font-cinzel text-slate-500 uppercase">
                      {slot.isEmpty ? 'EMPTY VESSEL' : slot.lastPlayed}
                    </span>
                  </div>

                  {slot.isEmpty ? (
                    <div className="flex items-center gap-3 py-2 text-slate-500">
                      <PlusCircle className="w-5 h-5" />
                      <span className="font-cinzel text-xs tracking-wider uppercase">
                        Unwritten Destiny — Start New Journey
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel text-base font-bold text-slate-100 tracking-wider">
                          {char?.name || slot.characterName}
                        </span>
                        <span className="text-[11px] font-cinzel text-cyan-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {slot.echoesCount} Echoes
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans">{slot.chapter}</p>
                    </div>
                  )}

                  {/* Active Indicator pip */}
                  {isSelected && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-r" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Slot Detail Inspection (Right) */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-black/40 overflow-y-auto">
            {selectedSlot && !selectedSlot.isEmpty ? (
              <div className="space-y-5">
                {/* Character preview thumb */}
                {selectedSlot.character && (
                  <div className="relative h-44 rounded-lg overflow-hidden border border-slate-800">
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

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-cinzel">
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                      <MapPin className="w-3 h-3 text-amber-400" /> Current Location
                    </span>
                    <span className="text-slate-200 font-semibold block mt-1">
                      {selectedSlot.location || 'Outer Temple Ruins'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                      <Clock className="w-3 h-3 text-cyan-400" /> Playtime
                    </span>
                    <span className="text-slate-200 font-semibold block mt-1">
                      {selectedSlot.playtimeMinutes || 47} minutes
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Echoes Inherited
                    </span>
                    <span className="text-cyan-300 font-semibold block mt-1">
                      {selectedSlot.echoesCount || 3} Spirits Absorbed
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase flex items-center gap-1 text-[10px]">
                      <User className="w-3 h-3 text-amber-400" /> Difficulty
                    </span>
                    <span className="text-amber-200 font-semibold block mt-1">
                      {selectedSlot.difficulty || 'Normal'}
                    </span>
                  </div>
                </div>

                {deleteConfirmId === selectedSlot.id ? (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded text-center space-y-2">
                    <p className="text-xs text-red-200 font-cinzel">
                      Confirm permanent erasure of this chronicle?
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1 bg-slate-800 text-xs font-cinzel text-slate-300 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(selectedSlot.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-xs font-cinzel text-white font-bold rounded cursor-pointer"
                      >
                        Erase
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setDeleteConfirmId(selectedSlot.id)}
                      className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-300 font-cinzel uppercase transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Erase Chronicle
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <PlusCircle className="w-12 h-12 text-slate-600 stroke-[1]" />
                <h4 className="font-cinzel text-base font-bold text-slate-300 uppercase tracking-widest">
                  EMPTY CHRONICLE SLOT
                </h4>
                <p className="text-xs text-slate-500 max-w-xs font-sans">
                  No echoes or vessel have been anchored to this slot. Launching will initiate a new awakening.
                </p>
              </div>
            )}

            {/* Bottom CTA for Selected Slot */}
            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => handleLoad(selectedSlot)}
                className={`w-full py-3 rounded font-cinzel text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer ${
                  selectedSlot.isEmpty
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                {selectedSlot.isEmpty ? 'INITIALIZE NEW JOURNEY' : 'RESUME CHRONICLE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
