import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import connectDB from '@/lib/db';
import PlaidItem from '@/models/PlaidItem';
import Transaction from '@/models/Transaction';
import { decrypt } from '@/lib/encryption';
import { learnMerchant, matchTransactionToMerchant } from '@/lib/merchantLearning';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { webhook_type, webhook_code, item_id } = body;
    
    if (webhook_type === 'TRANSACTIONS' && webhook_code === 'SYNC_UPDATES_AVAILABLE') {
      // Fetch new transactions
      const plaidItem = await PlaidItem.findOne({ itemId: item_id });
      if (!plaidItem) {
        return NextResponse.json({ received: true });
      }
      
      const accessToken = decrypt(plaidItem.accessToken);
      const userId = plaidItem.userId.toString();
      
      // Get accounts
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      
      // Sync transactions
      let cursor = undefined;
      let hasMore = true;
      
      while (hasMore) {
        const transactionsResponse = await plaidClient.transactionsSync({
          access_token: accessToken,
          cursor: cursor,
          count: 500,
        });
        
        const added = transactionsResponse.data.added;
        cursor = transactionsResponse.data.next_cursor;
        hasMore = transactionsResponse.data.has_more;
        
        for (const tx of added) {
          // Skip if exists
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
          
          // Learn merchant
          if (transaction.merchantName && transaction.primaryCategory) {
            const merchantId = await matchTransactionToMerchant(
              userId,
              transaction
            );
            
            if (merchantId) {
              transaction.merchantId = new Types.ObjectId(merchantId);
              await transaction.save();
            } else {
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
        }
      }
      
      // Update last successful update
      plaidItem.lastSuccessfulUpdate = new Date();
      await plaidItem.save();
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: true }, { status: 200 }); // Always return 200 to Plaid
  }
}

