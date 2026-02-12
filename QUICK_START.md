# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies (2 minutes)

Open terminal in the `deepagram` folder:

```bash
npm install
```

## 2. Get Deepgram API Key (2 minutes)

1. Visit: https://console.deepgram.com
2. Sign up (free - includes $200 credits)
3. Create an API key
4. Copy the key

## 3. Configure API Key (30 seconds)

Open the `.env` file and paste your API key:

```
VITE_DEEPGRAM_API_KEY=paste_your_key_here
```

## 4. Start the App (30 seconds)

```bash
npm run dev
```

## 5. Use the App

1. Open http://localhost:5173 in your browser
2. Allow microphone access
3. Click "Start"
4. Start speaking!
5. Click "Stop" to see the report

## That's It! 🎉

You now have a working real-time speaker tracker.

## Next Steps

- Read `README.md` for features
- Check `SETUP_GUIDE.md` for troubleshooting
- Review `TECHNICAL_OVERVIEW.md` to understand how it works

## Need Help?

Common issues:
- **No API key error**: Make sure `.env` file has your key and restart the server
- **Microphone not working**: Check browser permissions
- **No speakers detected**: Speak clearly and wait a few seconds

For more help, see `SETUP_GUIDE.md`
