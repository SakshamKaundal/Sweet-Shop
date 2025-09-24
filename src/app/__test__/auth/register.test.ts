import { POST } from "@/app/api/auth/register/route";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";


describe("Auth - Register", () => {

  // Clean up database after each test (optional but good practice)
  afterEach(async () => {
    await db.delete(users).where(eq(users.email, "alice@example.com"));
  });
  it("should create a new user", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.user.email).toBe("alice@example.com");
  });

});
