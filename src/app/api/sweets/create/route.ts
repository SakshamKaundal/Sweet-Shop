import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { jwtVerify, errors } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

interface DecodedToken {
  role: string;
}

// Define the validation schema using Zod
const createProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().nonnegative({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
  stock: z.number().int().nonnegative().default(0),
  minStock: z.number().int().nonnegative().default(5),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload: decoded } = await jwtVerify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Validate the request body against the schema
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Insert the validated data into the database
    const [newProduct] = await db
      .insert(products)
      .values({
        name: validation.data.name,
        description: validation.data.description,
        price: validation.data.price.toString(),
        photoUrl: validation.data.photoUrl,
        stock: validation.data.stock,
        minStock: validation.data.minStock,
        category: validation.data.category,
      })
      .returning(); // This returns the newly created product

    // Return the created product with a 201 status code
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Handle potential JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { message: "Invalid JSON in request body" } },
        { status: 400 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: { message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
