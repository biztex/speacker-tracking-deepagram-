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
    <div className="flex items-center space-x-4 rounded-lg bg-[var(--color-bg-secondary)] px-6 py-3 border border-[var(--color-border)]">
      <label className="text-sm font-medium text-[var(--color-text-secondary)]">
        Number of Speakers:
      </label>
      <div className="flex space-x-2">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((count) => (
          <button
            key={count}
            onClick={() => onChange(count)}
            disabled={disabled}
            className={`h-10 w-10 rounded-lg font-semibold transition-all ${
              value === count
                ? 'bg-[var(--color-primary)] text-white shadow-lg scale-110'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};
