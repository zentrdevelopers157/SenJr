'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitConnectionRequest } from '@/app/actions/connect';

const GOALS = [
  'UPSC / IAS', 'JEE / NEET', 'CAT / MBA', 
  'Software Engineering', 'Building a Startup', 'Personal Dev'
];

export function HomeConnectButton({ mentorId, mentorName, hasUser }: { mentorId: string, mentorName: string, hasUser: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [message, setMessage] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [format, setFormat] = useState('Online 1:1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    if (!hasUser) {
      router.push('/student/signup?error=Sign up to connect with mentors');
      return;
    }
    setIsOpen(true);
  };

  const toggleGoal = (g: string) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const submit = async () => {
    if (!message.trim() || goals.length === 0) return;
    setLoading(true);
    const res = await submitConnectionRequest({ mentorId, message, goals, format });
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 2500);
    } else {
      alert('Failed to send request: ' + res.error);
    }
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="w-full py-2.5 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold hover:bg-brand-orange hover:text-white transition-colors"
      >
        Connect &rarr;
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121A2B] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            
            {success ? (
              <div className="py-8 text-center text-white">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-bold mb-2">Request sent!</h3>
                <p className="text-sm text-slate-400">{mentorName} will get back to you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Connect with {mentorName}</h3>
                <p className="text-sm text-slate-400 mb-6">Send a brief intro to start the conversation.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Your Goals (Select 1-2)</label>
                    <div className="flex flex-wrap gap-2">
                      {GOALS.map(g => (
                        <button 
                          key={g} type="button" onClick={() => toggleGoal(g)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${goals.includes(g) ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' : 'bg-white/5 border-white/10 text-slate-300'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Preferred Format</label>
                    <select value={format} onChange={e => setFormat(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
                      <option>Online 1:1 Session</option>
                      <option>Group Session</option>
                      <option>Async Q&A / Chat</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Message</label>
                    <textarea 
                      placeholder={`What would you like to learn from ${mentorName.split(' ')[0]}? (2-3 sentences)`}
                      value={message} onChange={e => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none min-h-[100px]"
                    />
                  </div>

                  <button 
                    onClick={submit} disabled={loading || !message.trim() || goals.length === 0}
                    className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl mt-2 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Request ✦'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
