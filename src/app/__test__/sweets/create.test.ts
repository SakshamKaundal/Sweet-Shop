import { POST } from "@/app/api/sweets/create/route";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";

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
        price: 15.50,
        stock: 100,
        minStock: 10,
        category: "Indian Sweets",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.name).toBe("Gulab Jamun");
    expect(json.stock).toBe(100);
    expect(json.category).toBe("Indian Sweets");

    const allProducts = await db.select().from(products);
    expect(allProducts.length).toBe(1);
  });

  it("should fail if required fields are missing", async () => {
    const req = new Request("http://localhost/api/sweets", {
      method: "POST",
      body: JSON.stringify({
        name: "", // missing fields
        price: "10.00",
        category: "Sweets",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.fieldErrors.name[0]).toBe("Name is required");
  });

  it("should fail if category is missing", async () => {
    const req = new Request("http://localhost/api/sweets", {
      method: "POST",
      body: JSON.stringify({
        name: "Rasgulla",
        price: "12.00",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.fieldErrors.category[0]).toBe("Invalid input: expected string, received undefined");
  });
});
