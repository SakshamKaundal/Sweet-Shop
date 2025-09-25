'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sweet } from '@/components/SweetCard';
import Image from 'next/image';

interface EditSweetFormProps {
  sweet: Sweet;
  onUpdate: (updatedSweet: Sweet) => void;
  onCancel: () => void;
}

export const EditSweetForm = ({ sweet, onUpdate, onCancel }: EditSweetFormProps) => {
  const [name, setName] = useState(sweet.name);
  const [description, setDescription] = useState(sweet.description);
  const [price, setPrice] = useState(sweet.price);
  const [image, setImage] = useState(sweet.image);
  const [category, setCategory] = useState(sweet.category);
  const [quantity, setQuantity] = useState(sweet.quantity);

  useEffect(() => {
    setName(sweet.name);
    setDescription(sweet.description);
    setPrice(sweet.price);
    setImage(sweet.image);
    setCategory(sweet.category);
    setQuantity(sweet.quantity);
  }, [sweet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...sweet, name, description, price, image, category, quantity });
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900/80 border border-gray-800 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">Edit Sweet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="category" className="text-sm font-medium text-gray-300">Category</label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label htmlFor="price" className="text-sm font-medium text-gray-300">Price</label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-300">Stock Quantity</label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Image */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="image" className="text-sm font-medium text-gray-300">Image URL</label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
              {image && (
                <div className="mt-3 relative w-full h-48">
                  <Image
                    src={image}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg border border-gray-700 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 text-white p-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white">
              Update Sweet
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
