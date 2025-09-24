import { POST } from "@/app/api/auth/login/route";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import bcrypt from "bcrypt";

describe("Auth - Login", () => {
  beforeEach(async () => {
    // Clear users table before each test
    await db.delete(users);

    // Insert a test user
    const passwordHash = await bcrypt.hash("password123", 10);
    await db.insert(users).values({
      name: "Alice",
      email: "alice@example.com",
      passwordHash,
      role: "staff",
    });
  });

  it("should log in with correct credentials and return a JWT", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "alice@example.com",
        password: "password123",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBeDefined();
    expect(typeof json.token).toBe("string");
  });

  it("should fail with wrong password", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "alice@example.com",
        password: "wrongpass",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid credentials");
  });

  it("should fail if user does not exist", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "bob@example.com",
        password: "password123",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("User not found");
  });
});
