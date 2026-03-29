-- Create the session_requests table
CREATE TABLE IF NOT EXISTS public.session_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL, -- references auth.users(id) if needed
  student_name text NOT NULL,
  student_email text NOT NULL,
  mentor_id text NOT NULL,
  mentor_name text NOT NULL,
  exam_goal text,
  preferred_topic text,
  message text,
  preferred_datetime text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.session_requests ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies

-- 1. Students can view their own requests
CREATE POLICY "Students can view their own requests"
  ON public.session_requests
  FOR SELECT
  USING (auth.uid() = student_user_id);

-- 2. Students can insert their own requests
CREATE POLICY "Students can create requests"
  ON public.session_requests
  FOR INSERT
  WITH CHECK (auth.uid() = student_user_id);

-- 3. Mentors can view requests assigned to them
-- For now, if mentor_id is not linked to auth.users, this policy might need adjustment.
-- Assuming mentors might have a specific UUID or we handle it via server role.
-- If mentors are just regular users and their auth.uid() == mentor_id:
CREATE POLICY "Mentors can view their assigned requests"
  ON public.session_requests
  FOR SELECT
  USING (auth.uid()::text = mentor_id);

-- 4. Mentors can update requests assigned to them
CREATE POLICY "Mentors can update their assigned requests"
  ON public.session_requests
  FOR UPDATE
  USING (auth.uid()::text = mentor_id)
  WITH CHECK (auth.uid()::text = mentor_id);

-- 5. Service Role can do everything (Bypass RLS)
-- The server-side Supabase client using service_role key will bypass RLS.
