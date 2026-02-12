# Setup Guide - Deepgram Speaker Tracker

## Quick Start

### 1. Get Your Deepgram API Key

1. Go to [https://deepgram.com](https://deepgram.com)
2. Sign up for a free account
3. Navigate to your dashboard
4. Create a new API key
5. Copy the API key

### 2. Configure the Application

1. Open the `.env` file in the project root
2. Replace `your_deepgram_api_key_here` with your actual API key:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_key_here
   ```

### 3. Install Dependencies

Open a terminal in the `deepagram` folder and run:

```bash
npm install
```

This will install:
- React 19
- Deepgram SDK
- Tailwind CSS
- TypeScript
- Vite

### 4. Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Using the Application

1. Open the app in your browser
2. Allow microphone access when prompted
3. Select the number of speakers (2-5)
4. Click "Start" to begin tracking
5. Speak naturally - the app will identify speakers automatically
6. Click "Stop" to end the session and view the report
7. Click "Reset" to start a new session

## Troubleshooting

### "Deepgram API key not found" error
- Make sure your `.env` file exists in the root directory
- Verify the key is named `VITE_DEEPGRAM_API_KEY` (must start with `VITE_`)
- Restart the dev server after adding the key

### Microphone not working
- Check browser permissions for microphone access
- Try using HTTPS or localhost (required for microphone access)
- Make sure no other application is using the microphone

### No speakers detected
- Speak clearly and at normal volume
- Ensure there's minimal background noise
- Wait a few seconds for Deepgram to process the audio
- Check your internet connection (API requires connectivity)

### Connection errors
- Verify your API key is valid
- Check your internet connection
- Ensure you haven't exceeded your Deepgram API quota

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Requirements

- Modern browser with WebRTC support
- Chrome, Firefox, Safari, or Edge (latest versions)
- Microphone access permissions

## API Limits

Deepgram free tier includes:
- $200 in free credits
- Pay-as-you-go after credits
- Check your usage at https://console.deepgram.com

## Support

For Deepgram API issues:
- Documentation: https://developers.deepgram.com
- Support: https://deepgram.com/contact

For application issues:
- Check the browser console for errors
- Verify all setup steps were completed
- Ensure dependencies are installed correctly
