# Troubleshooting Guide

## 🔴 Registration/Login 500 Error

If you see "Registration failed" or "Login failed" with a 500 error, check these:

### 1. Check Environment Variables in Vercel

Go to Vercel → Your Project → Settings → Environment Variables

**Required variables:**
- ✅ `MONGODB_URI` - Must be set
- ✅ `JWT_SECRET` - Must be set
- ✅ `ENCRYPTION_KEY` - Must be set
- ✅ `PLAID_CLIENT_ID` - Must be set
- ✅ `PLAID_SECRET` - Must be set
- ✅ `PLAID_ENV=sandbox` - Must be set
- ✅ `NEXT_PUBLIC_APP_URL` - Must be set to your Vercel URL

### 2. Verify MongoDB Connection

**Check MongoDB Atlas:**
1. Go to MongoDB Atlas dashboard
2. Check if cluster is running
3. Verify IP whitelist includes Vercel IPs (or use 0.0.0.0/0)
4. Verify database user credentials are correct

**Test connection string:**
```bash
# Your connection string should look like:
mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority
```

### 3. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Functions** tab
4. Click on failed function (e.g., `/api/auth/register`)
5. Check the logs for specific errors

### 4. Common Issues

**"MongoServerError" or "MongoNetworkError"**
- ✅ Check MongoDB URI is correct
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Verify database user password is correct
- ✅ Ensure cluster is running

**"JWT_SECRET is not set"**
- ✅ Add JWT_SECRET to Vercel environment variables
- ✅ Value should be from your `.env` file

**"MONGODB_URI is not set"**
- ✅ Add MONGODB_URI to Vercel environment variables
- ✅ Use your MongoDB Atlas connection string

### 5. Quick Fix Checklist

- [ ] All environment variables added to Vercel
- [ ] MongoDB cluster is running
- [ ] IP whitelist includes 0.0.0.0/0 (or Vercel IPs)
- [ ] Database user password is correct
- [ ] Redeployed after adding environment variables

### 6. Test Locally First

If it works locally but not on Vercel:
```bash
npm install
npm run dev
# Try registering - if it works locally, it's an environment variable issue
```

### 7. Redeploy After Adding Variables

After adding environment variables in Vercel:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger redeploy

---

## 🆘 Still Having Issues?

Share:
1. The specific error from Vercel function logs
2. Which environment variables you've set
3. Whether it works locally

Then I can help debug further!

