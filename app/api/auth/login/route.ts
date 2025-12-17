import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { createToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Mark as dynamic since we use database
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    
    // Special handling for demo user to avoid any Mongo/bcrypt mismatch issues in Sandbox
    const DEMO_EMAIL = 'demo@pfa.com';
    const DEMO_PASSWORD = '9FAdem@1';
    
    let user;
    if (email === DEMO_EMAIL) {
      // Always try to find the demo user, or create if missing
      user = await User.findOne({ email: DEMO_EMAIL }).select('+password');
      if (!user) {
        user = await User.create({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
      } else {
        // Ensure demo user password is up to date
        user.password = DEMO_PASSWORD;
        user.markModified('password');
        await user.save();
      }
      
      // If the entered password matches the configured demo password, accept login
      if (password !== DEMO_PASSWORD) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } else {
      // Normal login flow for non-demo users
      user = await User.findOne({ email }).select('+password');
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }
    
    // Create token
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
    });
    
    const response = NextResponse.json(
      { success: true, userId: user._id.toString() },
      { status: 200 }
    );
    
    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

