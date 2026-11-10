import React, { useState, useEffect, useCallback } from 'react';
import { ASSET_PATHS, DEFAULT_SETTINGS, INITIAL_SAVE_SLOTS } from './data/gameData';
import { GameSettings, SaveSlot, CharacterId, ScreenState } from './types/game';
import { soundEngine } from './audio/soundEngine';
import { ParticleCanvas } from './components/ParticleCanvas';
import { TitleLockup } from './components/TitleLockup';
import { MainMenu } from './components/MainMenu';
import { CharacterSelect } from './components/CharacterSelect';
import { PrologueTransition } from './components/PrologueTransition';
import { SettingsScreen } from './components/SettingsScreen';
import { LoadGameModal } from './components/LoadGameModal';
import { ExtrasModal } from './components/ExtrasModal';
import { ExitModal } from './components/ExitModal';
import { PlayableLevel } from './components/PlayableLevel';

const SETTINGS_STORAGE_KEY = 'echoes_of_orion_settings_v2';
const SAVES_STORAGE_KEY = 'echoes_of_orion_saves_v2';

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>('TITLE');
  const [activeCharacterId, setActiveCharacterId] = useState<CharacterId>('kiyoji');
  const [activeSlotId, setActiveSlotId] = useState<number>(1);
  const [audioStarted, setAudioStarted] = useState<boolean>(false);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  // Settings State with Persistence
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Save Slots State with Persistence (clean install starts empty)
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>(() => {
    try {
      const saved = localStorage.getItem(SAVES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_SAVE_SLOTS;
  });

  // Synchronize audio engine with settings
  useEffect(() => {
    soundEngine.setVolumes(settings.audio);
  }, [settings.audio]);

  // First user interaction auto-starts dark ambient soundscape
  const startAudioOnInteraction = useCallback(() => {
    if (!audioStarted && !settings.audio.isMuted) {
      soundEngine.startAmbience();
      setAudioStarted(true);
    }
  }, [audioStarted, settings.audio.isMuted]);

  // Global keydown listeners (Audio initiation, Mute toggle, Fullscreen toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      startAudioOnInteraction();

      if (e.key === 'm' || e.key === 'M') {
        const newMuted = !settings.audio.isMuted;
        const updated: GameSettings = {
          ...settings,
          audio: {
            ...settings.audio,
            isMuted: newMuted,
          },
        };
        setSettings(updated);
        soundEngine.setVolumes(updated.audio);
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Storage error
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, startAudioOnInteraction]);

  // Mouse Parallax for Background Image (respects cameraParallax and reducedMotion)
  useEffect(() => {
    if (settings.display.cameraParallax === 'Off' || settings.accessibility.reducedMotion) {
      setMouseParallax({ x: 0, y: 0 });
      return;
    }

    const multiplier = settings.display.cameraParallax === 'Subtle' ? 6 : 14;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * multiplier;
      const normY = (e.clientY / window.innerHeight - 0.5) * (multiplier * 0.7);
      setMouseParallax({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.display.cameraParallax, settings.accessibility.reducedMotion]);

  // Save Settings handler
  const handleSaveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch {
      // Storage error
    }
  };

  // Check if any valid save slot exists for CONTINUE
  const activeSave = saveSlots.find((s) => !s.isEmpty);
  const hasSaveData = !!activeSave;

  // Continue action
  const handleContinue = () => {
    if (!activeSave) return;
    if (activeSave.character) {
      setActiveCharacterId(activeSave.character);
    }
    setActiveSlotId(activeSave.id);
    setScreenState('PROLOGUE');
  };

  // Confirm Character Selection in NEW GAME
  const handleConfirmCharacter = (charId: CharacterId) => {
    setActiveCharacterId(charId);

    // Write to selected save slot
    const updatedSlots = saveSlots.map((slot) => {
      if (slot.id === activeSlotId || (activeSlotId === 1 && slot.id === 1)) {
        return {
          ...slot,
          isEmpty: false,
          character: charId,
          characterName: charId === 'kiyoji' ? 'Kiyoji' : 'Hanetsu',
          chapter: 'Prologue: Ashes of Minakami',
          location: 'Outer Temple Ruins',
          playtimeMinutes: 0,
          echoesCount: 1,
          lastPlayed: new Date().toISOString().replace('T', ' ').slice(0, 16),
          difficulty: settings.gameplay.difficulty,
        };
      }
      return slot;
    });

    setSaveSlots(updatedSlots);
    try {
      localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(updatedSlots));
    } catch {
      // Storage error
    }

    setScreenState('PROLOGUE');
  };

  // Load Slot from LoadGameModal
  const handleLoadSlot = (slot: SaveSlot) => {
    if (slot.character) {
      setActiveCharacterId(slot.character);
    }
    setActiveSlotId(slot.id);
    setScreenState('PROLOGUE');
  };

  // Delete Slot
  const handleDeleteSlot = (slotId: number) => {
    const updated = saveSlots.map((s) =>
      s.id === slotId ? { id: slotId, isEmpty: true } : s
    );
    setSaveSlots(updated);
    try {
      localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage error
    }
  };

  // Toggle Mute quick handler
  const handleToggleMute = () => {
    const newMuted = !settings.audio.isMuted;
    const updated: GameSettings = {
      ...settings,
      audio: {
        ...settings.audio,
        isMuted: newMuted,
      },
    };
    setSettings(updated);
    soundEngine.setVolumes(updated.audio);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage error
    }
  };

  // High contrast styling class
  const highContrastClass = settings.accessibility.highContrastUI ? 'contrast-125 saturate-110' : '';

  return (
    <div
      onClick={startAudioOnInteraction}
      className={`relative w-screen h-screen overflow-hidden bg-[#030509] text-[#ede8dc] select-none flex flex-col justify-between ${highContrastClass}`}
    >
      {/* 1. CINEMATIC BACKGROUND ENVIRONMENT LAYER */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out z-0 scale-[1.05]"
        style={{
          transform: `translate3d(${-mouseParallax.x}px, ${-mouseParallax.y}px, 0)`,
        }}
      >
        <img
          src={ASSET_PATHS.titleEnvironment}
          alt="Devastated village of Minakami and the celestial rupture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
      </div>

      {/* 2. ATMOSPHERIC SHADOW SCRIMS & CINEMATIC VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none z-[1] cinematic-vignette" />
      <div className="absolute inset-0 pointer-events-none z-[1] cinematic-bottom-scrim opacity-85" />
      <div className="absolute inset-0 pointer-events-none z-[1] cinematic-left-scrim opacity-70" />
      <div className="absolute inset-0 pointer-events-none z-[2] bg-grain opacity-40 mix-blend-overlay" />

      {/* 3. DYNAMIC PARTICLE SYSTEM (Embers, Spectral Blue Echoes, Drifting Ash) */}
      {!settings.accessibility.reducedMotion && (
        <ParticleCanvas
          graphicsQuality={
            settings.graphics.volumetricFog === 'Off'
              ? 'Low'
              : settings.graphics.volumetricFog === 'Low'
              ? 'Medium'
              : 'High'
          }
          enableParallax={settings.display.cameraParallax !== 'Off'}
        />
      )}

      {/* 4. ACTIVE SCREEN RENDERER */}
      {screenState === 'TITLE' && (
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 animate-fadeIn">
          {/* Top Bar: Pure Cinematic Negative Space with Subdued Identity Mark */}
          <div className="flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2.5 opacity-70">
              <div className="w-1.5 h-1.5 bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.8)]" />
              <span className="font-ui text-[10px] sm:text-[11px] tracking-[0.3em] text-[#848c98] uppercase font-semibold">
                ORIGINAL DARK FANTASY RPG
              </span>
            </div>

            <div className="font-kanji text-xs sm:text-sm tracking-[0.6em] text-[#5a6270]/50 select-none">
              冥 響
            </div>
          </div>

          {/* Central Section: Monolithic Title Lockup */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-6 sm:-mt-10 pointer-events-none">
            <TitleLockup />
          </div>

          {/* Lower Section: Vertical Main Menu */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full pb-3 md:pb-4">
            <div className="w-full md:w-auto">
              <MainMenu
                onNewGame={() => {
                  soundEngine.playSelect();
                  setActiveSlotId(1);
                  setScreenState('CHARACTER_SELECT');
                }}
                onPlayPrototype={() => {
                  soundEngine.playSelect();
                  setScreenState('PLAYABLE_LEVEL');
                }}
                onContinue={handleContinue}
                onLoadGame={() => {
                  soundEngine.playSelect();
                  setScreenState('LOAD_GAME');
                }}
                onOpenSettings={() => {
                  soundEngine.playSelect();
                  setScreenState('SETTINGS');
                }}
                onOpenExtras={() => {
                  soundEngine.playSelect();
                  setScreenState('EXTRAS');
                }}
                onExitGame={() => {
                  soundEngine.playSelect();
                  setScreenState('EXIT_CONFIRM');
                }}
                hasSaveData={hasSaveData}
                continueSlotHint={
                  activeSave
                    ? `${activeSave.characterName || 'Kiyoji'} · ${activeSave.chapter || 'Prologue'}`
                    : undefined
                }
              />
            </div>
          </div>

          {/* Bottom Console Game Status Bar */}
          <footer className="w-full flex items-center justify-between border-t border-[#181d26]/80 pt-3 text-[10px] sm:text-[11px] font-mono text-[#6b7382] select-none">
            <div className="flex items-center gap-2 font-ui tracking-[0.25em] text-[#848c98] uppercase text-[10px]">
              <div className="w-1 h-1 rounded-full bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.8)]" />
              <span>THE WORLD REMEMBERS.</span>
            </div>

            <div className="flex items-center gap-4 text-[#5a6270]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playSelect();
                  handleToggleMute();
                }}
                className="hover:text-[#ded9cd] transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
                title="Toggle Mute (Key: M)"
              >
                [M] AUDIO: {settings.audio.isMuted ? 'OFF' : 'ON'}
              </button>
              <span className="text-[#2b3342]">·</span>
              <span className="tracking-wider uppercase text-[10px]">
                ECHOES OF ORION · VER 0.1
              </span>
            </div>
          </footer>
        </div>
      )}

      {/* Screen: Character Selection */}
      {screenState === 'CHARACTER_SELECT' && (
        <CharacterSelect
          onBack={() => setScreenState('TITLE')}
          onConfirmCharacter={handleConfirmCharacter}
        />
      )}

      {/* Screen: Prologue Awakening Transition */}
      {screenState === 'PROLOGUE' && (
        <PrologueTransition
          characterId={activeCharacterId}
          onReturnToTitle={() => setScreenState('TITLE')}
          onGoToLoadGame={() => setScreenState('LOAD_GAME')}
          onEnterLevel={() => setScreenState('PLAYABLE_LEVEL')}
        />
      )}

      {/* Screen: Playable 2D Prototype Level */}
      {screenState === 'PLAYABLE_LEVEL' && (
        <PlayableLevel
          initialCharacterId={activeCharacterId}
          onReturnToTitle={() => setScreenState('TITLE')}
        />
      )}

      {/* Screen: Settings (Console-Grade 6-Category Architecture) */}
      {screenState === 'SETTINGS' && (
        <SettingsScreen
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setScreenState('TITLE')}
        />
      )}

      {/* Screen: Load Game (Full-Screen Console Save Slot Architecture) */}
      {screenState === 'LOAD_GAME' && (
        <LoadGameModal
          saveSlots={saveSlots}
          onLoadSlot={handleLoadSlot}
          onNewGameSlot={(slotId) => {
            setActiveSlotId(slotId);
            setScreenState('CHARACTER_SELECT');
          }}
          onDeleteSlot={handleDeleteSlot}
          onClose={() => setScreenState('TITLE')}
        />
      )}

      {/* Screen: Extras & Archives */}
      {screenState === 'EXTRAS' && (
        <ExtrasModal onClose={() => setScreenState('TITLE')} />
      )}

      {/* Modal: Exit Confirmation */}
      {screenState === 'EXIT_CONFIRM' && (
        <ExitModal onClose={() => setScreenState('TITLE')} />
      )}
    </div>
  );
}
