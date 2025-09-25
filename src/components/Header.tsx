'use client';

import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

interface DecodedToken {
  role: string;
}

export const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const checkLoginState = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const decoded = jwt.decode(token) as DecodedToken;
          setUserRole(decoded.role);
        } catch {
          console.error("Invalid token");
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  };

  useEffect(() => {
    checkLoginState();

    window.addEventListener('loginStateChange', checkLoginState);
    window.addEventListener('logout', checkLoginState);

    return () => {
      window.removeEventListener('loginStateChange', checkLoginState);
      window.removeEventListener('logout', checkLoginState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new CustomEvent('logout'));
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-black supports-[backdrop-filter]:bg-background/60 ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <span className="text-xl font-bold text-primary-foreground">🍭</span>
          </div>
          <h1
            className={`${pacifico.className} text-2xl font-bold bg-gradient-primary bg-clip-text text-pink-600`}
          >
            Bakely
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/sweets" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Sweets</Link>
          <Link href="/about" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          {isLoggedIn ? (
            <>
              {userRole === 'admin' ? (
                <Button onClick={() => router.push("/admin")}>Admin Dashboard</Button>
              ) : (
                <Button onClick={() => router.push("/sweets")}>Dashboard</Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity bg-pink-500" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={() => router.push("/register")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
