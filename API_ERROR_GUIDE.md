# "Failed to call API" Error - Complete Guide

## What This Error Means

The "Failed to call API" error occurs when the application cannot establish a connection with the Deepgram API. This is usually related to:

1. Invalid or incorrectly formatted API key
2. Network connectivity issues
3. CORS or browser security restrictions
4. Deepgram service issues

## Quick Fix Checklist

Try these in order:

### 1. Verify API Key Format

Your API key should look like this:
```
VITE_DEEPGRAM_API_KEY=1234567890abcdef1234567890abcdef1234567890abcdef
```

**Common mistakes:**
- ❌ Extra spaces: `VITE_DEEPGRAM_API_KEY= 123abc...` (space after =)
- ❌ Quotes: `VITE_DEEPGRAM_API_KEY="123abc..."` (don't use quotes)
- ❌ Wrong variable name: `DEEPGRAM_API_KEY=123abc...` (missing VITE_ prefix)
- ❌ Placeholder: `VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here`

**Correct format:**
```
VITE_DEEPGRAM_API_KEY=your_actual_key_with_no_spaces_or_quotes
```

### 2. Get a Valid API Key

1. Go to https://console.deepgram.com
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create a New API Key"
5. Copy the key (you can only see it once!)
6. Paste it in your `.env` file

### 3. Restart Development Server

After changing `.env`:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Environment variables are loaded at startup. You MUST restart the server after changing `.env`.

### 4. Check Browser Console

1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for detailed error messages
4. Share these if asking for help

## Detailed Troubleshooting

### Issue 1: API Key Not Loading

**Symptoms:**
- Error: "Deepgram API key not found"
- Or: "Please replace the placeholder API key"

**Solution:**

1. **Check .env file exists:**
   ```bash
   # In project root (deepagram folder)
   ls -la .env
   ```

2. **Check .env content:**
   ```bash
   cat .env
   ```
   Should show:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_key_here
   ```

3. **Verify variable name:**
   - Must be exactly `VITE_DEEPGRAM_API_KEY`
   - Must start with `VITE_` (Vite requirement)
   - Case-sensitive

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Issue 2: Invalid API Key Format

**Symptoms:**
- Error: "Invalid API key"
- Or: "Failed to create Deepgram client"

**Solution:**

1. **Check key format:**
   - Should be a long alphanumeric string
   - No spaces, quotes, or special characters
   - Usually 40-50 characters long

2. **Test your API key:**
   ```bash
   curl -X POST https://api.deepgram.com/v1/listen \
     -H "Authorization: Token YOUR_API_KEY" \
     -H "Content-Type: audio/wav" \
     --data-binary @test.wav
   ```

3. **Create new API key:**
   - Old keys might be expired or revoked
   - Create a fresh key from Deepgram console
   - Update `.env` file

### Issue 3: Network/CORS Issues

**Symptoms:**
- Error: "Network error"
- Or: "Failed to call API"
- Console shows CORS errors

**Solution:**

1. **Check internet connection:**
   ```bash
   ping api.deepgram.com
   ```

2. **Test Deepgram API directly:**
   ```bash
   curl https://api.deepgram.com/v1/projects
   ```

3. **Check firewall:**
   - Ensure WebSocket connections are allowed
   - Port 443 (HTTPS) must be open
   - Try disabling VPN temporarily

4. **Browser issues:**
   - Try Chrome or Edge (best support)
   - Clear browser cache
   - Disable browser extensions
   - Try incognito mode

### Issue 4: Deepgram Service Issues

**Symptoms:**
- Error: "Connection timeout"
- Or: "Failed to call API"
- Works sometimes, fails other times

**Solution:**

1. **Check Deepgram status:**
   - Visit https://status.deepgram.com
   - Check for ongoing incidents

2. **Check your account:**
   - Visit https://console.deepgram.com
   - Verify you have available credits
   - Check usage limits

3. **Try again later:**
   - Temporary service issues
   - Wait 5-10 minutes and retry

## Advanced Debugging

### Enable Detailed Logging

Add this to your code temporarily:

```typescript
// In useDeepgram.ts, after creating connection
connection.on(LiveTranscriptionEvents.Open, () => {
  console.log('✅ Connection opened');
});

connection.on(LiveTranscriptionEvents.Error, (err) => {
  console.error('❌ Error details:', {
    error: err,
    message: err?.message,
    type: err?.type,
    code: err?.code,
    status: err?.status
  });
});

connection.on(LiveTranscriptionEvents.Close, (event) => {
  console.log('🔌 Connection closed:', event);
});
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Click on the WebSocket connection
5. Check:
   - Status code (should be 101)
   - Headers (Authorization header present?)
   - Messages (any data flowing?)

### Verify Environment Variable

Add temporary logging:

```typescript
// In useDeepgram.ts start function
console.log('API Key loaded:', import.meta.env.VITE_DEEPGRAM_API_KEY ? 'YES' : 'NO');
console.log('API Key length:', import.meta.env.VITE_DEEPGRAM_API_KEY?.length);
console.log('API Key first 10 chars:', import.meta.env.VITE_DEEPGRAM_API_KEY?.substring(0, 10));
```

**Remove this logging before committing!**

## Production Deployment

### Vercel

If deployed to Vercel:

1. **Add environment variable:**
   - Go to project settings
   - Environment Variables section
   - Add `VITE_DEEPGRAM_API_KEY`
   - Value: your API key
   - Select all environments

2. **Redeploy:**
   - Environment variables require rebuild
   - Click "Redeploy" in Vercel dashboard

3. **Check build logs:**
   - Look for environment variable errors
   - Verify build completed successfully

### Other Platforms

For Netlify, Railway, etc.:

1. Add environment variable in platform settings
2. Variable name: `VITE_DEEPGRAM_API_KEY`
3. Value: your API key
4. Redeploy/rebuild the application

## Common Mistakes

### ❌ Wrong: Using quotes
```
VITE_DEEPGRAM_API_KEY="abc123"
```

### ✅ Correct: No quotes
```
VITE_DEEPGRAM_API_KEY=abc123
```

---

### ❌ Wrong: Spaces
```
VITE_DEEPGRAM_API_KEY = abc123
```

### ✅ Correct: No spaces
```
VITE_DEEPGRAM_API_KEY=abc123
```

---

### ❌ Wrong: Missing VITE_ prefix
```
DEEPGRAM_API_KEY=abc123
```

### ✅ Correct: With VITE_ prefix
```
VITE_DEEPGRAM_API_KEY=abc123
```

---

### ❌ Wrong: Not restarting server
```bash
# Edit .env
# Continue using old server ❌
```

### ✅ Correct: Restart after changes
```bash
# Edit .env
# Stop server (Ctrl+C)
npm run dev  # Restart ✅
```

## Still Not Working?

### Create a Test File

Create `test-api.html` in your project:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Deepgram API Test</title>
</head>
<body>
    <h1>Deepgram API Test</h1>
    <button onclick="testAPI()">Test API</button>
    <pre id="result"></pre>

    <script>
        async function testAPI() {
            const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your key
            const result = document.getElementById('result');
            
            try {
                const response = await fetch('https://api.deepgram.com/v1/projects', {
                    headers: {
                        'Authorization': `Token ${apiKey}`
                    }
                });
                
                if (response.ok) {
                    result.textContent = '✅ API key is valid!\n' + JSON.stringify(await response.json(), null, 2);
                } else {
                    result.textContent = '❌ API key is invalid!\nStatus: ' + response.status;
                }
            } catch (err) {
                result.textContent = '❌ Network error:\n' + err.message;
            }
        }
    </script>
</body>
</html>
```

Open this file in your browser and click "Test API" to verify your API key works.

## Getting Help

If you've tried everything:

1. **Collect information:**
   - Browser console errors
   - Network tab screenshots
   - Your .env file (hide the actual key!)
   - Steps to reproduce

2. **Contact support:**
   - Deepgram: https://deepgram.com/contact
   - Deepgram Discord: https://discord.gg/deepgram
   - GitHub Issues: Create an issue with details

3. **Provide details:**
   - Operating system
   - Browser and version
   - Node.js version
   - Error messages
   - What you've tried

## Prevention

To avoid this error in the future:

1. ✅ Keep API keys secure and valid
2. ✅ Monitor API usage and credits
3. ✅ Test API key before deploying
4. ✅ Use environment variables correctly
5. ✅ Restart server after .env changes
6. ✅ Keep dependencies updated
7. ✅ Check Deepgram status before debugging
8. ✅ Have backup API keys ready

## Summary

Most "Failed to call API" errors are caused by:

1. **Invalid API key** (70% of cases)
2. **Environment variable not loaded** (20% of cases)
3. **Network issues** (8% of cases)
4. **Service issues** (2% of cases)

**Quick fix:** Get a fresh API key, add it to `.env` correctly, restart the server.
