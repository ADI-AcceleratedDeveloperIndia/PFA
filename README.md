# PFA - Personal Finance Agent

A real, working fintech web application that connects to US bank accounts via Plaid Sandbox, analyzes spending patterns, learns merchant behavior, and provides intelligent credit card recommendations.

## Features

- 🔐 **Secure Authentication** - Email-based login with JWT sessions
- 🏦 **Plaid Integration** - Full Plaid Sandbox integration for bank account connections
- 📊 **Transaction Intelligence** - Automatic categorization, income detection, recurring expense identification
- 🧠 **Merchant Learning** - AI-powered merchant recognition with confidence scoring
- 💳 **Credit Card Recommendations** - Personalized recommendations based on spending patterns
- 📱 **Mobile-First Design** - Optimized for one-hand mobile usage
- 🔒 **Security-First** - Encrypted token storage, server-side Plaid calls only

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Banking API**: Plaid Sandbox
- **Security**: JWT, bcrypt, AES-256-GCM encryption

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Plaid Sandbox account ([sign up here](https://dashboard.plaid.com/signup))

## Setup Instructions

### 1. Clone and Install

```bash
cd PFA
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/pfa
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pfa

# Plaid Sandbox Credentials (get from https://dashboard.plaid.com)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret_key

# Encryption key for Plaid access tokens (32 bytes hex)
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=your_32_byte_hex_encryption_key

# Google Places API (optional, for merchant location)
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Generate Encryption Key

Generate a secure 32-byte hex key for encrypting Plaid access tokens:

```bash
openssl rand -hex 32
```

Copy the output to `ENCRYPTION_KEY` in your `.env` file.

### 4. Start MongoDB

If using local MongoDB:

```bash
mongod
```

Or use MongoDB Atlas (cloud) - no local setup needed.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Register/Login

- Create an account with email and password (min 8 characters)
- Or login if you already have an account

### 2. Connect Bank Account

- Click "Connect" in the navigation
- Click "Connect Bank Account"
- You'll be redirected to Plaid Link
- In Sandbox mode, use test credentials:
  - **Institution**: Search for "First Platypus Bank" or any test bank
  - **Username**: `user_good`
  - **Password**: `pass_good`

### 3. View Dashboard

- See total balance across all accounts
- Monthly income and expenses
- Top spending categories
- Recurring expenses
- Predicted upcoming spending

### 4. View Transactions

- Browse all transactions
- Filter by category, date, pending status
- See merchant names and categories

### 5. Get Recommendations

- View personalized credit card recommendations
- Based on your actual spending patterns
- See rewards rates and sign-up bonuses

## Architecture

### Database Models

- **User**: Email, hashed password
- **PlaidItem**: Encrypted access tokens, institution info
- **Transaction**: Full transaction data from Plaid
- **Merchant**: Learned merchant names with confidence scores

### Security Features

- **Token Encryption**: Plaid access tokens encrypted at rest using AES-256-GCM
- **Password Hashing**: bcrypt with salt rounds
- **JWT Sessions**: Secure, httpOnly cookies
- **Server-Side Only**: All Plaid API calls on server, never expose secrets
- **No Credential Storage**: User credentials never stored

### Intelligence Engine

- **Income Detection**: Identifies salary patterns (weekly/biweekly/monthly)
- **Spending Analysis**: Category-wise monthly averages
- **Recurring Expenses**: Detects subscriptions and fixed expenses
- **Merchant Learning**: Confidence-based merchant recognition
- **Spending Predictions**: Forecasts likely upcoming expenses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Plaid
- `POST /api/plaid/create-link-token` - Create Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token for access token
- `POST /api/plaid/webhook` - Handle Plaid webhooks

### Data
- `GET /api/dashboard` - Dashboard analytics
- `GET /api/transactions` - List transactions
- `GET /api/merchants` - List merchants
- `POST /api/merchants/confirm` - Confirm merchant name
- `GET /api/recommendations` - Credit card recommendations

## Plaid Sandbox Testing

Plaid Sandbox provides test banks and transactions. Use these test credentials:

- **Username**: `user_good`
- **Password**: `pass_good`
- **Institution**: Search for test banks like "First Platypus Bank"

Test transactions will appear automatically. You can also trigger specific scenarios using Plaid's test mode.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use MongoDB Atlas (not local)
- Use production Plaid credentials (when ready)
- Ensure `NEXT_PUBLIC_APP_URL` matches your domain

## Security Notes

- **Never commit `.env` file** - Already in `.gitignore`
- **Rotate encryption keys** if compromised
- **Use HTTPS** in production
- **Monitor Plaid webhooks** for security events
- **Regular security audits** recommended

## Limitations (Sandbox Mode)

- Uses Plaid Sandbox (not real banks)
- Test data only
- Limited transaction history
- Some features may behave differently than production

## Future Enhancements

- Real-time transaction notifications
- Budget tracking and alerts
- Investment account support
- Bill reminders
- Spending insights with AI explanations
- Export to CSV/PDF

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network access for Atlas

### Plaid Link Not Opening
- Check `PLAID_CLIENT_ID` and `PLAID_SECRET`
- Verify `PLAID_ENV=sandbox`
- Check browser console for errors

### Transactions Not Appearing
- Wait a few seconds after connecting
- Check Plaid webhook logs
- Verify MongoDB connection

## License

This is a demo/prototype application. Use at your own risk.

## Support

For Plaid-specific issues, consult [Plaid Documentation](https://plaid.com/docs/).

---

Built with security and user privacy as top priorities. 🔒

