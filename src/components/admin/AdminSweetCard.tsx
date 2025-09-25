'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Sweet } from "@/components/SweetCard";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { imageMap } from "@/lib/imageMap";

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: string) => void;
}

export const AdminSweetCard = ({ sweet, onEdit, onDelete }: AdminSweetCardProps) => {
  const filename = sweet.image.split("/").pop() || "";
  const imageSrc = imageMap[filename] || sweet.image;

  return (
    <Card className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-md shadow-md hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
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
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="rounded-full bg-pink-600/80 text-white shadow-md px-3 py-1 text-xs">
            {sweet.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-white truncate">{sweet.name}</h3>
          <span className="text-lg font-bold text-pink-400">
            ${sweet.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{sweet.description}</p>
        <div className="text-xs text-gray-500">
          {sweet.quantity > 0 ? `${sweet.quantity} available` : "None left"}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-5 pb-5">
        <div className="flex gap-3 w-full">
          <Button
            onClick={() => onEdit(sweet)}
            className="flex-1 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition"
          >
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(sweet.id)}
            className="flex-1 rounded-full bg-pink-500 text-white hover:bg-red-500 transition"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
