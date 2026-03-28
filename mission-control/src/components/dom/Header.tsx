'use client';

import React, { useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import gsap from 'gsap';

export const Header = () => {
  const cartItemCount = useAppStore((state) => state.cartItemCount);
  const toggleMenu = useAppStore((state) => state.toggleGoldenMenu);
  const cartRef = useRef<HTMLDivElement>(null);

  // GSAP Bounce effect when cart count changes
  useEffect(() => {
    if (cartItemCount > 0 && cartRef.current) {
      gsap.fromTo(
        cartRef.current,
        { scale: 1 },
        { 
          scale: 1.2, 
          duration: 0.2, 
          yoyo: true, 
          repeat: 1, 
          ease: "back.out(1.7)" 
        }
      );
    }
  }, [cartItemCount]);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 md:px-8 py-4 md:py-6 flex justify-between items-center mix-blend-difference">
      {/* Left: Hamburger Menu (3 lines) */}
      <div className="flex items-center gap-8">
        <button 
          onClick={toggleMenu}
          className="group flex flex-col gap-[5px] p-2 focus:outline-none"
          aria-label="Menu"
        >
          <span className="w-6 h-[1.5px] bg-white transition-all group-hover:w-8" />
          <span className="w-8 h-[1.5px] bg-white transition-all group-hover:w-6" />
          <span className="w-5 h-[1.5px] bg-white transition-all group-hover:w-8" />
        </button>
      </div>

      {/* Center: Brand Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-black tracking-tighter uppercase italic cursor-pointer group">
        GESTALT
        <div className="h-[2px] w-0 group-hover:w-full bg-gold-400 transition-all duration-500 mx-auto" />
      </div>

      {/* Right: Search, Wishlist, Profile & Cart */}
      <div className="flex items-center gap-4 md:gap-10">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center gap-3 border-b border-white/20 pb-1.5 group focus-within:border-gold-400 transition-colors">
          <span className="text-white/40 group-focus-within:text-gold-400 transition-colors text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="SEARCH ARCHIVE" 
            className="bg-transparent border-none outline-none text-[10px] tracking-[0.3em] uppercase text-white placeholder:text-white/20 w-32 focus:w-48 transition-all duration-700 font-bold"
          />
        </div>

        {/* Wishlist Icon */}
        <button 
          className="text-white/60 hover:text-white transition-colors text-xl"
          aria-label="Wishlist"
        >
          ♡
        </button>

        {/* Profile Icon */}
        <button 
          className="hidden sm:flex items-center text-[10px] font-black tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors"
          aria-label="Profile"
        >
          PROFILE
        </button>
        
        {/* Cart/Bag with Badge */}
        <div 
          ref={cartRef}
          className="relative group cursor-pointer flex items-center gap-3"
        >
          <div className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] transition-all group-hover:bg-gold-400 group-hover:scale-105">
            BAG
          </div>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center bg-gold-500 text-black text-[9px] font-black w-4 h-4 rounded-full border border-black shadow-lg">
              {cartItemCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
