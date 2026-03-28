'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AdBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const items = Array.from(marquee.children);
    const totalWidth = items.reduce((acc, item) => acc + (item as HTMLElement).offsetWidth + 64, 0); // 64 is gap-16

    // Create a horizontal loop using GSAP
    const loop = gsap.to(marquee, {
      x: -totalWidth / 2, // Assuming we cloned the content once
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    return () => {
      loop.kill();
    };
  }, []);

  const adContent = (
    <div className="flex gap-16 items-center flex-shrink-0">
      <span className="text-gold-500 font-bold">GESTALT GENESIS DROP LIVE</span>
      <span className="w-1 h-1 bg-white/20 rounded-full" />
      <span className="text-white opacity-60">LIMITED RELEASE: 3D PUFF PRINT HOODIES (42/100)</span>
      <span className="w-1 h-1 bg-white/20 rounded-full" />
      <span className="text-gold-500 font-bold">FREE WORLDWIDE SHIPPING FOR WEB3 HOLDERS</span>
      <span className="w-1 h-1 bg-white/20 rounded-full" />
      <span className="text-white opacity-60">NEW COLORWAY: TITANIUM GREY AVAILABLE NOW</span>
      <span className="w-1 h-1 bg-white/20 rounded-full" />
    </div>
  );

  return (
    <div className="fixed top-24 left-0 w-full z-40 px-4 md:px-8">
      <div 
        ref={containerRef}
        className="relative h-[50px] bg-zinc-950/80 backdrop-blur-md border-t border-b border-white/5 overflow-hidden flex items-center"
      >
        <div 
          ref={marqueeRef}
          className="flex whitespace-nowrap text-[10px] tracking-[0.5em] uppercase font-black"
        >
          {adContent}
          {adContent} {/* Clone for infinite loop */}
        </div>
        
        {/* Subtle Scanline/Monitor effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent bg-[length:100%_4px]" />
      </div>
    </div>
  );
};
