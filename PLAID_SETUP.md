# Plaid Sandbox Setup Guide

## Step-by-Step Instructions

### 1. Create Plaid Account (Free)

1. Go to https://dashboard.plaid.com/signup
2. Sign up with your email
3. Verify your email address
4. Complete the onboarding

### 2. Get Your Sandbox Credentials

1. **Log in** to Plaid Dashboard: https://dashboard.plaid.com/
2. Go to **Team Settings** (top right) → **Keys**
3. You'll see two environments:
   - **Sandbox** (for development/testing)
   - **Development** (also for testing)
   - **Production** (for real users - requires approval)

4. **For Sandbox**, copy:
   - **Client ID** (starts with something like `5f...`)
   - **Secret** (long string, keep it secure!)

5. Add to your `.env` file:
   ```env
   PLAID_CLIENT_ID=your_sandbox_client_id_here
   PLAID_SECRET=your_sandbox_secret_here
   PLAID_ENV=sandbox
   ```

### 3. Configure Webhook URL (IMPORTANT!)

After deploying to Vercel, you'll need to set up webhooks:

1. In Plaid Dashboard, go to **Team Settings** → **Webhooks**
2. Click **Add Webhook URL**
3. For **Sandbox** environment:
   - URL: `https://your-vercel-app.vercel.app/api/plaid/webhook`
   - Replace `your-vercel-app` with your actual Vercel domain
4. Save the webhook URL

**Note**: For local development, you can use a tool like ngrok to expose your local server, but for now, webhooks will work once deployed to Vercel.

### 4. Test Bank Credentials (Sandbox)

When connecting a bank in Sandbox mode, use these test credentials:

- **Institution**: Search for "First Platypus Bank" or any test bank
- **Username**: `user_good`
- **Password**: `pass_good`

Plaid Sandbox will automatically generate test transactions.

### 5. Production Setup (Later)

When ready for production:

1. Apply for Production access in Plaid Dashboard
2. Get Production credentials
3. Update `.env`:
   ```env
   PLAID_ENV=production
   PLAID_CLIENT_ID=your_production_client_id
   PLAID_SECRET=your_production_secret
   ```
4. Add production webhook URL in Plaid Dashboard

## What You Need to Do Manually

### ✅ Before Pushing to GitHub

1. **Create `.env` file** (already have `.env.example`)
2. **Generate encryption keys**:
   ```bash
   node scripts/generate-keys.js
   ```
   Copy the output to `.env`

3. **Add Plaid Sandbox credentials** to `.env`:
   ```env
   PLAID_CLIENT_ID=your_client_id
   PLAID_SECRET=your_secret
   PLAID_ENV=sandbox
   ```

4. **Add MongoDB URI** to `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Set app URL** (for local dev):
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### ✅ After Deploying to Vercel

1. **Add Environment Variables in Vercel**:
   - Go to your Vercel project → Settings → Environment Variables
   - Add ALL variables from `.env`:
     - `MONGODB_URI`
     - `PLAID_CLIENT_ID`
     - `PLAID_SECRET`
     - `PLAID_ENV=sandbox`
     - `JWT_SECRET`
     - `ENCRYPTION_KEY`
     - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL: `https://your-app.vercel.app`)

2. **Update Plaid Webhook URL**:
   - Go to Plaid Dashboard → Team Settings → Webhooks
   - Add: `https://your-app.vercel.app/api/plaid/webhook`
   - Make sure it's for **Sandbox** environment

3. **Redeploy** if you added env vars after first deploy

## Quick Checklist

- [ ] Plaid account created
- [ ] Sandbox Client ID copied
- [ ] Sandbox Secret copied
- [ ] `.env` file created with all variables
- [ ] Encryption keys generated
- [ ] MongoDB URI added
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables added to Vercel
- [ ] `NEXT_PUBLIC_APP_URL` set to Vercel URL in Vercel
- [ ] Plaid webhook URL configured in Plaid Dashboard
- [ ] Test the connection flow!

## Troubleshooting

**"Invalid client_id or secret"**
- Double-check you copied the Sandbox credentials (not Production)
- Make sure there are no extra spaces in `.env`

**"Webhook not receiving events"**
- Verify webhook URL in Plaid Dashboard matches your Vercel URL
- Check Vercel function logs for webhook errors
- Make sure webhook is set for Sandbox environment

**"Link token creation failed"**
- Verify `PLAID_ENV=sandbox` in environment variables
- Check that Client ID and Secret are correct
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

## Need Help?

- Plaid Docs: https://plaid.com/docs/
- Plaid Dashboard: https://dashboard.plaid.com/
- Plaid Support: Available in dashboard

