# Technical Overview - Deepgram Speaker Tracker

## Architecture

This application uses Deepgram's Live Transcription API with speaker diarization to track who is speaking in real-time.

## Core Technologies

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Deepgram SDK**: Real-time speech processing
- **Tailwind CSS**: Styling
- **Vite**: Build tool and dev server

## How Speaker Tracking Works

### 1. Audio Capture
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: {
    channelCount: 1,
    sampleRate: 16000,
  } 
});
```
- Captures audio from user's microphone
- Single channel (mono) at 16kHz sample rate
- Optimized for speech recognition

### 2. Deepgram Connection
```typescript
const connection = deepgramClient.listen.live({
  model: 'nova-2',
  language: 'en',
  smart_format: true,
  diarize: true,
  punctuate: true,
  interim_results: true,
});
```

Key parameters:
- **model: 'nova-2'**: Latest Deepgram model with best accuracy
- **diarize: true**: Enables speaker identification
- **interim_results: true**: Provides real-time updates

### 3. Audio Streaming
```typescript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm',
});

mediaRecorder.addEventListener('dataavailable', (event) => {
  if (event.data.size > 0) {
    connection.send(event.data);
  }
});

mediaRecorder.start(250); // Send chunks every 250ms
```
- Audio is chunked into 250ms segments
- Sent to Deepgram via WebSocket
- Low latency for real-time processing

### 4. Speaker Identification
```typescript
connection.on(LiveTranscriptionEvents.Transcript, (data) => {
  const words = data.channel?.alternatives?.[0]?.words;
  
  words.forEach((word) => {
    if (word.speaker !== undefined) {
      const speakerId = word.speaker + 1;
      const duration = (word.end - word.start) * 1000;
      updateSpeakerTime(speakerId, duration);
    }
  });
});
```

Deepgram returns:
- **word.speaker**: Speaker ID (0-based index)
- **word.start/end**: Timing information
- **word.confidence**: Accuracy score

### 5. Time Tracking
```typescript
const updateSpeakerTime = (speakerId: number, duration: number) => {
  setSpeakers(prev => 
    prev.map(speaker => 
      speaker.id === speakerId
        ? { 
            ...speaker, 
            totalTime: speaker.totalTime + duration,
            lastActiveTime: Date.now()
          }
        : speaker
    )
  );
};
```
- Accumulates speaking time per speaker
- Updates in real-time as words are processed
- Tracks last active time for UI feedback

## Key Features Implementation

### Real-Time Updates
- WebSocket connection for low latency
- Updates every 250ms
- Smooth UI transitions

### Speaker Diarization
- Deepgram automatically identifies speakers
- No training required
- Works with 2-5 speakers
- Handles overlapping speech

### No Audio Storage
- Audio is streamed directly to Deepgram
- Not saved to disk or memory
- Complies with privacy requirements
- Only timing data is retained

### Session Management
```typescript
const handleStart = async () => {
  await startDeepgram();  // Connect to API
  startTimer();           // Start session timer
};

const handleStop = () => {
  stopDeepgram();         // Close connection
  stopTimer();            // Stop timer
};

const handleReset = () => {
  resetDeepgram();        // Clear speaker data
  resetTimer();           // Reset timer
};
```

## Component Structure

### Hooks
- **useDeepgram**: Manages Deepgram connection and speaker tracking
- **useTimer**: Handles session timing

### Components
- **Header**: App title and theme toggle
- **SessionTimer**: Displays elapsed time
- **SessionControls**: Start/Stop/Reset buttons
- **SpeakerCountSelector**: Choose 2-5 speakers
- **Visualization**: Visual feedback of active speaker
- **SpeakerList**: Time report for each speaker

## Data Flow

```
Microphone → MediaRecorder → WebSocket → Deepgram API
                                              ↓
                                    Speaker Diarization
                                              ↓
                                    Transcript with Speaker IDs
                                              ↓
                                    useDeepgram Hook
                                              ↓
                                    Update Speaker Times
                                              ↓
                                    React State Update
                                              ↓
                                    UI Re-render
```

## Performance Considerations

1. **Chunking**: 250ms audio chunks balance latency and efficiency
2. **State Updates**: Batched to prevent excessive re-renders
3. **WebSocket**: Persistent connection reduces overhead
4. **Cleanup**: Proper resource cleanup on unmount

## Error Handling

- API key validation
- Microphone permission checks
- Connection error recovery
- User-friendly error messages

## Future Enhancements

Potential improvements:
- Export session reports (CSV/PDF)
- Session history
- Custom speaker names
- Audio quality indicators
- Multi-language support
- Offline mode with local processing

## API Costs

Deepgram pricing (as of 2024):
- Pay-as-you-go: $0.0043/minute for Nova-2
- Free tier: $200 in credits
- Real-time streaming counts as usage time

## Security Notes

- API key stored in environment variables
- Never commit `.env` to version control
- Use HTTPS in production
- Validate API responses
- Handle sensitive data appropriately
