import React from 'react';
import { soundEngine } from '../../audio/soundEngine';

interface GameSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const GameSlider: React.FC<GameSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  onChange,
  disabled = false,
}) => {
  const percentage = Math.round(((value - min) / (max - min)) * 100);

  const handleStep = (direction: -1 | 1) => {
    if (disabled) return;
    const nextVal = Math.min(max, Math.max(min, value + direction * step));
    if (nextVal !== value) {
      soundEngine.playTick();
      onChange(nextVal);
    }
  };

  return (
    <div className="flex items-center gap-3 w-64 select-none">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => handleStep(-1)}
        className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-amber-300 disabled:opacity-20 cursor-pointer text-xs font-mono"
      >
        &#9664;
      </button>

      {/* Track */}
      <div className="flex-1 relative flex items-center h-6 cursor-pointer">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            soundEngine.playTick();
            onChange(Number(e.target.value));
          }}
          className="w-full h-1 bg-slate-800 rounded-none appearance-none accent-amber-500 cursor-pointer disabled:cursor-not-allowed"
        />
        {/* Fill Highlight */}
        <div
          className="absolute left-0 top-[11px] h-1 bg-gradient-to-r from-amber-600 to-amber-400 pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => handleStep(1)}
        className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-amber-300 disabled:opacity-20 cursor-pointer text-xs font-mono"
      >
        &#9654;
      </button>

      <span className="w-14 text-right font-cinzel text-xs text-amber-200/90 tabular-nums">
        {value}
        {unit}
      </span>
    </div>
  );
};
