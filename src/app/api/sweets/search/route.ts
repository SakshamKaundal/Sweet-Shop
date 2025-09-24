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
 *         description: The name of the sweet to search for.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the sweet to search for.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: The minimum price of the sweet.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
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
 *       500:
 *         description: Internal server error.
 */
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, gte, lte, like, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const name = searchParams.get("name");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query = db.select().from(products).$dynamic();

    const conditions = [];
    if (name) {
      conditions.push(like(products.name, `%${name}%`));
    }
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (minPrice) {
      conditions.push(gte(products.price, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const sweets = await query;

    return NextResponse.json(sweets, { status: 200 });
  } catch (err) {
    console.error("Error searching sweets:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}