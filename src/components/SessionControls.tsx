import React from 'react';
import type { SessionStatus } from '../types';

interface SessionControlsProps {
  status: SessionStatus;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  error: string | null;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  status,
  onStart,
  onStop,
  onReset,
  error,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="flex items-center space-x-2 rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700 transition-colors shadow-lg"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>Start</span>
          </button>
        )}

        {status === 'running' && (
          <button
            onClick={onStop}
            className="flex items-center space-x-2 rounded-lg bg-red-600 px-8 py-3 font-semibold text-white hover:bg-red-700 transition-colors shadow-lg"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            <span>Stop</span>
          </button>
        )}

        {status === 'stopped' && (
          <>
            <button
              onClick={onStart}
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors shadow-lg"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Resume</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center space-x-2 rounded-lg bg-[var(--color-bg-tertiary)] px-6 py-3 font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};
