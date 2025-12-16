import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { createToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Mark as dynamic since we use database
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await User.create({ email, password });
    
    // Create token
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
    });
    
    const response = NextResponse.json(
      { success: true, userId: user._id.toString() },
      { status: 201 }
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
    
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for MongoDB connection errors
    if (errorMessage.includes('MongoServerError') || errorMessage.includes('MongoNetworkError')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

