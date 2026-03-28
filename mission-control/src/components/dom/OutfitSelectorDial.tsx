'use client';

import React, { useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import gsap from 'gsap';

export const OutfitSelectorDial = () => {
    const activeDressIndex = useAppStore((state) => state.activeDressIndex);
    const setActiveDressIndex = useAppStore((state) => state.setActiveDressIndex);
    const dialRef = useRef<HTMLDivElement>(null);

    const numbers = [1, 2, 3, 4, 5];

    const handleClick = (num: number) => {
        setActiveDressIndex(num);
        
        // Haptic-like visual feedback with GSAP
        if (dialRef.current) {
            gsap.fromTo(dialRef.current, 
                { scale: 0.98 }, 
                { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" }
            );
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <span className="text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase">Select Unit</span>
            
            <div 
                ref={dialRef}
                className="relative flex items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-full"
            >
                {numbers.map((num) => {
                    const isActive = activeDressIndex === num;
                    return (
                        <button
                            key={num}
                            onClick={() => handleClick(num)}
                            className={`
                                relative w-12 h-12 rounded-full text-xs font-black transition-all duration-500
                                ${isActive 
                                    ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                    : 'text-white/40 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {/* Decorative Ring for active item */}
                            {isActive && (
                                <span className="absolute inset-[-4px] border border-white/20 rounded-full animate-pulse" />
                            )}
                            0{num}
                        </button>
                    );
                })}

                {/* Animated Indicator Bar underneath? Maybe stick to clean dots */}
            </div>
            
            <div className="w-12 h-[1px] bg-gold-400/50" />
        </div>
    );
};
