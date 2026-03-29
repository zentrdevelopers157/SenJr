'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function clearDemoRequests() {
  const supabase = await createClient();
  
  // Delete all session requests (excluding a potential seed ID if any)
  const { error } = await supabase
    .from('session_requests')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('[Demo] Failed to clear requests:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/mentor');
  revalidatePath('/dashboard/student');
  
  return { success: true };
}
