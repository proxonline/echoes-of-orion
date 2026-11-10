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
  onPlayPrototype: () => void;
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
  onPlayPrototype,
  hasSaveData,
  continueSlotHint,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const menuItems: MenuItem[] = [
    {
      id: 'new_game',
      label: 'NEW GAME',
      action: onNewGame,
      hint: 'Awaken beneath the ruins and choose your protagonist',
    },
    {
      id: 'play_prototype',
      label: 'PLAY PROTOTYPE',
      action: onPlayPrototype,
      hint: 'Enter the 2D Ashes of Minakami side-scrolling level',
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
      hint: 'Configure display, graphics, acoustics, and bindings',
    },
    {
      id: 'extras',
      label: 'EXTRAS',
      action: onOpenExtras,
      hint: 'Examine world lore, echo archives, and art gallery',
    },
    {
      id: 'exit',
      label: 'EXIT GAME',
      action: onExitGame,
      hint: 'Cease contemplation and leave the realm',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        soundEngine.playHover();
        setSelectedIndex((prev) => {
          let next = (prev + 1) % menuItems.length;
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
      } else if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playSelect();
        onExitGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuItems, onExitGame]);

  return (
    <div className="relative z-20 flex flex-col items-start select-none">
      {/* Menu Options List */}
      <nav className="flex flex-col space-y-1.5 sm:space-y-2" aria-label="Main Menu">
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
              className={`group relative flex items-center gap-3 text-left transition-all duration-150 py-1 px-2 cursor-pointer outline-none ${
                isDisabled ? 'opacity-25 cursor-not-allowed' : 'hover:translate-x-1'
              }`}
            >
              {/* Minimalist Japanese Diamond Marker */}
              <div
                className={`w-3 flex items-center justify-center transition-all duration-200 ${
                  isSelected && !isDisabled ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                <div className="w-1.5 h-1.5 rotate-45 bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.7)]" />
              </div>

              {/* Menu Label */}
              <span
                className={`font-title text-base sm:text-lg tracking-[0.24em] font-semibold transition-colors ${
                  isDisabled
                    ? 'text-[#505763]'
                    : isSelected
                    ? 'text-[#ede8dc] font-bold'
                    : 'text-[#9ca3af] group-hover:text-[#ded9cd]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Selected Item Subtitle / Context Hint */}
      <div className="mt-4 h-5 px-5">
        {menuItems[selectedIndex]?.hint && (
          <p className="font-ui text-[11px] tracking-wide text-[#7d848f] transition-opacity duration-200">
            {menuItems[selectedIndex].hint}
          </p>
        )}
      </div>

      {/* Console Controller / Keyboard Hint Line */}
      <div className="mt-3 px-5 flex items-center gap-2 text-[10px] font-mono tracking-wider text-[#5a6270] uppercase">
        <span className="text-[#848c98]">[W / S]</span>
        <span>NAVIGATE</span>
        <span className="text-[#3e4450]">·</span>
        <span className="text-[#848c98]">[ENTER]</span>
        <span>SELECT</span>
      </div>
    </div>
  );
};
