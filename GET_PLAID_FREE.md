# 🆓 How to Get FREE Plaid Sandbox Credentials

## ⚠️ IMPORTANT: Plaid Sandbox is 100% FREE!

You do NOT need to pay anything. Plaid Sandbox is completely free for development and testing.

## Step-by-Step: Get Your Free Credentials

### Step 1: Sign Up (Free Account)

1. Go to: **https://dashboard.plaid.com/signup**
2. Click **"Sign Up"** or **"Get Started"**
3. Fill in:
   - Email address
   - Password
   - Company name (can be anything, e.g., "My App" or "PFA")
4. Click **"Create Account"**
5. Verify your email

### Step 2: Skip Any Payment Prompts

- If you see any payment or upgrade prompts, **SKIP THEM** or click **"Continue with Free"**
- You're looking for the **Sandbox** environment, which is free
- Production requires payment, but **Sandbox is free**

### Step 3: Access Your Sandbox Keys

1. After logging in, you should see the Plaid Dashboard
2. Look for **"Team Settings"** or **"Settings"** (usually top right)
3. Click on it
4. Find **"Keys"** or **"API Keys"** tab
5. You'll see different environments:
   - **Sandbox** ← This is what you need (FREE)
   - Development (also free)
   - Production (requires payment - ignore this)

### Step 4: Copy Your Sandbox Credentials

In the **Sandbox** section, you'll see:
- **Client ID** (something like `5f1234567890abcdef`)
- **Secret** (long string)

Copy both of these!

### Step 5: Add to Your `.env` File

```env
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_secret_here
PLAID_ENV=sandbox
```

## 🚨 Troubleshooting: If You See Payment Prompts

### Option 1: Look for "Sandbox" or "Development" Tab
- Payment prompts are usually for **Production** access
- Look for a **Sandbox** or **Development** section
- Sandbox is always free

### Option 2: Use Development Environment
- If Sandbox isn't visible, try **Development** environment
- Development is also free
- Set `PLAID_ENV=development` instead

### Option 3: Contact Plaid Support
- If you can't find free credentials, contact Plaid support
- They'll help you access Sandbox (which is free)
- Support: Available in the dashboard

## ✅ What You Should See

When you have the right credentials:
- ✅ You see "Sandbox" or "Development" environment
- ✅ Client ID and Secret are visible
- ✅ No payment required
- ✅ You can start using immediately

## ❌ What to Avoid

- ❌ Don't click "Upgrade to Production" (that costs money)
- ❌ Don't enter payment information
- ❌ Don't sign up for paid plans
- ✅ Just use Sandbox (completely free)

## 📝 Quick Checklist

- [ ] Signed up at dashboard.plaid.com
- [ ] Verified email
- [ ] Found Team Settings → Keys
- [ ] Located Sandbox section
- [ ] Copied Client ID
- [ ] Copied Secret
- [ ] Added to `.env` file
- [ ] Set `PLAID_ENV=sandbox`

## 🎯 Alternative: If You Can't Find Sandbox

If the dashboard looks different:

1. **Try Development Environment**:
   - Look for "Development" instead of "Sandbox"
   - Use `PLAID_ENV=development` in `.env`

2. **Check Your Account Type**:
   - Make sure you're not on a trial that expired
   - Create a fresh account if needed

3. **Contact Support**:
   - Plaid has excellent free support
   - Ask them: "How do I access Sandbox credentials?"
   - They'll guide you (it's free!)

## 💡 Remember

- **Sandbox = FREE** ✅
- **Development = FREE** ✅
- **Production = PAID** ❌ (Don't use this yet)

You only need Sandbox for now!

---

**Still having issues?** The Plaid dashboard interface may have changed. Try:
1. Look for "Environments" or "API Keys" in the sidebar
2. Check if there's a dropdown to switch between Sandbox/Development/Production
3. Contact Plaid support - they're very helpful!

