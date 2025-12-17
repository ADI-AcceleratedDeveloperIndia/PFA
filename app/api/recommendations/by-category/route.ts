import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { getBestCardForCategory } from '@/lib/creditCards';

// Dynamic because we read cookies for auth
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';

    if (!category) {
      return NextResponse.json(
        { error: 'Missing category' },
        { status: 400 }
      );
    }

    const allowedCategories = new Map<string, string>([
      ['dining', 'dining'],
      ['grocery_stores', 'grocery_stores'],
      ['groceries', 'grocery_stores'],
      ['gas_stations', 'gas_stations'],
      ['gas', 'gas_stations'],
      ['online_shopping', 'online_shopping'],
      ['streaming', 'streaming'],
      ['transit', 'transit'],
      ['travel_general', 'travel_general'],
      ['travel', 'travel_general'],
    ]);

    const normalized = allowedCategories.get(category);

    if (!normalized) {
      return NextResponse.json(
        { error: 'Unsupported category for demo', category },
        { status: 400 }
      );
    }

    // Use a representative monthly spend for demo purposes
    const card = getBestCardForCategory(normalized, 500);

    if (!card) {
      return NextResponse.json(
        { error: 'No card found for this category' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category,
      card,
    });
  } catch (error) {
    console.error('Recommendations by-category error:', error);
    return NextResponse.json(
      { error: 'Failed to generate category recommendation' },
      { status: 500 }
    );
  }
}


