import React from 'react';
import { soundEngine } from '../../audio/soundEngine';

interface GameToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export const GameToggle: React.FC<GameToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const toggle = () => {
    if (disabled) return;
    soundEngine.playSelect();
    onChange(!value);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={toggle}
      className={`group flex items-center justify-between w-28 px-3 py-1 border transition-all cursor-pointer ${
        value
          ? 'border-[#c5a059]/60 bg-[#c5a059]/10'
          : 'border-[#222834] bg-[#07090e] hover:border-[#384152]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      <span
        className={`font-ui text-xs tracking-wider font-semibold ${
          value ? 'text-[#c5a059]' : 'text-[#6b7382]'
        }`}
      >
        {value ? 'ENABLED' : 'DISABLED'}
      </span>
      <div
        className={`w-1.5 h-1.5 rounded-full transition-all ${
          value ? 'bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.8)]' : 'bg-[#384152]'
        }`}
      />
    </button>
  );
};
