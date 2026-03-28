'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CharacterScene } from '@/components/canvas/CharacterScene';
import { OutfitSelectorDial } from '@/components/dom/OutfitSelectorDial';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { productsData } from '@/data/products';

export function ProductDetailClient() {
    const setPageThreeActive = useAppStore((state) => state.setPageThreeActive);
    const currentMainProductIndex = useAppStore((state) => state.currentMainProductIndex);
    
    const currentProduct = productsData[currentMainProductIndex] || productsData[0];

    useEffect(() => {
        setPageThreeActive(true);
        return () => setPageThreeActive(false);
    }, [setPageThreeActive]);

    return (
        <main className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/3 h-1/2 md:h-full">
                <CharacterScene rotationy={Math.PI / 8} />
                <Link href="/" className="absolute top-32 left-8 z-50 text-[10px] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-4">
                    <span className="text-lg">←</span> RETURN TO ARCHIVE
                </Link>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 z-50">
                    <OutfitSelectorDial />
                </div>
            </div>

            <div className="relative w-full md:w-1/3 h-1/2 md:h-full border-l border-white/5 bg-zinc-950/50 backdrop-blur-2xl p-8 md:p-16 flex flex-col justify-center">
                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "circOut" }}>
                    <span className="text-gold-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block">
                        PRODUCT REF: GEST-00{currentMainProductIndex + 1}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                        {currentProduct.name}
                    </h1>
                    <p className="text-sm md:text-base opacity-60 leading-relaxed mb-12 font-light max-w-sm">
                        {currentProduct.details}
                    </p>
                    <div className="flex items-center justify-between border-t border-b border-white/10 py-8 mb-12">
                        <span className="text-3xl font-bold tracking-tighter">{currentProduct.price}</span>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <button key={size} className="w-10 h-10 border border-white/10 flex items-center justify-center text-[10px] font-bold hover:bg-white hover:text-black transition-colors">
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="w-full bg-white text-black py-6 text-sm font-black tracking-[0.3em] uppercase hover:bg-gold-400 transition-colors">
                        ADD TO BAG
                    </button>
                    <p className="text-[9px] opacity-30 mt-8 tracking-widest leading-loose uppercase">
                        Secure Web3 Checkout • Worldwide Shipping • Limited Release
                    </p>
                </motion.div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </div>
        </main>
    );
}
