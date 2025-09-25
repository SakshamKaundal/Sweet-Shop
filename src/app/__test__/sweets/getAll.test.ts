import { GET } from "../../api/sweets/getAll/route";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";

interface Sweet {
  name: string;
}

describe("Sweets - List", () => {
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
    ]);
  });

  it("should return a list of all sweets", async () => {
    const req = new Request("http://localhost/api/sweets", { method: "GET" });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.sweets)).toBe(true);
    expect(json.sweets.length).toBe(2);

    const names = json.sweets.map((s: Sweet) => s.name);
    expect(names).toContain("Gulab Jamun");
    expect(names).toContain("Rasgulla");
  });
});
