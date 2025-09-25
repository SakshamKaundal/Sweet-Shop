import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
}

export const SweetCard = ({ sweet, onAddToCart, onToggleFavorite }: SweetCardProps) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="group overflow-hidden bg-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={sweet.image}
          alt={sweet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
          onClick={() => onToggleFavorite?.(sweet.id)}
        >
          <Heart className="h-4 w-4" />
        </Button>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-destructive text-destructive-foreground">
              Out of Stock
            </Badge>
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-gradient-secondary text-secondary-foreground">
          {sweet.category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{sweet.name}</h3>
          <span className="text-lg font-bold text-primary">${sweet.price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {sweet.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium">{sweet.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {sweet.quantity > 0 ? `${sweet.quantity} left` : 'Out of stock'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full ${
            isOutOfStock 
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-primary hover:opacity-90'
          } transition-all duration-300`}
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(sweet)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};