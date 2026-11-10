import React, { useState, useEffect } from 'react';
import { GameSettings, SettingsCategory } from '../types/game';
import { DEFAULT_SETTINGS, ASSET_PATHS } from '../data/gameData';
import { soundEngine } from '../audio/soundEngine';
import { DisplaySettings } from './settings/DisplaySettings';
import { GraphicsSettings } from './settings/GraphicsSettings';
import { AudioSettings } from './settings/AudioSettings';
import { GameplaySettings } from './settings/GameplaySettings';
import { ControlsSettings } from './settings/ControlsSettings';
import { AccessibilitySettings } from './settings/AccessibilitySettings';
import {
  Monitor,
  Cpu,
  Volume2,
  Gamepad2,
  Keyboard,
  Eye,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: GameSettings;
  onSaveSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

const CATEGORIES: { id: SettingsCategory; label: string; index: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'DISPLAY', label: 'DISPLAY', index: '01', icon: Monitor },
  { id: 'GRAPHICS', label: 'GRAPHICS', index: '02', icon: Cpu },
  { id: 'AUDIO', label: 'AUDIO', index: '03', icon: Volume2 },
  { id: 'GAMEPLAY', label: 'GAMEPLAY', index: '04', icon: Gamepad2 },
  { id: 'CONTROLS', label: 'CONTROLS', index: '05', icon: Keyboard },
  { id: 'ACCESSIBILITY', label: 'ACCESSIBILITY', index: '06', icon: Eye },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onSaveSettings,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('DISPLAY');
  const [current, setCurrent] = useState<GameSettings>({ ...settings });
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Resolution Revert Countdown Modal
  const [pendingResolution, setPendingResolution] = useState<{
    resolution: string;
    previous: string;
    countdown: number;
  } | null>(null);

  // Restore Defaults Confirmation Modal
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Resolution countdown timer
  useEffect(() => {
    if (!pendingResolution) return;

    if (pendingResolution.countdown <= 0) {
      soundEngine.playBack();
      setCurrent((prev) => ({
        ...prev,
        display: {
          ...prev.display,
          resolution: pendingResolution.previous,
        },
      }));
      setPendingResolution(null);
      return;
    }

    const timer = setInterval(() => {
      setPendingResolution((prev) =>
        prev ? { ...prev, countdown: prev.countdown - 1 } : null
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingResolution]);

  // Keyboard navigation for categories & modal actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pendingResolution || showResetConfirm) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playBack();
        if (hasChanges) {
          onSaveSettings(current);
        }
        onClose();
      } else if (e.key === 'q' || e.key === 'Q') {
        const idx = CATEGORIES.findIndex((c) => c.id === activeCategory);
        const prevIdx = (idx - 1 + CATEGORIES.length) % CATEGORIES.length;
        soundEngine.playHover();
        setActiveCategory(CATEGORIES[prevIdx].id);
      } else if (e.key === 'e' || e.key === 'E') {
        const idx = CATEGORIES.findIndex((c) => c.id === activeCategory);
        const nextIdx = (idx + 1) % CATEGORIES.length;
        soundEngine.playHover();
        setActiveCategory(CATEGORIES[nextIdx].id);
      } else if (e.key === 'r' || e.key === 'R') {
        soundEngine.playSelect();
        setShowResetConfirm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategory, current, hasChanges, onSaveSettings, onClose, pendingResolution, showResetConfirm]);

  const handleUpdate = <C extends keyof GameSettings, K extends keyof GameSettings[C]>(
    category: C,
    key: K,
    val: GameSettings[C][K]
  ) => {
    const updated = {
      ...current,
      [category]: {
        ...current[category],
        [key]: val,
      },
    };
    setCurrent(updated);
    setHasChanges(true);

    if (category === 'audio') {
      soundEngine.setVolumes(updated.audio);
    }
  };

  const handleApplyPreset = (preset: GameSettings['graphics']['preset']) => {
    soundEngine.playSelect();
    let updatedGraphics = { ...current.graphics, preset };

    if (preset === 'Very Low') {
      updatedGraphics = {
        ...updatedGraphics,
        preset,
        resolutionScale: 70,
        textureQuality: 'Low',
        shadowQuality: 'Low',
        effectsQuality: 'Low',
        postProcessing: 'Low',
        antiAliasing: 'Off',
        ambientOcclusion: 'Off',
        anisotropicFiltering: 'Off',
        motionBlur: 'Off',
        depthOfField: false,
        vegetationDensity: 'Low',
        environmentDetail: 'Low',
        volumetricFog: 'Off',
      };
    } else if (preset === 'Low') {
      updatedGraphics = {
        ...updatedGraphics,
        preset,
        resolutionScale: 85,
        textureQuality: 'Low',
        shadowQuality: 'Low',
        effectsQuality: 'Medium',
        postProcessing: 'Low',
        antiAliasing: 'FXAA',
        ambientOcclusion: 'Off',
        anisotropicFiltering: '2x',
        motionBlur: 'Low',
        depthOfField: false,
        vegetationDensity: 'Low',
        environmentDetail: 'Low',
        volumetricFog: 'Low',
      };
    } else if (preset === 'Medium') {
      updatedGraphics = {
        ...updatedGraphics,
        preset,
        resolutionScale: 100,
        textureQuality: 'Medium',
        shadowQuality: 'Medium',
        effectsQuality: 'Medium',
        postProcessing: 'Medium',
        antiAliasing: 'FXAA',
        ambientOcclusion: 'SSAO',
        anisotropicFiltering: '4x',
        motionBlur: 'Low',
        depthOfField: true,
        vegetationDensity: 'Medium',
        environmentDetail: 'Medium',
        volumetricFog: 'Low',
      };
    } else if (preset === 'High') {
      updatedGraphics = {
        ...updatedGraphics,
        preset,
        resolutionScale: 100,
        textureQuality: 'High',
        shadowQuality: 'High',
        effectsQuality: 'High',
        postProcessing: 'High',
        antiAliasing: 'TAA',
        ambientOcclusion: 'SSAO',
        anisotropicFiltering: '8x',
        motionBlur: 'Low',
        depthOfField: true,
        vegetationDensity: 'High',
        environmentDetail: 'High',
        volumetricFog: 'High',
      };
    } else if (preset === 'Ultra') {
      updatedGraphics = {
        ...updatedGraphics,
        preset,
        resolutionScale: 100,
        textureQuality: 'Ultra',
        shadowQuality: 'Ultra',
        effectsQuality: 'Ultra',
        postProcessing: 'Ultra',
        antiAliasing: 'TAA',
        ambientOcclusion: 'HBAO+',
        anisotropicFiltering: '16x',
        motionBlur: 'High',
        depthOfField: true,
        vegetationDensity: 'High',
        environmentDetail: 'High',
        volumetricFog: 'High',
      };
    }

    setCurrent((prev) => ({
      ...prev,
      graphics: updatedGraphics,
    }));
    setHasChanges(true);
  };

  const handleRequestResolution = (newRes: string) => {
    soundEngine.playSelect();
    const prev = current.display.resolution;
    setCurrent((p) => ({
      ...p,
      display: {
        ...p.display,
        resolution: newRes,
      },
    }));
    setHasChanges(true);
    setPendingResolution({
      resolution: newRes,
      previous: prev,
      countdown: 15,
    });
  };

  const confirmResolutionKeep = () => {
    soundEngine.playConfirm();
    setPendingResolution(null);
  };

  const revertResolution = () => {
    soundEngine.playBack();
    if (pendingResolution) {
      setCurrent((prev) => ({
        ...prev,
        display: {
          ...prev.display,
          resolution: pendingResolution.previous,
        },
      }));
    }
    setPendingResolution(null);
  };

  const handleConfirmReset = () => {
    soundEngine.playConfirm();
    setCurrent({ ...DEFAULT_SETTINGS });
    soundEngine.setVolumes(DEFAULT_SETTINGS.audio);
    setHasChanges(true);
    setShowResetConfirm(false);
  };

  const handleReturn = () => {
    soundEngine.playBack();
    onSaveSettings(current);
    onClose();
  };

  return (
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-[#040508] text-[#ede8dc] select-none overflow-hidden animate-fadeIn">
      {/* 1. Full-Screen Subdued Environmental Interior Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.settingsChamber}
          alt="Ancient stone temple chamber"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508]/95 via-[#040508]/85 to-[#040508]/75" />
        <div className="absolute inset-0 cinematic-vignette opacity-70" />
      </div>

      {/* 2. Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-5 border-b border-[#181d26] bg-[#040508]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleReturn}
            onMouseEnter={() => soundEngine.playHover()}
            className="group flex items-center gap-2 text-[#848c98] hover:text-[#ede8dc] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-ui text-xs tracking-widest uppercase font-semibold">
              BACK [ESC]
            </span>
          </button>

          <div className="h-4 w-[1px] bg-[#222834]" />

          <div className="flex items-center gap-3">
            <h2 className="font-title text-lg sm:text-xl font-bold tracking-[0.24em] uppercase text-[#ede8dc]">
              SYSTEM SETTINGS
            </h2>
            <span className="font-ui text-xs tracking-[0.25em] text-[#c5a059] uppercase font-semibold hidden sm:inline">
              / {activeCategory}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#5a6270]">
          <span className="border border-[#222834] px-2 py-0.5 rounded text-[#848c98] hidden md:inline">
            [Q / E] PREV / NEXT CATEGORY
          </span>
        </div>
      </header>

      {/* 3. Main Center Split */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full px-6 sm:px-12 py-3">
        {/* LEFT: Category Navigation Column */}
        <nav
          className="w-full md:w-64 md:border-r border-[#181d26] py-3 md:pr-4 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible"
          aria-label="Settings Categories"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundEngine.playSelect();
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`group relative flex items-center justify-between w-full px-4 py-2.5 text-left transition-all duration-150 cursor-pointer outline-none ${
                  isSelected
                    ? 'bg-[#c5a059]/10 text-[#ede8dc]'
                    : 'text-[#848c98] hover:text-[#ded9cd] hover:bg-white/[0.02]'
                }`}
              >
                {/* Thin Selection Marker */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all ${
                    isSelected
                      ? 'bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.8)]'
                      : 'bg-transparent group-hover:bg-[#2b3342]'
                  }`}
                />

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isSelected ? 'text-[#c5a059]' : 'text-[#5a6270] group-hover:text-[#848c98]'
                    }`}
                  />
                  <span
                    className={`font-ui text-xs tracking-[0.2em] uppercase font-semibold ${
                      isSelected ? 'text-[#ede8dc] font-bold' : ''
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>

                <span className="font-mono text-[10px] text-[#454c59] hidden md:inline">
                  {cat.index}
                </span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Selected Category Controls Viewport */}
        <div className="flex-1 overflow-y-auto py-2 md:pl-8 pr-2 custom-scroll">
          {activeCategory === 'DISPLAY' && (
            <DisplaySettings
              display={current.display}
              onChange={(key, val) => handleUpdate('display', key, val)}
              onRequestResolutionChange={handleRequestResolution}
              onRequestDisplayModeChange={(val) => handleUpdate('display', 'displayMode', val)}
            />
          )}

          {activeCategory === 'GRAPHICS' && (
            <GraphicsSettings
              graphics={current.graphics}
              onChange={(key, val) => handleUpdate('graphics', key, val)}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {activeCategory === 'AUDIO' && (
            <AudioSettings
              audio={current.audio}
              onChange={(key, val) => handleUpdate('audio', key, val)}
            />
          )}

          {activeCategory === 'GAMEPLAY' && (
            <GameplaySettings
              gameplay={current.gameplay}
              onChange={(key, val) => handleUpdate('gameplay', key, val)}
            />
          )}

          {activeCategory === 'CONTROLS' && (
            <ControlsSettings
              controls={current.controls}
              onChange={(key, val) => handleUpdate('controls', key, val)}
              onResetControls={() => {
                setCurrent((prev) => ({
                  ...prev,
                  controls: DEFAULT_SETTINGS.controls,
                }));
                setHasChanges(true);
              }}
            />
          )}

          {activeCategory === 'ACCESSIBILITY' && (
            <AccessibilitySettings
              accessibility={current.accessibility}
              onChange={(key, val) => handleUpdate('accessibility', key, val)}
            />
          )}
        </div>
      </div>

      {/* 4. Bottom Control Bar */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-8 sm:px-12 py-3 border-t border-[#181d26] bg-[#040508]/80 backdrop-blur-sm text-xs font-ui text-[#848c98] gap-3">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            setShowResetConfirm(true);
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="flex items-center gap-2 text-[#7d848f] hover:text-[#c5a059] transition-colors uppercase tracking-wider cursor-pointer text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>[R] RESTORE DEFAULTS</span>
        </button>

        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-wider text-[#5a6270] uppercase">
          <span><span className="text-[#848c98] font-bold">[W / S]</span> NAVIGATE</span>
          <span>·</span>
          <span><span className="text-[#848c98] font-bold">[A / D]</span> ADJUST</span>
          <span>·</span>
          <span><span className="text-[#848c98] font-bold">[ENTER]</span> SELECT</span>
          <span>·</span>
          <span><span className="text-[#848c98] font-bold">[ESC]</span> RETURN</span>
        </div>
      </footer>

      {/* 5. Resolution Revert Countdown Modal */}
      {pendingResolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0a0d14] border border-[#2e3442] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.95)] space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#c5a059] text-xs font-ui tracking-wider uppercase font-semibold">
              <AlertTriangle className="w-4 h-4 text-[#c5a059]" />
              DISPLAY CONFIGURATION CONFIRMATION
            </div>

            <h3 className="font-title text-xl font-bold uppercase text-[#ede8dc] tracking-wider">
              KEEP NEW RESOLUTION?
            </h3>

            <p className="font-ui text-xs text-[#848c98]">
              Target adjusted to <span className="text-[#ede8dc] font-mono font-bold">{pendingResolution.resolution}</span>.
              Reverting to previous setting in{' '}
              <span className="text-[#c5a059] font-mono font-bold">
                {pendingResolution.countdown}s
              </span>.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={revertResolution}
                className="flex-1 py-2.5 border border-[#2e3442] hover:border-[#434b5c] text-[#848c98] hover:text-[#ede8dc] font-ui text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <X className="w-3.5 h-3.5" />
                REVERT ({pendingResolution.countdown}s)
              </button>

              <button
                type="button"
                onClick={confirmResolutionKeep}
                className="flex-1 py-2.5 border border-[#c5a059] bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#ede8dc] font-title text-xs tracking-wider uppercase font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-3.5 h-3.5 text-[#c5a059]" />
                KEEP CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Restore Defaults Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0a0d14] border border-[#2e3442] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.95)] space-y-4 text-center">
            <h3 className="font-title text-lg font-bold uppercase text-[#ede8dc] tracking-wider">
              RESTORE DEFAULT SETTINGS?
            </h3>

            <p className="font-ui text-xs text-[#848c98] leading-relaxed">
              All configurations across Display, Graphics, Acoustics, Gameplay, Controls, and Accessibility
              will return to factory defaults. Recorded chronicles will remain untouched.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playBack();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 border border-[#2e3442] hover:border-[#434b5c] text-[#848c98] hover:text-[#ede8dc] font-ui text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                CANCEL [ESC]
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 border border-[#8a242a] bg-[#8a242a]/20 hover:bg-[#8a242a]/30 text-[#ede8dc] font-title text-xs tracking-wider uppercase font-bold transition-colors cursor-pointer"
              >
                RESTORE DEFAULTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
