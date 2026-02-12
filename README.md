# Speaker Tracker - Deepgram Edition

A real-time speaker tracking application powered by Deepgram's live transcription and speaker diarization API.

## Features

- Real-time speaker tracking for 2-5 speakers
- Live audio processing with Deepgram API
- Speaker diarization (automatic speaker identification)
- Time tracking for each speaker
- Visual feedback showing active speaker
- Session controls (Start/Stop/Reset)
- Dark/Light theme support
- No audio recording or storage

## Prerequisites

- Node.js 18+ and npm
- A Deepgram API key (get one at https://deepgram.com)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Add your Deepgram API key to the `.env` file:
```
VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

1. Click "Start" to begin tracking
2. The app requests microphone access
3. Audio is streamed to Deepgram's API in real-time
4. Deepgram performs speaker diarization and returns speaker information
5. The app tracks speaking time for each identified speaker
6. Click "Stop" to end the session and view the final report

## Technical Details

- Built with React 19 and TypeScript
- Uses Deepgram SDK for live transcription
- Styled with Tailwind CSS
- Real-time audio processing via MediaRecorder API
- WebSocket connection to Deepgram for low-latency results

## Project Structure

```
deepagram/
├── src/
│   ├── components/       # UI components
│   ├── contexts/         # React contexts (Theme)
│   ├── hooks/            # Custom hooks (useTimer, useDeepgram)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables (not in git)
├── .env.example          # Example env file
└── package.json          # Dependencies
```

## API Usage

This app uses Deepgram's Live Transcription API with the following features:
- Model: `nova-2` (latest and most accurate)
- Language: English
- Diarization: Enabled (speaker identification)
- Smart formatting and punctuation

## Notes

- Audio is processed in real-time only
- No audio data is stored or recorded
- Requires microphone permissions
- Works best in quiet environments with clear speech
- Initial version supports 2 speakers, expandable to 5

## License

MIT
