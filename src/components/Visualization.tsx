import React from 'react';

interface VisualizationProps {
  currentSpeakerId: number | null;
  isActive: boolean;
  maxSpeakers: number;
}

export const Visualization: React.FC<VisualizationProps> = ({ currentSpeakerId, isActive, maxSpeakers }) => {
  const speakers = Array.from({ length: maxSpeakers }, (_, i) => i + 1);
  
  return (
    <div className="rounded-xl bg-[var(--color-bg-secondary)] p-4 sm:p-6 md:p-8 border border-[var(--color-border)]">
      <div className={`flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 flex-wrap ${
        maxSpeakers > 3 ? 'max-w-md mx-auto' : ''
      }`}>
        {speakers.map((id) => (
          <div
            key={id}
            className={`flex flex-col items-center space-y-1 sm:space-y-2 transition-all duration-300 ${
              currentSpeakerId === id ? 'scale-110' : 'scale-100 opacity-50'
            }`}
          >
            <div
              className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl speaker-${id}-bg ${
                currentSpeakerId === id && isActive ? 'animate-pulse-ring shadow-lg' : ''
              }`}
            >
              {id}
            </div>
            <div className={`text-xs sm:text-sm font-medium speaker-${id}-text whitespace-nowrap`}>
              Speaker {id}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[var(--color-text-muted)]">
        {isActive && currentSpeakerId ? (
          <span>Speaker {currentSpeakerId} is speaking</span>
        ) : (
          <span>Waiting for speech...</span>
        )}
      </div>
    </div>
  );
};
