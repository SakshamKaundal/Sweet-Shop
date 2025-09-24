import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, price, stock, minStock } = await req.json();

    // basic validation
    if (!name || !price) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const [sweet] = await db
      .insert(products)
      .values({
        name,
        description: description || null,
        price,
        stock: stock ?? 0,
        minStock: minStock ?? 5,
      })
      .returning();

    return NextResponse.json({ sweet }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
