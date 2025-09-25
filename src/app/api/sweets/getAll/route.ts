import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sweets = await db.select().from(products);
    return NextResponse.json({ sweets }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
