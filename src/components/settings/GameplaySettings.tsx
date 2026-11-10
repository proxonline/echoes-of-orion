import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { SettingsRow } from './SettingsRow';
import { StepperControl } from './StepperControl';
import { GameSlider } from './GameSlider';
import { GameToggle } from './GameToggle';

interface GameplaySettingsProps {
  gameplay: GameSettings['gameplay'];
  onChange: <K extends keyof GameSettings['gameplay']>(key: K, val: GameSettings['gameplay'][K]) => void;
}

const DIFFICULTIES = ['Story', 'Easy', 'Normal', 'Hard', 'Nightmare'] as const;
const SUBTITLE_SIZES = ['Small', 'Medium', 'Large'] as const;
const CAMERA_SHAKES = ['Off', 'Low', 'Normal'] as const;
const COMBAT_PACINGS = ['Deliberate', 'Dynamic'] as const;

export const GameplaySettings: React.FC<GameplaySettingsProps> = ({
  gameplay,
  onChange,
}) => {
  const [activeRow, setActiveRow] = useState<string>('difficulty');

  return (
    <div className="space-y-1">
      {/* Difficulty */}
      <SettingsRow
        label="Difficulty Tier"
        description="Scales enemy posture recovery, parry deflection windows, and divine strike lethality."
        isActive={activeRow === 'difficulty'}
        onFocus={() => setActiveRow('difficulty')}
      >
        <StepperControl
          options={DIFFICULTIES}
          value={gameplay.difficulty}
          onChange={(val) => onChange('difficulty', val)}
        />
      </SettingsRow>

      {/* Combat Pacing */}
      <SettingsRow
        label="Combat Pacing Style"
        description="Deliberate focuses on stamina and committed animations; Dynamic enables higher mobility."
        isActive={activeRow === 'combatPacing'}
        onFocus={() => setActiveRow('combatPacing')}
      >
        <StepperControl
          options={COMBAT_PACINGS}
          value={gameplay.combatPacing}
          onChange={(val) => onChange('combatPacing', val)}
        />
      </SettingsRow>

      {/* Damage Numbers */}
      <SettingsRow
        label="Combat Damage Numbers"
        description="Renders floating physical and spectral damage values on blade contact."
        isActive={activeRow === 'damageNumbers'}
        onFocus={() => setActiveRow('damageNumbers')}
      >
        <GameToggle
          value={gameplay.damageNumbers}
          onChange={(val) => onChange('damageNumbers', val)}
        />
      </SettingsRow>

      {/* Subtitles */}
      <SettingsRow
        label="Dialogue Subtitles"
        description="Display text transcriptions during cinematics, elder whispers, and character dialogues."
        isActive={activeRow === 'subtitles'}
        onFocus={() => setActiveRow('subtitles')}
      >
        <GameToggle
          value={gameplay.subtitles}
          onChange={(val) => onChange('subtitles', val)}
        />
      </SettingsRow>

      {/* Subtitle Size */}
      <SettingsRow
        label="Subtitle Size"
        description="Font scaling for on-screen dialogue and narrative transcripts."
        isActive={activeRow === 'subtitleSize'}
        onFocus={() => setActiveRow('subtitleSize')}
        disabled={!gameplay.subtitles}
      >
        <StepperControl
          options={SUBTITLE_SIZES}
          value={gameplay.subtitleSize}
          disabled={!gameplay.subtitles}
          onChange={(val) => onChange('subtitleSize', val)}
        />
      </SettingsRow>

      {/* Camera Shake */}
      <SettingsRow
        label="Camera Impact Shake"
        description="Dynamic camera oscillation on heavy weapon impacts, parries, and divine tremors."
        isActive={activeRow === 'cameraShake'}
        onFocus={() => setActiveRow('cameraShake')}
      >
        <StepperControl
          options={CAMERA_SHAKES}
          value={gameplay.cameraShake}
          onChange={(val) => onChange('cameraShake', val)}
        />
      </SettingsRow>

      {/* Camera Sensitivity */}
      <SettingsRow
        label="Camera Look Sensitivity"
        description="Rotational speed of free camera orbit in 3D exploration."
        isActive={activeRow === 'cameraSensitivity'}
        onFocus={() => setActiveRow('cameraSensitivity')}
      >
        <GameSlider
          min={1}
          max={10}
          step={1}
          unit=""
          value={gameplay.cameraSensitivity}
          onChange={(val) => onChange('cameraSensitivity', val)}
        />
      </SettingsRow>

      {/* Tutorial Hints */}
      <SettingsRow
        label="Tutorial Hints & Codex Reminders"
        description="Shows contextual tutorial callouts when discovering unabsorbed echoes and ancient shrines."
        isActive={activeRow === 'tutorialHints'}
        onFocus={() => setActiveRow('tutorialHints')}
      >
        <GameToggle
          value={gameplay.tutorialHints}
          onChange={(val) => onChange('tutorialHints', val)}
        />
      </SettingsRow>

      {/* Interaction Prompts */}
      <SettingsRow
        label="World Interaction Prompts"
        description="Displays button glyphs above fallen bodies, lootable weapons, and shrine gates."
        isActive={activeRow === 'interactionPrompts'}
        onFocus={() => setActiveRow('interactionPrompts')}
      >
        <GameToggle
          value={gameplay.interactionPrompts}
          onChange={(val) => onChange('interactionPrompts', val)}
        />
      </SettingsRow>

      {/* Auto Camera Adjustment */}
      <SettingsRow
        label="Auto Camera Adjustment"
        description="Automatically guides camera orientation to track elevation changes while sprinting."
        isActive={activeRow === 'autoCamera'}
        onFocus={() => setActiveRow('autoCamera')}
      >
        <GameToggle
          value={gameplay.autoCameraAdjustment}
          onChange={(val) => onChange('autoCameraAdjustment', val)}
        />
      </SettingsRow>
    </div>
  );
};
