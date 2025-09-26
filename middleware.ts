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
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('token')?.value;

  // Allow public access to the getAll sweets route
  if (pathname === '/api/sweets/getAll') {
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // If user is on an auth page (login/register)
  if (isAuthPage) {
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        // Redirect to the appropriate dashboard based on role
        if (decoded.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
        return NextResponse.redirect(new URL('/sweets', req.url));
      } catch (e) {
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    }
    return NextResponse.next();
  }

  // For all other routes considered protected
  if (!token) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verify token for the protected route
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Role-based access for admin pages
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next(); // Token is valid, proceed

  } catch (error) {
    // If token is invalid, redirect to login and clear the bad cookie
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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

