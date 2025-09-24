import { POST } from "@/app/api/auth/register/route";

describe("Auth - Register", () => {
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
