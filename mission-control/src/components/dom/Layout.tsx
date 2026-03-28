'use client';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans selection:bg-gold-500 selection:text-black">
      {/* Cinematic Vignette Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Grain/Noise Effect */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};
