'use client';

import { useActionState } from 'react';
import { createBookingAction } from '@/app/actions/booking';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { AuthInput } from '@/components/auth/AuthLayout';
import { useParams, useRouter } from 'next/navigation';

/**
 * Booking Page UI
 * Allows student to select date/time and send a request to the mentor.
 */
export default function BookSessionPage() {
  const params = useParams();
  const mentorId = params.id as string;
  const [state, formAction] = useActionState(createBookingAction.bind(null, mentorId), null);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 max-w-xl">
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black mb-2">Book your Session</h1>
            <p className="text-slate-400">Request a convenient time to meet with your mentor.</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center animate-in fade-in zoom-in">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Select Date & Time</label>
              <input 
                type="datetime-local" 
                name="scheduledAt"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue/50 transition-colors text-white scheme-dark"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Message or Goals</label>
              <textarea 
                name="notes"
                rows={4}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
                placeholder="What would you like to focus on in this session?"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full h-14 text-lg">
                Send Booking Request
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500 font-medium">
            Your request will be sent to the mentor for confirmation. 
            <br />Payments are processed only after the session.
          </p>
        </div>
      </main>
    </div>
  );
}
