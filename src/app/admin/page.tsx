'use client';

import { useState, useEffect } from 'react';
import { AdminSweetsGrid } from '@/components/admin/AdminSweetsGrid';
import { AddSweetForm } from '@/components/admin/AddSweetForm';
import { EditSweetForm } from '@/components/admin/EditSweetForm';
import { Sweet } from '@/components/SweetCard';
import { Button } from '@/components/ui/button';
import { Pacifico } from "next/font/google";

// 🎨 Import Pacifico font
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

interface ApiSweet {
  id: number;
  name: string;
  description: string;
  price: string;
  photoUrl: string;
  category: string;
  stock: number;
}

export default function AdminPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const fetchSweets = async () => {
    try {
      const response = await fetch('/api/sweets/getAll');
      const data = await response.json();
      const mappedSweets = data.sweets.map((sweet: ApiSweet) => ({
        id: sweet.id.toString(),
        name: sweet.name,
        description: sweet.description,
        price: parseFloat(sweet.price),
        image: sweet.photoUrl || '/images/default-sweet.jpg',
        category: sweet.category,
        quantity: sweet.stock,
        rating: 4.5,
      }));
      setSweets(mappedSweets);
    } catch (error) {
      console.error('Failed to fetch sweets:', error);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleAdd = async (formData: Omit<Sweet, 'id' | 'rating'> & { minStock: number }) => {
    try {
      const token = localStorage.getItem("token");
      const newSweet = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        photoUrl: formData.image,
        category: formData.category,
        stock: formData.quantity,
        minStock: formData.minStock,
      };
      const response = await fetch('/api/sweets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSweet),
      });
      if (response.ok) {
        fetchSweets();
        setShowAddForm(false);
      } else {
        console.error('Failed to add sweet');
      }
    } catch (error) {
      console.error('Failed to add sweet:', error);
    }
  };

  const handleUpdate = async (updatedSweet: Sweet) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/sweets/update/${updatedSweet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSweet),
      });
      if (response.ok) {
        fetchSweets();
        setEditingSweet(null);
      } else {
        console.error('Failed to update sweet');
      }
    } catch (error) {
      console.error('Failed to update sweet:', error);
    }
  };

  const handleDelete = async (sweetId: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/sweets/delete/${sweetId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          fetchSweets();
        } else {
          console.error('Failed to delete sweet');
        }
      } catch (error) {
        console.error('Failed to delete sweet:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className={`${pacifico.className} text-pink-500`}>Admin</span>{" "}
          Dashboard
        </h1>
        {!showAddForm && !editingSweet && (
          <Button onClick={() => setShowAddForm(true)}>Add New Sweet</Button>
        )}
      </div>

      {showAddForm && <AddSweetForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}
      {editingSweet && <EditSweetForm sweet={editingSweet} onUpdate={handleUpdate} onCancel={() => setEditingSweet(null)} />}

      <div className="mt-8">
        <AdminSweetsGrid sweets={sweets} onEdit={setEditingSweet} onDelete={handleDelete} />
      </div>
    </div>
  );
}
