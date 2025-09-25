import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import caramelPretzels from '@/assets/caramel-pretzels.jpg';
import chocolateTruffles from '@/assets/chocolate-truffles.jpg';
import darkBrownies from '@/assets/dark-brownies.jpg';
import gummyBears from '@/assets/gummy-bears.jpg';
import heroSweets from '@/assets/hero-sweets.jpg';
import rainbowMacarons from '@/assets/rainbow-macarons.jpg';
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

// Define a mapping from image filenames to imported image objects
const imageMap: { [key: string]: StaticImageData } = {
  'caramel-pretzels.jpg': caramelPretzels,
  'chocolate-truffles.jpg': chocolateTruffles,
  'dark-brownies.jpg': darkBrownies,
  'gummy-bears.jpg': gummyBears,
  'hero-sweets.jpg': heroSweets,
  'rainbow-macarons.jpg': rainbowMacarons,
};

export interface Sweet {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  rating: number;
}

interface SweetCardProps {
  sweet: Sweet;
  onAddToCart?: (sweet: Sweet) => void;
  onToggleFavorite?: (sweetId: string) => void;
  onPurchaseSuccess?: (updatedSweet: Sweet) => void;
}

export const SweetCard = ({ sweet, onAddToCart, onToggleFavorite, onPurchaseSuccess }: SweetCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const isOutOfStock = sweet.quantity === 0;
  const filename = sweet.image.split('/').pop() || '';
  const imageSrc = imageMap[filename] || sweet.image; // Fallback to sweet.image if not in map

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to purchase items.");
        return;
      }

      const response = await fetch(`/api/inventory/${sweet.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      alert("Purchase successful!");
      if (onPurchaseSuccess) {
        onPurchaseSuccess(data.sweet);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl bg-card border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  <div className="relative aspect-square overflow-hidden rounded-t-2xl">
    <Image
      src={imageSrc}
      alt={sweet.name}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
    {/* Favorite Button */}
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-3 right-3 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full shadow-md"
      onClick={() => onToggleFavorite?.(sweet.id)}
    >
      <Heart className="h-5 w-5" />
    </Button>
    {/* Category Badge */}
    <Badge className="absolute top-3 left-3 bg-gradient-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs shadow">
      {sweet.category}
    </Badge>
  </div>

  <CardContent className="p-4">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-lg line-clamp-1">{sweet.name}</h3>
      <span className="text-lg font-bold text-primary">${sweet.price.toFixed(2)}</span>
    </div>
    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{sweet.description}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1 text-yellow-500">
        ⭐ <span className="text-sm font-medium text-foreground">{sweet.rating.toFixed(1)}</span>
      </div>
      <span className="text-xs text-muted-foreground">
        {sweet.quantity > 0 ? `${sweet.quantity} left` : 'Out of stock'}
      </span>
    </div>
  </CardContent>

  <CardFooter className="p-4 pt-0 flex-col items-stretch gap-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={sweet.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isOutOfStock}
          />
          <Button
            className={`w-full ${
              isOutOfStock 
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-gradient-primary hover:opacity-90'
            } transition-all duration-300`}
            disabled={isOutOfStock || loading}
            onClick={handlePurchase}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {loading ? 'Purchasing...' : 'Purchase'}
          </Button>
        </div>
      </CardFooter>
</Card>)
};