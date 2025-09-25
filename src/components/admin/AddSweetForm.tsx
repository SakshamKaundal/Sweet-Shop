'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sweet } from '@/components/SweetCard';

interface AddSweetFormProps {
  onAdd: (newSweet: Omit<Sweet, 'id' | 'rating'> & { minStock: number }) => void;
  onCancel: () => void;
}

export const AddSweetForm = ({ onAdd, onCancel }: AddSweetFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState('5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      description,
      price: parseFloat(price) || 0,
      image,
      category,
      quantity: parseInt(quantity, 10) || 0,
      minStock: parseInt(minStock, 10) || 0,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900/80 border border-gray-800 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">Add New Sweet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
              <Input
                id="name"
                placeholder="Chocolate Truffles"
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
                placeholder="Chocolate"
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
                placeholder="2.50"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-300">Stock Quantity</label>
              <Input
                id="quantity"
                placeholder="100"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Min Stock */}
            <div className="space-y-1">
              <label htmlFor="minStock" className="text-sm font-medium text-gray-300">Minimum Stock</label>
              <Input
                id="minStock"
                placeholder="10"
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="image" className="text-sm font-medium text-gray-300">Image URL</label>
              <Input
                id="image"
                placeholder="/images/chocolate-truffles.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
              <textarea
                id="description"
                placeholder="A short description of the sweet..."
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
              Add Sweet
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
