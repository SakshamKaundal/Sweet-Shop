"use client";

import { SweetCard, Sweet } from "@/components/SweetCard";

interface SweetsGridProps {
  sweets: Sweet[];
  onAddToCart: (sweet: Sweet) => void;
  onToggleFavorite: (id:string) => void;
  onPurchaseSuccess: (updatedSweet: Sweet) => void;
}

export const SweetsGrid = ({ sweets, onAddToCart, onToggleFavorite, onPurchaseSuccess }: SweetsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet.id}
          sweet={sweet}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      ))}
    </div>
  );
};

