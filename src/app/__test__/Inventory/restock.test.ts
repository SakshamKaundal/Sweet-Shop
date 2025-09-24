import { POST } from "@/app/api/sweets/[id]/restock/route";
import { db } from "@/app/db";
import { products, users } from "@/app/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

describe("Sweets - Restock (Admin only)", () => {
  let sweetId: number;
  let adminToken: string;
  let customerToken: string;

  beforeEach(async () => {
    await db.delete(products);
    await db.delete(users);

    // ✅ create admin user
    const adminPass = await bcrypt.hash("admin123", 10);
    const [admin] = await db
      .insert(users)
      .values({
        name: "Admin User",
        email: "admin@sweets.com",
        passwordHash: adminPass,
        role: "admin",
      })
      .returning();

    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ create customer user
    const custPass = await bcrypt.hash("cust123", 10);
    const [customer] = await db
      .insert(users)
      .values({
        name: "Customer User",
        email: "cust@sweets.com",
        passwordHash: custPass,
        role: "customer",
      })
      .returning();

    customerToken = jwt.sign(
      { id: customer.id, email: customer.email, role: "customer" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ insert sweet
    const [sweet] = await db
      .insert(products)
      .values({
        name: "Ladoo",
        category: "Dessert",
        description: "Round sweet",
        price: "10.00",
        stock: 5,
        photoUrl: "/images/ladoo.jpg",
      })
      .returning();

    sweetId = sweet.id;
  });

  it("should allow admin to restock a sweet", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}/restock`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ quantity: 10 }),
    });

    const res = await POST(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Restock successful");
    expect(json.sweet.stock).toBe(15); // 5 + 10
  });

  it("should block customer from restocking", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}/restock`, {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ quantity: 5 }),
    });

    const res = await POST(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Forbidden");
  });

  it("should return 404 if sweet not found", async () => {
    const req = new Request("http://localhost/api/sweets/9999/restock", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ quantity: 5 }),
    });

    const res = await POST(req, { params: { id: "9999" } } as any);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Sweet not found");
  });
});
