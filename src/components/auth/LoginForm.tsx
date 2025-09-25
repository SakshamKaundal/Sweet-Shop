"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

interface DecodedToken {
  role: string;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // ✅ check if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) setLoggedIn(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new CustomEvent('loginStateChange'));
      setLoggedIn(true);
      if (data.user.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/sweets"); 
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRoute() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as DecodedToken;
        if (decoded.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/sweets");
        }
      } catch {
        console.error("Invalid token");
        router.push("/sweets");
      }
    } else {
      router.push("/sweets");
    }
  }

  // ✅ if logged in → show logout button
  if (loggedIn) {
    return (
      <div className="space-y-4">
        <p className="text-center text-green-600">You are logged in!</p>
        <button
          onClick={handleRoute}
          className="w-full rounded-lg bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600"
        >
          Enter Dashboard
        </button>
      </div>
    );
  }

  // ✅ else show login form
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-4 py-2 text-white font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
