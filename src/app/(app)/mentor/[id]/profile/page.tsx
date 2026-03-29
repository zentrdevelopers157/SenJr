import { getMentorFullProfile } from '@/lib/data/mentors';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = await getMentorFullProfile(id);

  if (!mentor) {
    notFound();
  }

  const p = mentor.profiles;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 border-2 border-white/10 flex items-center justify-center text-6xl font-black text-white shadow-2xl overflow-hidden backdrop-blur-xl">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.full_name} className="w-full h-full object-cover" />
                ) : (
                  p.full_name.charAt(0)
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight">{p.full_name}</h1>
                  {mentor.linkedin_url && (
                    <a href={mentor.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="text-brand-blue font-black">★</span> 4.9 Rating
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 hidden md:block" />
                  <span>{mentor.experience_years}+ Years Experience</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 hidden md:block" />
                  <span>{mentor.timezone}</span>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {p.bio || 'Transforming the learning journey through dedicated mentorship and real-world expertise.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b border-white/5 pb-4">Specialties & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {mentor.skills?.map((s: string) => (
                  <span key={s} className="bg-slate-900 border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:border-brand-blue/50 transition-colors shadow-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b border-white/5 pb-4">Mentorship Style</h2>
              <p className="text-slate-400 leading-relaxed italic">
                "I focus on actionable feedback and practical application of concepts. Whether we're tackling complex coding challenges or prepping for career milestones, my goal is to build your confidence alongside your competence."
              </p>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-3xl space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Session Rate</p>
                  <p className="text-4xl font-black">${mentor.hourly_rate}<span className="text-lg text-slate-500 font-medium tracking-normal">/hr</span></p>
                </div>
                <div className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Verified
                </div>
              </div>
              
              <div className="space-y-4">
                <Link href={`/mentor/${id}/book`}>
                  <Button className="w-full h-14 text-lg">Book a Session</Button>
                </Link>
                <Button variant="outline" className="w-full h-14 text-lg">Send Message</Button>
              </div>
              
              <p className="text-center text-xs text-slate-500 font-medium">
                Average response time: <span className="text-white">Under 2 hours</span>
              </p>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Availability</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['Mon - Wed', '8 AM - 6 PM', 'Fri', '10 AM - 4 PM'].map((t, idx) => (
                    <div key={idx} className="bg-white/5 p-2.5 rounded-xl text-center text-xs font-medium text-slate-400">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
