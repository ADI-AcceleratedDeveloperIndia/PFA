# Deployment Checklist

Follow this checklist step-by-step to deploy PFA to production.

## Pre-Deployment (Local Setup)

### 1. Plaid Sandbox Setup ✅

- [ ] Create account at https://dashboard.plaid.com/signup
- [ ] Go to **Team Settings** → **Keys**
- [ ] Copy **Sandbox Client ID**
- [ ] Copy **Sandbox Secret**
- [ ] Add to `.env`:
  ```env
  PLAID_CLIENT_ID=your_sandbox_client_id
  PLAID_SECRET=your_sandbox_secret
  PLAID_ENV=sandbox
  ```

### 2. Generate Security Keys ✅

```bash
node scripts/generate-keys.js
```

Copy the output to `.env`:
```env
JWT_SECRET=generated_jwt_secret
ENCRYPTION_KEY=generated_encryption_key
```

### 3. MongoDB Setup ✅

**Option A: MongoDB Atlas (Recommended for Production)**
- [ ] Create account at https://www.mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Create database user
- [ ] Whitelist IP (or use 0.0.0.0/0 for Vercel)
- [ ] Get connection string
- [ ] Add to `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pfa`

**Option B: Local MongoDB**
- [ ] Install MongoDB locally
- [ ] Add to `.env`: `MONGODB_URI=mongodb://localhost:27017/pfa`

### 4. Test Locally ✅

```bash
npm install
npm run dev
```

- [ ] App runs on http://localhost:3000
- [ ] Can register/login
- [ ] Can connect bank (use test credentials: `user_good` / `pass_good`)
- [ ] Transactions appear

## GitHub Setup

### 5. Initialize Git (if not done) ✅

```bash
git init
git add .
git commit -m "Initial commit: PFA fintech app"
```

### 6. Push to GitHub ✅

- [ ] Create new repository on GitHub
- [ ] Add remote:
  ```bash
  git remote add origin https://github.com/yourusername/your-repo.git
  git branch -M main
  git push -u origin main
  ```

**IMPORTANT**: Make sure `.env` is in `.gitignore` (it already is!)

## Vercel Deployment

### 7. Deploy to Vercel ✅

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 8. Add Environment Variables in Vercel ✅

Go to **Settings** → **Environment Variables** and add:

```env
MONGODB_URI=your_mongodb_connection_string
PLAID_CLIENT_ID=your_sandbox_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox
JWT_SECRET=your_generated_jwt_secret
ENCRYPTION_KEY=your_generated_encryption_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**CRITICAL**: 
- Replace `your-app.vercel.app` with your actual Vercel domain
- You'll get the domain after first deployment
- Update `NEXT_PUBLIC_APP_URL` after first deploy if needed

### 9. Deploy ✅

- [ ] Click **"Deploy"**
- [ ] Wait for deployment to complete
- [ ] Copy your Vercel URL (e.g., `https://pfa-xyz.vercel.app`)

### 10. Update Environment Variables ✅

If `NEXT_PUBLIC_APP_URL` wasn't set correctly:
- [ ] Go to Vercel → Settings → Environment Variables
- [ ] Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
- [ ] Redeploy (or it will auto-update)

## Plaid Webhook Configuration

### 11. Configure Plaid Webhook ✅

1. Go to Plaid Dashboard: https://dashboard.plaid.com/
2. Navigate to **Team Settings** → **Webhooks**
3. Click **"Add Webhook URL"**
4. Select **Sandbox** environment
5. Enter webhook URL:
   ```
   https://your-app.vercel.app/api/plaid/webhook
   ```
   (Replace with your actual Vercel URL)
6. Click **"Save"**

### 12. Verify Webhook ✅

- [ ] Webhook URL is saved in Plaid Dashboard
- [ ] It's set for **Sandbox** environment
- [ ] URL matches your Vercel deployment

## Post-Deployment Testing

### 13. Test Production App ✅

1. **Open your Vercel URL**
2. **Register** a new account
3. **Login**
4. **Connect Bank**:
   - Click "Connect"
   - Click "Connect Bank Account"
   - Use test credentials: `user_good` / `pass_good`
   - Select "First Platypus Bank" or any test bank
5. **Verify**:
   - [ ] Bank connects successfully
   - [ ] Dashboard shows balance
   - [ ] Transactions appear
   - [ ] Recommendations work

### 14. Check Vercel Logs ✅

- [ ] Go to Vercel → Your Project → **Functions** tab
- [ ] Check for any errors
- [ ] Verify API routes are working

### 15. Test Webhook (Optional) ✅

- [ ] Connect a bank account
- [ ] Wait a few minutes
- [ ] Check Vercel function logs for webhook calls
- [ ] Verify new transactions appear automatically

## Troubleshooting

### "Invalid client_id or secret"
- ✅ Check Plaid credentials are for **Sandbox** (not Production)
- ✅ Verify no extra spaces in Vercel environment variables
- ✅ Make sure `PLAID_ENV=sandbox`

### "MongoDB connection error"
- ✅ Verify MongoDB Atlas IP whitelist includes Vercel IPs (or use 0.0.0.0/0)
- ✅ Check connection string format
- ✅ Verify database user has correct permissions

### "Webhook not working"
- ✅ Verify webhook URL in Plaid Dashboard matches Vercel URL exactly
- ✅ Check it's set for **Sandbox** environment
- ✅ Verify `/api/plaid/webhook` route exists (it does!)

### "Link token creation failed"
- ✅ Check `NEXT_PUBLIC_APP_URL` is set correctly in Vercel
- ✅ Verify Plaid credentials are correct
- ✅ Check Vercel function logs for detailed errors

## Final Checklist

- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Deployed to Vercel
- [ ] ✅ All environment variables set in Vercel
- [ ] ✅ Plaid webhook configured
- [ ] ✅ App is accessible via Vercel URL
- [ ] ✅ Can register/login
- [ ] ✅ Can connect bank account
- [ ] ✅ Transactions appear
- [ ] ✅ Dashboard works
- [ ] ✅ Recommendations work

## Share Your Deployment

Once everything works:

1. **GitHub URL**: `https://github.com/yourusername/your-repo`
2. **Vercel URL**: `https://your-app.vercel.app`
3. **MongoDB**: Already configured ✅
4. **Plaid**: Already configured ✅

You're all set! 🎉

