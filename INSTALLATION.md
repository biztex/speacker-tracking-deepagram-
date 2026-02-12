# Installation Instructions

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm (comes with Node.js)
- A Deepgram API key

## Step-by-Step Installation

### Step 1: Navigate to Project Directory

Open your terminal and navigate to the deepagram folder:

```bash
cd deepagram
```

### Step 2: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- React and React DOM
- Deepgram SDK (@deepgram/sdk)
- Tailwind CSS
- TypeScript
- Vite
- All development dependencies

### Step 3: Configure Environment Variables

1. You'll find a `.env` file already created in the project root
2. Open it and replace the placeholder with your actual Deepgram API key:

```
VITE_DEEPGRAM_API_KEY=your_actual_deepgram_api_key_here
```

**Getting a Deepgram API Key:**
1. Visit https://console.deepgram.com
2. Sign up for a free account (includes $200 in credits)
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### Step 4: Start the Development Server

Run the development server:

```bash
npm run dev
```

You should see output similar to:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

### Step 6: Test the Application

1. The browser will ask for microphone permissions - click "Allow"
2. Select the number of speakers (start with 2)
3. Click the "Start" button
4. Start speaking - you should see the timer running and speakers being tracked
5. Click "Stop" to end the session
6. View the speaking time report

## Verification Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] `.env` file exists with valid API key
- [ ] Development server starts without errors
- [ ] Application opens in browser
- [ ] Microphone permission granted
- [ ] Audio is being captured (check browser console)

## Common Installation Issues

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org

### Issue: "Cannot find module '@deepgram/sdk'"
**Solution**: Run `npm install` again

### Issue: "VITE_DEEPGRAM_API_KEY is not defined"
**Solution**: 
- Check that `.env` file exists
- Verify the variable name is exactly `VITE_DEEPGRAM_API_KEY`
- Restart the dev server after adding the key

### Issue: Port 5173 already in use
**Solution**: 
- Stop other Vite processes
- Or specify a different port: `npm run dev -- --port 3000`

### Issue: TypeScript errors
**Solution**: 
- Ensure TypeScript is installed: `npm install -D typescript`
- Check `tsconfig.json` files are present

## Build for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Next Steps

After successful installation:
1. Read `README.md` for feature overview
2. Check `SETUP_GUIDE.md` for usage instructions
3. Review `TECHNICAL_OVERVIEW.md` for implementation details

## Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Verify all installation steps were completed
3. Ensure your Deepgram API key is valid
4. Check that your microphone is working in other applications

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 4GB minimum
- **Internet**: Stable connection required for API calls
- **Microphone**: Any working microphone or headset
