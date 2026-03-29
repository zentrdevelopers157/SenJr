'use client';

import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useRouter, useParams } from 'next/navigation';

export default function SessionPage() {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [status, setStatus] = useState<'loading'|'waiting'|'active'|'ended'>('loading');
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) throw new Error('Session not found');
        const data = await res.json();
        setSession(data);
        
        const startTime = new Date(data.scheduled_at).getTime();
        const now = new Date().getTime();
        const diff = startTime - now;
        
        if (diff > 600000) { // More than 10 minutes away
          setStatus('waiting');
          setTimeLeft(diff);
        } else {
          setStatus('active');
        }
      } catch (err: any) {
        setError(err.message);
        setStatus('ended');
      }
    };

    fetchSession();
  }, [id]);

  useEffect(() => {
    if (status !== 'active' || !containerRef.current || callFrame || !session?.room_id) return;

    const initCall = async () => {
      try {
        const roomUrl = `https://senjr.daily.co/${session.room_id}`;

        const frame = DailyIframe.createFrame(containerRef.current!, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '24px',
          },
          showLeaveButton: true,
          theme: {
            colors: {
              accent: '#f97316',
              accentText: '#FFFFFF',
              background: '#0B1020',
              border: '#2D3748',
            },
          },
        });

        setCallFrame(frame);

        frame.on('left-meeting', () => {
          setStatus('ended');
          frame.destroy();
        });

        await frame.join({ url: roomUrl });
      } catch (err: any) {
        console.error('Daily.co error:', err);
        setError('Failed to join the session.');
        setStatus('ended');
      }
    };

    initCall();

    return () => {
      if (callFrame) callFrame.destroy();
    };
  }, [status, session]);

  if (status === 'waiting') {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <h1 className="text-4xl font-black mb-4">Too Early! ⏳</h1>
        <p className="text-slate-400 mb-8 max-w-sm">
          You can join the session 10 minutes before the scheduled time. 
          Session starts at: {new Date(session.scheduled_at).toLocaleString()}
        </p>
        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-[#f97316] rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
          Refresh to Join
        </button>
      </div>
    );
  }

  if (status === 'ended' || error) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-3xl font-black mb-2">{error || 'Session Ended'}</h1>
        <button onClick={() => window.location.href = '/dashboard'} className="mt-8 px-6 py-3 bg-slate-800 rounded-lg font-bold">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0B1020] p-4 md:p-8 flex flex-col font-sans text-white">
      <header className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-[#f97316] uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 mb-2 inline-block">Live Mentorship</span>
          <h1 className="text-xl font-black">Senjr Video Room</h1>
        </div>
      </header>
      
      <main className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900 z-10">
            <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400">Initializing...</p>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </main>
    </div>
  );
}
