// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Create a response object
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });

  // Set the cookie with an expiry date in the past to delete it
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
