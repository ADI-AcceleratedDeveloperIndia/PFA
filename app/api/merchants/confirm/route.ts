import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { confirmMerchant } from '@/lib/merchantLearning';
import { z } from 'zod';

const confirmSchema = z.object({
  merchantId: z.string(),
  confirmedName: z.string().min(1),
});

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
    
    const body = await request.json();
    const { merchantId, confirmedName } = confirmSchema.parse(body);
    
    const merchant = await confirmMerchant(userId, merchantId, confirmedName);
    
    return NextResponse.json({
      success: true,
      merchant: {
        id: merchant._id.toString(),
        canonicalName: merchant.canonicalName,
        confidence: merchant.confidence,
        userConfirmed: merchant.userConfirmed,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Merchant confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm merchant' },
      { status: 500 }
    );
  }
}

