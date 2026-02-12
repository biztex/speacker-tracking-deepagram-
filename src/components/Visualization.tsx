import React from 'react';

interface VisualizationProps {
  currentSpeakerId: number | null;
  isActive: boolean;
}

export const Visualization: React.FC<VisualizationProps> = ({ currentSpeakerId, isActive }) => {
  return (
    <div className="rounded-xl bg-[var(--color-bg-secondary)] p-8 border border-[var(--color-border)]">
      <div className="flex items-center justify-center space-x-8">
        {[1, 2, 3, 4, 5].map((id) => (
          <div
            key={id}
            className={`flex flex-col items-center space-y-2 transition-all duration-300 ${
              currentSpeakerId === id ? 'scale-110' : 'scale-100 opacity-50'
            }`}
          >
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl speaker-${id}-bg ${
                currentSpeakerId === id && isActive ? 'animate-pulse-ring shadow-lg' : ''
              }`}
            >
              {id}
            </div>
            <div className={`text-xs font-medium speaker-${id}-text`}>
              Speaker {id}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        {isActive && currentSpeakerId ? (
          <span>Speaker {currentSpeakerId} is speaking</span>
        ) : (
          <span>Waiting for speech...</span>
        )}
      </div>
    </div>
  );
};
