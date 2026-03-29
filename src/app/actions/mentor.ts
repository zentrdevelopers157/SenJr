'use server'

import { revalidatePath } from 'next/cache';
import { updateBookingStatus, BookingStatus } from '@/lib/data/requests';
import { createClient } from '@/utils/supabase/server';

/**
 * Action to handle booking requests (Confirm, Cancel, Complete)
 */
export async function handleRequestAction(bookingId: string, newStatus: BookingStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Update in database using the hardened bookings table
  const success = await updateBookingStatus(bookingId, newStatus);
  
  if (!success) {
    throw new Error('Failed to update booking status. Record not found.');
  }

  // Revalidate both dashboards to ensure real-time consistency
  revalidatePath('/dashboard/mentor');
  revalidatePath('/dashboard/student');
  
  return { success: true };
}
