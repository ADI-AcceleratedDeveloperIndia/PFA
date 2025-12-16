# Plaid FAQ - Quick Answers

## ❓ Does Plaid Have a CLI?

**No, Plaid doesn't have a CLI for getting credentials.** You need to use the **web dashboard** at https://dashboard.plaid.com/

However:
- ✅ The dashboard is easy to use
- ✅ Sandbox credentials are free
- ✅ Takes only 2 minutes to get them

## ❓ Do I Need to Pay for Plaid?

**NO! Plaid Sandbox is 100% FREE!**

- ✅ **Sandbox** = FREE (for development/testing)
- ✅ **Development** = FREE (for development/testing)
- ❌ **Production** = PAID (for real users - ignore this for now)

You only need Sandbox, which is completely free.

## ❓ What If I See Payment Prompts?

**Ignore them!** Payment prompts are for:
- Production access (you don't need this)
- Enterprise features (you don't need this)

Just look for the **Sandbox** or **Development** section - that's free.

## ❓ How Do I Get Credentials Without Paying?

1. Sign up at https://dashboard.plaid.com/signup (free)
2. Go to **Team Settings** → **Keys**
3. Find **Sandbox** section
4. Copy Client ID and Secret
5. That's it! No payment needed.

## ❓ Can I Use Plaid Without the Dashboard?

**For getting credentials: No** - You must use the web dashboard.

**For using Plaid in your app: Yes** - Once you have credentials, everything is done via API (which our code handles).

## ❓ What's the Difference Between Sandbox and Production?

| Feature | Sandbox (FREE) | Production (PAID) |
|---------|---------------|-------------------|
| Cost | Free | Paid |
| Real Banks | No (test banks) | Yes (real banks) |
| Real Money | No | Yes |
| For Development | ✅ Perfect | ❌ Not needed |
| For Testing | ✅ Perfect | ❌ Not needed |

**You only need Sandbox for now!**

## ❓ I Can't Find Sandbox Credentials

Try these:
1. Look for "Development" instead of "Sandbox" (also free)
2. Check if there's an "Environments" dropdown
3. Contact Plaid support (they're helpful and free)
4. Make sure you're logged in to the dashboard

## ✅ Quick Answer

- **CLI?** No, use web dashboard
- **Payment?** No, Sandbox is free
- **How?** Dashboard → Team Settings → Keys → Sandbox
- **Time?** 2 minutes

That's it! 🎉

