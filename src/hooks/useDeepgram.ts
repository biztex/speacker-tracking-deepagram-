import { useState, useRef, useCallback, useEffect } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import type { Speaker, SessionStatus, DeepgramTranscriptResponse, AudioFeatures } from '../types';

interface UseDeepgramProps {
  maxSpeakers: number;
}

export const useDeepgram = ({ maxSpeakers }: UseDeepgramProps) => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [currentSpeakerId, setCurrentSpeakerId] = useState<number | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deepgramRef = useRef<any>(null);
  const connectionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speakerTimersRef = useRef<Map<number, number>>(new Map());
  const lastSpeakerRef = useRef<number | null>(null);
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const speakerStartTimeRef = useRef<Map<number, number>>(new Map());

  const initializeSpeakers = useCallback(() => {
    const initialSpeakers: Speaker[] = Array.from({ length: maxSpeakers }, (_, i) => ({
      id: i + 1,
      totalTime: 0,
      lastActiveTime: 0,
    }));
    setSpeakers(initialSpeakers);
    speakerTimersRef.current.clear();
  }, [maxSpeakers]);

  const updateSpeakerTime = useCallback((speakerId: number, duration: number) => {
    setSpeakers(prev => 
      prev.map(speaker => 
        speaker.id === speakerId
          ? { ...speaker, totalTime: speaker.totalTime + duration, lastActiveTime: Date.now() }
          : speaker
      )
    );
  }, []);

  // Audio analysis for visualization
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || status !== 'running') return;

    const analyser = analyserRef.current;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const waveformData = new Uint8Array(analyser.fftSize);

    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(waveformData);

    // Calculate volume (RMS) - optimized
    let sum = 0;
    const step = 4; // Sample every 4th value for performance
    for (let i = 0; i < waveformData.length; i += step) {
      const normalized = (waveformData[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const volume = Math.sqrt(sum / (waveformData.length / step));

    // Estimate pitch using autocorrelation - optimized
    const pitch = estimatePitch(waveformData, audioContextRef.current?.sampleRate || 44100);

    setAudioFeatures({
      volume,
      pitch,
      frequencyData: new Uint8Array(frequencyData),
      waveformData: new Uint8Array(waveformData),
    });

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [status]);

  // Optimized pitch estimation
  const estimatePitch = (waveformData: Uint8Array, sampleRate: number): number => {
    const minPeriod = Math.floor(sampleRate / 500);
    const maxPeriod = Math.floor(sampleRate / 50);
    
    let bestCorrelation = 0;
    let bestPeriod = 0;

    // Optimize by checking fewer periods
    const step = 2;
    for (let period = minPeriod; period < maxPeriod && period < waveformData.length / 2; period += step) {
      let correlation = 0;
      const checkLength = Math.min(waveformData.length - period, 512); // Limit check length
      
      for (let i = 0; i < checkLength; i += 2) { // Sample every other value
        const val1 = (waveformData[i] - 128) / 128;
        const val2 = (waveformData[i + period] - 128) / 128;
        correlation += val1 * val2;
      }
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    return bestPeriod > 0 && bestCorrelation > 0.2 ? sampleRate / bestPeriod : 0;
  };

  const start = useCallback(async () => {
    try {
      setError(null);
      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      
      if (!apiKey) {
        throw new Error('Deepgram API key not found. Please add VITE_DEEPGRAM_API_KEY to your .env file');
      }

      // Initialize speakers
      initializeSpeakers();

      // Get microphone access with optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false, // Disable for faster response
        } 
      });
      streamRef.current = stream;

      // Create audio context for visualization
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.5; // Reduced for faster response
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Create Deepgram client
      deepgramRef.current = createClient(apiKey);

      // Create live transcription connection with optimized settings
      const connection = deepgramRef.current.listen.live({
        model: 'nova-2',
        language: 'en',
        smart_format: true,
        diarize: true,
        punctuate: true,
        interim_results: true,
        utterance_end_ms: 800, // Faster utterance detection
        vad_events: true, // Enable voice activity detection events
        endpointing: 200, // Faster endpoint detection (ms)
      });

      connectionRef.current = connection;

      // Handle connection open
      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Deepgram connection opened');
        setStatus('running');

        // Start audio analysis for visualization
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);

        // Create MediaRecorder to send audio
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder.start(100); // Send data every 100ms for faster response
      });

      // Handle transcription results
      connection.on(LiveTranscriptionEvents.Transcript, (data: DeepgramTranscriptResponse) => {
        const transcript = data.channel?.alternatives?.[0];
        
        if (transcript && transcript.words && transcript.words.length > 0) {
          const words = transcript.words;
          const now = Date.now();
          
          // Process words for speaker detection
          words.forEach((word) => {
            if (word.speaker !== undefined) {
              const speakerId = word.speaker + 1; // Deepgram uses 0-based indexing
              
              if (speakerId <= maxSpeakers) {
                // Immediately update current speaker (don't wait for speech_final)
                if (lastSpeakerRef.current !== speakerId) {
                  // Speaker changed - finalize previous speaker's time
                  if (lastSpeakerRef.current !== null && speakerStartTimeRef.current.has(lastSpeakerRef.current)) {
                    const startTime = speakerStartTimeRef.current.get(lastSpeakerRef.current)!;
                    const elapsed = now - startTime;
                    updateSpeakerTime(lastSpeakerRef.current, elapsed);
                  }
                  
                  // Start timing new speaker
                  speakerStartTimeRef.current.set(speakerId, now);
                  setCurrentSpeakerId(speakerId);
                  lastSpeakerRef.current = speakerId;
                  lastSpeechTimeRef.current = now;
                } else {
                  // Same speaker continuing - just update time reference
                  lastSpeechTimeRef.current = now;
                }
              }
            }
          });
          
          // On speech_final, finalize the current speaker's segment
          if (data.speech_final && lastSpeakerRef.current !== null) {
            if (speakerStartTimeRef.current.has(lastSpeakerRef.current)) {
              const startTime = speakerStartTimeRef.current.get(lastSpeakerRef.current)!;
              const elapsed = now - startTime;
              updateSpeakerTime(lastSpeakerRef.current, elapsed);
              speakerStartTimeRef.current.delete(lastSpeakerRef.current);
            }
          }
        }
      });

      // Handle errors
      connection.on(LiveTranscriptionEvents.Error, (err: any) => {
        console.error('Deepgram error:', err);
        setError('Connection error occurred');
      });

      // Handle connection close
      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed');
      });

    } catch (err) {
      console.error('Failed to start:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
      setStatus('idle');
    }
  }, [maxSpeakers, initializeSpeakers, updateSpeakerTime, analyzeAudio]);

  const stop = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Close Deepgram connection
    if (connectionRef.current) {
      connectionRef.current.finish();
      connectionRef.current = null;
    }

    // Disconnect audio nodes
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setCurrentSpeakerId(null);
    setAudioFeatures(null);
    setStatus('stopped');
  }, []);

  const reset = useCallback(() => {
    stop();
    initializeSpeakers();
    setCurrentSpeakerId(null);
    setAudioFeatures(null);
    setError(null);
    setStatus('idle');
    speakerStartTimeRef.current.clear();
  }, [stop, initializeSpeakers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (connectionRef.current) {
        connectionRef.current.finish();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Clear current speaker after silence
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (currentSpeakerId !== null && now - lastSpeechTimeRef.current > 800) {
        // Finalize current speaker's time before clearing
        if (speakerStartTimeRef.current.has(currentSpeakerId)) {
          const startTime = speakerStartTimeRef.current.get(currentSpeakerId)!;
          const elapsed = now - startTime;
          updateSpeakerTime(currentSpeakerId, elapsed);
          speakerStartTimeRef.current.delete(currentSpeakerId);
        }
        setCurrentSpeakerId(null);
      }
    }, 200); // Check more frequently

    return () => clearInterval(interval);
  }, [status, currentSpeakerId, updateSpeakerTime]);

  return {
    status,
    speakers,
    currentSpeakerId,
    audioFeatures,
    error,
    start,
    stop,
    reset,
  };
};
