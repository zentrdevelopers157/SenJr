'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import ChatContainer from '@/components/chat/ChatContainer';
import { useUser } from '@clerk/nextjs';

const DEMO_CONVERSATIONS = [
  { id: 'mentor1', name: 'Arjun Sharma', role: 'IIT Bombay · JEE AIR 247', avatar: 'A', color: 'bg-brand-orange' },
  { id: 'mentor2', name: 'Priya Nair', role: 'AIIMS Delhi · NEET 715', avatar: 'P', color: 'bg-brand-blue' },
  { id: 'mentor3', name: 'Rohan Mehta', role: 'IIM Ahmedabad · CAT 99.8', avatar: 'R', color: 'bg-emerald-500' },
];

export default function MessagesPage() {
  const { user, isLoaded } = useUser();
  const [activeChat, setActiveChat] = useState(DEMO_CONVERSATIONS[0]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 h-[calc(100vh-120px)] flex gap-8">
        {/* Sidebar */}
        <div className="w-80 flex flex-col bg-slate-900/40 border border-white/5 rounded-4xl p-6 backdrop-blur-xl shrink-0">
          <header className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">Inbox</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.15em]">Your Mentorship Network</p>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {DEMO_CONVERSATIONS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                  activeChat.id === chat.id 
                    ? 'bg-white/10 border border-white/20 shadow-2xl' 
                    : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${chat.color}`}>
                  {chat.avatar}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm">{chat.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{chat.role}</p>
                </div>
              </button>
            ))}
          </div>

          <footer className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-800" />
              <div>
                <p className="text-xs font-bold text-slate-400">Secured with E2E Realtime</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Chat Window */}
        <div className="flex-1 shadow-3xl">
          <ChatContainer 
            recipientId={activeChat.id} 
            recipientName={activeChat.name} 
          />
        </div>
      </main>
    </div>
  );
}
