import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '@/utils/supabase/env';

// Shared browser-side Supabase client
export const supabase = createSupabaseClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
