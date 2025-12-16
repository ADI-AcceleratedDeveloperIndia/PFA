import Merchant, { IMerchant } from '@/models/Merchant';
import Transaction, { ITransaction } from '@/models/Transaction';
import { Types } from 'mongoose';

/**
 * Find or create merchant with confidence scoring
 */
export async function learnMerchant(
  userId: string,
  rawMerchantName: string,
  category: string,
  location?: { lat?: number; lon?: number; city?: string }
): Promise<IMerchant> {
  if (!rawMerchantName || rawMerchantName.trim().length === 0) {
    throw new Error('Merchant name is required');
  }
  
  const normalizedName = rawMerchantName.trim().toLowerCase();
  
  // Try to find existing merchant by exact match or similar name
  let merchant = await Merchant.findOne({
    userId: new Types.ObjectId(userId),
    $or: [
      { canonicalName: { $regex: new RegExp(normalizedName, 'i') } },
      { rawNames: { $regex: new RegExp(normalizedName, 'i') } },
    ],
  });
  
  if (merchant) {
    // Update existing merchant
    if (!merchant.rawNames.includes(rawMerchantName)) {
      merchant.rawNames.push(rawMerchantName);
    }
    merchant.transactionCount += 1;
    merchant.lastSeen = new Date();
    
    // Increase confidence with more transactions
    if (merchant.transactionCount >= 3) {
      merchant.confidence = Math.min(0.9, merchant.confidence + 0.1);
    }
    
    // Update location if provided and not set
    if (location && !merchant.location?.lat) {
      merchant.location = {
        city: location.city,
        lat: location.lat,
        lon: location.lon,
      };
    }
    
    await merchant.save();
    return merchant;
  }
  
  // Create new merchant with low initial confidence
  merchant = await Merchant.create({
    userId: new Types.ObjectId(userId),
    canonicalName: rawMerchantName,
    rawNames: [rawMerchantName],
    category,
    confidence: 0.3, // Low confidence for new merchants
    userConfirmed: false,
    location: location ? {
      city: location.city,
      lat: location.lat,
      lon: location.lon,
    } : undefined,
    transactionCount: 1,
    lastSeen: new Date(),
  });
  
  return merchant;
}

/**
 * Confirm merchant name (user action)
 */
export async function confirmMerchant(
  userId: string,
  merchantId: string,
  confirmedName: string
): Promise<IMerchant> {
  const merchant = await Merchant.findOne({
    _id: new Types.ObjectId(merchantId),
    userId: new Types.ObjectId(userId),
  });
  
  if (!merchant) {
    throw new Error('Merchant not found');
  }
  
  merchant.canonicalName = confirmedName;
  merchant.userConfirmed = true;
  merchant.confidence = 1.0; // User confirmation = 100% confidence
  
  if (!merchant.rawNames.includes(confirmedName)) {
    merchant.rawNames.push(confirmedName);
  }
  
  await merchant.save();
  
  // Update all transactions with this merchant
  await Transaction.updateMany(
    {
      userId: new Types.ObjectId(userId),
      merchantName: { $in: merchant.rawNames },
    },
    {
      merchantId: merchant._id,
    }
  );
  
  return merchant;
}

/**
 * Get merchants that need user confirmation (low confidence, multiple transactions)
 */
export async function getMerchantsNeedingConfirmation(
  userId: string
): Promise<IMerchant[]> {
  return Merchant.find({
    userId: new Types.ObjectId(userId),
    userConfirmed: false,
    transactionCount: { $gte: 2 }, // At least 2 transactions
    confidence: { $lt: 0.7 }, // Low confidence
  }).sort({ transactionCount: -1, lastSeen: -1 }).limit(10);
}

/**
 * Match transaction to existing merchant
 */
export async function matchTransactionToMerchant(
  userId: string,
  transaction: ITransaction
): Promise<string | null> {
  if (!transaction.merchantName) return null;
  
  const merchant = await Merchant.findOne({
    userId: new Types.ObjectId(userId),
    $or: [
      { canonicalName: { $regex: new RegExp(transaction.merchantName, 'i') } },
      { rawNames: { $regex: new RegExp(transaction.merchantName, 'i') } },
    ],
    confidence: { $gte: 0.7 }, // Only match high-confidence merchants
  });
  
  if (merchant) {
    return merchant._id.toString();
  }
  
  return null;
}

