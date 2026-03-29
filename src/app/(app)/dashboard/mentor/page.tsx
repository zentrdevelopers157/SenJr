import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { getMentorBookings, updateBookingStatus } from '@/lib/data/requests';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function handleAction(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') {
  'use server';
  await updateBookingStatus(bookingId, status);
  revalidatePath('/dashboard/mentor');
}

export default async function MentorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const bookings = await getMentorBookings(user.id);

  const pending = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Welcome back, <span className="text-brand-orange">{profile?.full_name?.split(' ')[0] || 'Mentor'}</span>
            </h1>
            <p className="text-slate-400">You have {pending.length} new requests to review.</p>
          </div>
          <Link href={`/mentor/${user.id}/profile`}>
            <Button variant="outline">View Public Profile</Button>
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Pending', value: pending.length, color: 'text-yellow-500' },
            { label: 'Upcoming', value: confirmed.length, color: 'text-brand-blue' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'text-emerald-500' },
            { label: 'Total Earnings', value: `$${bookings.filter(b => b.status === 'completed').length * 50}`, color: 'text-white' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Requests List */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              Booking Requests
              {pending.length > 0 && <span className="bg-orange-500 text-[10px] px-2 py-0.5 rounded-full uppercase">Action Required</span>}
            </h2>

            {pending.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
                <p className="text-slate-500">No new booking requests at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((booking) => (
                  <div key={booking.id} className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-orange/30 transition-colors">
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="font-bold text-lg">{booking.student?.full_name}</h4>
                      <p className="text-sm text-slate-400">
                        {new Date(booking.scheduled_at).toLocaleDateString()} at {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs italic text-slate-500 mt-2 max-w-md">"{booking.notes}"</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <form action={handleAction.bind(null, booking.id, 'confirmed')}>
                        <Button type="submit" size="sm">Accept</Button>
                      </form>
                      <form action={handleAction.bind(null, booking.id, 'cancelled')}>
                        <Button type="submit" variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Decline</Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Confirmed Sessions */}
            <h2 className="text-2xl font-bold pt-8">Upcoming Sessions</h2>
            <div className="space-y-4">
              {confirmed.map((booking) => (
                <div key={booking.id} className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 flex items-center justify-between opacity-80">
                  <div>
                    <h4 className="font-bold">{booking.student?.full_name}</h4>
                    <p className="text-xs text-slate-500">
                      {new Date(booking.scheduled_at).toLocaleDateString()} • {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <form action={handleAction.bind(null, booking.id, 'completed')}>
                    <Button type="submit" variant="outline" size="sm">Mark Done</Button>
                  </form>
                </div>
              ))}
              {confirmed.length === 0 && <p className="text-slate-600 text-sm italic">No confirmed sessions yet.</p>}
            </div>
          </div>

          {/* Sidebar / Quick Tips */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-gradient-to-br from-brand-orange/10 to-transparent border border-brand-orange/20 rounded-3xl">
              <h3 className="font-bold text-brand-orange mb-3">Mentor Tip ⚡</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Mentors who respond to requests within 4 hours have a 3x higher booking rate. Keep your availability updated!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
