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
      className={`group relative flex items-center justify-between py-3 px-5 transition-all duration-150 border-b border-[#141822]/80 cursor-pointer ${
        isActive
          ? 'bg-[#c5a059]/5 text-[#ede8dc]'
          : 'hover:bg-white/[0.02] text-[#9ca3af]'
      } ${disabled ? 'opacity-35 cursor-not-allowed' : ''}`}
    >
      {/* Active Left Indicator Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-150 ${
          isActive ? 'bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.8)]' : 'bg-transparent'
        }`}
      />

      {/* Label and Hint */}
      <div className="flex-1 pr-6">
        <h4
          className={`font-ui text-xs sm:text-sm tracking-wide font-semibold transition-colors ${
            isActive ? 'text-[#ede8dc]' : 'text-[#b8b3a7] group-hover:text-[#ded9cd]'
          }`}
        >
          {label}
        </h4>
        <p className="text-[11px] text-[#6b7382] font-ui mt-0.5 line-clamp-1">
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
