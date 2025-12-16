# Architecture Documentation

## System Overview

PFA is a full-stack fintech application built with Next.js 14 (App Router), TypeScript, MongoDB, and Plaid Sandbox. It follows security-first principles with encrypted token storage, server-side API calls, and minimal data retention.

## Architecture Decisions

### Why Next.js App Router?
- **Server Components**: Better performance and SEO
- **API Routes**: Built-in backend without separate server
- **Type Safety**: Full TypeScript support
- **Deployment**: Easy Vercel deployment

### Why MongoDB?
- **Flexible Schema**: Easy to evolve transaction and merchant schemas
- **Document Model**: Natural fit for nested transaction data
- **Atlas Integration**: Easy cloud deployment
- **Mongoose**: Type-safe models with validation

### Why Plaid Sandbox?
- **Real API**: Same integration as production
- **Test Data**: Safe testing without real accounts
- **Webhooks**: Full webhook support for transaction updates
- **Compliance**: Handles OAuth, security, and compliance

## Security Architecture

### Encryption
- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key Management**: 32-byte hex key from environment variable
- **Storage**: Encrypted Plaid access tokens at rest
- **IV**: Random IV per encryption (stored with ciphertext)

### Authentication
- **Method**: JWT tokens in httpOnly cookies
- **Password**: bcrypt with salt rounds
- **Sessions**: 7-day expiration
- **Validation**: Zod schemas for input validation

### API Security
- **Server-Side Only**: All Plaid calls on server
- **No Credential Storage**: User credentials never stored
- **Token-Based**: Plaid access tokens only
- **Webhook Verification**: Plaid webhook signature verification (can be added)

## Data Flow

### Bank Connection Flow
```
1. User clicks "Connect Bank"
2. Frontend requests link token from /api/plaid/create-link-token
3. Plaid Link opens with token
4. User selects bank and authenticates
5. Plaid returns public_token
6. Frontend sends public_token to /api/plaid/exchange-token
7. Server exchanges for access_token
8. Server encrypts and stores access_token
9. Server fetches accounts and transactions
10. Server stores transactions in MongoDB
11. Merchant learning runs automatically
```

### Transaction Sync Flow
```
1. Plaid sends webhook to /api/plaid/webhook
2. Server decrypts access_token
3. Server calls transactionsSync API
4. Server processes new/updated transactions
5. Server learns merchants automatically
6. Server updates lastSuccessfulUpdate timestamp
```

### Intelligence Engine Flow
```
1. User views dashboard
2. Frontend requests /api/dashboard
3. Server queries transactions
4. Intelligence engine analyzes:
   - Income patterns (frequency, amount)
   - Spending by category
   - Recurring expenses
   - Predictions
5. Server returns aggregated data
6. Frontend displays insights
```

## Database Schema

### User
```typescript
{
  email: string (unique, indexed)
  password: string (hashed, not selected by default)
  createdAt: Date
  updatedAt: Date
}
```

### PlaidItem
```typescript
{
  userId: ObjectId (indexed)
  itemId: string (unique, from Plaid)
  accessToken: string (encrypted)
  institutionId: string
  institutionName: string
  lastSuccessfulUpdate: Date
  createdAt: Date
  updatedAt: Date
}
```

### Transaction
```typescript
{
  userId: ObjectId (indexed)
  plaidItemId: ObjectId (indexed)
  plaidTransactionId: string (unique)
  accountId: string
  accountName: string
  accountType: 'depository' | 'credit' | 'loan' | 'investment' | 'other'
  amount: number (positive = income, negative = expense)
  date: Date (indexed)
  merchantName: string (indexed)
  merchantId: ObjectId (reference to Merchant)
  category: string[]
  primaryCategory: string (indexed)
  personalFinanceCategory: { primary, detailed }
  pending: boolean (indexed)
  location: { address, city, region, lat, lon, ... }
  paymentMeta: { referenceNumber, payee, payer, ... }
  createdAt: Date
  updatedAt: Date
}
```

### Merchant
```typescript
{
  userId: ObjectId (indexed)
  canonicalName: string (indexed, user-confirmed)
  rawNames: string[] (all variations seen)
  category: string
  confidence: number (0-1)
  userConfirmed: boolean
  location: { city, region, lat, lon }
  transactionCount: number
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}
```

## Intelligence Engine

### Income Detection
- Analyzes positive transactions
- Groups by month
- Calculates frequency (weekly/biweekly/monthly)
- Predicts next income date

