'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-[#121A2B] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <span className="text-4xl">⚠️</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong!</h2>
        <p className="text-slate-400 mb-8">
          We've encountered an unexpected error. Our team has been notified.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => reset()}
            className="w-full font-bold shadow-lg"
          >
            Try again
          </Button>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
