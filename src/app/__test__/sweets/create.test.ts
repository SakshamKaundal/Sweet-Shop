import { POST } from "@/app/api/sweets/create/route";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { NextRequest } from "next/server";

describe("Sweets - Create", () => {
  beforeEach(async () => {
    await db.delete(products); // clear table
  });

  it("should create a new sweet", async () => {
    const req = new Request("http://localhost/api/sweets", {
      method: "POST",
      body: JSON.stringify({
        name: "Gulab Jamun",
        description: "Soft and sweet dessert",
        price: "15.50",
        stock: 100,
        minStock: 10,
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sweet.name).toBe("Gulab Jamun");
    expect(json.sweet.stock).toBe(100);

    const allProducts = await db.select().from(products);
    expect(allProducts.length).toBe(1);
  });

  it("should fail if required fields are missing", async () => {
    const req = new Request("http://localhost/api/sweets", {
      method: "POST",
      body: JSON.stringify({
        name: "", // missing fields
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid input");
  });
});
