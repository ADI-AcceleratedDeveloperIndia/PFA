import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // For API routes, let them handle auth themselves
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // For other routes, check auth token
  const token = request.cookies.get('auth-token');
  
  if (!token && !pathname.startsWith('/api/')) {
    // Redirect to login if not authenticated
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

