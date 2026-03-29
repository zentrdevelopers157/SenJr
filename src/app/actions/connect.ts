'use server';

import { createClient } from '@/utils/supabase/server';

export async function submitConnectionRequest(data: {
  mentorId: string;
  message: string;
  goals: string[];
  format: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Must be logged in' };
  }

  // Save to DB as requested by CPO: connection_requests
  const payload = {
    student_id: user.id,
    mentor_id: data.mentorId,
    message: data.message,
    goals: data.goals,
    format: data.format,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  // 1. Try connection_requests table
  let res = await supabase.from('connection_requests').insert(payload);

  if (res.error && res.error.code === '42P01') {
    // 2. Fallback to existing session_requests table if connection_requests doesn't exist
    res = await supabase.from('session_requests').insert({
      student_id: user.id,
      mentor_id: data.mentorId,
      message: `${data.format} | Goals: ${data.goals.join(', ')} | ${data.message}`,
      status: 'pending'
    });
  }

  if (res.error && res.error.code !== '42P01') {
    return { success: false, error: res.error.message };
  }

  return { success: true };
}
