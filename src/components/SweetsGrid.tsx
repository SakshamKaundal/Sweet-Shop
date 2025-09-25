"use client";

import { SweetCard, Sweet } from "@/components/SweetCard";

interface SweetsGridProps {
  sweets: Sweet[];
  onAddToCart: (sweet: Sweet) => void;
  onToggleFavorite: (id: string) => void;
}

export const SweetsGrid = ({ sweets, onAddToCart, onToggleFavorite }: SweetsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet.id}
          sweet={sweet}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
