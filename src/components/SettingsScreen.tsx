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
      // Revert!
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
        // Step category up
        const idx = CATEGORIES.findIndex((c) => c.id === activeCategory);
        const prevIdx = (idx - 1 + CATEGORIES.length) % CATEGORIES.length;
        soundEngine.playHover();
        setActiveCategory(CATEGORIES[prevIdx].id);
      } else if (e.key === 'e' || e.key === 'E') {
        // Step category down
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

  // Update specific category setting
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

  // Preset quick applier in Graphics
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

  // Resolution change requested
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

  // Restore defaults
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
    <div className="relative z-40 w-full h-full min-h-screen flex flex-col justify-between bg-black text-slate-100 select-none overflow-hidden animate-fadeIn">
      {/* 1. Full-Screen Subdued Environmental Interior Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSET_PATHS.settingsChamber}
          alt="Ancient stone temple chamber"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-110"
        />
        {/* Controlled dark cinematic overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/75" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* 2. Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-6 border-b border-slate-900 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleReturn}
            onMouseEnter={() => soundEngine.playHover()}
            className="group flex items-center gap-2 px-3 py-1.5 border border-slate-800 hover:border-amber-500/60 text-slate-400 hover:text-amber-200 transition-colors rounded cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-cinzel text-xs tracking-widest uppercase font-semibold">
              BACK
            </span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-3">
            <h2 className="font-cinzel text-lg sm:text-xl font-black tracking-[0.25em] uppercase text-white">
              SETTINGS
            </h2>
            <span className="font-cinzel text-xs tracking-[0.3em] text-amber-400/80 uppercase font-semibold hidden sm:inline">
              / {activeCategory}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-cinzel text-slate-500">
          <span className="border border-slate-800 px-2 py-0.5 rounded text-slate-400 hidden md:inline">
            Q / E CHANGE CATEGORY
          </span>
        </div>
      </header>

      {/* 3. Main Center Split: Left Category Navigation, Right Settings Controls */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full px-6 sm:px-12 py-4">
        {/* LEFT: Category Navigation Column */}
        <nav
          className="w-full md:w-72 md:border-r border-slate-900/90 py-4 md:pr-6 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible"
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
                className={`group relative flex items-center justify-between w-full px-4 py-3 text-left transition-all duration-200 cursor-pointer outline-none ${
                  isSelected
                    ? 'bg-amber-500/10 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
              >
                {/* Thin Selection Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                    isSelected
                      ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                      : 'bg-transparent group-hover:bg-slate-700'
                  }`}
                />

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isSelected ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  />
                  <span
                    className={`font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold ${
                      isSelected ? 'text-amber-200 font-bold' : ''
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>

                <span className="font-mono text-[10px] text-slate-600 hidden md:inline">
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

      {/* 4. Bottom Navigation & Action Hints Bar */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-8 sm:px-12 py-4 border-t border-slate-900 bg-black/70 backdrop-blur-sm text-xs font-cinzel text-slate-400 gap-3">
        {/* Reset Defaults Control */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            setShowResetConfirm(true);
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="flex items-center gap-2 text-slate-400 hover:text-amber-300 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>[R] RESTORE DEFAULTS</span>
        </button>

        {/* Console / Keyboard Hints Bar */}
        <div className="flex items-center gap-4 text-[10px] sm:text-[11px] tracking-widest text-slate-500 uppercase">
          <span>
            <span className="text-amber-400 font-bold mr-1">[W / S]</span> NAVIGATE
          </span>
          <span>·</span>
          <span>
            <span className="text-amber-400 font-bold mr-1">[A / D]</span> ADJUST
          </span>
          <span>·</span>
          <span>
            <span className="text-amber-400 font-bold mr-1">[ENTER]</span> SELECT
          </span>
          <span>·</span>
          <span>
            <span className="text-amber-400 font-bold mr-1">[ESC]</span> RETURN
          </span>
        </div>
      </footer>

      {/* 5. Resolution Countdown Confirmation Modal */}
      {pendingResolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#090d14] border border-amber-500/60 rounded p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-cinzel tracking-widest uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              CONFIRM DISPLAY CONFIGURATION
            </div>

            <h3 className="font-cinzel text-xl font-bold uppercase text-white tracking-wider">
              KEEP NEW RESOLUTION?
            </h3>

            <p className="font-sans text-xs text-slate-300">
              Display adjusted to <span className="text-amber-300 font-mono font-bold">{pendingResolution.resolution}</span>.
              Reverting to previous setting in{' '}
              <span className="text-amber-400 font-mono text-sm font-bold">
                {pendingResolution.countdown}s
              </span>.
            </p>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={revertResolution}
                className="flex-1 py-2.5 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-cinzel text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                REVERT ({pendingResolution.countdown}s)
              </button>

              <button
                type="button"
                onClick={confirmResolutionKeep}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-cinzel text-xs tracking-wider uppercase font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                KEEP CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Restore Defaults Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#090d14] border border-slate-700 rounded p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4 text-center">
            <h3 className="font-cinzel text-lg font-bold uppercase text-white tracking-wider">
              RESTORE DEFAULT SETTINGS?
            </h3>

            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              This will restore all configurations across Display, Graphics, Audio, Gameplay, Controls,
              and Accessibility to their original defaults. Real save files will remain unaffected.
            </p>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playBack();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-cinzel text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 border border-red-500/80 bg-red-950/60 hover:bg-red-900/80 text-red-200 font-cinzel text-xs tracking-wider uppercase font-bold transition-colors cursor-pointer"
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
