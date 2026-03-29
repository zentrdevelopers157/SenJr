'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Booking } from '@/lib/data/requests';

interface RequestListClientProps {
  initialRequests: Booking[];
  highlightLatest?: boolean;
}

export function RequestListClient({ initialRequests }: RequestListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = () => {
    startTransition(() => {
      router.refresh();
      setLastUpdated(new Date());
    });
  };

  useEffect(() => {
    const handleFocus = () => refreshData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Your Mentorship Sessions</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            Synced: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isPending ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>
      
      {initialRequests.length === 0 ? (
        <div className="p-20 text-center">
          <div className="text-4xl mb-4">🌑</div>
          <h3 className="text-xl font-bold mb-2">No active sessions</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Book your first session with a top-tier mentor to start your growth journey.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {initialRequests.map((req) => {
            const date = new Date(req.scheduled_at).toLocaleDateString();
            const time = new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            let badgeClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            if (req.status === 'confirmed') badgeClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            if (req.status === 'completed') badgeClass = "bg-brand-blue/10 text-brand-blue border-brand-blue/20";
            if (req.status === 'cancelled') badgeClass = "bg-red-500/10 text-red-500 border-red-500/20";

            return (
              <div key={req.id} className="p-6 md:p-8 hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{req.mentor?.full_name || 'Mentor'}</h3>
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${badgeClass}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>📅 {date}</span>
                    <span>⏰ {time}</span>
                  </div>
                  {req.notes && (
                    <p className="text-sm text-slate-500 mt-4 italic border-l-2 border-white/10 pl-4 py-1">
                      "{req.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
