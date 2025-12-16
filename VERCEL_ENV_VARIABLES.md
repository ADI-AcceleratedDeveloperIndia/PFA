# Vercel Environment Variables

## 📋 Complete List for Vercel

Add these environment variables in your Vercel project settings:

### 1. MongoDB Connection
```
MONGODB_URI=your_mongodb_connection_string
```
**Get from**: Your MongoDB Atlas dashboard or local MongoDB

### 2. Plaid Sandbox Credentials
```
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
```
**Get from**: Plaid Dashboard → Team Settings → Keys → Sandbox

### 3. JWT Secret (for authentication)
```
JWT_SECRET=your_generated_jwt_secret
```
**Generate with**: `node scripts/generate-keys.js`

### 4. Encryption Key (for Plaid tokens)
```
ENCRYPTION_KEY=your_generated_encryption_key
```
**Generate with**: `node scripts/generate-keys.js`

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
your_mongodb_connection_string

PLAID_CLIENT_ID
your_plaid_client_id

PLAID_SECRET
your_plaid_secret

PLAID_ENV
sandbox

JWT_SECRET
your_generated_jwt_secret

ENCRYPTION_KEY
your_generated_encryption_key

NEXT_PUBLIC_APP_URL
https://your-app.vercel.app
```

**⚠️ IMPORTANT**: Replace all placeholder values with your actual credentials from:
- `.env` file (local)
- MongoDB Atlas dashboard
- Plaid Dashboard
- Generated keys from `node scripts/generate-keys.js`

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

