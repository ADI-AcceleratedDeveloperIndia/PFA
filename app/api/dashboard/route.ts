import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import PlaidItem from '@/models/PlaidItem';
import { getUserIdFromRequest } from '@/lib/auth';
import { detectIncomePatterns, analyzeSpendingByCategory, detectRecurringExpenses, predictNextSpends } from '@/lib/intelligence';
import { Types } from 'mongoose';
import { plaidClient } from '@/lib/plaid';
import { decrypt } from '@/lib/encryption';

// Mark as dynamic since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Calculate total balance from accounts
    const plaidItems = await PlaidItem.find({
      userId: new Types.ObjectId(userId),
    });
    
    let totalBalance = 0;
    const accounts: any[] = [];
    
    for (const item of plaidItems) {
      try {
        const accessToken = decrypt(item.accessToken);
        const accountsResponse = await plaidClient.accountsGet({
          access_token: accessToken,
        });
        
        for (const account of accountsResponse.data.accounts) {
          if (account.balances?.available !== null) {
            totalBalance += account.balances.available || 0;
            accounts.push({
              accountId: account.account_id,
              name: account.name,
              type: account.type,
              balance: account.balances.available || 0,
              institution: item.institutionName,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching account balance:', error);
      }
    }
    
    // Calculate monthly income
    const incomeTransactions = await Transaction.find({
      userId: new Types.ObjectId(userId),
      amount: { $gt: 0 },
      pending: false,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });
    
    const monthlyIncome = incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate monthly expenses
    const expenseTransactions = await Transaction.find({
      userId: new Types.ObjectId(userId),
      amount: { $lt: 0 },
      pending: false,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });
    
    const monthlyExpenses = Math.abs(
      expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    );
    
    // Get spending patterns
    const spendingPatterns = await analyzeSpendingByCategory(userId, 3);
    
    // Get income patterns
    const incomePattern = await detectIncomePatterns(userId, 6);
    
    // Get recurring expenses
    const recurringExpenses = await detectRecurringExpenses(userId, 6);
    
    // Get predictions
    const predictions = await predictNextSpends(userId);
    
    return NextResponse.json({
      balance: {
        total: totalBalance,
        accounts,
      },
      monthly: {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        net: monthlyIncome - monthlyExpenses,
      },
      patterns: {
        income: incomePattern,
        spending: spendingPatterns,
        recurring: recurringExpenses,
      },
      predictions,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

