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
      minStock: parseInt(minStock, 10) || 0 
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Sweet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input id="name" placeholder="e.g., Chocolate Truffles" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input id="category" placeholder="e.g., Chocolate" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="price">Price</label>
              <Input id="price" placeholder="e.g., 2.50" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="quantity">Stock Quantity</label>
              <Input id="quantity" placeholder="e.g., 100" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="minStock">Minimum Stock</label>
              <Input id="minStock" placeholder="e.g., 10" type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="image">Image URL</label>
              <Input id="image" placeholder="e.g., /images/chocolate-truffles.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="A short description of the sweet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add Sweet</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
