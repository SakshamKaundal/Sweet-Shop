'use client';

import { useState, useEffect } from 'react';
import { SweetsGrid } from '@/components/SweetsGrid';
import { Sweet } from '@/components/SweetCard';
import { SweetFilters } from '@/components/SweetFilter';

export default function SweetsPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const response = await fetch('/api/sweets/getAll');
        const data = await response.json();
        const mappedSweets = data.sweets.map((sweet: any) => ({
          id: sweet.id.toString(),
          name: sweet.name,
          description: sweet.description,
          price: parseFloat(sweet.price),
          image: sweet.photoUrl || '/images/default-sweet.jpg',
          category: sweet.category,
          quantity: sweet.stock,
          rating: 4.5, // Hardcoded rating
        }));
        setSweets(mappedSweets);
        const uniqueCategories = ['All', ...Array.from(new Set(mappedSweets.map((s: Sweet) => s.category))) as string[]];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch sweets:', error);
      }
    };

    fetchSweets();
  }, []);

  useEffect(() => {
    let sortedSweets = [...sweets];
    if (selectedCategory !== 'All') {
      sortedSweets = sortedSweets.filter(sweet => sweet.category === selectedCategory);
    }

    switch (sortBy) {
      case 'name':
        sortedSweets.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        sortedSweets.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedSweets.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedSweets.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredSweets(sortedSweets);
  }, [sweets, selectedCategory, sortBy]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (sweet: Sweet) => {
    console.log('Added to cart:', sweet.name);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handlePurchaseSuccess = (updatedSweet: Sweet) => {
    const apiSweet = updatedSweet as any;
    const updatedSweets = sweets.map((s) => {
      if (s.id === apiSweet.id.toString()) {
        return {
          ...s,
          quantity: apiSweet.stock,
          name: apiSweet.name,
          description: apiSweet.description,
          price: parseFloat(apiSweet.price),
          image: apiSweet.photoUrl || '/images/default-sweet.jpg',
          category: apiSweet.category,
        };
      }
      return s;
    });
    setSweets(updatedSweets);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <aside className="w-full md:w-80 bg-card p-6 rounded-2xl border shadow-lg h-fit">
        <SweetFilters 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </aside>

      <main className="flex-1">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Our Sweet Collection</h1>
        <SweetsGrid
          sweets={filteredSweets}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </main>
    </div>
  );
}
