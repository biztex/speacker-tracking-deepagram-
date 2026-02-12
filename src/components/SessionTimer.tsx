import React from 'react';
import type { SessionStatus } from '../types';

interface SessionTimerProps {
  time: number;
  status: SessionStatus;
  formatTime: (ms: number) => string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ time, status, formatTime }) => {
  return (
    <div className="text-center">
      <div className="mb-2 text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
        Session Time
      </div>
      <div className="relative inline-block">
        <div className={`text-6xl sm:text-7xl font-bold tabular-nums transition-colors ${
          status === 'running' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
        }`}>
          {formatTime(time)}
        </div>
        {status === 'running' && (
          <div className="absolute -right-3 top-2 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
      <div className="mt-2 text-xs text-[var(--color-text-muted)]">
        {status === 'idle' && 'Press Start to begin tracking'}
        {status === 'running' && 'Recording in progress...'}
        {status === 'stopped' && 'Session ended'}
      </div>
    </div>
  );
};
