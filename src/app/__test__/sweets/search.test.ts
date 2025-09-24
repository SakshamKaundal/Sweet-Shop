import { GET } from "@/app/api/sweets/search/route";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextRequest } from "next/server";

describe("Sweets - Search", () => {
  beforeEach(async () => {
    await db.delete(products);

    await db.insert(products).values([
      {
        name: "Gulab Jamun",
        category: "Dessert",
        description: "Soft and sweet",
        price: "15.50",
        stock: 50,
        photoUrl: "/images/gulab-jamun.jpg",
      },
      {
        name: "Rasgulla",
        category: "Dessert",
        description: "Spongy and juicy",
        price: "12.00",
        stock: 30,
        photoUrl: "/images/rasgulla.jpg",
      },
      {
        name: "Samosa",
        category: "Snack",
        description: "Crispy fried snack",
        price: "8.00",
        stock: 40,
        photoUrl: "/images/samosa.jpg",
      },
    ]);
  });

  it("should filter sweets by name", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ name: "Rasgulla" }),
      },
    } as unknown as NextRequest;
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.length).toBe(1);
    expect(json[0].name).toBe("Rasgulla");
  });

  it("should filter sweets by category", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ category: "Snack" }),
      },
    } as unknown as NextRequest;
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.length).toBe(1);
    expect(json[0].name).toBe("Samosa");
  });

  it("should filter sweets by price range", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ minPrice: "10", maxPrice: "13" }),
      },
    } as unknown as NextRequest;
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.length).toBe(1);
    expect(json[0].name).toBe("Rasgulla");
  });
});
