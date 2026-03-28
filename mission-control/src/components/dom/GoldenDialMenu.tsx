'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import gsap from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const ITEMS = [
  { id: 0, label: 'HOODIE', icon: '🧥' },
  { id: 1, label: 'TROUSER', icon: '👖' },
  { id: 2, label: 'T-SHIRT', icon: '👕' },
  { id: 3, label: 'ACCESSRY', icon: '💍' },
];

const RADIUS = 150; 
const ANGLE_STEP = 360 / ITEMS.length; 

export const GoldenDialMenu = () => {
  const isOpen = useAppStore((state) => state.isGoldenMenuOpen);
  const toggleMenu = useAppStore((state) => state.toggleGoldenMenu);
  const activeIndex = useAppStore((state) => state.currentMainProductIndex);
  const setActiveIndex = useAppStore((state) => state.setCurrentMainProductIndex);
  
  const dialRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Local state for dragging visual feedback without committing to store immediately
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(activeIndex);

  const updateSelection = React.useCallback((rot: number) => {
    setRotation(rot);
    const normalizedRot = ((-rot % 360) + 360) % 360; 
    const index = Math.round(normalizedRot / ANGLE_STEP) % ITEMS.length;
    
    if (index !== selectedIndex) {
      setSelectedIndex(index);
    }
  }, [selectedIndex]);

  // Intro/Outro animations based on isOpen
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(activeIndex);
      // Fade in overlay and dial
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(dialRef.current, 
        { scale: 0.8, rotation: -90, opacity: 0 }, 
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
      );
    } else {
      // Fade out
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(dialRef.current, { scale: 0.9, opacity: 0, duration: 0.3 });
    }
  }, [isOpen, activeIndex]);

  // Draggable logic
  useEffect(() => {
    if (!dialRef.current || !isOpen) return;

    const draggable = Draggable.create(dialRef.current, {
      type: 'rotation',
      inertia: true,
      snap: (endValue) => Math.round(endValue / ANGLE_STEP) * ANGLE_STEP,
      onDrag: function() {
        updateSelection(this.rotation);
      },
      onThrowUpdate: function() {
        updateSelection(this.rotation);
      },
      onThrowComplete: function() {
        const snappedRotation = Math.round(this.rotation / ANGLE_STEP) * ANGLE_STEP;
        updateSelection(snappedRotation);
        gsap.fromTo(".dial-core", { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
      }
    });

    return () => {
      if (draggable[0]) draggable[0].kill();
    };
  }, [isOpen, updateSelection]);

  const handleConfirm = () => {
    // Double click or explicit confirm button triggers this
    setActiveIndex(selectedIndex);
    toggleMenu(); // Close
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center invisible opacity-0"
    >
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-all duration-500"
        onClick={toggleMenu} // Click outside to close without selecting
      />

      {/* The Golden Dial Container */}
      <div 
        ref={dialRef}
        className="relative w-[400px] h-[400px] rounded-full flex items-center justify-center"
      >
        {/* Outer Ring 1: Dark metallic base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gold-500/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
        
        {/* Outer Ring 2: Thick Golden Rim with Roman Numerals (Static relative to dial rotation, so it spins with it) */}
        <div className="absolute inset-[10px] rounded-full border-4 border-[#d4af37] bg-gradient-to-tr from-[#8a6e20] via-[#ffd700] to-[#8a6e20] p-1 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <div className="w-full h-full rounded-full border-2 border-black/80 relative">
                {/* Roman Numerals (I to XII) placed along the edge */}
                {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((num, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const r = 175; // near the edge
                    const x = r * Math.cos(angle);
                    const y = r * Math.sin(angle);
                    return (
                        <div 
                            key={i} 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a1a1a] font-serif font-bold text-lg"
                            style={{ transform: `translate(${x}px, ${y}px) rotate(${i * 30}deg)` }}
                        >
                            {num}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Inner Ring: Category Icons */}
        {ITEMS.map((item, i) => {
          // Standard mapping: 0=top, 1=right, 2=bottom, etc.
          const theta = (i * ANGLE_STEP - 90) * (Math.PI / 180); 
          const x = RADIUS * Math.cos(theta);
          const y = RADIUS * Math.sin(theta);

          const isHighlighted = selectedIndex === i;

          return (
            <div
              key={item.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${90}deg)`, // Keep icons upright relative to the dial center if needed, or rotate them so bottom points to center
              }}
            >
              {/* Counter-rotate the icon container so it stays upright relative to the screen, even when dial spins */}
              <div 
                style={{ transform: `rotate(${-rotation - 90}deg)` }} // The extra -90 compensates for the parent rotation above
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                  isHighlighted 
                    ? 'text-gold-400 scale-125 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]' 
                    : 'text-white/40 scale-90'
                }`}
              >
                <span className="text-3xl filter brightness-0 invert">{item.icon}</span> 
                {isHighlighted && (
                  <span className="absolute -bottom-6 text-[10px] font-black tracking-widest text-gold-400 bg-black/80 px-2 py-0.5 rounded border border-gold-400/30">
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* The Core: Honeycomb Pattern & Confirmation Button */}
        {/* We counter-rotate the core so it doesn't spin wildly, making it easier to double-click */}
        <div 
            className="dial-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full bg-black border-4 border-[#d4af37] shadow-[0_0_30px_rgba(0,0,0,1)] overflow-hidden cursor-pointer hover:border-white transition-colors flex items-center justify-center group"
            style={{ transform: `translate(-50%, -50%) rotate(${-rotation}deg)` }}
            onDoubleClick={handleConfirm}
        >
            {/* SVG Honeycomb Background */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10C10 4.477 5.523 0 0 0h24c-5.523 0-10 4.477-10 10v20c0 5.523 4.477 10 10 10H0z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '30px',
                backgroundPosition: 'center'
            }} />
            
            {/* Center Lock / Icon */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#8a6e20] to-[#ffd700] shadow-[0_0_15px_rgba(212,175,55,0.8)]">
                <span className="text-black font-black text-2xl tracking-tighter">OK</span>
            </div>
            
            <div className="absolute bottom-4 text-[8px] text-white/50 tracking-widest uppercase font-mono z-10">Double Click</div>
        </div>
      </div>
    </div>
  );
};
