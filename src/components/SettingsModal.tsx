import React, { useState } from 'react';
import { GameSettings } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { X, RotateCcw, Monitor, Volume2, Layout, Gamepad2, Check } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../data/gameData';

interface SettingsModalProps {
  settings: GameSettings;
  onSaveSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

type TabCategory = 'display' | 'audio' | 'interface' | 'game';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('display');
  const [current, setCurrent] = useState<GameSettings>({ ...settings });
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const updateSetting = <K extends keyof GameSettings, T extends keyof GameSettings[K]>(
    category: K,
    key: T,
    value: GameSettings[K][T]
  ) => {
    const updated = {
      ...current,
      [category]: {
        ...current[category],
        [key]: value,
      },
    };
    setCurrent(updated);
    setHasChanged(true);

    // Apply live audio changes immediately
    if (category === 'audio') {
      soundEngine.setVolumes(updated.audio);
    }
  };

  const handleApply = () => {
    soundEngine.playConfirm();
    onSaveSettings(current);
    setHasChanged(false);
  };

  const handleResetDefaults = () => {
    soundEngine.playSelect();
    setCurrent({ ...DEFAULT_SETTINGS });
    soundEngine.setVolumes(DEFAULT_SETTINGS.audio);
    setHasChanged(true);
  };

