import React, { useState, useEffect } from 'react';
import { GameSettings, KeyBindings } from '../../types/game';
import { SettingsRow } from './SettingsRow';
import { StepperControl } from './StepperControl';
import { GameSlider } from './GameSlider';
import { GameToggle } from './GameToggle';
import { soundEngine } from '../../audio/soundEngine';

interface ControlsSettingsProps {
  controls: GameSettings['controls'];
  onChange: <K extends keyof GameSettings['controls']>(key: K, val: GameSettings['controls'][K]) => void;
  onResetControls: () => void;
}

const CONTROLLER_LAYOUTS = ['Standard', 'Alternative', 'Tactical'] as const;

const ACTION_LABELS: { key: keyof KeyBindings; label: string; description: string }[] = [
  { key: 'moveForward', label: 'Move Forward', description: 'Advance character forward along directional vector.' },
  { key: 'moveBackward', label: 'Move Backward', description: 'Step backward or retreat.' },
  { key: 'moveLeft', label: 'Move Left (Strafe)', description: 'Step laterally to the left.' },
  { key: 'moveRight', label: 'Move Right (Strafe)', description: 'Step laterally to the right.' },
  { key: 'jump', label: 'Jump / Mantle', description: 'Vault over ruined timbers or leap over ground rifts.' },
  { key: 'dodge', label: 'Dodge / Sprint', description: 'Evade incoming strikes or hold to sprint.' },
  { key: 'interact', label: 'Interact / Absorb Echo', description: 'Commune with fallen warrior echoes or open temple gates.' },
  { key: 'attack', label: 'Light Attack', description: 'Perform rapid primary katana or glaive combo strikes.' },
  { key: 'heavyAttack', label: 'Heavy / Piercing Strike', description: 'Execute poise-breaking thrust or sweeping celestial arc.' },
  { key: 'block', label: 'Deflect / Guard (Parry)', description: 'Deflect enemy blade at precise moment of impact.' },
  { key: 'echoRelease', label: 'Echo Art Release', description: 'Unleash inherited supernatural ability.' },
  { key: 'inventory', label: 'Chronicle / Inventory', description: 'Open inherited echo list and item scrolls.' },
  { key: 'pause', label: 'Pause Menu', description: 'Open title/pause system menu.' },
];

