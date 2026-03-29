'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState<any>({
    // Shared
    full_name: '',
    bio: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // Mentor specific
    skills: [],
    experience_years: 0,
    hourly_rate: 0,
    linkedin_url: '',
    // Student specific
    goals: '',
    learning_interests: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.is_onboarded) {
        router.push(profile.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
        return;
      }

      setProfile(profile);
      setFormData((prev: any) => ({ 
        ...prev, 
        full_name: profile?.full_name || '',
        timezone: profile?.timezone || prev.timezone
      }));
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    try {
      // 1. Update main profile
      const { error: pError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          is_onboarded: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (pError) throw pError;

      // 2. Update specialized profile
      if (profile.role === 'mentor') {
        const { error: mError } = await supabase
          .from('mentor_profiles')
          .update({
            skills: formData.skills,
            experience_years: parseInt(formData.experience_years),
            hourly_rate: parseFloat(formData.hourly_rate),
            linkedin_url: formData.linkedin_url,
            timezone: formData.timezone,
            is_public: true // Make public on completion
          })
          .eq('id', user.id);
        if (mError) throw mError;
      } else {
        const { error: sError } = await supabase
          .from('student_profiles')
          .update({
            goals: formData.goals,
            learning_interests: formData.learning_interests,
            timezone: formData.timezone
          })
          .eq('id', user.id);
        if (sError) throw sError;
      }

      router.push(profile.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
    } catch (err: any) {
      alert('Error saving profile: ' + err.message);
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((i: string) => i !== s) });
  };

  const addInterest = () => {
    if (interestInput && !formData.learning_interests.includes(interestInput)) {
      setFormData({ ...formData, learning_interests: [...formData.learning_interests, interestInput] });
      setInterestInput('');
    }
  };

  const removeInterest = (i: string) => {
    setFormData({ ...formData, learning_interests: formData.learning_interests.filter((item: string) => item !== i) });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading onboarding...</div>;

  const isMentor = profile.role === 'mentor';

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 max-w-2xl">
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-400">
              Welcome to Senjr
            </h1>
            <p className="text-slate-400">Let's set up your {profile.role} profile.</p>
            
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-12 bg-orange-500' : 'w-4 bg-slate-800'}`} />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={formData.full_name} 
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 transition-colors"
                  placeholder="e.g. Alex Rivera"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Short Bio</label>
                <textarea 
                  rows={4}
                  value={formData.bio} 
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                  placeholder={isMentor ? "Tell students about your expertise..." : "Tell mentors what you're looking for..."}
                />
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-14 text-lg" disabled={!formData.full_name}>
                Continue to Details
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {isMentor ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Skills / Expertise</label>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {formData.skills.map((s: string) => (
                        <span key={s} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                          {s} <button onClick={() => removeSkill(s)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={skillInput} 
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSkill()}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                        placeholder="Add skill (e.g. Physics, Coding)"
                      />
                      <Button onClick={addSkill} variant="outline" className="h-12">Add</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Exp (Years)</label>
                      <input 
                        type="number" 
                        value={formData.experience_years} 
                        onChange={e => setFormData({ ...formData, experience_years: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Hourly Rate ($)</label>
                      <input 
                        type="number" 
                        value={formData.hourly_rate} 
                        onChange={e => setFormData({ ...formData, hourly_rate: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">LinkedIn URL (optional)</label>
                    <input 
                      type="url" 
                      value={formData.linkedin_url} 
                      onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Goals</label>
                    <textarea 
                      rows={3}
                      value={formData.goals} 
                      onChange={e => setFormData({ ...formData, goals: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50"
                      placeholder="e.g. Master React, pass the SATs..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Interests</label>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {formData.learning_interests.map((i: string) => (
                        <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                          {i} <button onClick={() => removeInterest(i)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={interestInput} 
                        onChange={e => setInterestInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addInterest()}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                        placeholder="Add topic"
                      />
                      <Button onClick={addInterest} variant="outline" className="h-12">Add</Button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setStep(1)} variant="ghost" className="flex-1 h-14">Back</Button>
                <Button onClick={handleSave} className="flex-1 h-14" disabled={saving}>
                  {saving ? 'Saving...' : 'Complete Profile'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
