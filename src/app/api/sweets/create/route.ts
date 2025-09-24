import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// Define the validation schema using Zod
const createProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  stock: z.number().int().nonnegative().default(0),
  minStock: z.number().int().nonnegative().default(5),
});

export async function POST(req: Request) {
  try {
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
        price: validation.data.price,
        stock: validation.data.stock,
        minStock: validation.data.minStock,
        category: validation.data.category,
      })
      .returning(); // This returns the newly created product

    // Return the created product with a 201 status code
    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
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
