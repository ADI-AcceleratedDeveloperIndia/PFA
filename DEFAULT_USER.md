# Default User Credentials

## 🔐 Default Login

**Email:** `demo@pfa.com`  
**Password:** `9FAdem@`

✅ **Default user has been created in your MongoDB database!**

## 📝 Default User Already Created!

The default user has been created in your MongoDB database. You can login immediately!

### If You Need to Recreate (Vercel)

If the user doesn't exist on Vercel, you can call this API endpoint:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/seed-user
```

Or visit in browser:
```
https://your-vercel-app.vercel.app/api/seed-user
```

This will create the default user if it doesn't exist.

## 🚀 Quick Start

1. **Run the seed script:**
   ```bash
   npm run seed
   ```

2. **Login with:**
   - Email: `demo@pfa.com`
   - Password: `9FAdem@`

3. **You're in!** 🎉

## ⚠️ About OAuth

**You don't need Google OAuth!** The app uses simple email/password authentication. No OAuth setup required.

## 🔧 If Seed Script Fails

If the seed script fails, it's likely the same MongoDB connection issue. Check:
- MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- MONGODB_URI is correct
- Database user credentials are correct

---

**Default credentials are ready to use once you run the seed script!** 🚀

