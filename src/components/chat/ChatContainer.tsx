'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';

export default function ChatContainer({ recipientId, recipientName }: { recipientId: string, recipientName: string }) {
  const { user } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const supabase = createClient();

  // Channel name: alphabetical to ensure consistency
  const channelName = [user?.id, recipientId].sort().join('_');

  useEffect(() => {
    if (!user) return;

    // 1. Fetch history from Postgres via API
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/messages/${recipientId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Fetch history error:', err);
      }
    };

    fetchHistory();

    // 2. Subscribe to Realtime channel
    const channel = supabase.channel(`chat:${channelName}`)
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, recipientId, channelName, supabase]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const newMessage = {
      sender_id: user.id,
      content: input,
      created_at: new Date().toISOString(),
      sender_name: user.fullName
    };

    // 1. Broadcast to Realtime
    await supabase.channel(`chat:${channelName}`).send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage,
    });

    // 2. Save to Postgres via API
    try {
      await fetch(`/api/messages/${recipientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: recipientId, content: input })
      });
    } catch (err) {
      console.error('Save message error:', err);
    }

    setMessages(prev => [...prev, { ...newMessage, id: Date.now().toString() }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/80">
        <div>
          <h3 className="font-bold text-lg">{recipientName}</h3>
          <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Active Now
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.sender_id === user?.id 
                ? 'bg-brand-blue text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-sm font-bold">Start the conversation</p>
            <p className="text-xs">Your messages are real-time and end-to-end synced.</p>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-slate-900/80 border-t border-white/10 flex gap-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-blue transition-colors"
        />
        <Button type="submit" className="px-6">Send</Button>
      </form>
    </div>
  );
}
