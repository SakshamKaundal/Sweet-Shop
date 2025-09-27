import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { jwtVerify, errors } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function DELETE(
  req: NextRequest, // Use NextRequest to access cookies
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // Get token from the cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const { payload: decoded } = await jwtVerify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const parsedId = parseInt(id, 10);

    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, parsedId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Sweet deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting sweet:", err);
    // Handle JWT errors specifically
    if (err instanceof errors.JOSEError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
