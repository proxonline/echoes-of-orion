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
          ? 'border-amber-500/70 bg-amber-500/10'
          : 'border-slate-800 bg-black/40 hover:border-slate-700'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      <span
        className={`font-cinzel text-xs tracking-widest font-semibold ${
          value ? 'text-amber-300' : 'text-slate-500'
        }`}
      >
        {value ? 'ENABLED' : 'DISABLED'}
      </span>
      <div
        className={`w-2 h-2 rounded-full transition-all ${
          value
            ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
            : 'bg-slate-700'
        }`}
      />
    </button>
  );
};
