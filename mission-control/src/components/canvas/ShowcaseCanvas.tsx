'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';
import { CharacterScene } from './CharacterScene';
import Link from 'next/link';
import { productsData } from '@/data/products';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ShowcaseCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [blur, setBlur] = useState(0);
  
  const currentMainProductIndex = useAppStore((state) => state.currentMainProductIndex);
  const setCurrentMainProductIndex = useAppStore((state) => state.setCurrentMainProductIndex);

  useEffect(() => {
    if (!containerRef.current) return;

    // We focus on 3 models as specified by the agent requirements
    const totalModels = 3; 
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalModels * 300}%`, // Longer scroll for premium feeling
        pin: true,
        scrub: 1, // Smooth dampening
        onUpdate: (self) => {
          const progress = self.progress;
          const segment = 1 / totalModels;
          const currentIdx = Math.min(Math.floor(progress / segment), totalModels - 1);
          
          // Segment Progress (0 to 1)
          const sp = (progress % segment) / segment;

          let rot = 0;
          let op = 1;
          let b = 0;

          // Step A & B: Rotation (0.1 to 0.8) 
          // We add a tiny fade-in buffer at the start (0 to 0.1)
          if (sp < 0.1) {
            op = gsap.utils.mapRange(0, 0.1, 0, 1, sp);
            rot = 0;
          } else if (sp <= 0.8) {
            // Exactly 360 degrees (2 * PI)
            rot = gsap.utils.mapRange(0.1, 0.8, 0, Math.PI * 2, sp);
            op = 1;
          } else {
            // Step C: Blur/Fade Out (0.8 to 1.0)
            // End perfectly at 2PI (front pose)
            rot = Math.PI * 2; 
            const fadeT = gsap.utils.mapRange(0.8, 1.0, 0, 1, sp);
            op = 1 - fadeT;
            b = fadeT * 15; // Max blur 15px
          }

          // Step D: Update global state for model swap
          if (currentIdx !== currentMainProductIndex) {
            setCurrentMainProductIndex(currentIdx);
          }

          setRotation(rot);
          setOpacity(op);
          setBlur(b);
        }
      }
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [currentMainProductIndex, setCurrentMainProductIndex]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* 3D Scene Layer */}
      <div 
        className="absolute inset-0 will-change-transform transition-all duration-150 ease-linear"
        style={{ 
          opacity: opacity,
          filter: `blur(${blur}px)`
        }}
      >
        <CharacterScene rotationy={rotation} />
      </div>

      {/* Product Info Overlays (Post-processing blur handles readability) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
        <div 
            className="text-center transition-opacity duration-300"
            style={{ opacity: opacity > 0.5 ? 1 : 0 }}
        >
          <Link 
            href={`/product/${currentMainProductIndex}`}
            className="pointer-events-auto group inline-block"
          >
            <div className="overflow-hidden">
                <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter mix-blend-difference uppercase leading-none transition-transform group-hover:scale-105 duration-700">
                  {productsData[currentMainProductIndex]?.name}
                </h2>
            </div>
            <div className="h-[2px] w-0 group-hover:w-full bg-gold-400 transition-all duration-1000 mx-auto mt-6" />
          </Link>

          <div className="mt-16 flex flex-col items-center gap-4 animate-pulse">
            <span className="text-[10px] font-mono tracking-[0.8em] text-gold-500 uppercase opacity-60">
                SCROLL TO NAVIGATE ARCHIVE
            </span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-gold-500/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* Visual Navigation Index */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12 z-20">
        {productsData.slice(0, 3).map((_, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <span className={`text-[10px] font-black transition-colors ${i === currentMainProductIndex ? 'text-gold-400' : 'text-white/20'}`}>
                    0{i+1}
                </span>
                <div className={`h-[1px] transition-all duration-500 ${i === currentMainProductIndex ? 'w-12 bg-gold-400' : 'w-4 bg-white/10 group-hover:w-8'}`} />
            </div>
        ))}
      </div>

      {/* Corner Status (Premium Detail) */}
      <div className="absolute bottom-12 right-12 text-right pointer-events-none">
        <p className="text-white/20 text-[8px] font-mono tracking-widest uppercase mb-1">Status</p>
        <p className="text-gold-500 text-[10px] font-black tracking-widest uppercase">
            Product {currentMainProductIndex + 1} of 3
        </p>
      </div>

      {/* Global Vignette (Ensures cinematic focus) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-0" />
    </div>
  );
};
