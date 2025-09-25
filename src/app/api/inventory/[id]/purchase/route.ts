import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // ✅ Auth check
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.decode(token!) as DecodedToken;

    if (decoded.role !== "customer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = await parseInt(params.id, 10);
    const body = await req.json();
    const quantity = body.quantity || 1;

    // ✅ Check sweet
    const sweet = await db.select().from(products).where(eq(products.id, id));
    if (sweet.length === 0) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 });
    }

    const currentStock = sweet[0].stock;
    if (currentStock < quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const [updated] = await db
      .update(products)
      .set({
        stock: currentStock - quantity,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({ message: "Purchase successful", sweet: updated }, { status: 200 });
  } catch (err) {
    console.error("Error purchasing sweet:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
