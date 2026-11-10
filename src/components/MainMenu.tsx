import React, { useState, useEffect } from 'react';
import { soundEngine } from '../audio/soundEngine';

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  hint?: string;
  action: () => void;
}

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onLoadGame: () => void;
  onOpenSettings: () => void;
  onOpenExtras: () => void;
  onExitGame: () => void;
  hasSaveData: boolean;
  continueSlotHint?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onContinue,
  onLoadGame,
  onOpenSettings,
  onOpenExtras,
  onExitGame,
  hasSaveData,
  continueSlotHint,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const menuItems: MenuItem[] = [
    {
      id: 'new_game',
      label: 'NEW GAME',
      action: onNewGame,
      hint: 'Awaken beneath the ruins and forge your fate',
    },
    {
      id: 'continue',
      label: 'CONTINUE',
      disabled: !hasSaveData,
      action: onContinue,
      hint: hasSaveData
        ? continueSlotHint || 'Resume journey from last recorded echo'
        : 'No recorded journey in memory',
    },
    {
      id: 'load_game',
      label: 'LOAD GAME',
      action: onLoadGame,
      hint: 'Select from recorded chronicle slots',
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      action: onOpenSettings,
      hint: 'Configure display, acoustics, and interface',
    },
    {
      id: 'extras',
      label: 'EXTRAS',
      action: onOpenExtras,
      hint: 'Examine world lore, echo archives, and scrolls',
    },
    {
      id: 'exit',
      label: 'EXIT GAME',
      action: onExitGame,
      hint: 'Cease contemplation and leave the realm',
    },
  ];

  // Keyboard navigation for authentic console/PC experience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        soundEngine.playHover();
        setSelectedIndex((prev) => {
          let next = (prev + 1) % menuItems.length;
          // Skip disabled if any
          if (menuItems[next].disabled && next === 1) {
            next = (next + 1) % menuItems.length;
          }
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        soundEngine.playHover();
        setSelectedIndex((prev) => {
          let next = (prev - 1 + menuItems.length) % menuItems.length;
          if (menuItems[next].disabled && next === 1) {
            next = (next - 1 + menuItems.length) % menuItems.length;
          }
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const item = menuItems[selectedIndex];
        if (item && !item.disabled) {
          soundEngine.playSelect();
          item.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuItems]);

  return (
    <div className="relative z-20 flex flex-col items-center md:items-start select-none">
      {/* Menu Options List */}
      <nav className="flex flex-col space-y-2.5 sm:space-y-3" aria-label="Main Menu">
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                soundEngine.playSelect();
                item.action();
              }}
              onMouseEnter={() => {
                if (!isDisabled) {
                  soundEngine.playHover();
                  setSelectedIndex(index);
                }
              }}
              className={`group relative flex items-center gap-4 text-left transition-all duration-300 px-3 py-1.5 cursor-pointer outline-none ${
                isDisabled ? 'opacity-35 cursor-not-allowed' : 'hover:translate-x-1.5'
              }`}
            >
              {/* Thin Decorative Indicator Bar */}
              <div
                className={`transition-all duration-300 flex items-center justify-center ${
                  isSelected && !isDisabled
                    ? 'w-6 opacity-100'
                    : 'w-1.5 opacity-0 group-hover:opacity-40'
                }`}
              >
                <div
                  className={`h-[1px] w-full transition-all duration-300 ${
                    isSelected ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-500'
                  }`}
                />
                {isSelected && (
                  <div className="w-1.5 h-1.5 rotate-45 bg-amber-300 shadow-[0_0_6px_#fde047] -ml-1" />
                )}
              </div>

              {/* Menu Label */}
              <span
                className={`font-cinzel text-base sm:text-lg md:text-xl tracking-[0.25em] font-semibold transition-all duration-300 ${
                  isDisabled
                    ? 'text-slate-600'
                    : isSelected
                    ? 'text-gold-gradient drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] translate-x-1'
                    : 'text-slate-300/80 group-hover:text-slate-100'
                }`}
              >
                {item.label}
              </span>

              {/* Spectral Ember Accent on active item */}
              {isSelected && !isDisabled && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 blur-[1px] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Selected Item Subtitle / Context Hint */}
      <div className="mt-6 h-6 px-3 min-w-[280px]">
        {menuItems[selectedIndex]?.hint && (
          <p className="font-cinzel text-[11px] tracking-[0.2em] text-slate-400/80 uppercase italic transition-opacity duration-300">
            {menuItems[selectedIndex].hint}
          </p>
        )}
      </div>

      {/* Controller / Keyboard Navigation Hint line */}
      <div className="mt-4 px-3 flex items-center gap-3 text-[10px] font-cinzel tracking-widest text-slate-500/70 uppercase">
        <span className="border border-slate-700/60 px-1.5 py-0.5 rounded text-slate-400">W / S</span>
        <span>·</span>
        <span className="border border-slate-700/60 px-1.5 py-0.5 rounded text-slate-400">ENTER</span>
        <span>CONFIRM</span>
      </div>
    </div>
  );
};
