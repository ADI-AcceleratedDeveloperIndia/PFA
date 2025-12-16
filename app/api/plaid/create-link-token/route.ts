import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'PFA - Personal Finance Agent',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      webhook: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/webhook`
        : undefined,
    });
    
    return NextResponse.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error: any) {
    console.error('Plaid link token error:', error);
    return NextResponse.json(
      { error: 'Failed to create link token', details: error.message },
      { status: 500 }
    );
  }
}

