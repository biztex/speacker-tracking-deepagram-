import React from 'react';
import type { SessionStatus } from '../types';

interface SessionTimerProps {
  time: number;
  status: SessionStatus;
  formatTime: (ms: number) => string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ time, status, formatTime }) => {
  return (
    <div className="text-center px-4">
      <div className="mb-2 text-xs sm:text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
        Session Time
      </div>
      <div className="relative inline-block">
        <div className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tabular-nums transition-colors ${
          status === 'running' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
        }`}>
          {formatTime(time)}
        </div>
        {status === 'running' && (
          <div className="absolute -right-2 sm:-right-3 top-1 sm:top-2 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
      <div className="mt-2 text-xs sm:text-sm text-[var(--color-text-muted)]">
        {status === 'idle' && 'Press Start to begin tracking'}
        {status === 'running' && 'Recording in progress...'}
        {status === 'stopped' && 'Session ended'}
      </div>
    </div>
  );
};
