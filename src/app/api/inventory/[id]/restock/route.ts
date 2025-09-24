import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // 🔑 Check auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔑 Extract sweet ID and body
    const id = parseInt(params.id, 10);
    const { quantity } = await req.json();
    const addQty = quantity && quantity > 0 ? quantity : 1;

    // 🔑 Find sweet
    const sweet = await db.select().from(products).where(eq(products.id, id));
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
      .where(eq(products.id, id))
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
