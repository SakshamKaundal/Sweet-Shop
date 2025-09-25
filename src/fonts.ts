import { Inter, Pacifico } from "next/font/google";

// Main body font
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Fancy headings font
export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});
