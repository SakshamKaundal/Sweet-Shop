'use client';

import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="bg-gradient-primary p-2 rounded-lg">
                    <span className="text-xl font-bold text-primary-foreground">🍭</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-pink-600">
                    SweetShop
                </h1>
            </div>

            {/* Search Bar */}
            {/* <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search for your favorite sweets..."
                        className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch?.(e.target.value)} />
                </div>
            </div> */}

            {/* Actions */}
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        0
                    </span>
                </Button>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
                {isLoggedIn ? (
                    <Button className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <>
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={() => router.push("/login")} >
                            Login
                        </Button>
                        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={() => router.push("/register")} >
                            Register
                        </Button>
                    </>
                )}
            </div>
        </div>
    </header>
    );
};