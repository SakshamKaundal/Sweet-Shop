import { DELETE } from "@/app/api/sweets/delete/[id]/route";
import { db } from "@/app/db";
import { products, users } from "@/app/db/schema";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

describe("Sweets - Delete", () => {
  let sweetId: number;
  let adminToken: string;
  let staffToken: string;

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

    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // create a staff user
    const staffPass = await bcrypt.hash("staff123", 10);
    const [staff] = await db.insert(users).values({
      name: "Staff User",
      email: "staff@sweets.com",
      passwordHash: staffPass,
      role: "staff",
    }).returning();

    staffToken = jwt.sign(
      { id: staff.id, email: staff.email, role: "staff" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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

    const res = await DELETE(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Sweet deleted successfully");

    const sweets = await db.select().from(products);
    expect(sweets.length).toBe(0);
  });

  it("should block staff from deleting a sweet", async () => {
    const req = new Request(`http://localhost/api/sweets/${sweetId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${staffToken}` },
    });

    const res = await DELETE(req, { params: { id: sweetId.toString() } } as any);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Forbidden");
  });

  it("should return 404 if sweet not found", async () => {
    const req = new Request("http://localhost/api/sweets/9999", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const res = await DELETE(req, { params: { id: "9999" } } as any);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Sweet not found");
  });
});
