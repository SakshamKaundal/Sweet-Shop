import { PUT } from "@/app/api/sweets/update/[id]/route";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";

describe("Sweets - Update", () => {
  let sweetId: number;

  beforeEach(async () => {
    await db.delete(products);

    const [sweet] = await db.insert(products).values({
      name: "Gulab Jamun",
      category: "Dessert",
      description: "Soft and sweet",
      price: "15.50",
      stock: 50,
      photoUrl: "/images/gulab-jamun.jpg",
    }).returning();

    sweetId = sweet.id;
  });

  it("should update a sweet's details", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Gulab Jamun (Updated)",
        price: "20.00",
        stock: 60,
      }),
    });

    const res = await PUT(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sweet.name).toBe("Gulab Jamun (Updated)");
    expect(json.sweet.price).toBe("20.00");
    expect(json.sweet.stock).toBe(60);
  });

  it("should return 404 if sweet not found", async () => {
    const req = new Request("http://localhost/api/sweets/9999", {
      method: "PUT",
      body: JSON.stringify({ name: "Does Not Exist" }),
    });

    const res = await PUT(req, { params: { id: "9999" } } as any);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Sweet not found");
  });
});
