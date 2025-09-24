import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // 🔑 Check auth
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded: any = jwt.decode(token!)

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
