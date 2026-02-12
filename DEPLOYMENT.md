# Deployment Guide

## Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Deepgram API key

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Root Directory: `deepagram` (if in monorepo) or `.` (if standalone)
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: Add Environment Variable

In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add variable:
   - Name: `VITE_DEEPGRAM_API_KEY`
   - Value: Your Deepgram API key
   - Environment: Production, Preview, Development

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Environment Variables

Required environment variables:
- `VITE_DEEPGRAM_API_KEY`: Your Deepgram API key

## Build Configuration

The project uses:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

## Troubleshooting

### Build fails with TypeScript errors
- Ensure all `.d.ts` files are included in `src/`
- Check `tsconfig.json` configuration
- Verify all dependencies are installed

### Environment variable not found
- Ensure variable name starts with `VITE_`
- Redeploy after adding environment variables
- Check variable is set for correct environment

### Microphone not working in production
- Ensure site is served over HTTPS
- Check browser permissions
- Verify Deepgram API key is valid

## Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_DEEPGRAM_API_KEY`

### GitHub Pages
Not recommended - requires HTTPS for microphone access

### Self-Hosted
1. Build: `npm run build`
2. Serve `dist` folder with any static server
3. Ensure HTTPS is configured
4. Set environment variables before build

## Production Checklist

- [ ] Deepgram API key added to environment variables
- [ ] HTTPS enabled (required for microphone)
- [ ] Build completes successfully
- [ ] Environment variables properly prefixed with `VITE_`
- [ ] Browser permissions tested
- [ ] Error handling tested
- [ ] API quota monitored

## Performance Optimization

For production:
1. Enable gzip compression
2. Set proper cache headers
3. Monitor API usage
4. Consider CDN for static assets

## Security Notes

- Never commit `.env` file
- Use environment variables for API keys
- Rotate API keys periodically
- Monitor API usage for anomalies
- Set up usage alerts in Deepgram console
