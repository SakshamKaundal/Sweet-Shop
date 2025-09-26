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

  if (pathname === '/api/sweets/getAll') {
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAuthPage) {
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
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

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Centralized admin role check for API routes
    const isAdminApiRoute = pathname.startsWith('/api/sweets/create') ||
                            pathname.startsWith('/api/sweets/update') ||
                            pathname.startsWith('/api/sweets/delete') ||
                            pathname.startsWith('/api/inventory/restock');

    if (isAdminApiRoute && decoded.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add user data to request headers for downstream API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.id.toString());
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-email', decoded.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
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

export const config = {
  matcher: [
    '/api/sweets/:path*',
    '/api/inventory/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};

