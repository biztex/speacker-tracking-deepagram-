import React from 'react';

interface SpeakerCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  disabled: boolean;
  min: number;
  max: number;
}

export const SpeakerCountSelector: React.FC<SpeakerCountSelectorProps> = ({
  value,
  onChange,
  disabled,
  min,
  max,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 rounded-lg bg-[var(--color-bg-secondary)] px-4 sm:px-6 py-3 border border-[var(--color-border)] w-full max-w-md mx-auto">
      <label className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
        Number of Speakers:
      </label>
      <div className="flex gap-2 sm:gap-2">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((count) => (
          <button
            key={count}
            onClick={() => onChange(count)}
            disabled={disabled}
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              value === count
                ? 'bg-[var(--color-primary)] text-white shadow-lg scale-110'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] active:scale-95'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};
