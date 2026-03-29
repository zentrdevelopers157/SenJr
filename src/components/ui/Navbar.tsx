'use client';

import Link from 'next/link';
import { Button } from './Button';
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from 'react';

export function Navbar() {
  const { user, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = user?.publicMetadata?.role;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      {/* Main bar */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-500">SENJR</span>
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-md">v2.0 Beta</span>
        </Link>

        <div className="hidden items-center space-x-6 md:flex">
          {!isLoaded ? (
            <div className="h-8 w-20 animate-pulse bg-white/5 rounded-lg" />
          ) : !user ? (
            <>
              <Link href="/mentors" className="text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors">
                Find Mentors
              </Link>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="primary" size="sm">Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            <>
              {role === 'student' ? (
                <>
                  <Link href="/dashboard/student" className="text-sm font-medium text-slate-400 hover:text-brand-blue transition-colors">Dashboard</Link>
                  <Link href="/feed" className="text-sm font-medium text-slate-400 hover:text-brand-blue transition-colors">Feed</Link>
                  <Link href="/messages" className="text-sm font-medium text-slate-400 hover:text-brand-blue transition-colors">Messages</Link>
                  <Link href="/schedule" className="text-sm font-medium text-slate-400 hover:text-brand-blue transition-colors">Schedule</Link>
                  <Link href="/mentors" className="text-sm font-medium text-slate-400 hover:text-brand-blue transition-colors">Mentors</Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard/mentor" className="text-sm font-medium text-slate-400 hover:text-brand-orange transition-colors">Dashboard</Link>
                  <Link href="/feed" className="text-sm font-medium text-slate-400 hover:text-brand-orange transition-colors">Feed</Link>
                  <Link href="/messages" className="text-sm font-medium text-slate-400 hover:text-brand-orange transition-colors">Messages</Link>
                  <Link href="/schedule" className="text-sm font-medium text-slate-400 hover:text-brand-orange transition-colors">Schedule</Link>
                  <Link href="/mentors" className="text-sm font-medium text-slate-400 hover:text-brand-orange transition-colors">Mentors</Link>
                  <Link href="/dashboard/mentor#requests" className="text-sm font-medium text-slate-400 hover:text-brand-orange transition-colors">Requests</Link>
                </>
              )}
              <UserButton />
            </>
          )}
        </div>

        {/* Mobile hamburger toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-400 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-[#0B1020] border-b border-white/10 shadow-2xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {!isLoaded ? (
             <div className="h-20 w-full animate-pulse bg-white/5 rounded-lg" />
          ) : !user ? (
            <>
              <Link href="/mentors" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Find Mentors</Link>
              <SignInButton mode="modal">
                <Button variant="ghost" className="w-full justify-start">Log In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="primary" className="w-full justify-start">Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            <>
              {role === 'student' ? (
                <>
                  <Link href="/dashboard/student" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/feed" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Feed</Link>
                  <Link href="/messages" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
                  <Link href="/schedule" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Schedule</Link>
                  <Link href="/mentors" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Mentors</Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard/mentor" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/feed" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Feed</Link>
                  <Link href="/messages" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
                  <Link href="/schedule" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Schedule</Link>
                  <Link href="/dashboard/mentor#requests" className="text-sm font-bold text-slate-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>Requests</Link>
                </>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-slate-500">{user.emailAddresses[0].emailAddress}</span>
                <UserButton />
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
