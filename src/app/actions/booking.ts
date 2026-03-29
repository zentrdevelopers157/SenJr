'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type BookingState = {
  error?: string;
  success?: boolean;
};

/**
 * Creates a new session booking request.
 */
export async function createBookingAction(
  mentorId: string,
  prevState: BookingState | null,
  formData: FormData
): Promise<BookingState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be logged in to book a session.' };
    }

    const scheduledAt = formData.get('scheduledAt') as string;
    const notes = formData.get('notes') as string;

    if (!scheduledAt) {
      return { error: 'Please select a date and time for your session.' };
    }

    const { error: bookingError } = await supabase.from('bookings').insert({
      mentor_id: mentorId,
      student_id: user.id,
      scheduled_at: new Date(scheduledAt).toISOString(),
      notes: notes || '',
    });

    if (bookingError) {
      console.error('[Booking] Error creating session:', bookingError.message);
      return { error: 'Failed to create booking request. Please try again.' };
    }

    revalidatePath('/dashboard/student');
    // Success redirect
    redirect('/dashboard/student?booked=1');
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
