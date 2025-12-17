import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { getUserIdFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import PlaidItem from '@/models/PlaidItem';
import Transaction from '@/models/Transaction';
import { decrypt } from '@/lib/encryption';
import { learnMerchant, matchTransactionToMerchant } from '@/lib/merchantLearning';
import { Types } from 'mongoose';

// Mark as dynamic since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Get all Plaid items for this user
    const plaidItems = await PlaidItem.find({ userId: new Types.ObjectId(userId) });
    
    if (plaidItems.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No bank accounts connected',
        itemsSynced: 0,
        totalTransactions: 0,
      });
    }
    
    let totalTransactions = 0;
    const results: any[] = [];
    
    for (const plaidItem of plaidItems) {
      try {
        const accessToken = decrypt(plaidItem.accessToken);
        
        // Get accounts
        const accountsResponse = await plaidClient.accountsGet({
          access_token: accessToken,
        });
        
        // Sync transactions
        let cursor: string | undefined = undefined;
        let hasMore = true;
        let transactionCount = 0;
        
        while (hasMore && transactionCount < 500) {
          const transactionsResponse = await plaidClient.transactionsSync({
            access_token: accessToken,
            cursor: cursor,
            count: 500,
          });
          
          const transactions = transactionsResponse.data.added;
          cursor = transactionsResponse.data.next_cursor;
          hasMore = transactionsResponse.data.has_more;
          
          for (const tx of transactions) {
            // Skip if already exists
            const existing = await Transaction.findOne({
              plaidTransactionId: tx.transaction_id,
            });
            
            if (existing) continue;
            
            const account = accountsResponse.data.accounts.find(
              (acc) => acc.account_id === tx.account_id
            );
            
            const primaryCategory = tx.personal_finance_category?.primary || 
                                   tx.category?.[0] || 
                                   'other';
            
            // Create transaction
            const transaction = await Transaction.create({
              userId: new Types.ObjectId(userId),
              plaidItemId: plaidItem._id,
              plaidTransactionId: tx.transaction_id,
              accountId: tx.account_id,
              accountName: account?.name || 'Unknown Account',
              accountType: (account?.type as any) || 'other',
              amount: tx.amount,
              date: new Date(tx.date),
              authorizedDate: tx.authorized_date ? new Date(tx.authorized_date) : undefined,
              merchantName: tx.merchant_name || tx.name,
              category: tx.category || [],
              primaryCategory,
              personalFinanceCategory: tx.personal_finance_category ? {
                primary: tx.personal_finance_category.primary,
                detailed: tx.personal_finance_category.detailed,
              } : undefined,
              pending: tx.pending,
              isoCurrencyCode: tx.iso_currency_code || 'USD',
              location: tx.location ? {
                address: tx.location.address,
                city: tx.location.city,
                region: tx.location.region,
                postalCode: tx.location.postal_code,
                country: tx.location.country,
                lat: tx.location.lat,
                lon: tx.location.lon,
              } : undefined,
              paymentMeta: tx.payment_meta ? {
                referenceNumber: tx.payment_meta.reference_number,
                ppdId: tx.payment_meta.ppd_id,
                payee: tx.payment_meta.payee,
                payer: tx.payment_meta.payer,
              } : undefined,
            });
            
            // Try to match to existing merchant or learn new one
            if (transaction.merchantName && transaction.primaryCategory) {
              const merchantId = await matchTransactionToMerchant(
                userId,
                transaction
              );
              
              if (merchantId) {
                transaction.merchantId = new Types.ObjectId(merchantId);
                await transaction.save();
              } else {
                // Learn new merchant
                try {
                  const merchant = await learnMerchant(
                    userId,
                    transaction.merchantName,
                    transaction.primaryCategory,
                    transaction.location
                  );
                  transaction.merchantId = merchant._id;
                  await transaction.save();
                } catch (error) {
                  console.error('Merchant learning error:', error);
                }
              }
            }
            
            transactionCount++;
            totalTransactions++;
          }
        }
        
        // Update last successful update
        plaidItem.lastSuccessfulUpdate = new Date();
        await plaidItem.save();
        
        results.push({
          institution: plaidItem.institutionName,
          transactionsImported: transactionCount,
        });
      } catch (error: any) {
        console.error(`Error syncing ${plaidItem.institutionName}:`, error);
        results.push({
          institution: plaidItem.institutionName,
          error: error.message,
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Synced ${plaidItems.length} bank account(s)`,
      itemsSynced: plaidItems.length,
      totalTransactions,
      results,
    });
  } catch (error: any) {
    console.error('Sync transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to sync transactions', details: error.message },
      { status: 500 }
    );
  }
}

