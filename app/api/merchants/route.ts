import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Merchant from '@/models/Merchant';
import { getUserIdFromRequest } from '@/lib/auth';
import { Types } from 'mongoose';

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
    
    const { searchParams } = new URL(request.url);
    const needsConfirmation = searchParams.get('needsConfirmation') === 'true';
    
    let query: any = {
      userId: new Types.ObjectId(userId),
    };
    
    if (needsConfirmation) {
      query.userConfirmed = false;
      query.transactionCount = { $gte: 2 };
      query.confidence = { $lt: 0.7 };
    }
    
    const merchants = await Merchant.find(query)
      .sort(needsConfirmation ? { transactionCount: -1, lastSeen: -1 } : { lastSeen: -1 })
      .limit(needsConfirmation ? 10 : 100)
      .lean();
    
    return NextResponse.json({ merchants });
  } catch (error) {
    console.error('Merchants fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}

