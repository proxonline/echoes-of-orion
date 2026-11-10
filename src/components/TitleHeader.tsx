import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface TitleHeaderProps {
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  audioStarted: boolean;
  onStartAudio: () => void;
}

export const TitleHeader: React.FC<TitleHeaderProps> = ({
  onOpenSettings,
  isMuted,
  onToggleMute,
  audioStarted,
  onStartAudio,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    soundEngine.playSelect();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-7 pointer-events-auto">
      {/* Top Left: Studio / Identity */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        <span className="font-cinzel text-xs tracking-[0.25em] text-slate-400/90 font-medium uppercase select-none">
          ORIGINAL DARK FANTASY RPG
        </span>
      </div>

      {/* Top Right: Functional Controls */}
      <div className="flex items-center gap-4">
        {/* Audio Ambient Trigger / Mute toggle */}
        <button
          onClick={() => {
            if (!audioStarted) {
              onStartAudio();
            } else {
              soundEngine.playSelect();
              onToggleMute();
            }
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="group flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-slate-800/80 hover:border-amber-500/40 rounded transition-all duration-200 cursor-pointer text-slate-300 hover:text-amber-200"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle Audio"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400/80 group-hover:text-red-300" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400/80 group-hover:text-amber-300" />
          )}
          <span className="text-[11px] font-cinzel tracking-wider uppercase hidden sm:inline text-slate-400 group-hover:text-amber-200/90">
            {isMuted ? 'MUTED' : audioStarted ? 'AUDIO ON' : 'START AUDIO'}
          </span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          onMouseEnter={() => soundEngine.playHover()}
          className="p-2 bg-black/40 hover:bg-black/60 border border-slate-800/80 hover:border-amber-500/40 rounded transition-all duration-200 cursor-pointer text-slate-400 hover:text-amber-200"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundEngine.playSelect();
            onOpenSettings();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="group flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 bg-black/40 hover:bg-black/60 border border-slate-800/80 hover:border-amber-500/40 rounded transition-all duration-200 cursor-pointer text-slate-400 hover:text-amber-200"
          title="Open System Settings"
          aria-label="Open Settings"
        >
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-[11px] font-cinzel tracking-wider uppercase hidden sm:inline text-slate-400 group-hover:text-amber-200/90">
            SETTINGS
          </span>
        </button>
      </div>
    </header>
  );
};
