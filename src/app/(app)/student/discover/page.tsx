import { getPublicMentors } from '@/lib/data/mentors';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; search?: string }>;
}) {
  const { skill, search } = await searchParams;
  const mentors = await getPublicMentors({ skill, search });

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-3">Find your Mentor</h1>
            <p className="text-slate-400 text-lg">Learn from experts who've been where you are.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search by name or skill..." 
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-brand-blue/50 transition-colors"
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-3.5 text-slate-500">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
          </div>
        </div>

        {mentors.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No mentors found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Link 
                key={mentor.id} 
                href={`/mentor/${mentor.id}/profile`}
                className="group bg-slate-900/50 border border-white/10 rounded-3xl p-6 hover:bg-slate-900 hover:border-brand-blue/30 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-2xl font-black text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                    {mentor.profiles.full_name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Hourly Rate</p>
                    <p className="text-xl font-black text-white">${mentor.hourly_rate}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-blue transition-colors">
                  {mentor.profiles.full_name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                  {mentor.profiles.bio || 'Experienced mentor ready to help you reach your goals.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.skills?.slice(0, 3).map((s: string) => (
                    <span key={s} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-300">
                      {s}
                    </span>
                  ))}
                  {mentor.skills?.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-500 ml-1">+{mentor.skills.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 text-sm">
                  <span className="text-slate-500 font-medium">
                    <span className="text-brand-orange font-bold mr-1">{mentor.experience_years}y</span> experience
                  </span>
                  <span className="text-brand-blue font-bold flex items-center gap-1">
                    View Profile
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
