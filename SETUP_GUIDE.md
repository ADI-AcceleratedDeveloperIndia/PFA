# Complete Setup Guide for PFA

This guide will walk you through everything you need to do manually to get PFA running.

## 🎯 What You Need to Do

### Part 1: Plaid Sandbox Setup (5 minutes)

1. **Create Plaid Account**
   - Go to: https://dashboard.plaid.com/signup
   - Sign up with your email
   - Verify your email

2. **Get Your Sandbox Credentials**
   - Log in to: https://dashboard.plaid.com/
   - Click **Team Settings** (top right)
   - Click **Keys** tab
   - Find the **Sandbox** section
   - Copy:
     - **Client ID** (looks like: `5f1234567890abcdef`)
     - **Secret** (long string, keep it secret!)

3. **Save to `.env` file**
   ```env
   PLAID_CLIENT_ID=paste_your_client_id_here
   PLAID_SECRET=paste_your_secret_here
   PLAID_ENV=sandbox
   ```

### Part 2: Generate Security Keys (1 minute)

Run this command:
```bash
node scripts/generate-keys.js
```

Copy the output to your `.env` file:
```env
JWT_SECRET=paste_generated_jwt_secret_here
ENCRYPTION_KEY=paste_generated_encryption_key_here
```

### Part 3: MongoDB Setup (5 minutes)

**Option A: MongoDB Atlas (Recommended - Free)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a new cluster (free M0 tier)
4. Create database user:
   - Username: `pfa-user` (or any username)
   - Password: Generate a strong password (save it!)
5. Network Access:
   - Click "Add IP Address"
   - For Vercel: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel IPs later
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add to `.env`:
     ```env
     MONGODB_URI=mongodb+srv://pfa-user:yourpassword@cluster0.xxxxx.mongodb.net/pfa?retryWrites=true&w=majority
     ```

**Option B: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB: `mongod`
3. Add to `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pfa
   ```

### Part 4: Complete `.env` File

Your complete `.env` should look like:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Plaid Sandbox
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Security Keys (from generate-keys.js)
JWT_SECRET=your_generated_jwt_secret
ENCRYPTION_KEY=your_generated_encryption_key

# App URL (for local dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google Places API
# GOOGLE_PLACES_API_KEY=your_key_here
```

### Part 5: Test Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Verify setup:
   ```bash
   npm run verify
   ```
   (This checks all environment variables)

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open: http://localhost:3000

5. Test:
   - Register an account
   - Login
   - Connect bank (use `user_good` / `pass_good`)
   - Check dashboard

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize git (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create GitHub repository:
   - Go to: https://github.com/new
   - Create new repo (public or private)
   - Copy the repository URL

3. Push code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to: https://vercel.com
2. Sign up/login (use GitHub)
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. **DON'T deploy yet!** First add environment variables

### Step 3: Add Environment Variables in Vercel

1. Before clicking "Deploy", click **"Environment Variables"**
2. Add each variable one by one:

   ```
   MONGODB_URI = your_mongodb_connection_string
   PLAID_CLIENT_ID = your_plaid_client_id
   PLAID_SECRET = your_plaid_secret
   PLAID_ENV = sandbox
   JWT_SECRET = your_generated_jwt_secret
   ENCRYPTION_KEY = your_generated_encryption_key
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```

   **Note**: For `NEXT_PUBLIC_APP_URL`, you'll get the URL after first deployment. You can:
   - Leave it blank for now, deploy, then update it
   - Or use a placeholder and update after deployment

3. Click **"Deploy"**

### Step 4: Get Your Vercel URL

After deployment completes:
- Copy your Vercel URL (e.g., `https://pfa-abc123.vercel.app`)
- Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- Redeploy (or it will auto-update)

### Step 5: Configure Plaid Webhook

1. Go to Plaid Dashboard: https://dashboard.plaid.com/
2. Navigate to **Team Settings** → **Webhooks**
3. Click **"Add Webhook URL"**
4. Select **Sandbox** environment
5. Enter:
   ```
   https://your-app.vercel.app/api/plaid/webhook
   ```
   (Replace with your actual Vercel URL)
6. Click **"Save"**

### Step 6: Test Production

1. Open your Vercel URL
2. Register an account
3. Login
4. Connect bank (use test credentials: `user_good` / `pass_good`)
5. Verify everything works!

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] Plaid account created
- [ ] Sandbox Client ID and Secret copied
- [ ] Security keys generated (`npm run verify` to check)
- [ ] MongoDB set up (Atlas or local)
- [ ] `.env` file complete
- [ ] App runs locally (`npm run dev`)
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] All environment variables in Vercel
- [ ] Plaid webhook configured
- [ ] Production app works

## 🆘 Common Issues

### "Invalid client_id or secret"
- ✅ Make sure you copied **Sandbox** credentials (not Production)
- ✅ Check for extra spaces in `.env`
- ✅ Verify in Vercel environment variables

### "MongoDB connection error"
- ✅ Check connection string format
- ✅ Verify password is correct (no special characters need encoding)
- ✅ For Atlas: Check IP whitelist (0.0.0.0/0 for Vercel)

### "ENCRYPTION_KEY must be 64 hex characters"
- ✅ Run `node scripts/generate-keys.js` again
- ✅ Copy the ENCRYPTION_KEY exactly (64 characters)

### "Webhook not working"
- ✅ Verify webhook URL in Plaid Dashboard
- ✅ Make sure it's for **Sandbox** environment
- ✅ Check Vercel function logs

## 📞 What to Share

When everything is set up, share:

1. **GitHub URL**: `https://github.com/yourusername/your-repo`
2. **Vercel URL**: `https://your-app.vercel.app`
3. **MongoDB**: Already configured ✅
4. **Plaid**: Already configured ✅

That's it! The app should be fully functional. 🎉

## 📚 Additional Resources

- **Plaid Setup Guide**: See `PLAID_SETUP.md`
- **Deployment Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Architecture Docs**: See `ARCHITECTURE.md`
- **Quick Start**: See `QUICKSTART.md`

