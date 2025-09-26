'use client';

import { useState, useEffect } from 'react';
import { SweetsGrid } from '@/components/SweetsGrid';
import { Sweet } from '@/components/SweetCard';
import { SweetFilters } from '@/components/SweetFilter';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ApiSweet {
  id: number;
  name: string;
  description: string;
  price: string;
  photoUrl: string;
  category: string;
  stock: number;
}

// ✅ Helper: Map ApiSweet → Sweet
function mapApiSweetToSweet(apiSweet: ApiSweet): Sweet {
  return {
    id: apiSweet.id.toString(),
    name: apiSweet.name,
    description: apiSweet.description,
    price: parseFloat(apiSweet.price),
    image: apiSweet.photoUrl || '/images/default-sweet.jpg',
    category: apiSweet.category,
    quantity: apiSweet.stock,
    rating: 4.5,
  };
}

export default function SweetsPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState('');

  // 🔑 Fetch sweets on mount
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        const response = await fetch('/api/sweets/getAll', {
          headers: {
            // Add the Authorization header
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If response is not OK, handle authentication error
          if (response.status === 401) {
            console.error('Unauthorized: Please log in.');
            // Optionally, redirect to login page
            // window.location.href = '/login';
          }
          throw new Error('Failed to fetch sweets');
        }

        const data = await response.json();

        const mappedSweets: Sweet[] = data.sweets.map((sweet: ApiSweet) =>
          mapApiSweetToSweet(sweet)
        );

        setSweets(mappedSweets);

        const uniqueCategories = [
          'All',
          ...Array.from(new Set(mappedSweets.map((s) => s.category))) as string[],
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch sweets:', error);
      }
    };

    fetchSweets();
  }, []);

  // 🔑 Filtering, searching, sorting
  useEffect(() => {
    let sortedSweets = [...sweets];

    if (selectedCategory !== 'All') {
      sortedSweets = sortedSweets.filter(
        (sweet) => sweet.category === selectedCategory
      );
    }

    if (searchQuery) {
      sortedSweets = sortedSweets.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
    }

    setFilteredSweets(sortedSweets);
  }, [sweets, selectedCategory, sortBy, searchQuery]);

  // 🔑 Purchase success updates state with mapped Sweet
  const handlePurchaseSuccess = (updatedSweet: Sweet) => {
    setSweets((prev) =>
      prev.map((s) => (s.id === updatedSweet.id ? updatedSweet : s))
    );
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 p-8">
      <aside className="w-full md:w-80 h-fit">
        <SweetFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </aside>

      <main className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Our Sweet Collection
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search for your favorite sweets..."
              className="pl-10 bg-gray-900/70 border border-gray-800 text-gray-200 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        <SweetsGrid
          sweets={filteredSweets}
          onAddToCart={() => {}}
          onToggleFavorite={() => {}}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </main>
    </div>
  );
}
