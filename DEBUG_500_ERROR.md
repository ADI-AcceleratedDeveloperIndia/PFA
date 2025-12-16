# Debugging 500 Error on Registration

## ✅ Environment Variables Set

You have all 7 variables:
- ✅ MONGODB_URI
- ✅ PLAID_CLIENT_ID
- ✅ PLAID_SECRET
- ✅ PLAID_ENV
- ✅ JWT_SECRET
- ✅ ENCRYPTION_KEY
- ✅ NEXT_PUBLIC_APP_URL

## 🔍 Next Steps to Debug

### 1. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Functions** tab
4. Click on `/api/auth/register`
5. Look at the **Logs** section
6. Find the error message

**What to look for:**
- MongoDB connection errors
- "MongoServerError"
- "MongoNetworkError"
- "Authentication failed"
- Any specific error messages

### 2. Check MongoDB Atlas

**Network Access:**
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** (left sidebar)
3. Check if IP whitelist includes:
   - `0.0.0.0/0` (allows all IPs - recommended for Vercel)
   - OR specific Vercel IP ranges

**If IP is blocked:**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0)
- Click **"Confirm"**

**Database Access:**
1. Go to **Database Access** (left sidebar)
2. Verify user `accelerateddeveloperindia_db_user` exists
3. Check password is correct: `IVf5m1lApwhot39x`
4. Verify user has read/write permissions

### 3. Test MongoDB Connection String

The connection string should be:
```
mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority
```

**Check:**
- ✅ Username: `accelerateddeveloperindia_db_user`
- ✅ Password: `IVf5m1lApwhot39x` (no special characters that need encoding)
- ✅ Cluster: `pfa.hg0dkis.mongodb.net`
- ✅ Database: `pfa`

### 4. Common Issues

**Issue 1: IP Whitelist**
- **Symptom**: "MongoNetworkError" or "Connection timeout"
- **Fix**: Add `0.0.0.0/0` to MongoDB Atlas Network Access

**Issue 2: Wrong Password**
- **Symptom**: "Authentication failed"
- **Fix**: Verify password in MongoDB Atlas matches exactly

**Issue 3: Database Name**
- **Symptom**: Connection works but can't find database
- **Fix**: Ensure database name `pfa` exists (MongoDB creates it automatically)

**Issue 4: Environment Variables Not Applied**
- **Symptom**: Still getting errors after adding variables
- **Fix**: Redeploy the project after adding variables

### 5. Redeploy After Adding Variables

**Important**: After adding/changing environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger redeploy

### 6. Check Vercel Runtime Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Runtime Logs** tab
4. Look for errors during registration attempts

## 🆘 Share the Error

To help debug, please share:
1. The exact error message from Vercel function logs
2. Screenshot of MongoDB Atlas Network Access (showing IP whitelist)
3. Whether you redeployed after adding MONGODB_URI

---

**Most likely cause**: MongoDB IP whitelist doesn't include Vercel IPs. Add `0.0.0.0/0` to allow all IPs.

