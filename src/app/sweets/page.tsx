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
    rating: 4.5, // Hardcoded for now
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
        const response = await fetch('/api/sweets/getAll');
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
      default:
        break;
    }

    setFilteredSweets(sortedSweets);
  }, [sweets, selectedCategory, sortBy, searchQuery]);

  // 🔑 Handlers
  const handleAddToCart = (sweet: Sweet) => {
    console.log('Added to cart:', sweet.name);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  // 🔑 Purchase success updates state
  const handlePurchaseSuccess = (updatedSweet: Sweet) => {
    const updatedSweets = sweets.map((s) =>
      s.id === updatedSweet.id ? updatedSweet : s
    );

    setSweets(updatedSweets);
  };

  // 🔑 Render
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Our Sweet Collection
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for your favorite sweets..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
        <SweetsGrid
          sweets={filteredSweets}
          onAddToCart={handleAddToCart}
          onToggleFavorite={() => {}}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </main>
    </div>
  );
}
