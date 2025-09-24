import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Define protected routes
  const protectedRoutes = [
    /^\/api\/sweets\/.*$/,
    /^\/api\/inventory\/.*$/,
  ];

  // 2. Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((regex) => regex.test(pathname));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 3. Get token from header
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: No token provided' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Verify token
  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next(); // Token is valid

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 5. Matcher to specify which routes the middleware should run on
export const config = {
  matcher: [
    '/api/sweets/:path*',
    '/api/inventory/:path*',
  ],
};
