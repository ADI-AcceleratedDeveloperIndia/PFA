import Transaction, { ITransaction } from '@/models/Transaction';
import Merchant, { IMerchant } from '@/models/Merchant';
import { Types } from 'mongoose';

export interface SpendingPattern {
  category: string;
  monthlyAverage: number;
  transactionCount: number;
  lastTransaction?: Date;
}

export interface IncomePattern {
  monthlyAverage: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'irregular';
  lastIncome?: Date;
  nextExpected?: Date;
}

export interface RecurringExpense {
  merchantName: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  confidence: number;
  lastSeen: Date;
  nextExpected?: Date;
}

/**
 * Detect income patterns from transactions
 */
export async function detectIncomePatterns(
  userId: string,
  months: number = 6
): Promise<IncomePattern> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const transactions = await Transaction.find({
    userId: new Types.ObjectId(userId),
    amount: { $gt: 0 }, // Positive amounts are income
    pending: false,
    date: { $gte: startDate },
  }).sort({ date: -1 });
  
  if (transactions.length === 0) {
    return {
      monthlyAverage: 0,
      frequency: 'irregular',
    };
  }
  
  // Group by month
  const monthlyTotals: Record<string, number> = {};
  transactions.forEach((tx) => {
    const monthKey = `${tx.date.getFullYear()}-${tx.date.getMonth()}`;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + tx.amount;
  });
  
  const monthlyValues = Object.values(monthlyTotals);
  const monthlyAverage = monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length;
  
  // Detect frequency
  const dates = transactions.map((tx) => tx.date.getTime()).sort((a, b) => a - b);
  const intervals: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    intervals.push(dates[i] - dates[i - 1]);
  }
  
  const avgInterval = intervals.length > 0
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : 0;
  
  let frequency: 'weekly' | 'biweekly' | 'monthly' | 'irregular' = 'irregular';
  const days = avgInterval / (1000 * 60 * 60 * 24);
  
  if (days >= 25 && days <= 35) {
    frequency = 'monthly';
  } else if (days >= 12 && days <= 18) {
    frequency = 'biweekly';
  } else if (days >= 5 && days <= 9) {
    frequency = 'weekly';
  }
  
  const lastIncome = transactions[0]?.date;
  let nextExpected: Date | undefined;
  if (frequency !== 'irregular' && lastIncome) {
    nextExpected = new Date(lastIncome);
    if (frequency === 'monthly') {
      nextExpected.setMonth(nextExpected.getMonth() + 1);
    } else if (frequency === 'biweekly') {
      nextExpected.setDate(nextExpected.getDate() + 14);
    } else if (frequency === 'weekly') {
      nextExpected.setDate(nextExpected.getDate() + 7);
    }
  }
  
  return {
    monthlyAverage,
    frequency,
    lastIncome,
    nextExpected,
  };
}

/**
 * Analyze spending by category
 */
export async function analyzeSpendingByCategory(
  userId: string,
  months: number = 3
): Promise<SpendingPattern[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const transactions = await Transaction.find({
    userId: new Types.ObjectId(userId),
    amount: { $lt: 0 }, // Negative amounts are expenses
    pending: false,
    date: { $gte: startDate },
  });
  
  const categoryMap: Record<string, { total: number; count: number; lastTx?: Date }> = {};
  
  transactions.forEach((tx) => {
    const category = tx.primaryCategory || 'other';
    if (!categoryMap[category]) {
      categoryMap[category] = { total: 0, count: 0 };
    }
    categoryMap[category].total += Math.abs(tx.amount);
    categoryMap[category].count += 1;
    if (!categoryMap[category].lastTx || tx.date > categoryMap[category].lastTx!) {
      categoryMap[category].lastTx = tx.date;
    }
  });
  
  const patterns: SpendingPattern[] = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    monthlyAverage: data.total / months,
    transactionCount: data.count,
    lastTransaction: data.lastTx,
  }));
  
  return patterns.sort((a, b) => b.monthlyAverage - a.monthlyAverage);
}

/**
 * Detect recurring expenses
 */
