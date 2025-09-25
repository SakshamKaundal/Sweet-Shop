import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 Promise
) {
  try {
    // 🔑 Resolve params
    const { id } = await params;
    const parsedId = parseInt(id, 10);

    // 🔑 Auth check
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.decode(token!) as DecodedToken;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔑 Extract body
    const { quantity } = await req.json();
    const addQty = quantity && quantity > 0 ? quantity : 1;

    // 🔑 Find sweet
    const sweet = await db.select().from(products).where(eq(products.id, parsedId));
    if (sweet.length === 0) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 });
    }

    // 🔑 Update stock
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
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
