import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Mark as dynamic
export const dynamic = 'force-dynamic';

// Core logic shared by GET/POST so you can just open this URL in the browser.
async function seedDefaultUser() {
  await connectDB();

  const DEFAULT_EMAIL = 'demo@pfa.com';
  const DEFAULT_PASSWORD = '9FAdem@1';

    // Check if user already exists
    const existingUser = await User.findOne({ email: DEFAULT_EMAIL }).select('+password');
    if (existingUser) {
      // Always reset the default password for demo purposes
      // Force update by setting isNew to false and marking password as modified
      existingUser.isNew = false;
      existingUser.password = DEFAULT_PASSWORD;
      existingUser.markModified('password'); // Ensure password is marked as modified
      
      // Force save with validation
      await existingUser.save({ validateBeforeSave: true });

      // Verify the password was actually updated by comparing
      const verifyUser = await User.findOne({ email: DEFAULT_EMAIL }).select('+password');
      const testMatch = await verifyUser?.comparePassword(DEFAULT_PASSWORD);
      
      return NextResponse.json({
        success: true,
        message: 'Default user password reset',
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
        verified: testMatch || false,
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
}

// Support both POST (API tools, curl) and GET (opening in browser)
export async function POST(request: NextRequest) {
  try {
    return await seedDefaultUser();
  } catch (error) {
    console.error('Seed user error (POST):', error);
    return NextResponse.json(
      {
        error: 'Failed to create default user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    return await seedDefaultUser();
  } catch (error) {
    console.error('Seed user error (GET):', error);
    return NextResponse.json(
      {
        error: 'Failed to create default user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