export async function detectRecurringExpenses(
  userId: string,
  months: number = 6
): Promise<RecurringExpense[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const transactions = await Transaction.find({
    userId: new Types.ObjectId(userId),
    amount: { $lt: 0 },
    pending: false,
    date: { $gte: startDate },
    merchantName: { $exists: true, $ne: null },
  }).sort({ date: -1 });
  
  // Group by merchant
  const merchantMap: Record<string, ITransaction[]> = {};
  transactions.forEach((tx) => {
    if (tx.merchantName) {
      if (!merchantMap[tx.merchantName]) {
        merchantMap[tx.merchantName] = [];
      }
      merchantMap[tx.merchantName].push(tx);
    }
  });
  
  const recurring: RecurringExpense[] = [];
  
  for (const [merchantName, txs] of Object.entries(merchantMap)) {
    if (txs.length < 2) continue; // Need at least 2 transactions
    
    // Check if amounts are similar (within 10% variance)
    const amounts = txs.map((tx) => Math.abs(tx.amount));
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.every((amt) => Math.abs(amt - avgAmount) / avgAmount < 0.1);
    
    if (!variance) continue;
    
    // Calculate frequency
    const dates = txs.map((tx) => tx.date.getTime()).sort((a, b) => a - b);
    const intervals: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push(dates[i] - dates[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const days = avgInterval / (1000 * 60 * 60 * 24);
    
    let frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'monthly';
    if (days >= 25 && days <= 35) {
      frequency = 'monthly';
    } else if (days >= 85 && days <= 95) {
      frequency = 'quarterly';
    } else if (days >= 350 && days <= 380) {
      frequency = 'yearly';
    } else if (days >= 5 && days <= 9) {
      frequency = 'weekly';
    }
    
    const confidence = Math.min(txs.length / 6, 1); // More transactions = higher confidence
    
    const lastSeen = txs[0].date;
    let nextExpected: Date | undefined;
    if (lastSeen) {
      nextExpected = new Date(lastSeen);
      if (frequency === 'monthly') {
        nextExpected.setMonth(nextExpected.getMonth() + 1);
      } else if (frequency === 'quarterly') {
        nextExpected.setMonth(nextExpected.getMonth() + 3);
      } else if (frequency === 'yearly') {
        nextExpected.setFullYear(nextExpected.getFullYear() + 1);
      } else if (frequency === 'weekly') {
        nextExpected.setDate(nextExpected.getDate() + 7);
      }
    }
    
    recurring.push({
      merchantName,
      amount: avgAmount,
      frequency,
      confidence,
      lastSeen,
      nextExpected,
    });
  }
  
  return recurring.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Predict next likely spend categories based on patterns
 */
export async function predictNextSpends(
  userId: string
): Promise<{ category: string; probability: number; expectedAmount?: number }[]> {
  const patterns = await analyzeSpendingByCategory(userId, 3);
  const recurring = await detectRecurringExpenses(userId, 6);
  
  const predictions: Record<string, { probability: number; amount?: number }> = {};
  
  // High probability for recurring expenses due soon
  const now = new Date();
  recurring.forEach((exp) => {
    if (exp.nextExpected && exp.nextExpected > now) {
      const daysUntil = (exp.nextExpected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (daysUntil <= 7) {
        // Find category for this merchant
        const tx = await Transaction.findOne({
          userId: new Types.ObjectId(userId),
          merchantName: exp.merchantName,
        });
        const category = tx?.primaryCategory || 'other';
        predictions[category] = {
          probability: 0.9,
          amount: exp.amount,
        };
      }
    }
  });
  
  // Medium probability for frequent categories
  patterns.slice(0, 5).forEach((pattern) => {
    if (!predictions[pattern.category]) {
      const daysSinceLast = pattern.lastTransaction
        ? (now.getTime() - pattern.lastTransaction.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      
      // Higher probability if it's been a while since last transaction
      const probability = daysSinceLast < 30 ? 0.6 : 0.4;
      predictions[pattern.category] = {
        probability,
        amount: pattern.monthlyAverage / 30, // Daily average
      };
    }
  });
  
  return Object.entries(predictions)
    .map(([category, data]) => ({
      category,
      probability: data.probability,
      expectedAmount: data.amount,
    }))
    .sort((a, b) => b.probability - a.probability);
}

