import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { jwtVerify, errors } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

interface DecodedToken {
  role: string;
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload: decoded } = await jwtVerify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const parsedId = parseInt(id, 10);
    const body = await req.json();

    const sweet = await db.select().from(products).where(eq(products.id, parsedId));
    if (sweet.length === 0) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(products)
      .set({
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.description && { description: body.description }),
        ...(body.price && { price: body.price }),
        ...(body.stock && { stock: body.stock }),
        ...(body.photoUrl && { photoUrl: body.photoUrl }),
        updatedAt: new Date(),
      })
      .where(eq(products.id, parsedId))
      .returning();

    return NextResponse.json({ sweet: updated }, { status: 200 });
  } catch (err) {
    console.error("Error updating sweet:", err);
    if (err instanceof errors.JOSEError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
