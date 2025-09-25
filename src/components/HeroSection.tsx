import Image from "next/image";
import heroImage from "@/assets/hero-sweets.jpg";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

// custom floating + shimmer animations
const animations = `
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}
@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.animate-shimmer {
  background-size: 200% 200%;
  animation: shimmer 5s linear infinite;
}
  .text-glow {
  text-shadow: 0 0 8px rgba(236, 72, 153, 0.5);
}
`;

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* inject animations */}
      <style>{animations}</style>

      <div className="container mx-auto px-4 py-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Indulge in
              <span
              className={`${pacifico.className} block px-1 whitespace-nowrap leading-none text-4xl md:text-7xl bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent animate-shimmer relative -translate-y-1`}
            >
              Sweet Perfection
            </span>
            </h1>
            <p className="text-xl py-1 text-muted-foreground max-w-lg">
              Discover our handcrafted collection of premium sweets, chocolates,
              and confections. Made with love and the finest ingredients.
            </p>

            {/* metrics section */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  👨‍👩‍👧 500+
                </div>
                <div className="text-sm text-muted-foreground">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  🍬 50+
                </div>
                <div className="text-sm text-muted-foreground">
                  Sweet Varieties
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  ⭐ 4.9
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            {/* 🌌 Aurora Glow */}
            <div className="absolute -inset-8 bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-pink-400/30 blur-3xl rounded-3xl -z-10" />

            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <Image
                src={heroImage}
                alt="Beautiful collection of artisanal sweets and confections"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* 🍫 Floating Cards */}
            <div className="absolute -bottom-4 -left-4 bg-white/90 rounded-xl p-4 shadow-xl text-black animate-bounce-slow">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🍫</div>
                <div>
                  <div className="font-semibold">Premium Chocolate</div>
                  <div className="text-sm text-muted-foreground">Fresh daily</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white/90 rounded-xl p-4 shadow-xl text-black animate-bounce-slow">
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

      {/* faint candy emojis in background */}
      <div className="absolute top-10 left-20 text-pink-500/10 text-6xl">🍭</div>
      <div className="absolute bottom-20 right-32 text-purple-500/10 text-7xl">🍩</div>
      <div className="absolute top-1/2 left-1/3 text-yellow-400/10 text-8xl">🍬</div>
    </section>
  );
};
