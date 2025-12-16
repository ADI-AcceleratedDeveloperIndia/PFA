# Quick Start Guide

Get PFA running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Generate encryption keys:
```bash
node scripts/generate-keys.js
```

3. Copy the output to your `.env` file.

4. Get Plaid Sandbox credentials:
   - Go to https://dashboard.plaid.com/signup
   - Create a free account
   - Go to Team Settings > Keys
   - Copy `Client ID` and `Secret` (Sandbox)
   - Add to `.env`:
     ```
     PLAID_CLIENT_ID=your_client_id
     PLAID_SECRET=your_secret
     PLAID_ENV=sandbox
     ```

5. Set up MongoDB:
   - **Option A**: Local MongoDB
     ```bash
     # Install MongoDB, then:
     mongod
     ```
     In `.env`: `MONGODB_URI=mongodb://localhost:27017/pfa`
   
   - **Option B**: MongoDB Atlas (Free)
     - Go to https://www.mongodb.com/cloud/atlas
     - Create free cluster
     - Get connection string
     - In `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pfa`

6. Set app URL:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 3: Run the App

```bash
npm run dev
```

Open http://localhost:3000

## Step 4: Test the App

1. **Register**: Create an account with any email/password (min 8 chars)

2. **Connect Bank**:
   - Click "Connect" in nav
   - Click "Connect Bank Account"
   - In Plaid Link:
     - Search for "First Platypus Bank" (or any test bank)
     - Username: `user_good`
     - Password: `pass_good`
   - Select accounts and continue

3. **View Dashboard**: See your balance, transactions, and insights!

4. **Check Recommendations**: See personalized credit card suggestions

## Troubleshooting

**"ENCRYPTION_KEY must be exactly 64 hex characters"**
- Run `node scripts/generate-keys.js` and copy the ENCRYPTION_KEY value

**"MongoDB connection error"**
- Ensure MongoDB is running (local) or check Atlas connection string

**"Plaid Link not opening"**
- Verify PLAID_CLIENT_ID and PLAID_SECRET in `.env`
- Check browser console for errors

**"No transactions showing"**
- Wait 10-30 seconds after connecting
- Transactions import in the background
- Check MongoDB for Transaction documents

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the codebase structure
- Customize credit card recommendations in `lib/creditCards.ts`
- Add your own intelligence rules in `lib/intelligence.ts`

Happy building! 🚀

