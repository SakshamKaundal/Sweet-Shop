import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // User is already authenticated by the middleware.
    // We can get user info from the request headers.
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      // This should technically not be reached if middleware is set up correctly
      return NextResponse.json({ error: "Unauthorized: Missing user identifier" }, { status: 401 });
    }

    const { id } = await context.params;
    const parsedId = parseInt(id, 10);

    const body = await req.json();
    const quantity = body.quantity || 1;

    const sweet = await db.select().from(products).where(eq(products.id, parsedId));
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
      .where(eq(products.id, parsedId))
      .returning();

    return NextResponse.json(
      { message: "Purchase successful", sweet: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error purchasing sweet:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
