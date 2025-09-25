'use client';

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-16">
      <div className="max-w-2xl w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-8 shadow-xl text-center space-y-6">
        <div className="text-5xl">🍭</div>
        <h1 className="text-4xl font-extrabold text-white">Hey, I'm Saksham!</h1>
        <p className="text-gray-300 text-lg">
          I write code, eat sweets, and sometimes try to do both at the same time.  
          (Spoiler: the keyboard doesn’t like sugar 🧁💻)
        </p>
        <p className="text-gray-400">
          Check out my experiments & side-quests on{" "}
          <Link
            href="https://github.com/SakshamKaundal"
            className="text-pink-400 hover:text-pink-300 font-medium transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          . It's like a candy shop, but with bugs instead of chocolates 🐛🍫.
        </p>
        <p className="text-gray-300">
          Goal: build cool stuff, make people smile, and never run out of desserts.  
        </p>
        <p className="text-pink-400 font-semibold">Let’s build something sweet 🚀</p>
      </div>
    </div>
  );
}
