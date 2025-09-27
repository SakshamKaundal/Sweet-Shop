import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { jwtVerify, errors } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

interface DecodedToken {
  role: string;
}

export async function POST(
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
    const { quantity } = await req.json();
    const addQty = quantity && quantity > 0 ? quantity : 1;

    const sweet = await db.select().from(products).where(eq(products.id, parsedId));
    if (sweet.length === 0) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 });
    }

    const currentStock = sweet[0].stock;
    const [updated] = await db
      .update(products)
      .set({
        stock: currentStock + addQty,
        updatedAt: new Date(),
      })
      .where(eq(products.id, parsedId))
      .returning();

    return NextResponse.json(
      { message: "Restock successful", sweet: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error restocking sweet:", err);
    if (err instanceof errors.JOSEError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
