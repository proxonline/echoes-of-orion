import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { SettingsRow } from './SettingsRow';
import { StepperControl } from './StepperControl';
import { GameSlider } from './GameSlider';
import { GameToggle } from './GameToggle';
import { ASSET_PATHS } from '../../data/gameData';
import { soundEngine } from '../../audio/soundEngine';

interface DisplaySettingsProps {
  display: GameSettings['display'];
  onChange: <K extends keyof GameSettings['display']>(key: K, val: GameSettings['display'][K]) => void;
  onRequestResolutionChange: (newResolution: string) => void;
  onRequestDisplayModeChange: (newMode: GameSettings['display']['displayMode']) => void;
}

const DISPLAY_MODES = ['Fullscreen', 'Borderless Window', 'Windowed'] as const;
const RESOLUTIONS = [
  '3840x2160 (16:9)',
  '2560x1440 (16:9)',
  '1920x1080 (16:9)',
  '1600x900 (16:9)',
  '1366x768 (16:9)',
  '1280x720 (16:9)',
] as const;
const REFRESH_RATES = ['60 Hz', '120 Hz', '144 Hz', '240 Hz'] as const;
const FPS_LIMITS = ['30 FPS', '45 FPS', '60 FPS', '90 FPS', '120 FPS', 'Unlimited'] as const;
const PARALLAX_MODES = ['Off', 'Subtle', 'Dynamic'] as const;

