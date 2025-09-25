import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImage from "@/assets/hero-sweets.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Indulge in
              <span className="block bg-gradient-primary bg-clip-text text-pink-400">
                Sweet Perfection
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Discover our handcrafted collection of premium sweets, chocolates, and confections. 
              Made with love and the finest ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-medium">
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-accent">
                View Catalog
              </Button>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Sweet Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">⭐ 4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <Image
                src={heroImage}
                alt="Beautiful collection of artisanal sweets and confections"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-medium">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🍫</div>
                <div>
                  <div className="font-semibold">Premium Chocolate</div>
                  <div className="text-sm text-muted-foreground">Fresh daily</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-medium">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🧁</div>
                <div>
                  <div className="font-semibold">Artisan Cupcakes</div>
                  <div className="text-sm text-muted-foreground">Made to order</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};