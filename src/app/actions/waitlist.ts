'use server';

import { createClient } from '@/utils/supabase/server';

export async function joinWaitlist(data: {
  role: 'student' | 'mentor';
  name: string;
  email: string;
  categories: string[];
  otherCategory?: string;
  experienceYears?: number;
}) {
  const supabase = await createClient();

  // Clean data
  const finalCategories = [...data.categories];
  if (data.otherCategory && data.otherCategory.trim() !== '') {
    finalCategories.push(`Other: ${data.otherCategory.trim()}`);
  }

  const payload = {
    role: data.role,
    name: data.name,
    email: data.email,
    categories: finalCategories,
    experience_years: data.experienceYears || null,
    created_at: new Date().toISOString()
  };

  // Attempt to insert. If table doesn't exist yet on production, 
  // catch the Postgres error gracefully to avoid crashing the landing page UI.
  const { error } = await supabase.from('waitlist').insert(payload);

  if (error) {
    if (error.code === '42P01') {
      // Table doesn't exist yet, graceful degradation for MVP
      console.warn('Waitlist table missing in Supabase. User not saved permanently.');
      return { success: true, warning: 'Table missing' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}
