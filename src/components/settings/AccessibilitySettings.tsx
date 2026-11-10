import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { SettingsRow } from './SettingsRow';
import { StepperControl } from './StepperControl';
import { GameToggle } from './GameToggle';

interface AccessibilitySettingsProps {
  accessibility: GameSettings['accessibility'];
  onChange: <K extends keyof GameSettings['accessibility']>(
    key: K,
    val: GameSettings['accessibility'][K]
  ) => void;
}

const SHAKE_INTENSITIES = [0, 50, 100] as const;
const SHAKE_LABELS = { '0': '0% (Disabled)', '50': '50% (Dampened)', '100': '100% (Full Impact)' };
const UI_SCALES = ['90% (Compact)', '100% (Standard)', '110% (Elevated)'] as const;
const SUB_BACKGROUNDS = ['None', 'Translucent', 'Solid Black'] as const;
const HOLD_TOGGLES = ['Hold', 'Toggle'] as const;

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  accessibility,
  onChange,
}) => {
  const [activeRow, setActiveRow] = useState<string>('highContrast');

  return (
    <div className="space-y-1">
      {/* High Contrast UI */}
      <SettingsRow
        label="High-Contrast Interface Mode"
        description="Reinforces slate borders with high-contrast outlines and sharpens typographic contrast."
        isActive={activeRow === 'highContrast'}
        onFocus={() => setActiveRow('highContrast')}
      >
        <GameToggle
          value={accessibility.highContrastUI}
          onChange={(val) => onChange('highContrastUI', val)}
        />
      </SettingsRow>

      {/* Reduced Motion */}
      <SettingsRow
        label="Reduced Motion (Vestibular Accessibility)"
        description="Disables camera parallax sway, eases screen transitions, and dampens dynamic floating effects."
        isActive={activeRow === 'reducedMotion'}
        onFocus={() => setActiveRow('reducedMotion')}
      >
        <GameToggle
          value={accessibility.reducedMotion}
          onChange={(val) => onChange('reducedMotion', val)}
        />
      </SettingsRow>

      {/* Camera Shake Intensity */}
      <SettingsRow
        label="Impact Camera Shake Intensity"
        description="Modulates physical camera impulse on parries, falls, and divine shockwaves."
        isActive={activeRow === 'shake'}
        onFocus={() => setActiveRow('shake')}
      >
        <StepperControl
          options={SHAKE_INTENSITIES}
          value={accessibility.cameraShakeIntensity}
          labels={SHAKE_LABELS}
          onChange={(val) => onChange('cameraShakeIntensity', val)}
        />
      </SettingsRow>

      {/* UI Scale */}
      <SettingsRow
        label="User Interface Scale"
        description="Scales HUD status elements, lore scrolls, and title menu proportions."
        isActive={activeRow === 'uiScale'}
        onFocus={() => setActiveRow('uiScale')}
      >
        <StepperControl
          options={UI_SCALES}
          value={accessibility.uiScale}
          onChange={(val) => onChange('uiScale', val)}
        />
      </SettingsRow>

      {/* Subtitle Background */}
      <SettingsRow
        label="Subtitle Text Background Plaque"
        description="Places a solid or translucent backing scrim behind text for legibility over bright explosions."
        isActive={activeRow === 'subBg'}
        onFocus={() => setActiveRow('subBg')}
      >
        <StepperControl
          options={SUB_BACKGROUNDS}
          value={accessibility.subtitleBackground}
          onChange={(val) => onChange('subtitleBackground', val)}
        />
      </SettingsRow>

      {/* Color-Independent Indicators */}
      <SettingsRow
        label="Color-Independent Selection Markers"
        description="Appends distinctive geometric glyphs (diamond, rule) alongside color-state shifts."
        isActive={activeRow === 'colorInd'}
        onFocus={() => setActiveRow('colorInd')}
      >
        <GameToggle
          value={accessibility.colorIndependentIndicators}
          onChange={(val) => onChange('colorIndependentIndicators', val)}
        />
      </SettingsRow>

      {/* Sprint Behavior */}
      <SettingsRow
        label="Sprint Input Behavior"
        description="Choose whether holding or tapping the sprint binding initiates continuous acceleration."
        isActive={activeRow === 'sprint'}
        onFocus={() => setActiveRow('sprint')}
      >
        <StepperControl
          options={HOLD_TOGGLES}
          value={accessibility.sprintBehavior}
          onChange={(val) => onChange('sprintBehavior', val)}
        />
      </SettingsRow>

      {/* Block Behavior */}
      <SettingsRow
        label="Deflect / Block Guard Input"
        description="Choose whether katana guard stance is maintained by holding or toggled on key tap."
        isActive={activeRow === 'block'}
        onFocus={() => setActiveRow('block')}
      >
        <StepperControl
          options={HOLD_TOGGLES}
          value={accessibility.blockBehavior}
          onChange={(val) => onChange('blockBehavior', val)}
        />
      </SettingsRow>
    </div>
  );
};