### Spending Analysis
- Groups expenses by category
- Calculates monthly averages
- Tracks transaction counts
- Identifies trends

### Recurring Expense Detection
- Groups by merchant name
- Checks amount consistency (within 10%)
- Calculates frequency from intervals
- Builds confidence from transaction count

### Merchant Learning
- Starts with low confidence (0.3)
- Increases with more transactions
- User confirmation sets to 1.0
- Matches similar names (fuzzy matching can be added)

### Spending Predictions
- High probability for recurring expenses due soon
- Medium probability for frequent categories
- Based on historical patterns
- No ML, rules-based only

## Credit Card Recommendations

### Static Dataset
- 6 popular US credit cards
- Rewards rates by category
- Annual fees
- Sign-up bonuses
- Caps and exclusions

### Recommendation Logic
- Maps Plaid categories to reward categories
- Calculates annual rewards per card
- Subtracts annual fees
- Recommends highest net reward
- Explains reasoning

## Frontend Architecture

### Pages
- `/` - Home (redirects to dashboard or login)
- `/login` - Authentication
- `/dashboard` - Main dashboard with insights
- `/transactions` - Transaction list
- `/recommendations` - Credit card recommendations
- `/connect` - Bank connection flow

### Components
- `NavBar` - Navigation with mobile menu
- `PlaidLinkButton` - Plaid Link integration

### State Management
- Client-side React state
- No global state management (can add Zustand/Redux if needed)
- API calls via fetch

### Styling
- Tailwind CSS
- Mobile-first design
- Touch-friendly (44px min tap targets)
- Responsive breakpoints

## API Routes

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user

### Plaid
- `POST /api/plaid/create-link-token` - Get Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token
- `POST /api/plaid/webhook` - Handle Plaid webhooks

### Data
- `GET /api/dashboard` - Dashboard analytics
- `GET /api/transactions` - List transactions (paginated)
- `GET /api/merchants` - List merchants
- `POST /api/merchants/confirm` - Confirm merchant name
- `GET /api/recommendations` - Credit card recommendations

## Error Handling

### Client-Side
- Try-catch blocks around API calls
- User-friendly error messages
- Loading states
- Retry mechanisms

### Server-Side
- Zod validation for inputs
- Try-catch in all routes
- Proper HTTP status codes
- Error logging (console for now, can add Sentry)

## Performance Considerations

### Database
- Indexes on frequently queried fields
- Compound indexes for common queries
- Pagination for large result sets

### API
- Connection pooling (Mongoose)
- Cached MongoDB connections
- Efficient queries with `.lean()` where appropriate

### Frontend
- Server Components where possible
- Client Components only when needed
- Lazy loading can be added
- Image optimization (Next.js built-in)

## Scalability

### Current Limitations
- Single MongoDB instance
- No caching layer
- No CDN
- No load balancing

### Future Improvements
- Redis for caching
- MongoDB replica set
- CDN for static assets
- Horizontal scaling with multiple instances
- Queue system for webhook processing

## Monitoring & Observability

### Current
- Console logging
- Error tracking in try-catch blocks

### Recommended Additions
- Sentry for error tracking
- Plaid webhook logging
- Database query monitoring
- API response time tracking
- User activity analytics

## Compliance & Privacy

### Data Privacy
- Minimal data retention
- Encrypted sensitive data
- No raw credential storage
- User can delete account (feature to add)

### Financial Regulations
- Read-only access (no payments)
- No money movement
- Sandbox mode only
- Clear user consent

### Security Best Practices
- HTTPS in production
- Secure cookies
- CORS configuration
- Rate limiting (can add)
- Input sanitization (Zod)

## Deployment

### Vercel (Recommended)
- Automatic deployments
- Environment variable management
- Built-in HTTPS
- Edge network

### Other Options
- AWS (ECS, Lambda)
- Google Cloud (Cloud Run)
- Azure (App Service)
- Self-hosted (Docker)

## Future Enhancements

### Features
- Real-time notifications
- Budget tracking
- Investment accounts
- Bill reminders
- Export functionality
- Multi-user support (families)

### Technical
- GraphQL API
- Real-time subscriptions (WebSockets)
- Advanced ML for predictions
- Merchant logo fetching
- Receipt scanning
- OCR integration

---

This architecture prioritizes security, user privacy, and maintainability while providing a solid foundation for future growth.

