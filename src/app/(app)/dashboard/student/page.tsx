import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { getStudentBookings } from '@/lib/data/requests';
import { createClient } from '@/utils/supabase/server';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const bookings = await getStudentBookings(user.id);

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Hey, <span className="text-brand-blue">{profile?.full_name?.split(' ')[0] || 'Student'}</span> 👋
            </h1>
            <p className="text-slate-400">Ready to level up today?</p>
          </div>
          <Link href="/student/discover">
            <Button size="lg" className="shadow-xl shadow-brand-blue/20">Find a Mentor</Button>
          </Link>
        </header>

        {/* Sessions Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-bold">Your Mentorship Sessions</h2>
            
            {upcoming.length === 0 ? (
              <div className="p-20 text-center bg-slate-900/30 border border-dashed border-white/10 rounded-4xl">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2">No active sessions</h3>
                <p className="text-slate-500 mb-8">Ready to start learning? Find your perfect mentor in seconds.</p>
                <Link href="/student/discover">
                  <Button variant="outline">Browse Mentors</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((booking) => (
                  <div key={booking.id} className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center font-bold text-brand-blue">
                        {booking.mentor?.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{booking.mentor?.full_name}</h4>
                        <p className="text-sm text-slate-400">
                          {new Date(booking.scheduled_at).toLocaleDateString()} at {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.status === 'confirmed' && (
                        <Button size="sm" variant="outline">Join Call</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="font-bold text-xl">Learning Journey</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sessions Completed</span>
                  <span className="font-bold">{bookings.filter(b => b.status === 'completed').length}</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue w-1/4 rounded-full" />
                </div>
                <p className="text-[10px] text-slate-500 italic">3 more sessions to reach "Enthusiast" level!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
