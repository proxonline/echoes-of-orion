import React from 'react';
import { soundEngine } from '../../audio/soundEngine';

interface SettingsRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
  isActive?: boolean;
  onFocus?: () => void;
  disabled?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  children,
  isActive = false,
  onFocus,
  disabled = false,
}) => {
  return (
    <div
      onMouseEnter={() => {
        if (!disabled && onFocus) {
          soundEngine.playHover();
          onFocus();
        }
      }}
      onClick={() => {
        if (!disabled && onFocus) {
          onFocus();
        }
      }}
      className={`group relative flex items-center justify-between py-3 px-5 transition-all duration-150 border-b border-slate-900/60 cursor-pointer ${
        isActive
          ? 'bg-amber-500/5 text-white'
          : 'hover:bg-slate-900/30 text-slate-300'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {/* Active Left Indicator Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 ${
          isActive ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-transparent'
        }`}
      />

      {/* Label and Hint */}
      <div className="flex-1 pr-6">
        <h4
          className={`font-cinzel text-xs sm:text-sm tracking-wider font-semibold transition-colors ${
            isActive ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
          }`}
        >
          {label}
        </h4>
        <p className="text-[11px] text-slate-500 font-sans mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>

      {/* Control Element */}
      <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
