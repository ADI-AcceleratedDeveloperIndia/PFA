import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  const payload = verifyToken(token);
  return payload?.userId || null;
}

