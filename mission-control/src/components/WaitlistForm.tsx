'use client';

import { useState } from 'react';
import { joinWaitlist } from '@/app/actions/waitlist';

const CATEGORY_GROUPS = [
  { group: '📚 Competitive Exams', items: ['UPSC / IAS', 'JEE / NEET', 'CAT / MBA Entrance', 'GATE', 'SSC / Banking', 'State PSC', 'CLAT / Law'] },
  { group: '🎓 Academic Subjects', items: ['Mathematics', 'Physics / Chem / Bio', 'Computer Science', 'History / PolSci', 'Economics', 'Literature'] },
  { group: '💼 Career & Professional', items: ['Software Engineering', 'Data Science / AI', 'Product Management', 'UI/UX Design', 'Digital Marketing', 'Finance', 'Consulting'] },
  { group: '🚀 Startups', items: ['Building a Startup', 'Finding Co-founders', 'Fundraising', 'Growth Strategy', 'Social Enterprises'] },
  { group: '🎨 Creative & Skills', items: ['Drawing / Illustration', 'Graphic Design', 'Music / Audio', 'Video Editing', 'Photography', 'Writing'] },
  { group: '🌱 Personal Dev', items: ['Productivity', 'Communication', 'Leadership', 'Mental Health', 'Language Learning'] }
];

export function WaitlistForm() {
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [otherCat, setOtherCat] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggle = (item: string) => {
    setSelectedCats(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }
    if (selectedCats.length === 0 && !otherCat.trim()) {
      setErrorMsg('Please select at least one interest/expertise area.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await joinWaitlist({
        role,
        name,
        email,
        categories: selectedCats,
        otherCategory: otherCat,
        experienceYears: role === 'mentor' && experience ? parseInt(experience) : undefined
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`I just joined the Senjr Waitlist for elite mentorship! 🚀 Join me here: https://senjr.co`)}`;
    
    return (
      <div className="flex flex-col items-center py-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-orange/40 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-brand-orange/40 flex items-center justify-center text-6xl shadow-2xl">
            ✨
          </div>
        </div>
        
        <div className="space-y-4 mb-10">
          <h3 className="text-4xl font-black text-white tracking-tight">You're in, {name.split(' ')[0]}! 🎉</h3>
          <p className="text-slate-400 max-w-sm mx-auto leading-relaxed text-lg">
            We've reserved your spot. Watch your inbox at <span className="text-white font-bold">{email}</span> for your invite link. 
          </p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5c] text-white font-black py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-[#25D366]/20"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Share to WhatsApp
          </a>
          <button 
            onClick={() => setSuccess(false)}
            className="w-full text-xs font-bold text-slate-500 hover:text-white transition-colors"
          >
            Wait, I need to add another person
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 text-left">
      {/* Role Toggle */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <button 
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${role === 'student' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Join as Student
        </button>
        <button 
          type="button"
          onClick={() => setRole('mentor')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${role === 'mentor' ? 'bg-brand-orange text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Join as Mentor / Senior
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="Your Full Name" 
          value={name} onChange={e => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-orange transition-colors"
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} onChange={e => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-orange transition-colors"
        />
      </div>

      {role === 'mentor' && (
        <div className="animate-in fade-in slide-in-from-top-2 w-full mb-4">
          <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Years of Experience</label>
          <input 
            type="number" 
            min="0" max="50"
            placeholder="e.g. 5" 
            value={experience} onChange={e => setExperience(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-orange transition-colors"
          />
        </div>
      )}

      {/* Category Multi-select */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-white">
            {role === 'student' ? 'What do you want to learn?' : 'What do you want to mentor?'}
          </label>
          <span className="text-xs text-slate-400">Select multiple</span>
        </div>

        <div className="max-h-[280px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.group} className="pb-4 mb-4 border-b border-white/5 last:border-0 last:mb-0">
              <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                {group.group}
                <span className="flex-1 h-[1px] bg-white/5"></span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map(item => {
                  const selected = selectedCats.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggle(item)}
                      className={`px-[14px] py-[8px] text-[13px] font-semibold rounded-xl border transition-all duration-200 ${selected ? (role === 'mentor' ? 'bg-brand-orange/20 border-brand-orange text-brand-orange shadow-[0_4px_12px_rgba(234,88,12,0.2)]' : 'bg-brand-blue/20 border-brand-blue text-brand-blue shadow-[0_4px_12px_rgba(37,99,235,0.2)]') : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">✍️ Something Else</p>
            <input 
              type="text" 
              placeholder="e.g. Astrophysics, Custom Topic..." 
              value={otherCat} onChange={e => setOtherCat(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-orange transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all"
          style={{ background: role === 'student' ? 'var(--primary-blue)' : 'var(--orange)' }}
        >
          {loading ? 'Joining...' : (role === 'student' ? 'Join Waitlist — It\'s Free ✦' : 'Apply as Mentor ✦')}
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">🔒 No spam. No credit card. Just your spot in line.</p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </form>
  );
}
