export interface Speaker {
  id: number;
  totalTime: number;
  lastActiveTime: number;
}

export interface AudioFeatures {
  volume: number;
  pitch: number;
  frequencyData: Uint8Array;
  waveformData: Uint8Array;
}

export type SessionStatus = 'idle' | 'running' | 'stopped';

export const SPEAKER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
];

export interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
  punctuated_word?: string;
}

export interface DeepgramUtterance {
  start: number;
  end: number;
  confidence: number;
  channel: number;
  transcript: string;
  words: DeepgramWord[];
  speaker?: number;
  id: string;
}

export interface DeepgramTranscriptResponse {
  type: string;
  channel_index: number[];
  duration: number;
  start: number;
  is_final: boolean;
  speech_final: boolean;
  channel: {
    alternatives: Array<{
      transcript: string;
      confidence: number;
      words: DeepgramWord[];
    }>;
  };
}
