/**
 * @swagger
 * /api/sweets/search:
 *   get:
 *     summary: Search for sweets by name, category, or price range.
 *     description: >
 *       This endpoint allows you to search for sweets based on various criteria.
 *       You can filter by name (partial match), category (exact match), and a price range (minPrice and maxPrice).
 *       All parameters are optional. If no parameters are provided, it will return all sweets.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the sweet to search for (case-insensitive partial match).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the sweet to search for (exact match).
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: The minimum price of the sweet.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: The maximum price of the sweet.
 *     responses:
 *       200:
 *         description: A list of sweets that match the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sweet'
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, gte, lte, ilike, eq } from "drizzle-orm";

// Helper function to validate price parameters
function validatePriceParam(priceStr: string | null, paramName: string): number | null {
  if (!priceStr) return null;
  
  const price = parseFloat(priceStr);
  if (isNaN(price) || price < 0) {
    throw new Error(`Invalid ${paramName}. Must be a positive number.`);
  }
  return price;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    // Extract and sanitize search parameters
    const name = searchParams.get("name")?.trim() || null;
    const category = searchParams.get("category")?.trim() || null;
    const minPriceStr = searchParams.get("minPrice");
    const maxPriceStr = searchParams.get("maxPrice");

    // Validate price parameters
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    try {
      minPrice = validatePriceParam(minPriceStr, "minPrice");
      maxPrice = validatePriceParam(maxPriceStr, "maxPrice");
    } catch (validationError) {
      return NextResponse.json(
        { error: (validationError as Error).message },
        { status: 400 }
      );
    }

    // Validate price range logic
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      return NextResponse.json(
        { error: "minPrice cannot be greater than maxPrice" },
        { status: 400 }
      );
    }

    // Build dynamic query
    let query = db.select().from(products).$dynamic();
    const conditions = [];

    // Add search conditions
    if (name) {
      conditions.push(ilike(products.name, `%${name}%`)); // Case-insensitive search
    }

    if (category) {
      conditions.push(eq(products.category, category)); // Exact match
    }

    if (minPrice !== null) {
      conditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice !== null) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    // Apply conditions if any exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Execute query
    const sweets = await query;

    return NextResponse.json(sweets, { status: 200 });

  } catch (error) {
    console.error("Error searching sweets:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      console.error("Database error details:", error.message);
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}