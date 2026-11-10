import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { SettingsRow } from './SettingsRow';
import { StepperControl } from './StepperControl';
import { GameSlider } from './GameSlider';
import { GameToggle } from './GameToggle';

interface GraphicsSettingsProps {
  graphics: GameSettings['graphics'];
  onChange: <K extends keyof GameSettings['graphics']>(key: K, val: GameSettings['graphics'][K]) => void;
  onApplyPreset: (preset: GameSettings['graphics']['preset']) => void;
}

const PRESETS = ['Very Low', 'Low', 'Medium', 'High', 'Ultra', 'Custom'] as const;
const TIERS = ['Low', 'Medium', 'High', 'Ultra'] as const;
const AA_MODES = ['Off', 'FXAA', 'TAA'] as const;
const AO_MODES = ['Off', 'SSAO', 'HBAO+'] as const;
const AF_MODES = ['Off', '2x', '4x', '8x', '16x'] as const;
const BLUR_MODES = ['Off', 'Low', 'High'] as const;
const FOG_TIERS = ['Off', 'Low', 'High'] as const;
const DENSITY_TIERS = ['Low', 'Medium', 'High'] as const;

export const GraphicsSettings: React.FC<GraphicsSettingsProps> = ({
  graphics,
  onChange,
  onApplyPreset,
}) => {
  const [activeRow, setActiveRow] = useState<string>('preset');

  return (
    <div className="space-y-1">
      {/* Preset */}
      <SettingsRow
        label="Graphics Preset"
        description="Global fidelity baseline. Choosing a preset automatically harmonizes all GPU shader stages."
        isActive={activeRow === 'preset'}
        onFocus={() => setActiveRow('preset')}
      >
        <StepperControl
          options={PRESETS}
          value={graphics.preset}
          onChange={(val) => onApplyPreset(val)}
        />
      </SettingsRow>

      {/* Resolution Scale */}
      <SettingsRow
        label="Internal Resolution Scale"
        description="Scales sub-surface viewport rendering target. 100% maintains native pixel ratio."
        isActive={activeRow === 'resScale'}
        onFocus={() => setActiveRow('resScale')}
      >
        <GameSlider
          min={50}
          max={100}
          step={5}
          value={graphics.resolutionScale}
          onChange={(val) => onChange('resolutionScale', val)}
        />
      </SettingsRow>

      {/* Texture Quality */}
      <SettingsRow
        label="Texture Quality"
        description="MIP-map surface detail on wooden beams, tatami, stone monuments, and hero armor."
        isActive={activeRow === 'textures'}
        onFocus={() => setActiveRow('textures')}
      >
        <StepperControl
          options={TIERS}
          value={graphics.textureQuality}
          onChange={(val) => onChange('textureQuality', val)}
        />
      </SettingsRow>

      {/* Shadow Quality */}
      <SettingsRow
        label="Shadow Resolution & Filtering"
        description="Cascaded shadow map sampling across ruined structures and moonlight silhouettes."
        isActive={activeRow === 'shadows'}
        onFocus={() => setActiveRow('shadows')}
      >
        <StepperControl
          options={TIERS}
          value={graphics.shadowQuality}
          onChange={(val) => onChange('shadowQuality', val)}
        />
      </SettingsRow>

      {/* Effects Quality */}
      <SettingsRow
        label="Spiritual Effects & Particles"
        description="Density and blend states of celestial rifts, floating ash, and blue spectral wisps."
        isActive={activeRow === 'effects'}
        onFocus={() => setActiveRow('effects')}
      >
        <StepperControl
          options={TIERS}
          value={graphics.effectsQuality}
          onChange={(val) => onChange('effectsQuality', val)}
        />
      </SettingsRow>

      {/* Volumetric Fog */}
      <SettingsRow
        label="Volumetric Atmospheric Fog"
        description="Real-time light scattering through village mist, temple incense, and midnight ruins."
        isActive={activeRow === 'fog'}
        onFocus={() => setActiveRow('fog')}
      >
        <StepperControl
          options={FOG_TIERS}
          value={graphics.volumetricFog}
          onChange={(val) => onChange('volumetricFog', val)}
        />
      </SettingsRow>

      {/* Anti-Aliasing */}
      <SettingsRow
        label="Anti-Aliasing Method"
        description="Smooths jagged high-contrast edges along katana silhouettes and architecture."
        isActive={activeRow === 'aa'}
        onFocus={() => setActiveRow('aa')}
      >
        <StepperControl
          options={AA_MODES}
          value={graphics.antiAliasing}
          onChange={(val) => onChange('antiAliasing', val)}
        />
      </SettingsRow>

      {/* Ambient Occlusion */}
      <SettingsRow
        label="Ambient Occlusion"
        description="Approximates contact shadows in crevices, shattered roof tiles, and rubble recesses."
        isActive={activeRow === 'ao'}
        onFocus={() => setActiveRow('ao')}
      >
        <StepperControl
          options={AO_MODES}
          value={graphics.ambientOcclusion}
          onChange={(val) => onChange('ambientOcclusion', val)}
        />
      </SettingsRow>

      {/* Anisotropic Filtering */}
      <SettingsRow
        label="Anisotropic Filtering"
        description="Sharpens oblique ground surfaces, stone pathways, and temple flagstones at shallow angles."
        isActive={activeRow === 'af'}
        onFocus={() => setActiveRow('af')}
      >
        <StepperControl
          options={AF_MODES}
          value={graphics.anisotropicFiltering}
          onChange={(val) => onChange('anisotropicFiltering', val)}
        />
      </SettingsRow>

      {/* Post Processing */}
      <SettingsRow
        label="Post-Processing Tone Mapping"
        description="Cinematic ACES tone curve, bloom, and restrained color grading pass."
        isActive={activeRow === 'post'}
        onFocus={() => setActiveRow('post')}
      >
        <StepperControl
          options={TIERS}
          value={graphics.postProcessing}
          onChange={(val) => onChange('postProcessing', val)}
        />
      </SettingsRow>

      {/* Motion Blur */}
      <SettingsRow
        label="Camera Motion Blur"
        description="Velocity-based frame smoothing during rapid camera rotation and weapon swings."
        isActive={activeRow === 'blur'}
        onFocus={() => setActiveRow('blur')}
      >
        <StepperControl
          options={BLUR_MODES}
          value={graphics.motionBlur}
          onChange={(val) => onChange('motionBlur', val)}
        />
      </SettingsRow>

      {/* Depth of Field */}
      <SettingsRow
        label="Cinematic Depth of Field"
        description="Soft optical defocus for distant mountain silhouettes and background temple structures."
        isActive={activeRow === 'dof'}
        onFocus={() => setActiveRow('dof')}
      >
        <GameToggle
          value={graphics.depthOfField}
          onChange={(val) => onChange('depthOfField', val)}
        />
      </SettingsRow>

      {/* Environment Detail */}
      <SettingsRow
        label="Environment Geometry Density"
        description="Polygon mesh density for destroyed timbers, broken masonry, and distant shrines."
        isActive={activeRow === 'detail'}
        onFocus={() => setActiveRow('detail')}
      >
        <StepperControl
          options={DENSITY_TIERS}
          value={graphics.environmentDetail}
          onChange={(val) => onChange('environmentDetail', val)}
        />
      </SettingsRow>

      {/* Hardware Scalability Notice */}
      <div className="pt-4 px-5 pb-2 text-[11px] font-cinzel text-slate-500">
        <span className="text-amber-400 mr-2 font-semibold">ENGINE SCALABILITY:</span>
        Designed to maintain 60 FPS presentation on modest hardware (Intel HD 620 integrated graphics and discrete GPUs).
      </div>
    </div>
  );
};