  const handleClose = () => {
    soundEngine.playBack();
    // If unsaved changes, save automatically or close
    if (hasChanged) {
      onSaveSettings(current);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-3xl bg-[#070a10] border border-slate-700/80 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090e18]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rotate-45 bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <h2 className="font-cinzel text-xl font-bold tracking-[0.2em] uppercase text-white">
              SYSTEM SETTINGS
            </h2>
          </div>

          <button
            onClick={handleClose}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-1.5 text-slate-400 hover:text-white rounded border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-black/40 px-6 overflow-x-auto">
          {[
            { id: 'display', label: 'DISPLAY', icon: Monitor },
            { id: 'audio', label: 'AUDIO', icon: Volume2 },
            { id: 'interface', label: 'INTERFACE', icon: Layout },
            { id: 'game', label: 'GAMEPLAY', icon: Gamepad2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playSelect();
                  setActiveTab(tab.id as TabCategory);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`flex items-center gap-2 py-3 px-4 font-cinzel text-xs tracking-[0.2em] uppercase font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* DISPLAY TAB */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Target Resolution
                  </h4>
                  <p className="text-xs text-slate-400">Renders title composition viewport ratio.</p>
                </div>
                <select
                  value={current.display.resolution}
                  onChange={(e) => updateSetting('display', 'resolution', e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded font-cinzel cursor-pointer outline-none focus:border-amber-400"
                >
                  <option value="1920x1080 (FHD)">1920 × 1080 (FHD 16:9)</option>
                  <option value="2560x1440 (QHD)">2560 × 1440 (QHD 16:9)</option>
                  <option value="1366x768 (HD)">1366 × 768 (Laptop)</option>
                  <option value="3840x2160 (4K UHD)">3840 × 2160 (4K UHD)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Particle & Graphics Quality
                  </h4>
                  <p className="text-xs text-slate-400">
                    Controls active particle density, ember glow halos, and shader detail.
                  </p>
                </div>
                <div className="flex gap-1 bg-slate-900 p-1 border border-slate-800 rounded">
                  {(['Low', 'Medium', 'High', 'Cinematic'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => updateSetting('display', 'graphicsQuality', q)}
                      className={`px-3 py-1 text-xs font-cinzel rounded transition-colors cursor-pointer ${
                        current.display.graphicsQuality === q
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Interactive Camera Parallax
                  </h4>
                  <p className="text-xs text-slate-400">
                    Gently tilts environmental layers and particles based on mouse drift.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting('display', 'cameraParallax', !current.display.cameraParallax)
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    current.display.cameraParallax ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      current.display.cameraParallax ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    VSync Synchronization
                  </h4>
                  <p className="text-xs text-slate-400">
                    Locks canvas refresh rate to display monitor frequency (60Hz / 120Hz).
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('display', 'vsync', !current.display.vsync)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    current.display.vsync ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      current.display.vsync ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded text-[11px] text-slate-400 font-cinzel">
                <span className="text-amber-400 font-semibold mr-2">RUNTIME STATUS:</span>
                Particle simulation, parallax, and resolution framing are active in the current title client.
                3D shader pipelines will link to the runtime upon game launch.
              </div>
            </div>
          )}

          {/* AUDIO TAB */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Mute All Acoustics
                  </h4>
                  <p className="text-xs text-slate-400">Silences all music, winds, and interface audio.</p>
                </div>
                <button
                  onClick={() => updateSetting('audio', 'isMuted', !current.audio.isMuted)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    current.audio.isMuted ? 'bg-red-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      current.audio.isMuted ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Master Volume */}
              <div className="space-y-2 pb-3 border-b border-slate-800/60">
                <div className="flex justify-between text-xs font-cinzel">
                  <span className="text-slate-200 uppercase font-semibold">Master Volume</span>
                  <span className="text-amber-400 font-mono">{current.audio.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={current.audio.masterVolume}
                  onChange={(e) => updateSetting('audio', 'masterVolume', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Music Volume */}
              <div className="space-y-2 pb-3 border-b border-slate-800/60">
                <div className="flex justify-between text-xs font-cinzel">
                  <span className="text-slate-200 uppercase font-semibold">
                    Music & Orchestral Ambience
                  </span>
                  <span className="text-amber-400 font-mono">{current.audio.musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={current.audio.musicVolume}
                  onChange={(e) => updateSetting('audio', 'musicVolume', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Sound Effects Volume */}
              <div className="space-y-2 pb-3 border-b border-slate-800/60">
                <div className="flex justify-between text-xs font-cinzel">
                  <span className="text-slate-200 uppercase font-semibold">
                    Interface & Strike FX Volume
                  </span>
                  <span className="text-amber-400 font-mono">{current.audio.sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={current.audio.sfxVolume}
                  onChange={(e) => updateSetting('audio', 'sfxVolume', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Ambient Volume */}
              <div className="space-y-2 pb-3 border-b border-slate-800/60">
                <div className="flex justify-between text-xs font-cinzel">
                  <span className="text-slate-200 uppercase font-semibold">
                    Environmental Wind & Ash Drone
                  </span>
                  <span className="text-amber-400 font-mono">{current.audio.ambientVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={current.audio.ambientVolume}
                  onChange={(e) => updateSetting('audio', 'ambientVolume', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Test Audio Cues */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => soundEngine.playConfirm()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-cinzel text-amber-200 uppercase cursor-pointer"
                >
                  Test Celestial Strike
                </button>
                <button
                  onClick={() => soundEngine.playEchoAbsorb()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-cinzel text-cyan-300 uppercase cursor-pointer"
                >
                  Test Echo Absorption
                </button>
              </div>
            </div>
          )}

          {/* INTERFACE TAB */}
          {activeTab === 'interface' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    UI Scaling
                  </h4>
                  <p className="text-xs text-slate-400">Adjusts text and title menu scale factors.</p>
                </div>
                <div className="flex gap-1 bg-slate-900 p-1 border border-slate-800 rounded">
                  {(['Small', 'Normal', 'Large'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateSetting('interface', 'uiScale', s)}
                      className={`px-3 py-1 text-xs font-cinzel rounded transition-colors cursor-pointer ${
                        current.interface.uiScale === s
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Dialogue & Lore Subtitles
                  </h4>
                  <p className="text-xs text-slate-400">
                    Displays on-screen text transcripts during character speech.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting('interface', 'subtitles', !current.interface.subtitles)
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    current.interface.subtitles ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      current.interface.subtitles ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Text Size
                  </h4>
                  <p className="text-xs text-slate-400">Controls size of archive and lore entries.</p>
                </div>
                <div className="flex gap-1 bg-slate-900 p-1 border border-slate-800 rounded">
                  {(['Compact', 'Standard', 'Elevated'] as const).map((ts) => (
                    <button
                      key={ts}
                      onClick={() => updateSetting('interface', 'textSize', ts)}
                      className={`px-3 py-1 text-xs font-cinzel rounded transition-colors cursor-pointer ${
                        current.interface.textSize === ts
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GAMEPLAY TAB */}
          {activeTab === 'game' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Language Localization
                  </h4>
                  <p className="text-xs text-slate-400">Audio and menu text language selection.</p>
                </div>
                <select
                  value={current.game.language}
                  onChange={(e) =>
                    updateSetting(
                      'game',
                      'language',
                      e.target.value as GameSettings['game']['language']
                    )
                  }
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded font-cinzel cursor-pointer outline-none focus:border-amber-400"
                >
                  <option value="English">English (Original Audio)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Combat Pacing
                  </h4>
                  <p className="text-xs text-slate-400">
                    Deliberate stamina-focused tactical combat vs Dynamic high-speed action.
                  </p>
                </div>
                <div className="flex gap-1 bg-slate-900 p-1 border border-slate-800 rounded">
                  {(['Deliberate', 'Dynamic'] as const).map((cp) => (
                    <button
                      key={cp}
                      onClick={() => updateSetting('game', 'combatPacing', cp)}
                      className={`px-3 py-1 text-xs font-cinzel rounded transition-colors cursor-pointer ${
                        current.game.combatPacing === cp
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="font-cinzel text-sm text-slate-200 uppercase font-semibold">
                    Echo Inheritance Guidance
                  </h4>
                  <p className="text-xs text-slate-400">
                    Displays visual tutorial prompts when approaching fallen warrior echoes.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting('game', 'echoTutorials', !current.game.echoTutorials)
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    current.game.echoTutorials ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      current.game.echoTutorials ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#090e18]">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 font-cinzel uppercase transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-slate-700 hover:border-slate-600 rounded text-xs font-cinzel uppercase text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-cinzel text-xs tracking-wider uppercase font-bold rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Apply & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
