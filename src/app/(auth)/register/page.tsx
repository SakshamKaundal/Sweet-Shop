// src/app/auth/register/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register - Sweet Delights",
  description: "Create your Sweet Delights account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="w-full max-w-md relative">
        {/* 🌌 Aurora Glow Behind Card */}
        <div className="absolute -inset-20 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />

        {/* ✨ Subtle Floating Particles */}
        <span className="absolute -top-4 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-ping" />
        <span className="absolute bottom-6 right-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full blur-[2px] animate-pulse" />
        <span className="absolute top-10 -left-2 w-2 h-2 bg-pink-600 rounded-full blur-sm animate-bounce" />
        <span className="absolute -bottom-4 right-10 w-1.5 h-1.5 bg-pink-300 rounded-full blur-[1px] animate-pulse" />

        {/* 💳 Glass Card */}
        <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 space-y-6 border border-white/5 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-pink-700 text-white text-2xl shadow-md">
              🍬
            </div>
            <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
            <p className="text-gray-400 text-sm">Join Sweet Delights today</p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Footer */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-pink-400 hover:text-pink-300 transition font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
