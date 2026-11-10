import React, { useState, useEffect } from 'react';
import { ASSET_PATHS, DEFAULT_SETTINGS, INITIAL_SAVE_SLOTS } from './data/gameData';
import { GameSettings, SaveSlot, CharacterId, ScreenState } from './types/game';
import { soundEngine } from './audio/soundEngine';
import { ParticleCanvas } from './components/ParticleCanvas';
import { TitleHeader } from './components/TitleHeader';
import { TitleLockup } from './components/TitleLockup';
import { MainMenu } from './components/MainMenu';
import { CharacterSelect } from './components/CharacterSelect';
import { PrologueTransition } from './components/PrologueTransition';
import { SettingsModal } from './components/SettingsModal';
import { LoadGameModal } from './components/LoadGameModal';
import { ExtrasModal } from './components/ExtrasModal';
import { ExitModal } from './components/ExitModal';

const SETTINGS_STORAGE_KEY = 'echoes_of_orion_settings_v1';
const SAVES_STORAGE_KEY = 'echoes_of_orion_saves_v1';

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

  // Save Slots State with Persistence
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

  // First user interaction auto-starts dark ambient soundscape if allowed
  const startAudioOnInteraction = () => {
    if (!audioStarted && !settings.audio.isMuted) {
      soundEngine.startAmbience();
      setAudioStarted(true);
    }
  };

  // Mouse Parallax for Background Image
  useEffect(() => {
    if (!settings.display.cameraParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 14;
      const normY = (e.clientY / window.innerHeight - 0.5) * 10;
      setMouseParallax({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.display.cameraParallax]);

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
          difficulty: 'Normal' as const,
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
    const updated = {
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

  return (
    <div
      onClick={startAudioOnInteraction}
      className="relative w-screen h-screen overflow-hidden bg-[#030509] text-slate-100 select-none flex flex-col justify-between"
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
      <ParticleCanvas
        graphicsQuality={settings.display.graphicsQuality}
        enableParallax={settings.display.cameraParallax}
      />

      {/* 4. ACTIVE SCREEN RENDERER */}
      {screenState === 'TITLE' && (
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 animate-fadeIn">
          {/* Top Bar Navigation */}
          <TitleHeader
            onOpenSettings={() => setScreenState('SETTINGS')}
            isMuted={settings.audio.isMuted}
            onToggleMute={handleToggleMute}
            audioStarted={audioStarted}
            onStartAudio={() => {
              soundEngine.startAmbience();
              setAudioStarted(true);
            }}
          />

          {/* Central Section: Title Lockup */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-6 sm:-mt-10">
            <TitleLockup />
          </div>

          {/* Lower Section: Vertical Main Menu (Left-aligned/Lower Center) */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full pb-4 md:pb-6">
            <div className="w-full md:w-auto">
              <MainMenu
                onNewGame={() => {
                  soundEngine.playSelect();
                  setActiveSlotId(1);
                  setScreenState('CHARACTER_SELECT');
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

          {/* Bottom Indicators */}
          <footer className="w-full flex items-center justify-between border-t border-slate-800/60 pt-3 text-[10px] sm:text-[11px] font-cinzel text-slate-400 select-none">
            {/* Bottom Left: Subtle environmental message */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-cyan-400/80 shadow-[0_0_6px_#38bdf8]" />
              <span className="tracking-[0.25em] text-slate-400 uppercase">
                THE WORLD REMEMBERS.
              </span>
            </div>

            {/* Bottom Right: Version notice */}
            <div className="tracking-[0.2em] text-slate-500 uppercase">
              ECHOES OF ORION · VERSION 0.1 — PRE-ALPHA
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
        />
      )}

      {/* Modal: Settings */}
      {screenState === 'SETTINGS' && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setScreenState('TITLE')}
        />
      )}

      {/* Modal: Load Game */}
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

      {/* Modal: Extras & Archives */}
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
