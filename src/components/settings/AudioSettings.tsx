import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { SettingsRow } from './SettingsRow';
import { StepperControl } from './StepperControl';
import { GameSlider } from './GameSlider';
import { GameToggle } from './GameToggle';
import { soundEngine } from '../../audio/soundEngine';

interface AudioSettingsProps {
  audio: GameSettings['audio'];
  onChange: <K extends keyof GameSettings['audio']>(key: K, val: GameSettings['audio'][K]) => void;
}

const DYNAMIC_RANGES = ['Full Studio', 'Midnight', 'Headphones'] as const;

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  audio,
  onChange,
}) => {
  const [activeRow, setActiveRow] = useState<string>('master');

  return (
    <div className="space-y-1">
      {/* Master Mute */}
      <SettingsRow
        label="Master Mute"
        description="Silences all audio pipelines across music, ambient winds, and combat soundscapes."
        isActive={activeRow === 'mute'}
        onFocus={() => setActiveRow('mute')}
      >
        <GameToggle
          value={audio.isMuted}
          onChange={(val) => onChange('isMuted', val)}
        />
      </SettingsRow>

      {/* Master Volume */}
      <SettingsRow
        label="Master Volume"
        description="Global master gain applied to all mixed audio buses."
        isActive={activeRow === 'master'}
        onFocus={() => setActiveRow('master')}
      >
        <GameSlider
          value={audio.masterVolume}
          disabled={audio.isMuted}
          onChange={(val) => onChange('masterVolume', val)}
        />
      </SettingsRow>

      {/* Music Volume */}
      <SettingsRow
        label="Music & Orchestral Ambience"
        description="Volume of dark fantasy harmonic score, strings, and mystical choral drones."
        isActive={activeRow === 'music'}
        onFocus={() => setActiveRow('music')}
      >
        <GameSlider
          value={audio.musicVolume}
          disabled={audio.isMuted}
          onChange={(val) => onChange('musicVolume', val)}
        />
      </SettingsRow>

      {/* Sound Effects Volume */}
      <SettingsRow
        label="Sound Effects (SFX)"
        description="Volume of weapon strikes, parries, footfalls, and UI tactile interaction."
        isActive={activeRow === 'sfx'}
        onFocus={() => setActiveRow('sfx')}
      >
        <GameSlider
          value={audio.sfxVolume}
          disabled={audio.isMuted}
          onChange={(val) => onChange('sfxVolume', val)}
        />
      </SettingsRow>

      {/* Ambient Sound Volume */}
      <SettingsRow
        label="Environmental Ambience"
        description="Volume of mountain wind howling, burning timber embers, and distant ruin murmurs."
        isActive={activeRow === 'ambient'}
        onFocus={() => setActiveRow('ambient')}
      >
        <GameSlider
          value={audio.ambientVolume}
          disabled={audio.isMuted}
          onChange={(val) => onChange('ambientVolume', val)}
        />
      </SettingsRow>

      {/* Voice Volume */}
      <SettingsRow
        label="Voice & Dialogue"
        description="Volume of protagonist incantations, echo whispers, and celestial voices."
        isActive={activeRow === 'voice'}
        onFocus={() => setActiveRow('voice')}
      >
        <GameSlider
          value={audio.voiceVolume}
          disabled={audio.isMuted}
          onChange={(val) => onChange('voiceVolume', val)}
        />
      </SettingsRow>

      {/* Dynamic Range */}
      <SettingsRow
        label="Acoustic Dynamic Range"
        description="Midnight compresses extremes for quiet listening. Full Studio maximizes dynamic contrast."
        isActive={activeRow === 'dynamicRange'}
        onFocus={() => setActiveRow('dynamicRange')}
      >
        <StepperControl
          options={DYNAMIC_RANGES}
          value={audio.dynamicRange}
          onChange={(val) => onChange('dynamicRange', val)}
        />
      </SettingsRow>

      {/* Channel Sound Checks */}
      <div className="pt-4 px-5 space-y-2">
        <span className="text-[11px] font-cinzel tracking-wider text-slate-400 block uppercase">
          Audio Channel Previews
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => soundEngine.playSelect()}
            className="px-3 py-1.5 border border-slate-800 bg-black/40 hover:border-amber-400/80 text-xs font-cinzel text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
          >
            Bronze Chime (UI)
          </button>
          <button
            type="button"
            onClick={() => soundEngine.playConfirm()}
            className="px-3 py-1.5 border border-slate-800 bg-black/40 hover:border-amber-400/80 text-xs font-cinzel text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
          >
            Celestial Strike
          </button>
          <button
            type="button"
            onClick={() => soundEngine.playEchoAbsorb()}
            className="px-3 py-1.5 border border-slate-800 bg-black/40 hover:border-cyan-400/80 text-xs font-cinzel text-cyan-300 hover:text-cyan-100 rounded transition-colors cursor-pointer"
          >
            Echo Absorption
          </button>
        </div>
      </div>
    </div>
  );
};
