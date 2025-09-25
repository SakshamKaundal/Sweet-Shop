"use client";

import { useState } from "react";
import { SweetsGrid } from "@/components/SweetsGrid";
import { SweetCard, Sweet } from "@/components/SweetCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Example sweets data
const sweetsData: Sweet[] = [
  {
    id: "1",
    name: "Caramel Pretzel Clusters",
    description: "Crunchy pretzel pieces covered in rich caramel and milk chocolate.",
    price: 9.99,
    image: "/images/caramel-pretzel.jpg",
    category: "Caramel",
    quantity: 30,
    rating: 4.6,
  },
  {
    id: "2",
    name: "Chocolate Truffle Delight",
    description: "Rich, velvety chocolate truffles dusted with cocoa powder. Made with Belgian chocolate.",
    price: 12.99,
    image: "/images/chocolate-truffle.jpg",
    category: "Chocolate",
    quantity: 25,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Dark Chocolate Brownies",
    description: "Fudgy brownies made with premium dark chocolate and walnuts.",
    price: 7.25,
    image: "/images/dark-brownie.jpg",
    category: "Brownies",
    quantity: 20,
    rating: 4.5,
  },
  {
    id: "4",
    name: "Gummy Bear Paradise",
    description: "Assorted gummy bears in fruity flavors, made with real fruit juice.",
    price: 6.99,
    image: "/images/gummy-bears.jpg",
    category: "Gummies",
    quantity: 45,
    rating: 4.4,
  },
  {
    id: "5",
    name: "Lemon Tart Supreme",
    description: "Tangy lemon curd in a buttery pastry shell, topped with meringue.",
    price: 8.5,
    image: "/images/lemon-tart.jpg",
    category: "Tarts",
    quantity: 12,
    rating: 4.8,
  },
  {
    id: "6",
    name: "Rainbow Macarons",
    description: "Delicate French macarons in vibrant colors with various flavored fillings.",
    price: 18.5,
    image: "/images/macarons.jpg",
    category: "Macarons",
    quantity: 15,
    rating: 4.9,
  },
];

export default function SweetsPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (sweet: Sweet) => {
    console.log("Added to cart:", sweet.name);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar */}
      <aside className="w-60 bg-background p-4 rounded-xl border h-fit">
        <h2 className="font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Chocolate", "Caramel", "Brownies", "Gummies", "Tarts", "Macarons"].map(
            (cat) => (
              <Badge key={cat} className="cursor-pointer hover:bg-primary hover:text-white">
                {cat}
              </Badge>
            )
          )}
        </div>

        <h2 className="font-semibold mb-4">Sort By</h2>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm">
            Name
          </Button>
          <Button variant="outline" size="sm">
            Price: Low to High
          </Button>
          <Button variant="outline" size="sm">
            Price: High to Low
          </Button>
          <Button variant="outline" size="sm">
            Rating
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6">All Sweets</h1>
        <SweetsGrid sweets={sweetsData} onAddToCart={handleAddToCart} onToggleFavorite={toggleFavorite} />
      </main>
    </div>
  );
}
