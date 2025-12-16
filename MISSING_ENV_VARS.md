# Missing Environment Variables in Vercel

## ❌ Missing: MONGODB_URI

You have these variables set:
- ✅ PLAID_CLIENT_ID
- ✅ PLAID_SECRET
- ✅ PLAID_ENV
- ✅ JWT_SECRET
- ✅ ENCRYPTION_KEY

## ⚠️ You're Missing:

### 1. MONGODB_URI (CRITICAL!)

This is why registration is failing with a 500 error!

**Add this to Vercel:**
```
MONGODB_URI=mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority
```

### 2. NEXT_PUBLIC_APP_URL (Recommended)

Set this to your Vercel URL:
```
NEXT_PUBLIC_APP_URL=https://pfa-phi.vercel.app
```

## 📝 How to Add

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. **Key**: `MONGODB_URI`
4. **Value**: `mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority`
5. **Environments**: Select all (Production, Preview, Development)
6. Click **"Save"**

7. Repeat for `NEXT_PUBLIC_APP_URL`:
   - **Key**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://pfa-phi.vercel.app`
   - **Environments**: All
   - Click **"Save"**

## 🔄 After Adding

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete
4. Try registering again!

## ✅ Complete List

After adding, you should have **7 environment variables**:

1. ✅ MONGODB_URI (ADD THIS!)
2. ✅ PLAID_CLIENT_ID
3. ✅ PLAID_SECRET
4. ✅ PLAID_ENV
5. ✅ JWT_SECRET
6. ✅ ENCRYPTION_KEY
7. ✅ NEXT_PUBLIC_APP_URL (ADD THIS!)

---

**The 500 error is because MONGODB_URI is missing!** Add it and redeploy. 🚀

