import React from 'react';
import { soundEngine } from '../../audio/soundEngine';

interface StepperControlProps<T extends string | number> {
  options: readonly T[];
  value: T;
  onChange: (val: T) => void;
  disabled?: boolean;
  widthClass?: string;
  labels?: Record<string, string>;
}

export const StepperControl = <T extends string | number>({
  options,
  value,
  onChange,
  disabled = false,
  widthClass = 'w-64',
  labels,
}: StepperControlProps<T>) => {
  const currentIndex = options.indexOf(value);

  const handleStep = (direction: -1 | 1) => {
    if (disabled) return;
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    soundEngine.playTick();
    onChange(options[nextIndex]);
  };

  const displayLabel = labels ? labels[String(value)] || String(value) : String(value);

  return (
    <div
      className={`flex items-center justify-between border border-slate-800 bg-black/40 hover:border-slate-700 px-2 py-1 select-none transition-colors ${widthClass} ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleStep(-1)}
        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-amber-300 disabled:opacity-20 cursor-pointer text-xs font-mono transition-colors"
        aria-label="Previous Option"
      >
        &#9664;
      </button>

      <span className="font-cinzel text-xs tracking-wider text-slate-200 font-medium px-2 truncate text-center flex-1">
        {displayLabel}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => handleStep(1)}
        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-amber-300 disabled:opacity-20 cursor-pointer text-xs font-mono transition-colors"
        aria-label="Next Option"
      >
        &#9654;
      </button>
    </div>
  );
};
