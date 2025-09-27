import { DELETE } from "@/app/api/sweets/delete/[id]/route";
import { db } from "@/app/db";
import { products, users } from "@/app/db/schema";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

describe("Sweets - Delete", () => {
  let sweetId: number;
  let adminToken: string;
  let customerToken: string;

  beforeEach(async () => {
    await db.delete(products);
    await db.delete(users);

    // create an admin user
    const adminPass = await bcrypt.hash("admin123", 10);
    const [admin] = await db.insert(users).values({
      name: "Admin User",
      email: "admin@sweets.com",
      passwordHash: adminPass,
      role: "admin",
    }).returning();

    adminToken = await new SignJWT({ id: admin.id, email: admin.email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // create a customer user
    const customerPass = await bcrypt.hash("customer123", 10);
    const [customer] = await db.insert(users).values({
      name: "Customer User",
      email: "customer@sweets.com",
      passwordHash: customerPass,
      role: "customer",
    }).returning();

    customerToken = await new SignJWT({ id: customer.id, email: customer.email, role: "customer" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // insert a sweet
    const [sweet] = await db.insert(products).values({
      name: "Rasgulla",
      category: "Dessert",
      description: "Juicy sweet",
      price: "12.00",
      stock: 20,
      photoUrl: "/images/rasgulla.jpg",
    }).returning();

    sweetId = sweet.id;
  });

  it("should allow admin to delete a sweet", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const res = await DELETE(req, { params: { id: sweetId.toString() } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Sweet deleted successfully");

    const sweets = await db.select().from(products);
    expect(sweets.length).toBe(0);
  });

  it("should block customer from deleting a sweet", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${customerToken}` },
    });

    const res = await DELETE(req, { params: { id: sweetId.toString() } });
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Forbidden");
  });

  it("should return 404 if sweet not found", async () => {
    const req = new Request("http://localhost/api/sweets/9999", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const res = await DELETE(req, { params: { id: "9999" } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Sweet not found");
  });
});
