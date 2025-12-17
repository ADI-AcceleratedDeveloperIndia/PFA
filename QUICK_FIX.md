# Quick Fix - Make It Work NOW

## 🔴 The Problem

Both login and registration are failing with 500 errors. This is a **MongoDB connection issue**.

## ✅ Immediate Fix

### Step 1: Check MongoDB Atlas Network Access

1. Go to: https://cloud.mongodb.com/
2. Login to MongoDB Atlas
3. Click **Network Access** (left sidebar)
4. **CRITICAL**: Make sure you have `0.0.0.0/0` in the IP whitelist
5. If not, click **"Add IP Address"** → **"Allow Access from Anywhere"** → Enter `0.0.0.0/0`
6. Click **"Confirm"**

### Step 2: Verify MONGODB_URI in Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Verify `MONGODB_URI` is exactly:
   ```
   mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority
   ```
3. No extra spaces, no quotes

### Step 3: Redeploy

1. Go to Vercel → Deployments
2. Click **"Redeploy"** on latest deployment
3. Wait for it to complete

### Step 4: Create Default User on Vercel

After redeploy, visit this URL in your browser:
```
https://pfa-phi.vercel.app/api/seed-user
```

This will create (or reset) the default user: `demo@pfa.com` / `9FAdem@1`

### Step 5: Login

1. Go to: https://pfa-phi.vercel.app
2. Click **Login**
3. Email: `demo@pfa.com`
4. Password: `9FAdem@1`
5. Click **Login**

## 🎯 Default Credentials

**Email:** `demo@pfa.com`  
**Password:** `9FAdem@1`

## ⚠️ Most Likely Issue

**MongoDB IP Whitelist** - Vercel IPs are blocked. Add `0.0.0.0/0` to allow all IPs.

---

**Do Step 1 first - that's 99% likely the issue!**


