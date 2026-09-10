import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-on-surface dark:border-[#383E4A] font-mono text-xs font-bold transition-all duration-200 cursor-pointer select-none brick-btn ${
        isDark
          ? 'bg-[#1E222B] text-brick-yellow hover:bg-[#252A36]'
          : 'bg-brick-yellow text-on-surface hover:bg-[#FFE033]'
      } ${className}`}
    >
      {/* 2 Micro Lego Studs on top edge of the button */}
      <span className="absolute -top-1.5 left-2.5 w-2.5 h-1.5 rounded-t-sm bg-inherit border-t-2 border-x-2 border-on-surface dark:border-[#383E4A] pointer-events-none" />
      <span className="absolute -top-1.5 right-2.5 w-2.5 h-1.5 rounded-t-sm bg-inherit border-t-2 border-x-2 border-on-surface dark:border-[#383E4A] pointer-events-none" />

      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-brick-yellow fill-brick-yellow animate-fadeIn" />
          <span className="font-mono text-[11px] tracking-wider uppercase">NIGHT</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-on-surface animate-fadeIn" />
          <span className="font-mono text-[11px] tracking-wider uppercase">DAY</span>
        </>
      )}
    </button>
  );
};
