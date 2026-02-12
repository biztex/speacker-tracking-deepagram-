# Visualization Update - Wave-like Audio Effects

## Changes Made

Added real-time audio visualization with waveform and frequency spectrum displays, matching the Speaker-tracking-app design.

## Updated Files

### 1. `src/types/index.ts`
Added:
- `AudioFeatures` interface with volume, pitch, frequencyData, and waveformData
- `SPEAKER_COLORS` array for consistent speaker color coding

### 2. `src/hooks/useDeepgram.ts`
Added:
- Audio context and analyser node for real-time audio analysis
- `audioFeatures` state to store visualization data
- `analyzeAudio()` function that runs in animation frame loop
- `estimatePitch()` function for pitch detection using autocorrelation
- Audio analysis extraction (waveform and frequency data)
- Proper cleanup of audio nodes on stop

Key additions:
```typescript
const audioContextRef = useRef<AudioContext | null>(null);
const analyserRef = useRef<AnalyserNode | null>(null);
const animationFrameRef = useRef<number | null>(null);
```

### 3. `src/components/Visualization.tsx`
Complete rewrite to include:
- Canvas-based waveform visualization
- Canvas-based frequency spectrum bars
- Real-time animation loop
- Color gradients matching active speaker
- Pitch display in header
- Volume percentage display
- Smooth animations and glow effects

Features:
- **Waveform Display**: Shows audio signal in real-time with speaker-colored gradient
- **Frequency Bars**: 32-bar spectrum analyzer with reflection effects
- **Active Speaker Indicator**: Pulsing dot and color coding
- **Pitch Detection**: Displays fundamental frequency in Hz
- **Volume Meter**: Shows current audio volume percentage

### 4. `src/App.tsx`
Updated to:
- Pass `audioFeatures` prop to Visualization component
- Extract `audioFeatures` from useDeepgram hook

## How It Works

### Audio Analysis Pipeline

1. **Microphone Input** → MediaStream
2. **Audio Context** → Creates Web Audio API context
3. **Analyser Node** → Extracts frequency and time-domain data
4. **Animation Loop** → Updates visualization 60 times per second
5. **Canvas Rendering** → Draws waveform and frequency bars

### Waveform Visualization

```typescript
// Extract time-domain data
analyser.getByteTimeDomainData(waveformData);

// Draw smooth waveform with gradient
for (let i = 0; i < data.length; i++) {
  const v = data[i] / 255;
  const y = (1 - v) * height;
  ctx.lineTo(i * sliceWidth, y);
}
```

### Frequency Spectrum

```typescript
// Extract frequency data
analyser.getByteFrequencyData(frequencyData);

// Draw bars with gradient and reflection
for (let i = 0; i < barCount; i++) {
  const barHeight = value * height * 0.9;
  // Draw main bar
  ctx.roundRect(x, y, barWidth, barHeight, 2);
  // Draw reflection
  ctx.roundRect(x, height, barWidth, barHeight * 0.3, 2);
}
```

### Pitch Detection

Uses autocorrelation method:
1. Normalize waveform data
2. Calculate correlation at different periods
3. Find period with highest correlation
4. Convert period to frequency (Hz)

```typescript
const pitch = sampleRate / bestPeriod;
```

## Visual Features

### Color Coding
- Speaker 1: Blue (#3b82f6)
- Speaker 2: Green (#10b981)
- Speaker 3: Amber (#f59e0b)
- Speaker 4: Red (#ef4444)
- Speaker 5: Purple (#8b5cf6)

### Animations
- Pulsing indicator when active
- Smooth waveform transitions
- Gradient effects on bars
- Glow effects on waveform
- Reflection effects on frequency bars

### Responsive Design
- Adapts to screen size
- High DPI display support
- Smooth scaling animations

## Performance

- **60 FPS** animation loop
- **2048 FFT size** for good frequency resolution
- **32 frequency bars** for optimal performance
- **Canvas rendering** for hardware acceleration
- **RequestAnimationFrame** for smooth updates

## Browser Compatibility

Requires:
- Web Audio API support
- Canvas 2D context
- MediaStream API
- RequestAnimationFrame

Supported browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Usage

The visualization automatically updates when:
1. Session is running
2. Audio is being captured
3. Speaker is detected

No additional configuration needed - it works out of the box!

## Comparison with Original

### Similarities
- Waveform display with gradient
- Frequency spectrum bars
- Speaker color coding
- Pitch detection
- Volume display
- Smooth animations

### Differences
- Uses Deepgram for speaker detection (vs local algorithm)
- Simpler pitch estimation (vs full autocorrelation with interpolation)
- Combined with real-time transcription
- Cloud-based processing for speaker ID

## Future Enhancements

Potential improvements:
- Add spectrogram view
- Show formant frequencies
- Display MFCC coefficients
- Add audio quality indicators
- Show confidence scores
- Add recording level meter
- Implement audio effects

## Testing

To test the visualization:
1. Start the application
2. Click "Start" button
3. Speak into microphone
4. Watch waveform and frequency bars animate
5. See pitch and volume values update
6. Observe speaker color changes

The visualization should:
- ✅ Show smooth waveform
- ✅ Display frequency bars
- ✅ Update in real-time
- ✅ Match speaker colors
- ✅ Show pitch values
- ✅ Display volume percentage
- ✅ Animate smoothly at 60 FPS
