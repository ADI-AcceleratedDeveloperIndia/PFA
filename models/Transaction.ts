import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  plaidItemId: mongoose.Types.ObjectId;
  plaidTransactionId: string;
  accountId: string;
  accountName: string;
  accountType: 'depository' | 'credit' | 'loan' | 'investment' | 'other';
  amount: number; // Positive for income, negative for expenses
  date: Date;
  authorizedDate?: Date;
  merchantName?: string;
  merchantId?: mongoose.Types.ObjectId; // Reference to learned merchant
  category: string[];
  primaryCategory: string;
  personalFinanceCategory?: {
    primary: string;
    detailed: string;
  };
  pending: boolean;
  isoCurrencyCode?: string;
  location?: {
    address?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    lat?: number;
    lon?: number;
  };
  paymentMeta?: {
    referenceNumber?: string;
    ppdId?: string;
    payee?: string;
    payer?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plaidItemId: {
      type: Schema.Types.ObjectId,
      ref: 'PlaidItem',
      required: true,
      index: true,
    },
    plaidTransactionId: {
      type: String,
      required: true,
      unique: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ['depository', 'credit', 'loan', 'investment', 'other'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    authorizedDate: {
      type: Date,
    },
    merchantName: {
      type: String,
      index: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
    },
    category: {
      type: [String],
      default: [],
    },
    primaryCategory: {
      type: String,
      required: true,
    },
    personalFinanceCategory: {
      primary: String,
      detailed: String,
    },
    pending: {
      type: Boolean,
      default: false,
      index: true,
    },
    isoCurrencyCode: {
      type: String,
      default: 'USD',
    },
    location: {
      address: String,
      city: String,
      region: String,
      postalCode: String,
      country: String,
      lat: Number,
      lon: Number,
    },
    paymentMeta: {
      referenceNumber: String,
      ppdId: String,
      payee: String,
      payer: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, merchantName: 1 });
TransactionSchema.index({ userId: 1, primaryCategory: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

