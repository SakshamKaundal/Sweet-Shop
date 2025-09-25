'use client';

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { Sweet } from "@/components/SweetCard";
import { StaticImageData } from "next/image";
import { imageMap } from "@/lib/imageMap";
import Image from "next/image";

const StickyCard_001 = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  src: StaticImageData;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 250}px)`,
        }}
        className="rounded-4xl relative -top-1/4 flex h-[400px] w-[600px] origin-top flex-col overflow-hidden"
      >
        <Image src={src} alt={title} layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl font-serif italic text-white font-bold">{title}</h2>
        </div>
      </motion.div>
    </div>
  );
};

interface Skiper16Props {
  sweets: Sweet[];
}

const Skiper16 = ({ sweets }: Skiper16Props) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = sweets.map(sweet => {
    const filename = sweet.image.split('/').pop() || '';
    const imageSrc = imageMap[filename] || sweet.image;
    return {
      title: sweet.name,
      src: imageSrc,
    }
  });

  return (
    <ReactLenis root>
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pt-[20vh] pb-[50vh]"
      >
        <div className="absolute left-1/2 top-[5%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            Scroll down to see our Best Sellers
          </span>
        </div>
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.1,
          );
          return (
            <StickyCard_001
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export { Skiper16, StickyCard_001 };
