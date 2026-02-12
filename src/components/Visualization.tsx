import React, { useRef, useEffect, useCallback } from 'react';
import type { AudioFeatures } from '../types';
import { SPEAKER_COLORS } from '../types';

interface VisualizationProps {
  audioFeatures: AudioFeatures | null;
  currentSpeakerId: number | null;
  isActive: boolean;
}

export const Visualization: React.FC<VisualizationProps> = ({
  audioFeatures,
  currentSpeakerId,
  isActive,
}) => {
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentColor = currentSpeakerId !== null 
    ? SPEAKER_COLORS[currentSpeakerId - 1] 
    : '#64748b';

  // Draw waveform
  const drawWaveform = useCallback(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (!audioFeatures?.waveformData || !isActive) {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const data = audioFeatures.waveformData;
    const sliceWidth = width / data.length;
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, currentColor + '80');
    gradient.addColorStop(0.5, currentColor);
    gradient.addColorStop(1, currentColor + '80');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();

    // Downsample for performance while maintaining visual quality
    const downsampleFactor = Math.max(1, Math.floor(data.length / 200));
    for (let i = 0; i < data.length; i += downsampleFactor) {
      const v = data[i] / 255;
      const y = (1 - v) * height;
      
      if (i === 0) {
        ctx.moveTo(0, y);
      } else {
        ctx.lineTo((i / downsampleFactor) * sliceWidth * downsampleFactor, y);
      }
    }

    ctx.stroke();

    ctx.shadowColor = currentColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [audioFeatures, currentColor, isActive]);

  // Draw frequency bars
  const drawFrequency = useCallback(() => {
    const canvas = frequencyCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    if (!audioFeatures?.frequencyData || !isActive) {
      const barCount = 32;
      const barWidth = width / barCount - 2;
      
      ctx.fillStyle = 'rgba(100, 116, 139, 0.2)';
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = 4;
        const x = i * (barWidth + 2) + 1;
        const y = height - barHeight;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
      return;
    }

    const data = audioFeatures.frequencyData;
    
    const barCount = Math.min(32, data.length);
    const step = Math.floor(data.length / barCount);
    const barWidth = width / barCount - 2;

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j];
      }
      const value = sum / step / 255;
      
      const barHeight = Math.max(4, value * height * 0.9);
      const x = i * (barWidth + 2) + 1;
      const y = height - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, height);
      gradient.addColorStop(0, currentColor);
      gradient.addColorStop(1, currentColor + '40');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();

      ctx.fillStyle = currentColor + '20';
      ctx.beginPath();
      ctx.roundRect(x, height, barWidth, Math.min(barHeight * 0.3, 10), 2);
      ctx.fill();
    }
  }, [audioFeatures, currentColor, isActive]);

  useEffect(() => {
    const animate = () => {
      drawWaveform();
      drawFrequency();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform, drawFrequency]);

  return (
    <div className="w-full rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              isActive ? 'animate-pulse' : ''
            }`}
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {currentSpeakerId !== null
              ? `Speaker ${currentSpeakerId}`
              : 'Waiting for audio...'}
          </span>
        </div>
        
        {audioFeatures && isActive && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span>Pitch:</span>
            <span className="font-mono" style={{ color: currentColor }}>
              {audioFeatures.pitch > 0 ? `${Math.round(audioFeatures.pitch)} Hz` : '--'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="relative h-24 sm:h-32">
          <canvas
            ref={waveformCanvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-muted)]">Frequency Spectrum</span>
          {audioFeatures && isActive && (
            <span className="text-xs text-[var(--color-text-muted)]">
              Vol: {Math.round(audioFeatures.volume * 100)}%
            </span>
          )}
        </div>
        <div className="relative h-16 sm:h-20">
          <canvas
            ref={frequencyCanvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