export const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  display,
  onChange,
  onRequestResolutionChange,
  onRequestDisplayModeChange,
}) => {
  const [activeRow, setActiveRow] = useState<string>('displayMode');
  const [showCalibration, setShowCalibration] = useState<boolean>(false);

  return (
    <div className="space-y-1">
      {/* Display Mode */}
      <SettingsRow
        label="Display Mode"
        description="Select window containment format. Borderless allows seamless desktop alt-tabbing."
        isActive={activeRow === 'displayMode'}
        onFocus={() => setActiveRow('displayMode')}
      >
        <StepperControl
          options={DISPLAY_MODES}
          value={display.displayMode}
          onChange={(val) => {
            if (val === 'Fullscreen') {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            } else if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
            onRequestDisplayModeChange(val);
          }}
        />
      </SettingsRow>

      {/* Resolution */}
      <SettingsRow
        label="Resolution"
        description="Output rendering canvas resolution. Affects pixel density and UI canvas aspect."
        isActive={activeRow === 'resolution'}
        onFocus={() => setActiveRow('resolution')}
      >
        <StepperControl
          options={RESOLUTIONS}
          value={display.resolution as typeof RESOLUTIONS[number]}
          onChange={(newRes) => onRequestResolutionChange(newRes)}
        />
      </SettingsRow>

      {/* Refresh Rate */}
      <SettingsRow
        label="Display Refresh Rate"
        description="Target monitor scan frequency for presentation sync."
        isActive={activeRow === 'refreshRate'}
        onFocus={() => setActiveRow('refreshRate')}
      >
        <StepperControl
          options={REFRESH_RATES}
          value={display.refreshRate}
          onChange={(val) => onChange('refreshRate', val)}
        />
      </SettingsRow>

      {/* V-Sync */}
      <SettingsRow
        label="Vertical Synchronization (V-Sync)"
        description="Synchronizes rendered frame presentation with display refresh to prevent screen tearing."
        isActive={activeRow === 'vsync'}
        onFocus={() => setActiveRow('vsync')}
      >
        <GameToggle
          value={display.vsync}
          onChange={(val) => onChange('vsync', val)}
        />
      </SettingsRow>

      {/* Frame Rate Limit */}
      <SettingsRow
        label="Frame Rate Limit"
        description="Caps internal game loop delta to conserve GPU resources and reduce thermal load."
        isActive={activeRow === 'fpsLimit'}
        onFocus={() => setActiveRow('fpsLimit')}
      >
        <StepperControl
          options={FPS_LIMITS}
          value={display.frameRateLimit}
          onChange={(val) => onChange('frameRateLimit', val)}
        />
      </SettingsRow>

      {/* Brightness */}
      <SettingsRow
        label="Display Luminance (Brightness)"
        description="Adjust gamma compensation. Use the calibration view to align black floor levels."
        isActive={activeRow === 'brightness'}
        onFocus={() => setActiveRow('brightness')}
      >
        <div className="flex items-center gap-2">
          <GameSlider
            min={0}
            max={100}
            step={2}
            value={display.brightness}
            onChange={(val) => onChange('brightness', val)}
          />
          <button
            type="button"
            onClick={() => {
              soundEngine.playSelect();
              setShowCalibration(!showCalibration);
            }}
            className="px-2.5 py-1 text-[11px] font-cinzel border border-slate-700 bg-slate-900/60 hover:border-amber-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {showCalibration ? 'HIDE TEST' : 'CALIBRATE'}
          </button>
        </div>
      </SettingsRow>

      {/* Calibration Preview Box */}
      {showCalibration && (
        <div className="mx-5 my-3 p-4 border border-slate-800 bg-black/80 rounded space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-cinzel text-slate-400">
            <span>BRIGHTNESS CALIBRATION</span>
            <span>TARGET: CENTER SIGIL BARELY VISIBLE</span>
          </div>
          <div className="grid grid-cols-3 gap-2 h-20 text-center font-cinzel text-[10px]">
            {/* Box 1: Barely visible */}
            <div
              className="flex flex-col items-center justify-center p-2 rounded border border-slate-900"
              style={{
                backgroundColor: `rgb(${Math.max(2, Math.round(display.brightness * 0.15))}, ${Math.max(
                  2,
                  Math.round(display.brightness * 0.15)
                )}, ${Math.max(2, Math.round(display.brightness * 0.15))})`,
              }}
            >
              <img
                src={ASSET_PATHS.orionSigil}
                alt="Sigil Test"
                className="w-7 h-7 object-contain opacity-40 mix-blend-screen"
              />
              <span className="text-slate-500 mt-1">BARELY VISIBLE</span>
            </div>

            {/* Box 2: Clearly visible */}
            <div
              className="flex flex-col items-center justify-center p-2 rounded border border-slate-800"
              style={{
                backgroundColor: `rgb(${Math.round(display.brightness * 0.7)}, ${Math.round(
                  display.brightness * 0.7
                )}, ${Math.round(display.brightness * 0.7)})`,
              }}
            >
              <img
                src={ASSET_PATHS.orionSigil}
                alt="Sigil Test"
                className="w-7 h-7 object-contain opacity-90"
              />
              <span className="text-slate-900 font-bold mt-1">CLEARLY VISIBLE</span>
            </div>

            {/* Box 3: Highlight Reference */}
            <div className="flex flex-col items-center justify-center p-2 rounded bg-white text-black font-bold border border-white">
              <span className="text-xs uppercase">HIGH PEAK</span>
              <span className="text-slate-700 font-sans text-[10px]">Reference 100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Field of View */}
      <SettingsRow
        label="Camera Field of View (FOV)"
        description="Horizontal perspective viewing angle. Standard is 90 degrees."
        isActive={activeRow === 'fov'}
        onFocus={() => setActiveRow('fov')}
      >
        <GameSlider
          min={75}
          max={110}
          step={1}
          unit="°"
          value={display.fov}
          onChange={(val) => onChange('fov', val)}
        />
      </SettingsRow>

      {/* Camera Parallax */}
      <SettingsRow
        label="Title Camera Parallax"
        description="Gentle rotational depth tilt reacting to cursor or controller stick displacement."
        isActive={activeRow === 'cameraParallax'}
        onFocus={() => setActiveRow('cameraParallax')}
      >
        <StepperControl
          options={PARALLAX_MODES}
          value={display.cameraParallax}
          onChange={(val) => onChange('cameraParallax', val)}
        />
      </SettingsRow>
    </div>
  );
};
