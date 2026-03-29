import { createClient } from '@/utils/supabase/server';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  mentor_id: string;
  student_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: BookingStatus;
  notes: string;
  created_at: string;
  // Joins
  student?: { full_name: string; email: string };
  mentor?: { full_name: string; email: string };
}

export async function getStudentBookings(studentId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      mentor:profiles!bookings_mentor_id_fkey (
        full_name,
        email
      )
    `)
    .eq('student_id', studentId)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('[Data] Error fetching student bookings:', error.message);
    return [];
  }

  return data as Booking[];
}

export async function getMentorBookings(mentorId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      student:profiles!bookings_student_id_fkey (
        full_name,
        email
      )
    `)
    .eq('mentor_id', mentorId)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('[Data] Error fetching mentor bookings:', error.message);
    return [];
  }

  return data as Booking[];
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    console.error('[Data] Error updating booking status:', error.message);
    return false;
  }

  return true;
}
