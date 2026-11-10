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
        className="w-4 h-4 flex items-center justify-center text-[#6b7382] hover:text-[#c5a059] disabled:opacity-20 cursor-pointer text-[10px] font-mono"
      >
        &#9664;
      </button>

      {/* Slider Track */}
      <div className="flex-1 relative flex items-center h-5 cursor-pointer">
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
          className="w-full h-[2px] bg-[#222834] appearance-none accent-[#c5a059] cursor-pointer disabled:cursor-not-allowed"
        />
        {/* Subtle Fill Bar */}
        <div
          className="absolute left-0 top-[9px] h-[2px] bg-[#c5a059] pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => handleStep(1)}
        className="w-4 h-4 flex items-center justify-center text-[#6b7382] hover:text-[#c5a059] disabled:opacity-20 cursor-pointer text-[10px] font-mono"
      >
        &#9654;
      </button>

      <span className="w-12 text-right font-mono text-xs text-[#ded9cd] tabular-nums">
        {value}
        {unit}
      </span>
    </div>
  );
};
