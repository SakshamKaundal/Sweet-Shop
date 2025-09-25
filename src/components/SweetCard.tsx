import { Heart, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { imageMap } from "@/lib/imageMap";

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
  onAddToCart: (sweet: Sweet) => void;
  onToggleFavorite?: (sweetId: string) => void;
  onPurchaseSuccess?: (updatedSweet: Sweet) => void;
}

export const SweetCard = ({ sweet, onToggleFavorite, onPurchaseSuccess }: SweetCardProps) => {
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl bg-card border shadow-lg hover:shadow hover:shadow-fuchsia-200 transition-all duration-300 hover:-translate-y-1.5">
      <div className="relative aspect-square overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={sweet.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white"
          onClick={() => onToggleFavorite?.(sweet.id)}
        >
          <Heart className="h-5 w-5" />
        </Button>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-6 py-2 rounded-full">
              Out of Stock
            </Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <Badge className="bg-gradient-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm shadow-lg">
            {sweet.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl truncate">{sweet.name}</h3>
          <span className="text-xl font-extrabold text-primary">${sweet.price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-base line-clamp-2 mb-4">
          {sweet.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-yellow-400">
            <span className="text-lg">⭐</span>
            <span className="font-bold text-foreground">{sweet.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">
            {sweet.quantity > 0 ? `${sweet.quantity} available` : 'None left'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <div className="flex items-center gap-3 w-full">
          <input
            type="number"
            min="1"
            max={sweet.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-24 text-center rounded-lg border-2 border-input bg-transparent px-3 py-2 font-semibold focus:ring-2 focus:ring-primary focus:outline-none transition"
            disabled={isOutOfStock}
          />
          <Button
            className={`w-full text-lg font-semibold rounded-xl ${
              isOutOfStock 
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-lg'
            } transition-all duration-300`}
            disabled={isOutOfStock || loading}
            onClick={handlePurchase}
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2.5" />
            {loading ? 'Processing...' : 'Purchase'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};