import { useState, useRef, useCallback } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    
    const startTime = Date.now() - time;
    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTime);
    }, 100);
  }, [time]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTime(0);
  }, [stop]);

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return { time, start, stop, reset, formatTime };
};
