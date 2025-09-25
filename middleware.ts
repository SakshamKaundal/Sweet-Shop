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

  // 1. Define protected routes
  const protectedRoutes = [
    /^\/api\/sweets\/.*$/,
    /^\/api\/inventory\/.*$/,
    /\/admin/,
  ];

  // 2. Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((regex) => regex.test(pathname));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 3. Get token from header or cookie
  const authHeader = req.headers.get('authorization');
  const tokenFromHeader = authHeader?.split(' ')[1];
  const tokenFromCookie = req.cookies.get('token')?.value;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 4. Verify token and role
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next(); // Token is valid

  } catch (error) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// 5. Matcher to specify which routes the middleware should run on
export const config = {
  matcher: [
    '/api/sweets/:path*',
    '/api/inventory/:path*',
    '/admin/:path*',
  ],
};
