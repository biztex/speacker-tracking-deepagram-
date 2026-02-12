import React from 'react';
import type { Speaker } from '../types';

interface SpeakerListProps {
  speakers: Speaker[];
  currentSpeakerId: number | null;
  formatTime: (ms: number) => string;
}

export const SpeakerList: React.FC<SpeakerListProps> = ({
  speakers,
  currentSpeakerId,
  formatTime,
}) => {
  const totalTime = speakers.reduce((sum, s) => sum + s.totalTime, 0);

  return (
    <div className="rounded-xl bg-[var(--color-bg-secondary)] p-4 sm:p-6 border border-[var(--color-border)]">
      <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
        Speaking Time Report
      </h2>
      
      <div className="space-y-2 sm:space-y-3">
        {speakers.map((speaker) => {
          const percentage = totalTime > 0 ? (speaker.totalTime / totalTime) * 100 : 0;
          const isActive = currentSpeakerId === speaker.id;

          return (
            <div
              key={speaker.id}
              className={`rounded-lg p-3 sm:p-4 transition-all ${
                isActive
                  ? 'bg-[var(--color-bg-tertiary)] border-2 speaker-' + speaker.id + '-border'
                  : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className={`h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold speaker-${speaker.id}-bg`}>
                    {speaker.id}
                  </div>
                  <span className="font-medium text-sm sm:text-base text-[var(--color-text-primary)] truncate">
                    Speaker {speaker.id}
                  </span>
                  {isActive && (
                    <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-green-500/20 text-green-500 font-medium whitespace-nowrap">
                      Speaking
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    {formatTime(speaker.totalTime)}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className={`h-full speaker-${speaker.id}-bg transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalTime > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--color-border)]">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-[var(--color-text-muted)]">Total Speaking Time:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {formatTime(totalTime)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
