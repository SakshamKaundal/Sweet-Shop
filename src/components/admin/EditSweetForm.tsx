'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sweet } from '@/components/SweetCard';

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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Sweet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity">Stock Quantity</label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="image">Image URL</label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              {/* ✅ Live Preview of image */}
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-md border"
                />
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Update Sweet</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
