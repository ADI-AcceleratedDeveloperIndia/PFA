import mongoose, { Schema, Document } from 'mongoose';

export interface IPlaidItem extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: string; // Plaid item_id
  accessToken: string; // Encrypted
  institutionId: string;
  institutionName: string;
  webhookUrl?: string;
  lastSuccessfulUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PlaidItemSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      required: true, // Stored encrypted
    },
    institutionId: {
      type: String,
      required: true,
    },
    institutionName: {
      type: String,
      required: true,
    },
    webhookUrl: {
      type: String,
    },
    lastSuccessfulUpdate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PlaidItem || mongoose.model<IPlaidItem>('PlaidItem', PlaidItemSchema);

