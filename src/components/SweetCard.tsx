import { Heart, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  onPurchaseSuccess?: (updatedSweet: any) => void; // note: we remap in parent
}

export const SweetCard = ({
  sweet,
  onToggleFavorite,
  onPurchaseSuccess,
}: SweetCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(sweet.quantity);

  // Add this line to define imageSrc
  const filename = sweet.image.split('/').pop() || '';
  const imageSrc = imageMap[filename] || sweet.image;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to purchase items.");
        return;
      }

      // Validate quantity before purchase
      if (quantity > localQuantity) {
        alert("Cannot purchase more than available quantity");
        return;
      }

      const response = await fetch(`/api/inventory/${sweet.id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      // Calculate new quantity
      const newQuantity = localQuantity - quantity;
      setLocalQuantity(newQuantity);

      // Reset quantity input to 1 or 0 if out of stock
      setQuantity(newQuantity > 0 ? 1 : 0);

      // Update parent state with the new sweet data
      if (onPurchaseSuccess) {
        onPurchaseSuccess({
          ...sweet,
          quantity: newQuantity,
        });
      }

      alert("Purchase successful!");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Update local quantity when sweet prop changes
  useEffect(() => {
    setLocalQuantity(sweet.quantity);
  }, [sweet.quantity]);

  const isOutOfStock = localQuantity <= 0;

  return (
    <Card className="group overflow-hidden rounded-xl bg-gray-900/70 border border-gray-800 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-gray-700 transition-all duration-300">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={sweet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white"
          onClick={() => onToggleFavorite?.(sweet.id)}
        >
          <Heart className="h-5 w-5" />
        </Button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="rounded-full bg-gray-800/80 text-gray-200 shadow-sm">
            {sweet.category}
          </Badge>
        </div>

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <Badge
              variant="destructive"
              className="px-4 py-2 text-base rounded-full"
            >
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-white truncate">
            {sweet.name}
          </h3>
          <span className="text-lg font-bold text-gray-100">
            ${sweet.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">
          {sweet.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-yellow-400">
            ⭐ <span className="font-medium">{sweet.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400">
            {localQuantity > 0
              ? `${localQuantity} available`
              : "Out of stock"}
          </span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-2 w-full">
          <input
            type="number"
            min="1"
            max={localQuantity}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0 && val <= localQuantity) {
                setQuantity(val);
              }
            }}
            className="w-20 rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-center text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
            disabled={isOutOfStock}
          />
          <Button
            className="w-full rounded-md bg-pink-600 text-white hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-500 transition"
            disabled={isOutOfStock || loading}
            onClick={handlePurchase}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {loading ? "Processing..." : "Purchase"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
