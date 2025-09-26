'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { Skiper16 } from '@/components/ui/skiper-ui/skiper16';
import { Sweet } from '@/components/SweetCard';
import { imageMap } from '@/lib/imageMap';

interface ApiSweet {
  id: number;
  name: string;
  description: string;
  price: string;
  photoUrl: string;
  category: string;
  stock: number;
}

export default function HomePage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/sweets/getAll', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const mappedSweets = data.sweets.map((sweet: ApiSweet) => ({
          id: sweet.id.toString(),
          name: sweet.name,
          description: sweet.description,
          price: parseFloat(sweet.price),
          image: sweet.photoUrl || '',
          category: sweet.category,
          quantity: sweet.stock,
          rating: 4.5, // Hardcoded rating
        }));
        const filteredSweets = mappedSweets.filter((sweet: Sweet) => {
          const filename = sweet.image.split('/').pop() || '';
          return imageMap.hasOwnProperty(filename);
        });
        setSweets(filteredSweets);
      } catch (error) {
        console.error('Failed to fetch sweets:', error);
      }
    };

    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {sweets.length > 0 && <Skiper16 sweets={sweets} />}

      {/* Authentication Notice */}
      <section className="bg-gradient-accent py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Purchase?</h3>
          <p className="text-muted-foreground mb-6">
            Sign up for an account to start purchasing your favorite sweets and track your orders.
          </p>
        </div>
      </section>
      
    </div>
  )
}