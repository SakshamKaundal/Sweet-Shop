'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sweet } from '@/components/SweetCard';

interface AddSweetFormProps {
  onAdd: (newSweet: Omit<Sweet, 'id' | 'rating'>) => void;
  onCancel: () => void;
}

export const AddSweetForm = ({ onAdd, onCancel }: AddSweetFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, description, price, image, category, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Sweet</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <Input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
        <Input placeholder="Stock Quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} required />
        <Input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required className="col-span-2" />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-2 p-2 border rounded-md"
          required
        />
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Sweet</Button>
      </div>
    </form>
  );
};
