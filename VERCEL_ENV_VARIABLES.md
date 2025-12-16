# Vercel Environment Variables

## 📋 Complete List for Vercel

Add these environment variables in your Vercel project settings:

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority
```

### 2. Plaid Sandbox Credentials
```
PLAID_CLIENT_ID=694196fdc50e430021a82556
PLAID_SECRET=e643c0888965e2fe9fbefb4a4390a5
PLAID_ENV=sandbox
```

### 3. JWT Secret (for authentication)
```
JWT_SECRET=e81cdba50c82637b645eef0a65e36e574b640f6c8fa7e95577a34309572bfff0
```

### 4. Encryption Key (for Plaid tokens)
```
ENCRYPTION_KEY=e25843f0100ef3dbf4c5563e4f844e838f8b44c74b6979a41dd3428fe888e917
```

### 5. Next.js App URL
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```
**⚠️ IMPORTANT**: Replace `your-app.vercel.app` with your actual Vercel domain after first deployment!

---

## 📝 Step-by-Step: How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. For each variable:
   - **Key**: Copy the variable name (e.g., `MONGODB_URI`)
   - **Value**: Copy the value (e.g., `mongodb+srv://...`)
   - **Environment**: Select **Production**, **Preview**, and **Development** (or just Production)
   - Click **Save**

5. After adding all variables, **redeploy** your project

---

## ✅ Quick Copy-Paste List

Copy these one by one into Vercel:

```
MONGODB_URI
mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority

PLAID_CLIENT_ID
694196fdc50e430021a82556

PLAID_SECRET
e643c0888965e2fe9fbefb4a4390a5

PLAID_ENV
sandbox

JWT_SECRET
e81cdba50c82637b645eef0a65e36e574b640f6c8fa7e95577a34309572bfff0

ENCRYPTION_KEY
e25843f0100ef3dbf4c5563e4f844e838f8b44c74b6979a41dd3428fe888e917

NEXT_PUBLIC_APP_URL
https://your-app.vercel.app
```

**Note**: Update `NEXT_PUBLIC_APP_URL` after you get your Vercel domain!

---

## 🔄 After First Deployment

1. Get your Vercel URL (e.g., `https://pfa-abc123.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. Redeploy (or it will auto-update)

---

## ⚠️ Important Notes

- ✅ Add all variables **before** first deployment (or redeploy after adding)
- ✅ Select **all environments** (Production, Preview, Development) when adding
- ✅ `NEXT_PUBLIC_APP_URL` can be updated after first deploy
- ✅ Never commit these values to git (they're already in `.gitignore`)

---

## 🧪 Verify Setup

After adding all variables and deploying:

1. Open your Vercel URL
2. Register/Login
3. Connect bank account
4. Verify everything works!

---

## 📸 Screenshot Guide

In Vercel Dashboard:
1. **Project** → **Settings** → **Environment Variables**
2. Click **"Add New"** button
3. Fill in:
   - **Key**: Variable name
   - **Value**: Variable value
   - **Environments**: Check all (Production, Preview, Development)
4. Click **"Save"**
5. Repeat for all variables

That's it! 🎉

