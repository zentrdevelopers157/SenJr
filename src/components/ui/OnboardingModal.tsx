'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show once
    const hasSeen = localStorage.getItem('senjr_v2_seen');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('senjr_v2_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#121A2B] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-[0_0_50px_rgba(249,115,22,0.15)] relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-orange/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-blue/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-orange to-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-orange/20 rotate-3">
            <span className="text-4xl">🚀</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            Major Update Live
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4">Welcome to Senjr 2.0</h2>
          
          <p className="text-text-muted text-lg mb-8 leading-relaxed max-w-sm mx-auto">
            We've completely rebuilt the platform based on your feedback. Enjoy the new <span className="text-brand-blue font-bold">Community Feed</span>, smoother bookings, and faster mentor matching.
          </p>

          <Button 
            onClick={dismiss} 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-white text-slate-950 hover:bg-slate-200 hover:scale-[1.02] transition-transform shadow-xl"
          >
            Let's Go! ✦
          </Button>
        </div>
      </div>
    </div>
  );
}
