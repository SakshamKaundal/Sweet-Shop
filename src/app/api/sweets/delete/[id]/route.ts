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

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.decode(token!) as DecodedToken;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = parseInt(context.params.id, 10);
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sweet deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting sweet:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
