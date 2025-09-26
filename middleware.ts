import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function middleware(req: NextRequest) {
  console.log('--- Middleware Start ---');
  const { pathname } = req.nextUrl;
  console.log(`[Middleware] Pathname: ${pathname}`);

  const token = req.cookies.get('token')?.value;
  console.log(`[Middleware] Token found in cookie: ${!!token}`);

  // Allow public access to the getAll sweets route
  if (pathname === '/api/sweets/getAll') {
    console.log('[Middleware] Public route /api/sweets/getAll, allowing.');
    console.log('--- Middleware End ---');
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  console.log(`[Middleware] Is auth page: ${isAuthPage}`);

  // If user is on an auth page (login/register)
  if (isAuthPage) {
    if (token) {
      try {
        jwt.verify(token, JWT_SECRET);
        console.log('[Middleware] User is on auth page but has valid token. Redirecting to /sweets.');
        console.log('--- Middleware End ---');
        return NextResponse.redirect(new URL('/sweets', req.url));
      } catch (e) {
        console.log('[Middleware] User is on auth page with an INVALID token. Clearing cookie and allowing access.');
        const response = NextResponse.next();
        response.cookies.delete('token');
        console.log('--- Middleware End ---');
        return response;
      }
    }
    console.log('[Middleware] User is on auth page without a token. Allowing access.');
    console.log('--- Middleware End ---');
    return NextResponse.next();
  }

  // For all other routes considered protected
  if (!token) {
    console.log('[Middleware] Protected route and no token. Redirecting to /login.');
    if (pathname.startsWith('/api')) {
      console.log('[Middleware] API route, returning 401.');
      console.log('--- Middleware End ---');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.log('--- Middleware End ---');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verify token for the protected route
  try {
    console.log('[Middleware] Verifying token for protected route...');
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    console.log('[Middleware] Token is VALID.');

    // Role-based access for admin pages
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      console.log(`[Middleware] Admin route access denied for role: ${decoded.role}. Redirecting.`);
      console.log('--- Middleware End ---');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('[Middleware] Access granted.');
    console.log('--- Middleware End ---');
    return NextResponse.next(); // Token is valid, proceed

  } catch (error) {
    console.log('[Middleware] Token verification FAILED.', error);
    // If token is invalid, redirect to login and clear the bad cookie
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    
    if (pathname.startsWith('/api')) {
      console.log('[Middleware] API route with invalid token, returning 401.');
      console.log('--- Middleware End ---');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('[Middleware] Page route with invalid token, redirecting to /login and clearing cookie.');
    console.log('--- Middleware End ---');
    return response;
  }
}

// Apply middleware to all routes except static assets and the public homepage.
export const config = {
  matcher: [
    '/api/sweets/:path*',
    '/api/inventory/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
