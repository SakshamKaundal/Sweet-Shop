import { POST } from "@/app/api/sweets/[id]/purchase/route";
import { db } from "@/app/db";
import { products, users } from "@/app/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

describe("Sweets - Purchase", () => {
  let sweetId: number;
  let customerToken: string;

  beforeEach(async () => {
    await db.delete(products);
    await db.delete(users);

    // create a customer user
    const pass = await bcrypt.hash("cust123", 10);
    const [customer] = await db.insert(users).values({
      name: "Customer One",
      email: "cust@example.com",
      passwordHash: pass,
      role: "customer",
    }).returning();

    customerToken = jwt.sign(
      { id: customer.id, email: customer.email, role: "customer" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // insert sweet
    const [sweet] = await db.insert(products).values({
      name: "Rasgulla",
      category: "Dessert",
      description: "Juicy sweet",
      price: "12.00",
      stock: 10,
      photoUrl: "/images/rasgulla.jpg",
    }).returning();

    sweetId = sweet.id;
  });

  it("should allow customer to purchase a sweet (reduce stock)", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}/purchase`, {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ quantity: 3 }),
    });

    const res = await POST(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Purchase successful");
    expect(json.sweet.stock).toBe(7); // 10 - 3 = 7
  });

  it("should block if not enough stock", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}/purchase`, {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ quantity: 20 }),
    });

    const res = await POST(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Not enough stock");
  });

  it("should return 404 if sweet not found", async () => {
    const req = new Request("http://localhost/api/sweets/9999/purchase", {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ quantity: 1 }),
    });

    const res = await POST(req, { params: { id: "9999" } } as any);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Sweet not found");
  });
});
