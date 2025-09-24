import { GET } from "@/app/api/sweets/search/route";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";

describe("Sweets - Search", () => {
  beforeEach(async () => {
    await db.delete(products);

    await db.insert(products).values([
      {
        name: "Gulab Jamun",
        category: "Dessert",
        description: "Soft and sweet",
        price: "15.50",
        stock: 50,
        photoUrl: "/images/gulab-jamun.jpg",
      },
      {
        name: "Rasgulla",
        category: "Dessert",
        description: "Spongy and juicy",
        price: "12.00",
        stock: 30,
        photoUrl: "/images/rasgulla.jpg",
      },
      {
        name: "Samosa",
        category: "Snack",
        description: "Crispy fried snack",
        price: "8.00",
        stock: 40,
        photoUrl: "/images/samosa.jpg",
      },
    ]);
  });

  it("should filter sweets by name", async () => {
    const req = new Request("http://localhost/api/sweets/search?name=Rasgulla");
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sweets.length).toBe(1);
    expect(json.sweets[0].name).toBe("Rasgulla");
  });

  it("should filter sweets by category", async () => {
    const req = new Request("http://localhost/api/sweets/search?category=Snack");
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sweets.length).toBe(1);
    expect(json.sweets[0].name).toBe("Samosa");
  });

  it("should filter sweets by price range", async () => {
    const req = new Request("http://localhost/api/sweets/search?minPrice=10&maxPrice=13");
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sweets.length).toBe(1);
    expect(json.sweets[0].name).toBe("Rasgulla");
  });
});
