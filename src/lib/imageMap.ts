import caramelPretzels from '@/assets/caramel-pretzels.jpg';
import chocolateTruffles from '@/assets/chocolate-truffles.jpg';
import darkBrownies from '@/assets/dark-brownies.jpg';
import gummyBears from '@/assets/gummy-bears.jpg';
import heroSweets from '@/assets/hero-sweets.jpg';
import rainbowMacarons from '@/assets/rainbow-macarons.jpg';
import { StaticImageData } from "next/image";

export const imageMap: { [key: string]: StaticImageData } = {
  'caramel-pretzels.jpg': caramelPretzels,
  'chocolate-truffles.jpg': chocolateTruffles,
  'dark-brownies.jpg': darkBrownies,
  'gummy-bears.jpg': gummyBears,
  'hero-sweets.jpg': heroSweets,
  'rainbow-macarons.jpg': rainbowMacarons,
};
