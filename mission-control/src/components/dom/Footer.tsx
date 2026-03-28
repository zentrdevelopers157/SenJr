'use client';

import React from 'react';

export const Footer = () => {
  return (
    <footer className="relative w-full py-20 px-12 border-t border-zinc-900 bg-black z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="text-2xl font-black italic">GESTALT</div>
          <p className="text-sm text-zinc-500 max-w-xs uppercase tracking-tighter leading-relaxed">
            Revolutionizing the way you experience fashion with Web3D and real-time customization.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-8 text-gold-500">Shop</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="hover:text-white transition-colors cursor-pointer">T-Shirts</li>
            <li className="hover:text-white transition-colors cursor-pointer">Trousers</li>
            <li className="hover:text-white transition-colors cursor-pointer">Hoodies</li>
            <li className="hover:text-white transition-colors cursor-pointer">Accessories</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-8 text-gold-500">Support</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="hover:text-white transition-colors cursor-pointer">Track Order</li>
            <li className="hover:text-white transition-colors cursor-pointer">Returns</li>
            <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
            <li className="hover:text-white transition-colors cursor-pointer">Size Guide</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-8 text-gold-500">Connect</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="hover:text-white transition-colors cursor-pointer">Instagram</li>
            <li className="hover:text-white transition-colors cursor-pointer">X / Twitter</li>
            <li className="hover:text-white transition-colors cursor-pointer">Discord</li>
            <li className="hover:text-white transition-colors cursor-pointer">Newsletter</li>
          </ul>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
        <div>© 2026 GESTALT LABS. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-8">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};
