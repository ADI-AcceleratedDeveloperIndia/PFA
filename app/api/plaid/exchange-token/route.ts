import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { getUserIdFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import PlaidItem from '@/models/PlaidItem';
import { encrypt } from '@/lib/encryption';
import Transaction from '@/models/Transaction';
import { learnMerchant, matchTransactionToMerchant } from '@/lib/merchantLearning';
import { Types } from 'mongoose';
import { CountryCode } from 'plaid';

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
    
    const { public_token } = await request.json();
    if (!public_token) {
      return NextResponse.json(
        { error: 'Public token is required' },
        { status: 400 }
      );
    }
    
    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;
    
    // Get institution info
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });
    
    const institutionId = itemResponse.data.item.institution_id || '';
    
    let institutionName = 'Unknown Institution';
    if (institutionId) {
      try {
        const instResponse = await plaidClient.institutionsGetById({
          institution_id: institutionId,
          country_codes: [CountryCode.Us],
        });
        institutionName = instResponse.data.institution.name;
      } catch (error) {
        console.error('Failed to fetch institution name:', error);
      }
    }
    
    // Check if item already exists
    let plaidItem = await PlaidItem.findOne({ itemId });
    
    if (plaidItem) {
      // Update existing item
      plaidItem.accessToken = encrypt(accessToken);
      plaidItem.institutionName = institutionName;
      await plaidItem.save();
    } else {
      // Create new item
      plaidItem = await PlaidItem.create({
        userId: new Types.ObjectId(userId),
        itemId,
        accessToken: encrypt(accessToken),
        institutionId,
        institutionName,
      });
    }
    
    // Fetch and store accounts
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    
    // Fetch initial transactions (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
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
      }
    }
    
    // Update last successful update
    plaidItem.lastSuccessfulUpdate = new Date();
    await plaidItem.save();
    
    return NextResponse.json({
      success: true,
      itemId: plaidItem._id.toString(),
      institutionName,
      accountsCount: accountsResponse.data.accounts.length,
      transactionsImported: transactionCount,
    });
  } catch (error: any) {
    console.error('Plaid token exchange error:', error);
    return NextResponse.json(
      { error: 'Failed to exchange token', details: error.message },
      { status: 500 }
    );
  }
}

