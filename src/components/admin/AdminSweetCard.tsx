'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Sweet } from "@/components/SweetCard";
import { ImageIcon } from "lucide-react";
import { imageMap } from "@/lib/imageMap";

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: string) => void;
}

export const AdminSweetCard = ({ sweet, onEdit, onDelete }: AdminSweetCardProps) => {
  const filename = sweet.image.split('/').pop() || '';
  const imageSrc = imageMap[filename] || sweet.image; // Fallback to sweet.image if not in map

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
            <span className="text-muted-foreground">
                {sweet.quantity > 0 ? `${sweet.quantity} available` : 'None left'}
            </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <div className="flex items-center gap-3 w-full">
          <Button
            className="w-full text-lg font-semibold rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-lg transition-all duration-300"
            onClick={() => onEdit(sweet)}
            size="lg"
          >
            Edit
          </Button>
          <Button
            className="w-full text-lg font-semibold rounded-xl bg-red-500 text-white hover:opacity-95 shadow-lg transition-all duration-300"
            onClick={() => onDelete(sweet.id)}
            size="lg"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