export const ControlsSettings: React.FC<ControlsSettingsProps> = ({
  controls,
  onChange,
  onResetControls,
}) => {
  const [activeRow, setActiveRow] = useState<string>('mouseSens');
  const [rebindingAction, setRebindingAction] = useState<keyof KeyBindings | null>(null);
  const [activeTab, setActiveTab] = useState<'keyboard' | 'controller'>('keyboard');

  // Key Rebinding Listener
  useEffect(() => {
    if (!rebindingAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        soundEngine.playBack();
        setRebindingAction(null);
        return;
      }

      // Convert key names nicely
      let keyName = e.key.toUpperCase();
      if (e.code === 'Space') keyName = 'Space';
      else if (e.key === ' ') keyName = 'Space';
      else if (e.key.length === 1) keyName = e.key.toUpperCase();
      else if (e.key === 'Shift') keyName = 'Shift';
      else if (e.key === 'Control') keyName = 'Ctrl';
      else if (e.key === 'Alt') keyName = 'Alt';

      soundEngine.playRebind();

      const updatedBindings = {
        ...controls.bindings,
        [rebindingAction]: keyName,
      };

      onChange('bindings', updatedBindings);
      setRebindingAction(null);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [rebindingAction, controls.bindings, onChange]);

  return (
    <div className="space-y-4">
      {/* Sub-tab selection between Keyboard/Mouse and Gamepad */}
      <div className="flex items-center gap-4 border-b border-slate-900 pb-2 px-5">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            setActiveTab('keyboard');
          }}
          className={`font-cinzel text-xs tracking-widest font-semibold pb-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'keyboard'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          KEYBOARD & MOUSE
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            setActiveTab('controller');
          }}
          className={`font-cinzel text-xs tracking-widest font-semibold pb-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'controller'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          CONTROLLER (GAMEPAD)
        </button>
      </div>

      {activeTab === 'keyboard' && (
        <div className="space-y-1">
          {/* Mouse Sensitivity */}
          <SettingsRow
            label="Mouse Aim Sensitivity"
            description="Multiplier for high-DPI mouse cursor camera rotation."
            isActive={activeRow === 'mouseSens'}
            onFocus={() => setActiveRow('mouseSens')}
          >
            <GameSlider
              min={1}
              max={10}
              step={1}
              unit=""
              value={controls.mouseSensitivity}
              onChange={(val) => onChange('mouseSensitivity', val)}
            />
          </SettingsRow>

          {/* Invert Y-Axis */}
          <SettingsRow
            label="Invert Mouse Pitch (Y-Axis)"
            description="Inverts vertical camera movement for flight and traditional flight-stick feel."
            isActive={activeRow === 'invertY'}
            onFocus={() => setActiveRow('invertY')}
          >
            <GameToggle
              value={controls.invertY}
              onChange={(val) => onChange('invertY', val)}
            />
          </SettingsRow>

          <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-cinzel text-slate-500 border-b border-slate-900">
            <span>ACTION BINDING</span>
            <span>ASSIGNED KEY</span>
          </div>

          {/* Key Bindings List */}
          {ACTION_LABELS.map((item) => {
            const isRebindingThis = rebindingAction === item.key;
            const currentBinding = controls.bindings[item.key];

            return (
              <SettingsRow
                key={item.key}
                label={item.label}
                description={item.description}
                isActive={activeRow === item.key || isRebindingThis}
                onFocus={() => setActiveRow(item.key)}
              >
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSelect();
                    setRebindingAction(item.key);
                  }}
                  className={`w-36 py-1 px-3 border text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    isRebindingThis
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 animate-pulse'
                      : 'border-slate-800 bg-black/40 hover:border-amber-500/50 text-slate-200'
                  }`}
                >
                  {isRebindingThis ? 'PRESS KEY...' : currentBinding}
                </button>
              </SettingsRow>
            );
          })}

          {/* Reset Controls Button */}
          <div className="pt-4 px-5 flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundEngine.playConfirm();
                onResetControls();
              }}
              className="px-4 py-2 border border-slate-800 bg-black/40 hover:border-slate-700 text-xs font-cinzel text-slate-400 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Restore Default Key Bindings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'controller' && (
        <div className="space-y-4 px-5">
          <SettingsRow
            label="Controller Layout Template"
            description="Pre-configured controller button profiles."
            isActive={activeRow === 'controllerLayout'}
            onFocus={() => setActiveRow('controllerLayout')}
          >
            <StepperControl
              options={CONTROLLER_LAYOUTS}
              value={controls.controllerLayout}
              onChange={(val) => onChange('controllerLayout', val)}
            />
          </SettingsRow>

          {/* Controller Map Diagram */}
          <div className="p-5 border border-slate-800 bg-black/60 rounded space-y-4">
            <div className="flex items-center justify-between text-xs font-cinzel text-amber-300">
              <span>GAMEPAD DIAGRAM · {controls.controllerLayout.toUpperCase()}</span>
              <span>XINPUT / DUALSENSE READY</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-cinzel">
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-amber-400 block text-[10px]">LEFT STICK</span>
                <span className="text-slate-200">Character Movement</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-amber-400 block text-[10px]">RIGHT STICK</span>
                <span className="text-slate-200">Camera Orbit / Lock-On</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-cyan-400 block text-[10px]">RIGHT BUMPER (RB / R1)</span>
                <span className="text-slate-200">Light Katana Attack</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-cyan-400 block text-[10px]">RIGHT TRIGGER (RT / R2)</span>
                <span className="text-slate-200">Heavy Strike / Arc</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-amber-400 block text-[10px]">LEFT BUMPER (LB / L1)</span>
                <span className="text-slate-200">Deflect & Parry Guard</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-amber-400 block text-[10px]">LEFT TRIGGER (LT / L2)</span>
                <span className="text-slate-200">Channel Echo Stance</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-slate-400 block text-[10px]">BUTTON A / CROSS</span>
                <span className="text-slate-200">Jump & Mantle</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-slate-400 block text-[10px]">BUTTON B / CIRCLE</span>
                <span className="text-slate-200">Dodge & Dash</span>
              </div>
              <div className="p-2 border border-slate-800/80 rounded bg-slate-900/30">
                <span className="text-slate-400 block text-[10px]">BUTTON X / SQUARE</span>
                <span className="text-slate-200">Interact & Absorb</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
