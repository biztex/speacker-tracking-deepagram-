# Troubleshooting Guide

## "Connection error occurred"

This error can happen for several reasons. The app now provides specific error messages to help you identify the issue.

### Common Causes and Solutions

#### 1. Invalid API Key
**Error:** "Invalid API key. Please check your VITE_DEEPGRAM_API_KEY in .env file"

**Solution:**
1. Open the `.env` file in the project root
2. Verify your API key is correct
3. Get a new API key from https://console.deepgram.com
4. Replace the value:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
   ```
5. Restart the dev server: `npm run dev`

#### 2. Placeholder API Key
**Error:** "Please replace the placeholder API key with your actual Deepgram API key"

**Solution:**
- You're still using the default placeholder
- Get your API key from Deepgram console
- Replace `your_deepgram_api_key_here` with your actual key

#### 3. Network Error
**Error:** "Network error. Please check your internet connection"

**Solution:**
- Check your internet connection
- Try accessing https://api.deepgram.com in your browser
- Check if your firewall is blocking WebSocket connections
- Try disabling VPN if you're using one

#### 4. Connection Timeout
**Error:** "Connection timeout. Please check your internet connection and API key"

**Solution:**
- Slow internet connection (need >1 Mbps upload)
- Firewall blocking WebSocket connections
- API key might be invalid
- Try again in a few moments

#### 5. Rate Limit Exceeded
**Error:** "Rate limit exceeded. Please wait a moment and try again"

**Solution:**
- You've made too many requests
- Wait 1-2 minutes before trying again
- Check your Deepgram usage at https://console.deepgram.com

#### 6. Permission Error
**Error:** "API key does not have permission for live transcription"

**Solution:**
- Your API key doesn't have the right permissions
- Create a new API key with live transcription permissions
- Update your `.env` file

### Microphone Errors

#### Microphone Access Denied
**Error:** "Microphone access denied. Please allow microphone access and try again"

**Solution:**
1. Click the microphone icon in your browser's address bar
2. Select "Allow" for microphone access
3. Refresh the page and try again

#### No Microphone Found
**Error:** "No microphone found. Please connect a microphone and try again"

**Solution:**
- Connect a microphone to your computer
- Check if it's properly connected
- Try a different USB port
- Restart your browser

#### Microphone In Use
**Error:** "Microphone is already in use by another application"

**Solution:**
- Close other applications using the microphone (Zoom, Skype, etc.)
- Close other browser tabs using the microphone
- Restart your browser

#### Microphone Error
**Error:** "Microphone error. Please check your microphone and try again"

**Solution:**
- Check microphone is properly connected
- Test microphone in system settings
- Try a different microphone
- Restart your browser

### Browser Issues

#### WebSocket Not Supported
If you see connection errors, your browser might not support WebSockets.

**Solution:**
- Use Chrome 90+ or Edge 90+ (recommended)
- Update your browser to the latest version
- Try a different browser

#### HTTPS Required
Microphone access requires HTTPS (except on localhost).

**Solution:**
- Use `http://localhost:5173` for development
- Use HTTPS for production deployment
- Vercel automatically provides HTTPS

### Debugging Steps

#### 1. Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for error messages
4. Share the error message if asking for help

#### 2. Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Look for failed connections
5. Check the status code

#### 3. Verify API Key
```bash
# Test your API key with curl
curl -X POST https://api.deepgram.com/v1/listen \
  -H "Authorization: Token YOUR_API_KEY" \
  -H "Content-Type: audio/wav" \
  --data-binary @test.wav
```

#### 4. Check Deepgram Status
Visit https://status.deepgram.com to check if Deepgram services are operational.

### Environment Variable Issues

#### Variable Not Found
**Error:** "Deepgram API key not found"

**Solution:**
1. Ensure `.env` file exists in project root
2. Variable must be named exactly `VITE_DEEPGRAM_API_KEY`
3. Must start with `VITE_` prefix
4. Restart dev server after adding

#### Variable Not Loading
If the variable exists but isn't loading:

**Solution:**
1. Stop the dev server (Ctrl+C)
2. Delete `.env` file
3. Create new `.env` file
4. Add: `VITE_DEEPGRAM_API_KEY=your_key_here`
5. Start dev server: `npm run dev`

### Production Deployment Issues

#### Vercel Environment Variables
If deployed to Vercel but getting connection errors:

**Solution:**
1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add `VITE_DEEPGRAM_API_KEY`
4. Set value to your API key
5. Select all environments (Production, Preview, Development)
6. Redeploy the project

#### Build-Time vs Runtime
Environment variables in Vite are embedded at build time.

**Important:**
- Changing environment variables requires rebuild
- In Vercel, redeploy after changing variables
- In local dev, restart dev server

### Performance Issues

#### Slow Response Time
If speaker detection is slow:

**Solution:**
- Check internet speed (need >1 Mbps upload)
- Close unnecessary browser tabs
- Check CPU usage
- Try Chrome or Edge for best performance

#### Stuttering Audio
If visualization stutters:

**Solution:**
- Close other applications
- Check CPU usage (should be <10%)
- Try reducing browser zoom level
- Disable browser extensions

### Still Having Issues?

#### Collect Information
1. Browser name and version
2. Operating system
3. Error message from console
4. Network tab screenshot
5. Steps to reproduce

#### Check Logs
Look for detailed error messages in:
- Browser console (F12)
- Network tab (F12 → Network → WS)
- Deepgram console (https://console.deepgram.com)

#### Test Checklist
- [ ] API key is valid and correct
- [ ] Internet connection is stable
- [ ] Microphone is connected and working
- [ ] Browser is up to date
- [ ] No firewall blocking WebSockets
- [ ] Environment variable is set correctly
- [ ] Dev server was restarted after .env changes

### Quick Fixes

#### Reset Everything
```bash
# Stop the server
Ctrl+C

# Clear cache
rm -rf node_modules dist .vite

# Reinstall
npm install

# Restart
npm run dev
```

#### Test API Key
Visit https://console.deepgram.com and verify:
- API key exists
- API key has correct permissions
- Account has available credits
- No usage limits exceeded

### Getting Help

If none of these solutions work:

1. **Deepgram Support:** https://deepgram.com/contact
2. **Deepgram Docs:** https://developers.deepgram.com
3. **GitHub Issues:** Create an issue with error details
4. **Discord:** Join Deepgram community

### Prevention

To avoid connection errors:
- Keep API key secure and valid
- Monitor API usage and credits
- Maintain stable internet connection
- Use supported browsers
- Keep dependencies updated
- Test microphone before starting
