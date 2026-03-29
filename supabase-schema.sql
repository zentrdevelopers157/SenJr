-- ==========================================
-- Senjr Master Schema & Security Configuration
-- ==========================================
-- Run this in the Supabase SQL Editor.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Profiles: Shared base for all users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('mentor', 'student')),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentor Profiles: Specialized data for mentors
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  skills TEXT[],
  experience_years INTEGER,
  hourly_rate NUMERIC,
  availability JSONB,
  is_public BOOLEAN DEFAULT false,
  linkedin_url TEXT,
  timezone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Profiles: Specialized data for students
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  goals TEXT,
  learning_interests TEXT[],
  timezone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES public.profiles(id) NOT NULL,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT CHECK (role IN ('mentor', 'student')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  categories TEXT[],
  experience_years INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES

-- Profiles
CREATE POLICY "Users can only read/edit their own profile"
ON public.profiles FOR ALL
TO authenticated
USING (auth.uid() = id);

-- Mentor Profiles
CREATE POLICY "Anyone can view public mentor profiles"
ON public.mentor_profiles FOR SELECT
TO authenticated
USING (is_public = true);

CREATE POLICY "Mentors can manage their own mentor profile"
ON public.mentor_profiles FOR ALL
TO authenticated
USING (auth.uid() = id);

-- Student Profiles
CREATE POLICY "Students can manage their own student profile"
ON public.student_profiles FOR ALL
TO authenticated
USING (auth.uid() = id);

-- Bookings
CREATE POLICY "Participants can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = student_id OR auth.uid() = mentor_id);

CREATE POLICY "Students can create bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participants can update their own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = student_id OR auth.uid() = mentor_id);

-- Waitlist
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. INDEXES for RLS performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_id ON public.mentor_profiles(id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_public ON public.mentor_profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_id ON public.bookings(mentor_id);

-- 6. TRIGGERS & FUNCTIONS

-- Trigger to auto-create a profile row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'student') -- Default to student if not provided
  );
  
  -- Create specialized profile based on role
  IF (NEW.raw_user_meta_data->>'role' = 'mentor') THEN
    INSERT INTO public.mentor_profiles (id) VALUES (NEW.id);
  ELSE
    INSERT INTO public.student_profiles (id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Automatic updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_mentor_profiles_updated_at BEFORE UPDATE ON public.mentor_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
