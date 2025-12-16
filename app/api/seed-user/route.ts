import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Mark as dynamic
export const dynamic = 'force-dynamic';

// Simple endpoint to create default user (one-time use)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const DEFAULT_EMAIL = 'demo@pfa.com';
    const DEFAULT_PASSWORD = 'demo12345';

    // Check if user already exists
    const existingUser = await User.findOne({ email: DEFAULT_EMAIL });
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Default user already exists',
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
      });
    }

    // Create default user
    const user = await User.create({
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    });

    return NextResponse.json({
      success: true,
      message: 'Default user created successfully',
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    });
  } catch (error) {
    console.error('Seed user error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create default user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

