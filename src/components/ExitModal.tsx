import React, { useState, useEffect } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { Moon, LogOut } from 'lucide-react';

interface ExitModalProps {
  onClose: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ onClose }) => {
  const [hasExited, setHasExited] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasExited) {
        if (e.key === 'Escape' || e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          soundEngine.playBack();
          onClose();
        } else if (e.key === 'Enter' || e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleExit();
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          soundEngine.startAmbience();
          setHasExited(false);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasExited, onClose]);

  const handleExit = () => {
    soundEngine.playConfirm();
    soundEngine.stopAmbience();
    setHasExited(true);
  };

  if (hasExited) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#020305] text-center select-none animate-fadeIn">
        <div className="max-w-md space-y-5">
          <Moon className="w-10 h-10 text-[#c5a059] mx-auto animate-pulse" />
          <h3 className="font-title text-2xl font-bold tracking-[0.24em] uppercase text-[#ede8dc]">
            THE REALM SLUMBERS
          </h3>
          <p className="font-ui text-xs text-[#848c98] leading-relaxed italic">
            &ldquo;When the world falls silent, the dead still speak. Until your return, wanderer.&rdquo;
          </p>
          <div className="pt-6">
            <button
              type="button"
              onClick={() => {
                soundEngine.startAmbience();
                setHasExited(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#0a0d14] border border-[#2e3442] hover:border-[#c5a059] text-xs font-title tracking-[0.2em] uppercase text-[#ded9cd] hover:text-[#fff] transition-colors cursor-pointer"
            >
              [ENTER] AWAKEN ONCE MORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#0a0d14] border border-[#2e3442] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.95)] space-y-6 text-center">
        <div className="flex items-center justify-center gap-2.5 text-[#c5a059] border-b border-[#181d26] pb-3">
          <LogOut className="w-4 h-4 text-[#c5a059]" />
          <h3 className="font-title text-lg font-bold tracking-[0.24em] uppercase text-[#ede8dc]">
            EXIT GAME?
          </h3>
        </div>

        <p className="font-ui text-sm text-[#ded9cd] leading-relaxed">
          Return to the desktop?
        </p>

        <p className="font-ui text-xs text-[#6b7382]">
          All chronicle records and settings are preserved in memory.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playBack();
              onClose();
            }}
            className="flex-1 py-2.5 border border-[#2e3442] bg-[#07090e] hover:bg-[#121620] hover:border-[#434b5c] text-[#848c98] hover:text-[#ede8dc] font-ui text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
          >
            NO [ESC]
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="flex-1 py-2.5 border border-[#8a242a] bg-[#8a242a]/20 hover:bg-[#8a242a]/35 text-[#ede8dc] font-title text-xs tracking-[0.2em] uppercase font-bold transition-colors cursor-pointer"
          >
            YES [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
};
