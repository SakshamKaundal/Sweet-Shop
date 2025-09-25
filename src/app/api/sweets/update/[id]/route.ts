import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 make params async
) {
  try {
    const { id } = await context.params; // 👈 await it
    const parsedId = parseInt(id, 10);
    const body = await req.json();

    // check if sweet exists
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
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
