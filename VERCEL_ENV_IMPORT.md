# How to Import Environment Variables to Vercel

## 🎯 Quick Answer

**Vercel doesn't support direct `.env` file upload**, but you can:
1. ✅ Use Vercel CLI (easiest)
2. ✅ Copy-paste from `.env` file manually
3. ✅ Use Vercel API (advanced)

---

## Method 1: Vercel CLI (Recommended) ⚡

This is the **easiest** way to import your `.env` file!

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project

```bash
cd /Users/nandagiriaditya/Documents/PFA
vercel link
```

Follow the prompts to link to your Vercel project.

### Step 4: Pull Environment Variables (Optional)

If you want to see what's already set:
```bash
vercel env pull .env.vercel
```

### Step 5: Add Environment Variables from .env

You can add variables one by one, or use this script:

```bash
# Add all variables from .env file
vercel env add MONGODB_URI production < .env
vercel env add PLAID_CLIENT_ID production < .env
vercel env add PLAID_SECRET production < .env
vercel env add PLAID_ENV production < .env
vercel env add JWT_SECRET production < .env
vercel env add ENCRYPTION_KEY production < .env
vercel env add NEXT_PUBLIC_APP_URL production < .env
```

**Or use this automated script:**

```bash
# Create a script to add all variables
cat > add-env-vars.sh << 'EOF'
#!/bin/bash
source .env

vercel env add MONGODB_URI production <<< "$MONGODB_URI"
vercel env add PLAID_CLIENT_ID production <<< "$PLAID_CLIENT_ID"
vercel env add PLAID_SECRET production <<< "$PLAID_SECRET"
vercel env add PLAID_ENV production <<< "$PLAID_ENV"
vercel env add JWT_SECRET production <<< "$JWT_SECRET"
vercel env add ENCRYPTION_KEY production <<< "$ENCRYPTION_KEY"
vercel env add NEXT_PUBLIC_APP_URL production <<< "$NEXT_PUBLIC_APP_URL"
EOF

chmod +x add-env-vars.sh
./add-env-vars.sh
```

### Step 6: Add to All Environments (Optional)

To add to Preview and Development too:
```bash
vercel env add MONGODB_URI preview
vercel env add MONGODB_URI development
# Repeat for each variable
```

---

## Method 2: Manual Copy-Paste (Simple) 📋

### Step 1: Open Your `.env` File

```bash
cat .env
```

### Step 2: Go to Vercel Dashboard

1. Go to: https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Step 3: Add Each Variable

For each line in your `.env` file:

1. Click **"Add New"**
2. **Key**: Variable name (e.g., `MONGODB_URI`)
3. **Value**: Variable value (copy from `.env`)
4. **Environments**: Select Production, Preview, Development
5. Click **"Save"**

### Quick Reference from Your `.env`:

```
MONGODB_URI=mongodb+srv://accelerateddeveloperindia_db_user:IVf5m1lApwhot39x@pfa.hg0dkis.mongodb.net/pfa?retryWrites=true&w=majority

PLAID_CLIENT_ID=694196fdc50e430021a82556

PLAID_SECRET=e643c0888965e2fe9fbefb4a4390a5

PLAID_ENV=sandbox

JWT_SECRET=e81cdba50c82637b645eef0a65e36e574b640f6c8fa7e95577a34309572bfff0

ENCRYPTION_KEY=e25843f0100ef3dbf4c5563e4f844e838f8b44c74b6979a41dd3428fe888e917

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Method 3: Vercel CLI Bulk Import (Advanced) 🚀

Create a script to import all at once:

```bash
#!/bin/bash
# save-env-to-vercel.sh

# Read .env file and add each variable to Vercel
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ $key =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  
  # Remove quotes from value if present
  value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
  
  echo "Adding $key to Vercel..."
  echo "$value" | vercel env add "$key" production
done < .env
```

**Usage:**
```bash
chmod +x save-env-to-vercel.sh
./save-env-to-vercel.sh
```

---

## Method 4: Using Vercel API (Most Advanced) 🔧

You can use the Vercel API to programmatically add environment variables:

```bash
# Get your Vercel token from: https://vercel.com/account/tokens
export VERCEL_TOKEN=your_token_here
export VERCEL_PROJECT_ID=your_project_id

# Add a variable
curl -X POST "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "MONGODB_URI",
    "value": "mongodb+srv://...",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }'
```

---

## ✅ Recommended Approach

**For your case, I recommend Method 2 (Manual Copy-Paste)** because:
- ✅ Simple and straightforward
- ✅ No CLI installation needed
- ✅ You can verify each value
- ✅ Takes only 2-3 minutes

**Or Method 1 (Vercel CLI)** if you want automation:
- ✅ Fast and automated
- ✅ Can script it
- ✅ Good for future updates

---

## 🔄 After Adding Variables

1. **Redeploy** your project (or it will auto-redeploy)
2. **Verify** variables are set:
   ```bash
   vercel env ls
   ```
3. **Test** your app to ensure everything works

---

## 📝 Quick Checklist

- [ ] Install Vercel CLI (if using Method 1)
- [ ] Login to Vercel
- [ ] Link project (if using CLI)
- [ ] Add all 7 environment variables
- [ ] Set for Production, Preview, Development
- [ ] Redeploy project
- [ ] Test the app

---

## ⚠️ Important Notes

1. **Update `NEXT_PUBLIC_APP_URL`** after first deployment with your actual Vercel URL
2. **Never commit** `.env` file to git (already protected)
3. **Keep credentials secure** - Vercel encrypts them
4. **Test after deployment** to ensure everything works

---

## 🆘 Troubleshooting

**"Command not found: vercel"**
- Install: `npm install -g vercel`

**"Not logged in"**
- Run: `vercel login`

**"Project not linked"**
- Run: `vercel link` in your project directory

**Variables not working?**
- Make sure you redeployed after adding variables
- Check variable names match exactly (case-sensitive)
- Verify values don't have extra spaces

---

**That's it! Choose the method that works best for you.** 🎉

