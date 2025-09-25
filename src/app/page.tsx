'use client';

import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
// import { SweetsGrid } from '@/components/SweetsGrid'
// import { mockSweets } from '@/data/mockSweets'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* <main className="container mx-auto px-4 py-12">
        <SweetsGrid sweets={mockSweets} />
      </main> */}

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