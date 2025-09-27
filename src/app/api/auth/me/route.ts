// src/app/api/auth/me/route.ts
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify, errors } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  name: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload: decoded } = await jwtVerify(token, JWT_SECRET);

    // Return user information
    return NextResponse.json(
      {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof errors.JOSEError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
