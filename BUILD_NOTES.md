# Build Notes

## TypeScript Configuration

This project includes proper TypeScript type definitions to ensure successful builds.

### Type Definition Files

1. **src/vite-env.d.ts**
   - Defines `import.meta.env` types
   - Includes `VITE_DEEPGRAM_API_KEY` type
   - Required for Vite environment variables

2. **src/global.d.ts**
   - Declares CSS module types
   - Handles asset imports (SVG, PNG, JPG)
   - Prevents TypeScript errors for style imports

### Build Process

The build command runs in two steps:
```bash
tsc -b && vite build
```

1. **TypeScript Compilation** (`tsc -b`)
   - Type checks all TypeScript files
   - Uses `tsconfig.json` configuration
   - Validates type definitions

2. **Vite Build** (`vite build`)
   - Bundles application for production
   - Optimizes assets
   - Generates `dist` folder

### Common Build Issues

#### Issue: "Property 'env' does not exist on type 'ImportMeta'"
**Solution**: Ensure `src/vite-env.d.ts` exists and is properly configured

#### Issue: "Cannot find module './index.css'"
**Solution**: Ensure `src/global.d.ts` exists with CSS module declarations

#### Issue: "VITE_DEEPGRAM_API_KEY is not defined"
**Solution**: 
- For local builds: Add to `.env` file
- For Vercel: Add to environment variables in project settings

### TypeScript Configuration Files

- **tsconfig.json**: Root configuration
- **tsconfig.app.json**: Application-specific settings
- **tsconfig.node.json**: Node/build tool settings

### Vercel Build Configuration

Vercel automatically:
1. Detects Vite framework
2. Runs `npm install`
3. Executes `npm run build`
4. Deploys `dist` folder

### Environment Variables in Build

Environment variables must:
- Start with `VITE_` prefix
- Be set before build time
- Be accessible via `import.meta.env.VITE_*`

Example:
```typescript
const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
```

### Build Output

Successful build creates:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

### Optimization

Vite automatically:
- Minifies JavaScript
- Optimizes CSS
- Tree-shakes unused code
- Code-splits for better performance
- Generates source maps (in dev)

### Testing Build Locally

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

This serves the production build locally for testing.

### CI/CD Integration

For automated deployments:
1. Set environment variables in CI/CD platform
2. Run `npm install`
3. Run `npm run build`
4. Deploy `dist` folder

### Build Performance

Typical build times:
- Clean build: 10-20 seconds
- Incremental build: 5-10 seconds
- Type checking: 3-5 seconds

### Troubleshooting Build Failures

1. **Clear cache and rebuild**:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **Check TypeScript errors**:
   ```bash
   npx tsc --noEmit
   ```

3. **Verify dependencies**:
   ```bash
   npm list
   ```

4. **Check Node version**:
   ```bash
   node --version  # Should be 18.x or higher
   ```

### Production Build Checklist

- [ ] All TypeScript errors resolved
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Build completes successfully
- [ ] Preview build works locally
- [ ] No console errors in production build
- [ ] Assets load correctly
- [ ] API connections work
