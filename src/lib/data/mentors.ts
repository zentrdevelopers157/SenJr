import { createClient } from '@/utils/supabase/server';

export async function getPublicMentors(filters?: {
  skill?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('mentor_profiles')
    .select(`
      *,
      profiles!inner (
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('is_public', true);

  if (filters?.minPrice) query = query.gte('hourly_rate', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('hourly_rate', filters.maxPrice);
  if (filters?.skill) query = query.contains('skills', [filters.skill]);
  
  const { data, error } = await query.order('experience_years', { ascending: false });

  if (error) {
    console.error('[Data] Error fetching public mentors:', error.message);
    return [];
  }

  return data;
}

export async function getMentorFullProfile(mentorId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select(`
      *,
      profiles!inner (
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('id', mentorId)
    .single();

  if (error) {
    console.error('[Data] Error fetching mentor profile:', error.message);
    return null;
  }

  return data;
}
