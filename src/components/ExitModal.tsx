import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { X, Moon, LogOut } from 'lucide-react';

interface ExitModalProps {
  onClose: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ onClose }) => {
  const [hasExited, setHasExited] = useState<boolean>(false);

  const handleExitGame = () => {
    soundEngine.playConfirm();
    soundEngine.stopAmbience();
    setHasExited(true);
  };

  if (hasExited) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black text-center select-none animate-fadeIn">
        <div className="max-w-md space-y-4">
          <Moon className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
          <h3 className="font-cinzel text-2xl font-bold tracking-[0.2em] uppercase text-white">
            THE REALM SLUMBERS
          </h3>
          <p className="font-cinzel text-xs text-slate-400 leading-relaxed italic">
            &ldquo;When the world falls silent, the dead still speak. Until your return, wanderer.&rdquo;
          </p>
          <div className="pt-6">
            <button
              onClick={() => {
                soundEngine.startAmbience();
                setHasExited(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-cinzel tracking-widest uppercase text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
            >
              AWAKEN ONCE MORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#070a10] border border-slate-700/80 rounded-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-lg font-bold tracking-wider uppercase text-white">
              DEPART THE REALM
            </h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
          Are you certain you wish to suspend this session and return to desktop? All chronicle
          progress has been preserved in memory.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            className="flex-1 py-2.5 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-cinzel text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleExitGame}
            className="flex-1 py-2.5 rounded border border-red-500/80 bg-red-950/60 hover:bg-red-900/80 text-red-200 font-cinzel text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
          >
            EXIT TO DESKTOP
          </button>
        </div>
      </div>
    </div>
  );
};
