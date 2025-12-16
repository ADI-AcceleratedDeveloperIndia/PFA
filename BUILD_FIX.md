# Vercel Build Fix Guide

## Common Build Errors and Fixes

### Error 1: "Module not found" or "Cannot find module"

**Fix**: Ensure all dependencies are in `package.json`

```bash
npm install
```

### Error 2: TypeScript errors

**Fix**: Check for type errors:
```bash
npx tsc --noEmit
```

### Error 3: react-plaid-link build issues

**Fix**: Added `transpilePackages` to `next.config.mjs`:
```js
transpilePackages: ['react-plaid-link'],
```

### Error 4: Missing environment variables at build time

**Fix**: Some env vars might be needed at build time. Add to Vercel:
- `NEXT_PUBLIC_APP_URL` (required for build)

### Error 5: Import errors

**Fix**: Check all imports are correct:
- Server components can't import client-only packages
- Client components marked with `'use client'`

---

## Quick Fix Checklist

1. ✅ **Updated `next.config.mjs`** - Added `transpilePackages` for react-plaid-link
2. ✅ **Fixed TypeScript imports** - Changed to type-only imports where needed
3. ✅ **Created `.vercelignore`** - Excludes unnecessary files

---

## Steps to Fix Your Build

### Step 1: Pull Latest Changes

```bash
git pull origin main
```

### Step 2: Test Build Locally

```bash
npm install
npm run build
```

If it builds locally, it should build on Vercel.

### Step 3: Check Vercel Build Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click on the failed deployment
5. Check the **Build Logs** for specific errors

### Step 4: Common Issues

**If you see "react-plaid-link" errors:**
- ✅ Already fixed in `next.config.mjs`

**If you see TypeScript errors:**
- Check the specific file mentioned
- Ensure all types are imported correctly

**If you see "Module not found":**
- Ensure `package.json` has all dependencies
- Run `npm install` locally to verify

**If you see environment variable errors:**
- Make sure all required env vars are set in Vercel
- `NEXT_PUBLIC_APP_URL` is especially important

---

## Updated Files

1. **`next.config.mjs`** - Added `transpilePackages` for react-plaid-link
2. **`app/recommendations/page.tsx`** - Fixed type imports
3. **`.vercelignore`** - Added to exclude unnecessary files

---

## Next Steps

1. **Commit and push** the fixes:
   ```bash
   git add .
   git commit -m "Fix Vercel build errors"
   git push
   ```

2. **Vercel will auto-redeploy** - Check the new deployment

3. **If still failing**, check Vercel build logs and share the specific error

---

## Need More Help?

Share the specific error from Vercel build logs, and I can help fix it!

