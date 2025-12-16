import mongoose, { Schema, Document } from 'mongoose';

export interface IMerchant extends Document {
  userId: mongoose.Types.ObjectId;
  canonicalName: string; // User-confirmed or high-confidence name
  rawNames: string[]; // All variations seen
  category: string;
  confidence: number; // 0-1, based on frequency and user confirmation
  userConfirmed: boolean;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    lat?: number;
    lon?: number;
  };
  transactionCount: number;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MerchantSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    canonicalName: {
      type: String,
      required: true,
      index: true,
    },
    rawNames: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      default: 0.5,
      min: 0,
      max: 1,
    },
    userConfirmed: {
      type: Boolean,
      default: false,
    },
    location: {
      city: String,
      region: String,
      country: String,
      lat: Number,
      lon: Number,
    },
    transactionCount: {
      type: Number,
      default: 1,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for merchant lookup
MerchantSchema.index({ userId: 1, canonicalName: 1 });

export default mongoose.models.Merchant || mongoose.model<IMerchant>('Merchant', MerchantSchema);

